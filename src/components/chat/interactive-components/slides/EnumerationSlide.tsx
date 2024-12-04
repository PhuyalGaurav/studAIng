import React from 'react';

interface EnumerationSlideProps {
  title: string;
  bullets: string[];
}

const EnumerationSlide: React.FC<EnumerationSlideProps> = ({ title, bullets }) => {
  return (
    <div className="flex flex-col items-start justify-center h-full bg-white text-gray-800 p-8">
      <h2 className="text-sm sm:text-xl md:text-2xl font-semibold sm:mb-2 md:mb-4">{title}</h2>
      <ul className="sm:space-y-1 md:space-y-2">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-start">
            <span className="text-[8px] sm:text-sm md:text-base">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnumerationSlide;