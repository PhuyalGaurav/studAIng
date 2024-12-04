import { Message } from '@prisma/client'
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

// sends and stores the message to the database
export async function POST(
  request: Request,
  { params }: { params: { userId: string, chatSessionId: string } }
) {
  // Log the incoming parameters
  console.log("Received params:", params);

  try {
    // Check if chatSessionId is 'undefined' and handle it
    if (params.chatSessionId === 'undefined') {
      console.error("chatSessionId is 'undefined'");
      return NextResponse.json({ message: 'Invalid chatSessionId' }, { status: 400 });
    }

    // Remove 'undefined' from chatSessionId if it exists
    if (params.chatSessionId.includes('undefined')) {
      params.chatSessionId = params.chatSessionId.replace('undefined', '');
      console.log("Updated chatSessionId:", params.chatSessionId);
    }

    // Validate the chatSessionId
    if (!params.chatSessionId || params.chatSessionId.length !== 24) {
      console.error("Invalid chatSessionId provided:", params.chatSessionId);
      return NextResponse.json({ message: 'Invalid chatSessionId' }, { status: 400 });
    }

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
    console.error("Error creating message:", error);
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}