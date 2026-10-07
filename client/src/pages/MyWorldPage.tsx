import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Feather, Mic, Camera, Palette, Plus, Smile } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore.js';
import { MemoryCard } from '../components/MemoryCard.js';
import { EMOTIONS } from '../utils/emotions.js';
import type { EmotionType } from '../types/index.js';

export const MyWorldPage: React.FC = () => {
  const navigate = useNavigate();
  const { memories, loadMemories, isLoading, setActiveMemoryModal } = useMemoryStore();
  const [selectedQuickEmotion, setSelectedQuickEmotion] = useState<EmotionType>('Happy');

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const totalMemories = memories.length;

  const quickEmotions: EmotionType[] = ['Happy', 'Peaceful', 'Loved', 'Grateful', 'Nostalgic', 'Hopeful'];

  return (
    <div className="space-y-10">
      {/* Header Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b-2 border-[#FFE4E8]"
      >
        <div className="space-y-1">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#332C35]">
            My World <span className="text-[#FF80AB]">🌸</span>
          </h1>
          <p className="font-handwriting text-2xl text-[#FF80AB]">
            "Come inside and tell me about your day."
          </p>
        </div>

        <button
          onClick={() => navigate('/remember-this')}
          className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF80AB] to-[#FFB6C1] text-white font-display font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Keep this moment</span>
        </button>
      </motion.div>

      {/* "How are you feeling today?" Quick Reflection Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-white border-3 border-[#FFE4E8] p-8 shadow-scrapbook"
      >
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-xs font-display font-bold text-[#FF80AB] uppercase tracking-widest bg-[#FFF0F3] px-3.5 py-1.5 rounded-full border border-[#FFB6C1]/50">
            <Sparkles className="w-4 h-4 text-[#FF80AB]" />
            <span>Daily Feeling</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-[#332C35]">
            How are you feeling today?
          </h2>

          {/* Cute Emotion Buttons */}
          <div className="flex flex-wrap gap-3">
            {quickEmotions.map((emo) => {
              const meta = EMOTIONS[emo];
              const isSelected = selectedQuickEmotion === emo;
              return (
                <button
                  key={emo}
                  onClick={() => setSelectedQuickEmotion(emo)}
                  className={`px-4 py-2.5 rounded-2xl font-display text-sm font-bold transition-all border-2 flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-[#FFF0F3] text-[#FF80AB] border-[#FF80AB] scale-105 shadow-xs'
                      : 'bg-[#FDF8F5] text-[#7A6E7D] border-[#FFE4E8] hover:border-[#FFB6C1]'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span>{emo}</span>
                </button>
              );
            })}
          </div>

          <p className="font-handwriting text-xl text-[#7A6E7D]">
            "{EMOTIONS[selectedQuickEmotion]?.description}"
          </p>
        </div>
      </motion.div>

      {/* Playful Interactive Action Grid (Write, Speak, Memory, Draw) */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-[#332C35] flex items-center space-x-2">
          <span>What do you want to create?</span>
          <Smile className="w-5 h-5 text-[#FF80AB]" />
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Write */}
          <motion.div
            whileHover={{ y: -6, rotate: 1 }}
            onClick={() => navigate('/remember-this')}
            className="cursor-pointer bg-white border-3 border-[#FFE4E8] rounded-3xl p-6 text-center space-y-3 shadow-scrapbook hover:border-[#FFB6C1] transition-all group"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF0F3] border-2 border-[#FFB6C1] flex items-center justify-center text-[#FF80AB] group-hover:scale-110 transition-transform">
              <Feather className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#332C35]">Tell me about today</h3>
              <p className="text-xs text-[#7A6E7D] font-sans">Write your thoughts</p>
            </div>
          </motion.div>

          {/* Speak */}
          <motion.div
            whileHover={{ y: -6, rotate: -1 }}
            onClick={() => navigate('/remember-this')}
            className="cursor-pointer bg-white border-3 border-[#FFE4E8] rounded-3xl p-6 text-center space-y-3 shadow-scrapbook hover:border-[#FFB6C1] transition-all group"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E1F5FE] border-2 border-[#81D4FA] flex items-center justify-center text-[#0288D1] group-hover:scale-110 transition-transform">
              <Mic className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#332C35]">Let me hear your story</h3>
              <p className="text-xs text-[#7A6E7D] font-sans">Voice recording</p>
            </div>
          </motion.div>

          {/* Memory */}
          <motion.div
            whileHover={{ y: -6, rotate: 1 }}
            onClick={() => navigate('/remember-this')}
            className="cursor-pointer bg-white border-3 border-[#FFE4E8] rounded-3xl p-6 text-center space-y-3 shadow-scrapbook hover:border-[#FFB6C1] transition-all group"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF9C4] border-2 border-[#FFF59D] flex items-center justify-center text-[#F57F17] group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#332C35]">Add a little memory</h3>
              <p className="text-xs text-[#7A6E7D] font-sans">Photos & moments</p>
            </div>
          </motion.div>

          {/* Draw */}
          <motion.div
            whileHover={{ y: -6, rotate: -1 }}
            onClick={() => navigate('/remember-this')}
            className="cursor-pointer bg-white border-3 border-[#FFE4E8] rounded-3xl p-6 text-center space-y-3 shadow-scrapbook hover:border-[#FFB6C1] transition-all group"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F3E5F5] border-2 border-[#E1BEE7] flex items-center justify-center text-[#8E24AA] group-hover:scale-110 transition-transform">
              <Palette className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#332C35]">Doodle & Draw</h3>
              <p className="text-xs text-[#7A6E7D] font-sans">Sketches & art</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Scrapbook Memories Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-[#332C35]">
            My Memory Scrapbook ({totalMemories})
          </h2>
          {memories.length > 0 && (
            <button
              onClick={() => navigate('/my-memories')}
              className="text-xs font-display font-bold text-[#FF80AB] hover:underline"
            >
              See all memories &rarr;
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-[#7A6E7D] text-sm font-display animate-pulse">
            Opening your magical journal...
          </div>
        ) : memories.length === 0 ? (
          <div className="bg-white border-3 border-[#FFE4E8] rounded-3xl p-12 text-center space-y-4 shadow-scrapbook">
            <Sparkles className="w-12 h-12 text-[#FF80AB] mx-auto" />
            <h3 className="font-display text-2xl font-bold text-[#332C35]">Your diary is quiet right now</h3>
            <p className="text-sm text-[#7A6E7D] max-w-sm mx-auto font-sans">
              Some moments deserve to stay. Tell me about your day and keep your first memory safe here.
            </p>
            <button
              onClick={() => navigate('/remember-this')}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF80AB] to-[#FFB6C1] text-white font-display font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              Tell me about today
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memories.slice(0, 4).map((mem) => (
              <MemoryCard
                key={mem.id}
                memory={mem}
                onClick={() => setActiveMemoryModal(mem)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
