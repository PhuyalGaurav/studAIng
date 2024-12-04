import OpenAI from "openai"
import * as dotenv from 'dotenv';

dotenv.config({ path: ".env" });

const apiKey = process.env.AIML_API_KEY;

const baseURL = "https://api.aimlapi.com/v1";

const openai = new OpenAI({
  apiKey,
  baseURL,
});

export default async function generateChatName(input: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Provide a concise chat name based on the following input. The chat name should be 3-6 words, clearly summarizing the topic for easy recall. Do not put the text in quotation marks. Do not use words like 'chat' or 'discussion' at the end.",
      },
      {
        role: "user",
        content: input,
      },
    ],
    temperature: 1,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  return response.choices[0].message.content as string;
}