"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Quiz = dynamic(() => import('@/components/chat/interactive-components/quiz'), { ssr: false });

const QuizPage = () => {
  const searchParams = useSearchParams();
  const quizId = searchParams.get('quizId');
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    if (quizId) {
      fetch(`/api/quiz?quizId=${quizId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.questions) {
            setQuestions(data.questions);
          } else {
            console.error('Quiz not found');
          }
        });
    }
  }, [quizId]);

  if (!questions) {
    return <p>Loading...</p>;
  }

  return <Quiz questions={questions} />;
};

export default QuizPage;