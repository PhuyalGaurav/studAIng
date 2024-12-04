import prisma from "@/lib/db"
import { NextResponse } from "next/server";
import generateChatName from "@/utils/generateChatName";

// gets all chats for a user
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userId: params.userId
      }
    })

    return NextResponse.json(chats)
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}

// creates a new chat
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { input }: { input: string } = await request.json();
    console.log(input, 'input')
    const chatName = await generateChatName(input.trim())
    console.log(chatName, 'chatName')

    const newChat = await prisma.chat.create({
      data: {
        chatName: chatName,
        userId: params.userId
      },
    })

    // returns chatsession id from the newly created chat.
    // the session id will be used to append messages to the chat.
    return NextResponse.json({ chatSessionId: newChat.chatSessionId }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}