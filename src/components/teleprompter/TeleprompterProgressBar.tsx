import React from 'react';
import { calculateProgress } from '@/utils/progressCalculator';

interface TeleprompterProgressBarProps {
  currentPosition: number;
  maxScrollDistance: number;
}

export const TeleprompterProgressBar: React.FC<TeleprompterProgressBarProps> = ({
  currentPosition,
  maxScrollDistance
}) => {
  const progress = calculateProgress(currentPosition, maxScrollDistance);

  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-20">
      <div 
        className="h-full bg-gradient-to-r from-speaker-andreas to-speaker-achim transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};