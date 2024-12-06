import { authOptions } from "@/lib/authOptions";
import ChatLayout from "@/components/chat/ChatLayout";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DateTime from "@/components/DateTime";

export default async function ChatPage({ params }: { params: { chatId: string } }) {
  const session = await getServerSession(authOptions);

  // Debugging statement to log the params object
  console.log("Received params:", params);

  // Remove '/undefined' from chatId if it exists
  if (params.chatId.endsWith("/undefined")) {
    params.chatId = params.chatId.replace("/undefined", "");
  }

  // Validate the chatId
  if (!params.chatId || params.chatId.length !== 24) {
    console.error("Invalid chatId provided:", params.chatId);
    return redirect("/chat");
  }

  try {
    const chatOwner = await prisma.chat.findUnique({
      where: {
        chatSessionId: params.chatId
      },
      select: {
        userId: true
      }
    });

    if (!session) {
      return redirect("/auth/signin");
    }

    if (!chatOwner || chatOwner.userId !== session.user.id) {
      return redirect("/chat");
    }

    const chatsHistory = await prisma.chat.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const chats = await prisma.chat.findUnique({
      where: {
        chatSessionId: params.chatId
      },
      select: {
        messages: {
          select: {
            role: true,
            content: true,
            messageType: true
          }
        }
      }
    });

    const filteredMessages = chats?.messages.map((message) => {
      const { messageType, ...rest } = message;
      if (messageType === null) {
        return rest;
      }
      return message;
    }) || [];

    return (
      <div className="flex flex-col h-screen bg-grid-black/[0.1]">
        <ChatLayout chatHistory={chatsHistory} userId={session.user.id} messages={filteredMessages} chatId={params.chatId} />
        <DateTime />
      </div>
    );
  } catch (error) {
    console.error("Error fetching chat data:", error);
    return redirect("/chat");
  }
}