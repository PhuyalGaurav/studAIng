import React, { useState } from 'react';

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
  const [quizUrl, setQuizUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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
    if (quizUrl) {
      setShowModal(true);
      return;
    }

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
      // Store the full URL without navigation
      const fullUrl = `${window.location.origin}/quiz/${data.quizId}`;
      setQuizUrl(fullUrl);
      setShowModal(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to share quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (quizUrl) {
      navigator.clipboard.writeText(quizUrl).then(() => {
        // Use a more subtle notification instead of alert
        const notification = document.createElement('div');
        notification.textContent = 'Link copied!';
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
      });
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Share Quiz</h2>
            <p className="mb-4">Share this link to invite others to take the quiz:</p>
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={quizUrl || ''}
                readOnly
                className="flex-grow p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleCopyLink}
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Copy Link
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;