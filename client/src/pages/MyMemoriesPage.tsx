import React, { useEffect, useState } from 'react';
import { Search, Heart } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore.js';
import { MemoryCard } from '../components/MemoryCard.js';
import { ALL_EMOTION_NAMES } from '../utils/emotions.js';
import type { EmotionType } from '../types/index.js';

export const MyMemoriesPage: React.FC = () => {
  const { memories, loadMemories, isLoading, setActiveMemoryModal } = useMemoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | 'All'>('All');

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const filteredMemories = memories.filter((m) => {
    const matchesEmotion = selectedEmotion === 'All' || m.primaryEmotion === selectedEmotion;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.content.toLowerCase().includes(q) ||
      m.people.some((p) => p.toLowerCase().includes(q)) ||
      (m.place && m.place.toLowerCase().includes(q)) ||
      m.tags.some((t) => t.toLowerCase().includes(q));

    return matchesEmotion && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b-2 border-[#FFE4E8]">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#332C35]">
          My Memories <span className="text-[#FF80AB]">📖</span>
        </h1>
        <p className="font-handwriting text-2xl text-[#FF80AB]">
          "The timeline of everything I was and everything I felt."
        </p>
      </div>

      {/* Search & Emotion Filter Spectrum */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF80AB]" />
          <input
            type="text"
            placeholder="Search my memories by keyword, place, or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-3 border-[#FFE4E8] rounded-3xl pl-13 pr-6 py-4 text-sm font-display text-[#332C35] placeholder-[#7A6E7D]/50 focus:outline-none focus:border-[#FF80AB] transition-colors shadow-xs"
          />
        </div>

        {/* Emotion Pills */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedEmotion('All')}
            className={`px-4 py-2.5 rounded-full text-xs font-display font-bold shrink-0 transition-all border-2 ${
              selectedEmotion === 'All'
                ? 'bg-[#FF80AB] text-white border-[#FF80AB] shadow-xs'
                : 'bg-white text-[#7A6E7D] border-[#FFE4E8] hover:border-[#FFB6C1]'
            }`}
          >
            All Moments ({memories.length})
          </button>

          {ALL_EMOTION_NAMES.map((emo) => {
            const count = memories.filter((m) => m.primaryEmotion === emo).length;
            if (count === 0 && selectedEmotion !== emo) return null;
            return (
              <button
                key={emo}
                onClick={() => setSelectedEmotion(emo)}
                className={`px-4 py-2.5 rounded-full text-xs font-display font-bold shrink-0 transition-all border-2 ${
                  selectedEmotion === emo
                    ? 'bg-[#FFF0F3] text-[#FF80AB] border-[#FF80AB] shadow-xs'
                    : 'bg-white text-[#7A6E7D] border-[#FFE4E8] hover:border-[#FFB6C1]'
                }`}
              >
                {emo} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-[#7A6E7D] text-sm font-display animate-pulse">
          Opening memories...
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="bg-white border-3 border-[#FFE4E8] rounded-3xl p-12 text-center space-y-3 shadow-scrapbook">
          <Heart className="w-10 h-10 text-[#FF80AB]/60 mx-auto" />
          <p className="font-display text-xl font-bold text-[#332C35]">No matching memories found</p>
          <p className="text-xs text-[#7A6E7D] font-sans">
            Try adjusting your search terms or emotion filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onClick={() => setActiveMemoryModal(memory)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
