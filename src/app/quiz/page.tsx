"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const QuizPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/chat');
  }, [router]);

  return null;
};

export default QuizPage;