import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

let quizzes: { [key: string]: any } = {};

export async function POST(req: NextRequest) {
  const { questions } = await req.json();
  const quizId = uuidv4();
  quizzes[quizId] = questions;
  return NextResponse.json({ quizId });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const quizId = searchParams.get('quizId');
  const quiz = quizzes[quizId as string];
  if (quiz) {
    return NextResponse.json({ questions: quiz });
  } else {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }
}