import { Chat } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db';

// user updates chat name
// body should contain the new chat name
export async function PUT(
  request: Request,
  { params }: { params: { userId: string, chatSessionId: string } }
) {
  try {
    const body: Chat = await request.json()

    const chat = await prisma.chat.findUnique({
      where: {
        chatSessionId: params.chatSessionId
      }
    });

    if (!chat || chat.userId !== params.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await prisma.chat.update({
      where: {
        chatSessionId: params.chatSessionId
      },
      data: {
        chatName: body.chatName
      }
    })

    return NextResponse.json({ message: 'Chat name updated' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}


// user deletes the specific chat

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string, chatSessionId: string } }
) {
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        chatSessionId: params.chatSessionId
      }
    });

    if (!chat || chat.userId !== params.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await prisma.chat.delete({
      where: {
        chatSessionId: params.chatSessionId
      }
    })

    return NextResponse.json({ message: 'Chat deleted' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}