"use client";

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Flashcard {
  term: string;
  definition: string;
}

interface FlashcardProps {
  flashcards: Flashcard[];
}

const Flashcards: React.FC<FlashcardProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1))
    setIsFlipped(false)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0))
    setIsFlipped(false)
  }



  const currentFlashcard = flashcards[currentIndex]

  return (
    <div className="flex flex-col flex-grow items-center w-[250px] sm:w-[450px] md:w-[550px] justify-center">
      <div
        className={`relative w-full bg-white aspect-[4/3] rounded-lg cursor-pointer perspective-1000 transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={handleFlip}
      >
        <div className="relative w-full h-full text-card-foreground">
          <div className={`absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-6 ${isFlipped ? '' : 'rotate-y-180 opacity-0'}`}>
            <h2 className="text-2xl font-bold text-center mb-2">{currentFlashcard.term}</h2>
          </div>
          <div className={`absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-6 ${isFlipped ? 'rotate-y-180 opacity-0' : ''}`}>
            <p className="text-base text-center">{currentFlashcard.definition}</p>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-muted-foreground">
            {currentIndex + 1} of {flashcards.length}
          </div>
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 bottom-2 opacity-70 hover:opacity-100"
              onClick={handlePrevious}
              aria-label="Previous card"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-4 opacity-70 hover:opacity-100"
              onClick={handleNext}
              aria-label="Next card"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        </div>
      </div>
    </div>
  )
};

export default Flashcards;