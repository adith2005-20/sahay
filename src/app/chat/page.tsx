"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { v4 as uuidv4 } from "uuid";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type LLMOutputComponent } from "@llm-ui/react";
import { Textarea } from "@/components/ui/textarea";
import { PulseLoader } from 'react-spinners';
import { Loader2Icon, SendIcon } from "lucide-react";
import SahayLoader from "@/components/SahayLoader";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};


const MarkdownComponent = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  );
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: uuidv4(),
      role: "assistant",
      content: "Hi! I'm Sahayi, your AI career advisor. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [temperature, setTemperature] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const assistantId = uuidv4();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      if (streamingEnabled) {
        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messages.concat(userMessage),
            config: {
              temperature,
              streaming: true,
            },
          }),
        });

        if (!response.body) throw new Error("No response stream");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedResponse += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: accumulatedResponse }
                : msg
            )
          );
        }
      }
    //     else {
    //     const response = await fetch("/api/chat", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         messages: messages.concat(userMessage),
    //         config: {
    //           temperature,
    //           streaming: false,
    //         },
    //       }),
    //     });

    //     const data = await response.json();
    //     setMessages((prev) =>
    //       prev.map((msg) =>
    //         msg.id === assistantId ? { ...msg, content: data.content } : msg
    //       )
    //     );
    //   }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "system",
          content: "Sorry, there was an error processing your request.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 top-14 flex flex-col bg-gradient-to-b from-slate-50 to-white">
        

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-[100px]">
          <div className="space-y-4 max-w-3xl mx-auto pt-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "assistant"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "bg-[#B7410E] text-white"
                  }`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content === "" && message.role === "assistant" && isLoading ? (
                      <PulseLoader  color={'#B7410E'} size={8} speedMultiplier={0.5}/>
                    ) : null}
                    <MarkdownComponent content={message.content} />
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 p-4 bg-gradient-to-t from-white via-white/80 to-transparent pb-6">
          <form onSubmit={handleSubmit} className="pointer-events-auto mx-auto max-w-3xl">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Sahayi a query..."
                disabled={isLoading}
                className="w-full focus:border-none resize-none max-h-36 rounded-2xl border bg-white/80 pr-12 pl-4 py-3 min-h-[56px] shadow-lg backdrop-blur-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="absolute right-2 bottom-2 h-8 w-8 rounded-full p-0 border-muted-foreground shadow-md"
                variant="ghost"
              >
                {isLoading ? <SahayLoader/> : <SendIcon className="h-4 w-4"/>}
              </Button>
            </div>
          </form>
        </div>
      </div>
  );
}
