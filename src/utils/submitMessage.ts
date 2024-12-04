import { GPT4oMessagesInput, O1MessagesInput } from "@/lib/types";

export default async function submitMessage(userId: string, sessionId: string, message: O1MessagesInput | GPT4oMessagesInput): Promise<string> {
  try {
    const response = await fetch(`/api/messages/${userId}/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error(error);
    throw error;
  }
}