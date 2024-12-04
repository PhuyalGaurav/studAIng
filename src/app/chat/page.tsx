import ChatLayout from "@/components/chat/ChatLayout";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect("/auth/signin");
  }

  const chatsHistory = await prisma.chat.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="flex flex-col h-screen bg-grid-black/[0.1]">
      <ChatLayout chatHistory={chatsHistory} userId={session.user.id} />
    </div>
  );
}