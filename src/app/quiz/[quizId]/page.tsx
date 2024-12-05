"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Quiz = dynamic(() => import('@/components/chat/interactive-components/quiz'), { ssr: false });

interface Question {
  questionText: string;
  choices: {
    text: string;
    isCorrect: boolean;
  }[];
}

interface QuizData {
  questions: Question[];
  error?: string;
}

const QuizPage = () => {
  const params = useParams();
  const quizId = params.quizId as string;
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${quizId}`);
        if (!response.ok) {
          throw new Error('Quiz not found');
        }
        const data: QuizData = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  if (isLoading) {
    return <p className="text-center">Loading quiz...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!questions) {
    return <p className="text-center">Quiz not found</p>;
  }

  return <Quiz questions={questions} />;
};

export default QuizPage;