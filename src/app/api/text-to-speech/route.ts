import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    const response = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'alloy',
      input: text,
    });

    return new Response(response.body, {
      headers: {
        "Content-Type": response.type,
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return NextResponse.json({ error: "Error generating speech" }, { status: 500 });
  }
}