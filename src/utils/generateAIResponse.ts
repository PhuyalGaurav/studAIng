/* eslint-disable @typescript-eslint/no-explicit-any */
import getGPT4oResponse from "./getGPT4oResponse";
import getO1Response from "./getO1Response";
import selectAIModel from "./selectAIModel";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { O1MessagesInput, AIResponse } from "@/lib/types";

export default async function generateAIResponse(messageInput: ChatCompletionMessageParam[] | O1MessagesInput[]): Promise<AIResponse> {
  const selectedModel = selectAIModel(messageInput);

  try {
    if (selectedModel === "gpt-4o") {
      return await getGPT4oResponse(messageInput as ChatCompletionMessageParam[]);
    } else {
      return await getO1Response(messageInput as O1MessagesInput[]);
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}