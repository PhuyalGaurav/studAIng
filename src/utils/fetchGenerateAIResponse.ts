import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { O1MessagesInput, AIResponse } from "@/lib/types";

export default async function fetchGenerateAIResponse(messages: ChatCompletionMessageParam[] | O1MessagesInput[]): Promise<AIResponse> {
  const messagesConverted = []

  for (let i = 0; i < messages.length; i++) {
    messagesConverted.push({role: messages[i].role, content: messages[i].content})
  }

  try {
    const response = await fetch('/api/generate-ai-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: messagesConverted }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI response');
    }

    const data = await response.json();
    if (data.contentType) {
      return { content: data.content, contentType: data.contentType };
    }
    return { content: data.content };
  } catch (error) {
    console.error('Error calling AI response API:', error);
    throw error;
  }
}