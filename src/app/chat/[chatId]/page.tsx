import { authOptions } from "@/lib/authOptions";
import ChatLayout from "@/components/chat/ChatLayout";
import prisma from "@/lib/db"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ChatPage({ params }: { params: { chatId: string } }) {
  const session = await getServerSession(authOptions)
  const chatOwner = await prisma.chat.findUnique({
    where: {
      chatSessionId: params.chatId
    },
    select: {
      userId: true
    }
  })

  if (!session) {
    return redirect("/auth/signin");
  }

  if (!chatOwner || chatOwner.userId !== session.user.id) {
    return redirect("/");
  }

  const chatsHistory = await prisma.chat.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

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
  })

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
    </div>
  )
}