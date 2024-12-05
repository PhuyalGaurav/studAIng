import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Choice {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  choices: Choice[];
}

interface QuizProps {
  questions: Question[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnswerClick = (isCorrect: boolean) => {
    setError(null);
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleRedo = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const handleShare = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to share quiz');
      }
      
      const data = await response.json();
      router.push(`/quiz/${data.quizId}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to share quiz');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow items-center rounded-lg bg-white w-[250px] sm:w-[450px] md:w-[550px] justify-center p-4">
      {error && (
        <div className="w-full p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      <div className="w-full flex justify-end">
        <button
          onClick={handleShare}
          disabled={isLoading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Sharing...' : 'Share'}
        </button>
      </div>
      {showScore ? (
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">
            Congratulations! You scored {score} out of {questions.length}
          </p>
          <button
            onClick={handleRedo}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Redo Quiz
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-4">{questions[currentQuestion].questionText}</h2>
          <div className="space-y-3 w-full sm:w-3/4">
            {questions[currentQuestion].choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(choice.isCorrect)}
                className="w-full p-3 text-left bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition duration-300 ease-in-out"
              >
                {choice.text}
              </button>
            ))}
            <div className="text-sm text-center text-muted-foreground">
              {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;