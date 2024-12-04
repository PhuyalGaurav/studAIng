"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, BookOpen, FileText } from "lucide-react";
import { textToSpeech } from '@/components/speech/TextToSpeech';

interface Spelling {
  word: string;
  definition: string;
  examples: string[];
}

interface SpellingProps {
  spellings: Spelling[];
}

const Spelling: React.FC<SpellingProps> = ({ spellings }) => {
  const [audioMap, setAudioMap] = useState<{ [key: string]: string }>({});
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currAnswer, setCurrAnswer] = useState<string>("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = (text: string) => {
    textToSpeech(text, audioMap, setAudioMap, setIsSpeaking, currentAudioRef);
  };

  const speakWord = () => {
    const wordToSpeak = spellings[currentQuestion].word;
    speakText(wordToSpeak);
  };

  const speakDefinition = () => {
    const definitionToSpeak = spellings[currentQuestion].definition;
    speakText(definitionToSpeak);
  };

  const speakExample = (example: string) => {
    speakText(example);
  };

  const handleAnswerClick = () => {
    const correctAnswer = spellings[currentQuestion].word.toLowerCase();
    const isCorrect = currAnswer.trim().toLowerCase() === correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    const nextSpellingQuestion = currentQuestion + 1;
    if (nextSpellingQuestion < spellings.length) {
      setCurrentQuestion(nextSpellingQuestion);
      setCurrAnswer("");
    } else {
      setShowScore(true);
    }
  };

  const handleRedo = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setCurrAnswer("");
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className='px-0 py-4'>
        <CardTitle className="text-center text-2xl  font-bold">Spelling Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6 py-0">
        {showScore ? (
          <div className="text-center mb-4">
            <p className="text-xl font-bold mb-4 text-gray-800">
              Congratulations! You scored {score} out of {spellings.length}
            </p>
            <Button
              onClick={handleRedo}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Redo Spelling
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={speakWord}
                aria-label="Listen to word"
                disabled={isSpeaking}
              >
                <Volume2 className="h-6 w-6" />
              </Button>
              <p className="text-sm sm:text-base font-medium">Listen and spell the word</p>
            </div>
            <div className="flex flex-col items-center">
              <div className='flex flex-col space-y-2 items-center w-full'>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={speakDefinition}
                  aria-label="Listen to definition"
                  className="w-full flex items-center space-x-2 py-2"
                  disabled={isSpeaking}
                >
                  <BookOpen className="h-4 w-4 text-gray-600" />
                  <span>Definition</span>
                </Button>
                <div>
                  <p className="text-sm mb-4"> Definition: {spellings[currentQuestion].definition}</p>
                </div>
                {spellings[currentQuestion].examples.map((example, index) => (
                  <Button
                    key={index}
                    onClick={() => speakExample(example)}
                    variant="outline"
                    size="sm"
                    className='w-full flex items-center space-x-2 py-2'
                    disabled={isSpeaking}
                  >
                    <FileText className="h-4 w-4" />
                    <span>{`Example ${index + 1}`}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Input
                type="text"
                placeholder="Type your answer"
                className="pr-10"
                value={currAnswer}
                onChange={(e) => setCurrAnswer(e.target.value)}
              />
            </div>
          </>
        )}
      </CardContent>
      {!showScore && (
        <CardFooter className='flex flex-col space-y-4 py-4'>
          <Button className="w-full" onClick={handleAnswerClick}>
            Submit
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            {currentQuestion + 1} of {spellings.length}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Spelling;