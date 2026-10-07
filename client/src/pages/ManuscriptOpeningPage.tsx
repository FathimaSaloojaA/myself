import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { CloudIllustration, StarIllustration, FlowerIllustration, BookIllustration } from '../components/Illustrations.js';

export const ManuscriptOpeningPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/my-world');
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#FFF5F5] via-[#FDF8F5] to-[#FFF0F3] flex flex-col items-center justify-center px-6 overflow-hidden select-none">
      {/* Soft Floating Decorative Illustrations */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 left-12 opacity-80"
      >
        <CloudIllustration className="w-16 h-16" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 left-16 opacity-80"
      >
        <FlowerIllustration className="w-16 h-16" />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-16 opacity-80"
      >
        <StarIllustration className="w-14 h-14" />
      </motion.div>

      {/* Diary Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-xl text-center space-y-8 bg-white/80 backdrop-blur-md border-4 border-[#FFE4E8] rounded-3xl p-10 md:p-14 shadow-2xl"
      >
        {/* Cute Emblem */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="inline-flex items-center justify-center p-4 rounded-full bg-[#FFF0F3] border-2 border-[#FFB6C1] text-[#FF80AB] shadow-md mb-2 cursor-pointer"
        >
          <BookIllustration className="w-10 h-10" />
        </motion.div>

        {/* Title */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight text-[#332C35]"
          >
            MYSELF <span className="text-[#FF80AB]">✨</span>
          </motion.h1>

          <p className="font-handwriting text-2xl md:text-3xl text-[#FF80AB] pt-1">
            "Everything I was. Everything I felt. Everything I became."
          </p>
        </div>

        <p className="text-base text-[#5C5260] font-sans leading-relaxed max-w-md mx-auto">
          A cute & magical digital scrapbook for your daily thoughts, voice memories, photos, emotions, people, and places.
        </p>

        {/* Action Button: Open My Diary */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pt-4"
        >
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center space-x-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#FF80AB] to-[#FFB6C1] text-white font-display text-lg font-bold tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <span>Open My Diary ✨</span>
            <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
          </button>
        </motion.div>
      </motion.div>

      {/* Cute Footer */}
      <div className="absolute bottom-6 text-xs text-[#7A6E7D] font-display flex items-center space-x-1">
        <span>Made with</span>
        <Heart className="w-3.5 h-3.5 text-[#FF80AB] fill-[#FF80AB]" />
        <span>for your precious memories</span>
      </div>
    </div>
  );
};
