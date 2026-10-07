import React from 'react';
import type { EmotionType } from '../types/index.js';
import { EMOTIONS } from '../utils/emotions.js';

interface EmotionBadgeProps {
  emotion: EmotionType;
  intensity?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const EmotionBadge: React.FC<EmotionBadgeProps> = ({
  emotion,
  intensity,
  size = 'md',
}) => {
  const meta = EMOTIONS[emotion] || EMOTIONS['Peaceful'];

  const sizeClasses = {
    sm: 'text-xs px-3 py-1 space-x-1.5 font-display',
    md: 'text-sm px-4 py-1.5 space-x-2 font-display',
    lg: 'text-base px-5 py-2 space-x-2.5 font-display',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border-2 shadow-xs transition-transform duration-200 hover:scale-105 ${sizeClasses[size]}`}
      style={{
        borderColor: `${meta.color}`,
        backgroundColor: `${meta.color}25`,
        color: '#332C35',
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full animate-pulse"
        style={{ backgroundColor: meta.color, boxShadow: `0 0 10px ${meta.color}` }}
      />
      <span className="font-semibold tracking-wide">{meta.name}</span>
      {intensity !== undefined && (
        <span
          className="text-xs px-1.5 py-0.5 rounded-full font-sans font-bold"
          style={{ backgroundColor: '#FFFFFF', color: '#332C35' }}
        >
          {intensity}%
        </span>
      )}
    </span>
  );
};
