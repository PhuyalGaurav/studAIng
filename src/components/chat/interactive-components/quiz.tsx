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

  const handleAnswerClick = (isCorrect: boolean) => {
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

  return (
    <div className="flex flex-col flex-grow items-center rounded-lg bg-white w-[250px] sm:w-[450px] md:w-[550px] justify-center p-4">
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