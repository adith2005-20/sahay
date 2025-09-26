import { NextRequest } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ToolNode } from '@langchain/langgraph/prebuilt';
import {
  StateGraph,
  MessagesAnnotation,
  END,
  START,
  MemorySaver
} from "@langchain/langgraph";
import { tools } from "./tools";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

// Initialize the model with tools
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  streaming: true,
}).bindTools(tools);

// Create tool node for handling tool executions
const toolNode = new ToolNode(tools);

// Define the system prompt
const systemPrompt = new SystemMessage(
  `You are Sahayi, a friendly AI career advisor for students and professionals on the Sahay platform.

## CORE APPROACH:
- Be conversational and supportive, not robotic
- Extract detailed insights from user queries (e.g., "math teacher" → teaching methods + mathematics domain)
- Consider nearby locations for better opportunities (Delhi → NCR, UP, Haryana)
- If tools return limited data, use web search for comprehensive information
- Ask only essential clarifications needed for tools - don't over-complicate

## FINANCIAL-CLARITY-ENGINE:
Provide domain and location-aware financial insights including regional variations and market trends.

## PROCESS:
1. **Smart extraction** - understand context and related fields from user query
2. **Minimal clarification** - ask only what's essential for tool execution
3. **Multi-tool approach** - use relevant tools, supplement with web search if needed
4. **Provide Data in tables** - wherever data is in a comparitive form, provide as a table
5. **Natural recommendations** - conversational tone with clear next steps

## RESPONSE STYLE:
Keep it warm and helpful. Instead of "Extracted Information:", try "I understand you're looking for..." or "Based on what you've shared..."

Be the career friend who happens to have access to great data and tools.`
);

// Check if we should continue to tools or end
const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if (lastMessage && "tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls?.length) {
    console.log("Tool calls detected, continuing to tools node");
    return "tools";
  }
  console.log("No tool calls detected, ending conversation");
  return END;
};

// Main model call function
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke([
    systemPrompt,
    ...state.messages
  ]);
  console.log("Model response:", response);
  return { messages: response };
};

// Set up the workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue, ["tools", END])
  .addEdge("tools", "agent");

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Create stream transformer
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Convert messages to LangChain format
    const formattedMessages = messages.map((msg: any) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    );

    // Process the conversation through the workflow
    const result = await app.invoke(
      {
        messages: formattedMessages
      },
      {
        configurable: {
          thread_id: uuidv4()
        }
      }
    );

    // Get the final response
    const lastMessage = result.messages[result.messages.length - 1];
    const content = lastMessage?.content || "";

    // Stream the response
    if (typeof content === "string") {
      for (const char of content) {
        writer.write(encoder.encode(char));
        // Add a small delay to simulate natural typing
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } else {
      writer.write(encoder.encode(JSON.stringify(content)));
    }
    writer.close();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat streaming error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
