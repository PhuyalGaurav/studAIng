import { GPT4oMessagesInput, O1MessagesInput } from "@/lib/types";

export default function selectAIModel(messageInput: GPT4oMessagesInput[] | O1MessagesInput[]): "gpt-4o-mini" | "o1" {
  if (messageInput.length === 0) {
      throw new Error("Message input array is empty");
  }

  // defaulted to gpt-4o for launched verion only

  return "gpt-4o-mini";

//   const firstMessage = messageInput[0];

//   if ('content' in firstMessage && Array.isArray(firstMessage.content)) {
//       return "gpt-4o";
//   } else if ('content' in firstMessage && typeof firstMessage.content === 'string') {
//       return "o1";
//   } else {
//       throw new Error("Invalid message input format");
//   }
}