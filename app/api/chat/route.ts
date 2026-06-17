import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, context } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "AI assistant is not configured. Add your ANTHROPIC_API_KEY to .env.local to enable this feature." });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: `You are Claro, an AI business assistant for a small service business. You have access to the following real business data:\n\n${context}\n\nAnswer the owner's questions concisely and helpfully using this data. Use bold (**text**) to highlight key numbers or names. Keep answers under 150 words.`,
      messages: messages.slice(-6),
    }),
  });

  const data = await res.json();
  const reply = data?.content?.[0]?.text || "I couldn't generate a response. Please try again.";
  return NextResponse.json({ reply });
}
