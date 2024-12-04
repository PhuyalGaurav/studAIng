import React from 'react';

interface ComparisonItem {
  header: string;
  points: string[];
}

interface ComparisonSlideProps {
  title: string;
  comparisonItems: ComparisonItem[];
}

const ComparisonSlide: React.FC<ComparisonSlideProps> = ({ title, comparisonItems }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-1 sm:p-2 md:p-4 bg-white">
      <h2 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 md:mb-4">{title}</h2>
      <div className="flex flex-row justify-center w-full max-w-5xl space-x-2">
        {comparisonItems.map((item, index) => (
          <div key={index} className="flex-1 bg-gray-50 p-2 m-auto h-full rounded-lg border border-gray-200">
            <h3 className="text-[8px] sm:text-base font-semibold mb-0 sm:mb-1">{item.header}</h3>
            <ul className="space-y-0 sm:space-y-1 md:space-y-2">
              {item.points.map((point, idx) => (
                <li key={idx} className="flex items-center text-[6px] sm:text-[10px] md:text-xs">
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonSlide;