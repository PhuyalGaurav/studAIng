import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { questions } = await req.json();
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Invalid quiz format' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        questions: questions,
      },
    });
    return NextResponse.json({ quizId: quiz.id });
  } catch (error) {
    console.error('Quiz creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const quizzes = await prisma.quiz.findMany();
    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Quiz fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}