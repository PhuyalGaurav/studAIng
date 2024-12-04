import { NextRequest, NextResponse } from 'next/server';
import generateAIResponse from '@/utils/generateAIResponse';
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { O1MessagesInput, AIResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatCompletionMessageParam[] | O1MessagesInput[] = body.messages;

    const response = await generateAIResponse(messages);

    console.log(response)

    if (response.contentType === "quiz" || response.contentType === "ppt" || response.contentType == "flashcards" || response.contentType == "spelling" || response.contentType == "canvas" || response.contentType == "image" || response.contentType == "physics") {
      return NextResponse.json({ content: response.content, contentType: response.contentType } as AIResponse, { status: 200 });
    }

    return NextResponse.json({ content: response.content } as AIResponse, { status: 200 });
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}