import { NextResponse } from "next/server";
import { z } from "zod";

// Using direct REST call to Gemini; try multiple broadly available models
const MODEL_CANDIDATES = [
  "gemini-2.0-flash"
];
const GOOGLE_API_URL = (model: string) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

type GeminiPart = { text?: string };
type GeminiContent = { parts?: GeminiPart[] };
type GeminiCandidate = { content?: GeminiContent; safetyRatings?: unknown };
type GeminiResponse = { candidates?: GeminiCandidate[]; promptFeedback?: { blockReason?: unknown } | undefined; text?: string };

const BodySchema = z.object({
  riasec: z.unknown(),
  prompt: z.string().optional(),
});

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function extractTextAndBlock(data: unknown): { text: string; blocked: boolean; feedback?: unknown } {
  if (!isObject(data)) return { text: "", blocked: false };
  const d = data as GeminiResponse;
  const blocked = Boolean(d.promptFeedback?.blockReason);
  const candidates: GeminiCandidate[] = Array.isArray(d.candidates) ? d.candidates : [];
  const partsTexts: string[] = [];
  for (const cand of candidates) {
    const parts = cand?.content?.parts;
    if (Array.isArray(parts)) {
      for (const p of parts) {
        if (p && typeof p.text === "string") partsTexts.push(p.text);
      }
    }
  }
  const joined = partsTexts.join("\n").trim();
  const fallback = candidates[0]?.content?.parts?.[0]?.text ?? d.text ?? "";
  return { text: joined || (typeof fallback === "string" ? fallback : ""), blocked, feedback: d.promptFeedback };
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_API_KEY on server" }, { status: 500 });
    }

    const body = BodySchema.parse(await req.json());
    const { riasec, prompt } = body;
    if (!riasec) {
      return NextResponse.json({ error: "Missing RIASEC context" }, { status: 400 });
    }

    const baseInstruction = `You are an expert Indian career guidance advisor.
Given a student's latest RIASEC result JSON and an optional user prompt, synthesize a clear, encouraging, and actionable plan.
- Explain their likely strengths and working styles (tie back to RIASEC codes)
- Recommend 3-5 suitable education paths (streams, subjects, or domains)
- For each path: why it fits, required skills, subject focus in 11-12, potential entrance exams (if relevant), and example careers.
- Conclude with a short next-steps plan for the coming 1-2 months.
Keep it concise, well-structured with headings and bullet points. Avoid over-claiming; add caveats where appropriate.`;

    let compactContext: unknown = riasec;
    if (isObject(riasec)) {
      const r = riasec;
      compactContext = (r.results ?? r.response_data) ?? riasec;
    }
    const composed = [
      baseInstruction,
      `\nLatest RIASEC result JSON:\n${JSON.stringify(compactContext, null, 2)}`,
      prompt ? `\nUser prompt:\n${prompt}` : "",
    ].join("\n");

    let finalText: string | null = null;
    let lastErr: unknown = null;

    for (const model of MODEL_CANDIDATES) {
      try {
        const res = await fetch(`${GOOGLE_API_URL(model)}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: composed }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 32,
              topP: 0.9,
              maxOutputTokens: 2048,
            },
            // Loosen safety slightly to reduce benign blocks; adjust to your policy
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            ],
          }),
        });

        if (!res.ok) {
          lastErr = await res.text();
          continue;
        }

        const data: unknown = await res.json();
        const { text, blocked, feedback } = extractTextAndBlock(data);
        if (blocked) {
          lastErr = feedback ?? "blocked";
          continue;
        }

        if (text) {
          finalText = text;
          break;
        }
      } catch (err: unknown) {
        lastErr = err;
      }
    }

    if (!finalText) {
      return NextResponse.json({ error: "No text returned from Gemini", details: lastErr }, { status: 502 });
    }

    return NextResponse.json({ output: finalText });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Server error", details: message }, { status: 500 });
  }
}
