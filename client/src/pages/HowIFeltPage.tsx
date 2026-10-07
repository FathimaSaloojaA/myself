import React, { useEffect } from 'react';
import { Heart, Activity, Sparkles } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore.js';
import { ALL_EMOTION_NAMES, EMOTIONS } from '../utils/emotions.js';

export const HowIFeltPage: React.FC = () => {
  const { memories, loadMemories } = useMemoryStore();

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const total = memories.length || 1;

  const emotionCounts = ALL_EMOTION_NAMES.map((emo) => {
    const count = memories.filter((m) => m.primaryEmotion === emo).length;
    const percentage = Math.round((count / total) * 100);
    return {
      emotion: emo,
      count,
      percentage,
      meta: EMOTIONS[emo],
    };
  }).sort((a, b) => b.count - a.count);

  const avgIntensity = Math.round(
    memories.reduce((acc, m) => acc + (m.emotionIntensity || 80), 0) / total
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b-2 border-[#FFE4E8]">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#332C35]">
          How I felt <span className="text-[#FF80AB]">💖</span>
        </h1>
        <p className="font-handwriting text-2xl text-[#FF80AB]">
          "The emotional spectrum of my daily life."
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-3 border-[#FFE4E8] rounded-3xl p-6 flex items-center space-x-5 shadow-scrapbook">
          <div className="p-4 rounded-2xl bg-[#FFF0F3] border-2 border-[#FFB6C1] text-[#FF80AB]">
            <Heart className="w-8 h-8 fill-[#FF80AB]" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-display font-bold text-[#7A6E7D]">
              Top Emotional Resonance
            </div>
            <div className="font-display text-3xl font-bold text-[#332C35]">
              {emotionCounts[0]?.emotion || 'Happy'}
            </div>
            <div className="text-xs text-[#7A6E7D] font-sans pt-0.5">
              Accounted for {emotionCounts[0]?.percentage || 0}% of preserved moments
            </div>
          </div>
        </div>

        <div className="bg-white border-3 border-[#FFE4E8] rounded-3xl p-6 flex items-center space-x-5 shadow-scrapbook">
          <div className="p-4 rounded-2xl bg-[#E8F5E9] border-2 border-[#A5D6A7] text-[#388E3C]">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-display font-bold text-[#7A6E7D]">
              Average Intensity
            </div>
            <div className="font-display text-3xl font-bold text-[#332C35]">
              {avgIntensity}%
            </div>
            <div className="text-xs text-[#7A6E7D] font-sans pt-0.5">
              Overall depth of emotional awareness
            </div>
          </div>
        </div>
      </div>

      {/* Spectrum Breakdown */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-[#332C35] flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#FF80AB]" />
          <span>My Emotional Spectrum</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emotionCounts.map(({ emotion, count, percentage, meta }) => (
            <div
              key={emotion}
              className="bg-white border-3 border-[#FFE4E8] rounded-3xl p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
                  />
                  <span className="font-display text-lg font-bold text-[#332C35]">{emotion}</span>
                </div>
                <span className="text-xs font-display font-bold text-[#7A6E7D]">
                  {count} {count === 1 ? 'memory' : 'memories'} ({percentage}%)
                </span>
              </div>

              <div className="w-full bg-[#FFF0F3] h-3 rounded-full overflow-hidden p-0.5 border border-[#FFB6C1]/40">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(percentage, count > 0 ? 8 : 0)}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>

              <p className="font-handwriting text-lg text-[#7A6E7D]">
                "{meta.description}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
