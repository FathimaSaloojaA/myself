import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Lock, Calendar, Tag } from 'lucide-react';
import type { Memory } from '../types/index.js';
import { EmotionBadge } from './EmotionBadge.js';
import { EMOTIONS } from '../utils/emotions.js';

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onClick }) => {
  const meta = EMOTIONS[memory.primaryEmotion] || EMOTIONS['Peaceful'];

  const formattedDate = new Date(memory.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ y: -5, rotate: 0.5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group relative cursor-pointer rounded-3xl bg-white border-2 border-[#FFE4E8] p-6 shadow-scrapbook hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Decorative Washi Tape Accent on Top */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 opacity-80 pointer-events-none rounded-sm border border-dashed border-[#FFB6C1]"
        style={{ backgroundColor: `${meta.color}60`, transform: 'translateX(-50%) rotate(-1deg)' }}
      />

      <div className="flex items-center justify-between mb-4 pt-1">
        <div className="flex items-center space-x-1.5 text-xs text-[#7A6E7D] font-display">
          <Calendar className="w-3.5 h-3.5 text-[#FF80AB]" />
          <span>{formattedDate}</span>
          {memory.isPrivate && (
            <span className="flex items-center space-x-1 text-[#FF80AB] ml-2 bg-[#FFF0F3] px-2 py-0.5 rounded-full border border-[#FFB6C1]/50">
              <Lock className="w-3 h-3" />
              <span>Private</span>
            </span>
          )}
        </div>
        <EmotionBadge emotion={memory.primaryEmotion} intensity={memory.emotionIntensity} size="sm" />
      </div>

      <h3 className="font-display text-xl font-bold text-[#332C35] group-hover:text-[#FF80AB] transition-colors duration-200 line-clamp-1 mb-2">
        {memory.title}
      </h3>

      <p className="font-sans text-sm text-[#5C5260] line-clamp-3 leading-relaxed mb-6">
        {memory.content}
      </p>

      {/* Card Footer */}
      <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-[#FFE4E8] text-xs text-[#7A6E7D]">
        {memory.place && (
          <span className="flex items-center space-x-1 text-[#4A3E4E] bg-[#FFF5F5] px-2.5 py-1 rounded-full border border-[#FFD1DC]">
            <MapPin className="w-3.5 h-3.5 text-[#FF80AB]" />
            <span className="font-medium">{memory.place}</span>
          </span>
        )}

        {memory.people.length > 0 && (
          <span className="flex items-center space-x-1 text-[#4A3E4E] bg-[#FFF5F5] px-2.5 py-1 rounded-full border border-[#FFD1DC]">
            <Users className="w-3.5 h-3.5 text-[#FF80AB]" />
            <span className="font-medium">{memory.people.join(', ')}</span>
          </span>
        )}

        {memory.tags.map((tag) => (
          <span key={tag} className="flex items-center space-x-0.5 text-[#5C5260] bg-[#FDF0F5] px-2.5 py-1 rounded-full border border-[#FFD1DC]/60 font-sans">
            <Tag className="w-2.5 h-2.5 text-[#FF80AB]" />
            <span>{tag}</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
};
