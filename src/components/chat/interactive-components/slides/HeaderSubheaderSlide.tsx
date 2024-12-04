import React from 'react';

interface HeaderSubheaderSlideProps {
  title: string;
  subtitle: string;
}

const HeaderSubheaderSlide: React.FC<HeaderSubheaderSlideProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
      <h1 className="text-lg sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-2 md:mb-4 text-center">{title}</h1>
      <p className="text-base sm:text-lg md:text-xl text-center max-w-2xl">{subtitle}</p>
    </div>
  );
};

export default HeaderSubheaderSlide;