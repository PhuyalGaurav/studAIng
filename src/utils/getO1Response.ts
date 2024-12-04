import * as dotenv from "dotenv";
import { OpenAI } from "openai";
import { O1MessagesInput, AIResponse } from "@/lib/types";

dotenv.config({ path: ".env" });

const apiKey = process.env.AIML_API_KEY;

const baseURL = "https://api.aimlapi.com/v1";

const openai = new OpenAI({
  apiKey,
  baseURL,
});

export default async function getO1Response(messages : O1MessagesInput[]) : Promise<AIResponse>  {
  const response = await openai.chat.completions.create({
    model: "o1-mini",
    messages: messages,
    temperature: 1,
    max_tokens: 12010,
    top_p: 1,
  });

  return {content: response.choices[0].message.content as string}
}