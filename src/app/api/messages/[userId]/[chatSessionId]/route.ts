import { Message } from '@prisma/client'
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

// sends and stores the message to the database
export async function POST(
  request: Request,
  { params }: { params: { userId: string, chatSessionId: string } }
) {
  try {
    const body = await request.json();
    const message: Message & { componentMessageType: string } = body.message;

    await prisma.message.create({
      data: {
        chatSessionId: params.chatSessionId,
        role: message.role,
        content: message.content,
        messageType: message.componentMessageType
      }
    })

    return NextResponse.json({ message: 'Message sent' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}