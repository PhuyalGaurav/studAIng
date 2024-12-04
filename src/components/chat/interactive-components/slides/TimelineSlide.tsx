import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

interface Milestone {
  eventTitle: string;
  date: string;
  description: string;
  icon?: string;
}

interface TimelineSlideProps {
  title: string;
  milestones: Milestone[];
}

const TimelineSlide: React.FC<TimelineSlideProps> = ({ title, milestones }) => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-8 bg-white">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="w-full max-w-4xl">
        <div className="relative">
          <div className="border-l-2 border-blue-500 absolute h-full left-1/2 transform -translate-x-1/2"></div>
          <ul className="space-y-8">
            {milestones.map((milestone, index) => (
              <li key={index} className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <FaCalendarAlt className="text-blue-500 mb-2" />
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
                <div className="bg-white p-4 rounded shadow-md w-1/2">
                  <h3 className="text-xl font-semibold">{milestone.eventTitle}</h3>
                  <span className="text-sm text-gray-500">{milestone.date}</span>
                  <p className="mt-2 text-gray-700">{milestone.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TimelineSlide;