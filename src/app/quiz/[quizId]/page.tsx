"use client";

import logo from "@/public/logo.png";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Head from "next/head";
const Quiz = dynamic(
  () => import("@/components/chat/interactive-components/quiz"),
  { ssr: false }
);

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigation = () => {
    setIsTransitioning(true);
    router.push("/chat");
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${quizId}`);
        if (!response.ok) {
          throw new Error("Quiz not found");
        }
        const data: QuizData = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
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

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center p-10">
        {isTransitioning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <h1 className="text-2xl bold">Welcome to the Quiz!</h1>
        <p>
          This quiz was shared with you. Answer the questions below and see how
          you do!
        </p>
        <Quiz questions={questions} />
        <button
          onClick={handleNavigation}
          disabled={isTransitioning}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Back to chat
        </button>
      </div>
    </>
  );
};

export default QuizPage;
