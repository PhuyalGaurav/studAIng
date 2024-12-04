import React from 'react';

interface DefinitionSlideProps {
  term: string;
  definition: string;
}

const DefinitionSlide: React.FC<DefinitionSlideProps> = ({ term, definition }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white text-gray-800 p-8">
      <h3 className="text-base sm:text-2xl md:text-4xl font-bold mb-1 sm:mb-2 md:mb-4">{term}</h3>
      <p className="text-xs sm:text-base md:text-lg max-w-2xl text-center">{definition}</p>
    </div>
  );
};

export default DefinitionSlide;