import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Lock, Trash2, Heart, Mic, Camera, Palette, Play, Pause } from 'lucide-react';
import type { Memory } from '../types/index.js';
import { EmotionBadge } from './EmotionBadge.js';
import { EMOTIONS } from '../utils/emotions.js';
import { useMemoryStore } from '../store/useMemoryStore.js';

interface MemoryDetailModalProps {
  memory: Memory | null;
  onClose: () => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  onClose,
}) => {
  const { deleteMemory } = useMemoryStore();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  if (!memory) return null;

  const meta = EMOTIONS[memory.primaryEmotion] || EMOTIONS['Peaceful'];

  const formattedDate = new Date(memory.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this memory from your diary?')) {
      if (audioElement) audioElement.pause();
      await deleteMemory(memory.id);
      onClose();
    }
  };

  const toggleAudio = () => {
    if (!memory.audioUrl) return;

    if (!audioElement) {
      const audio = new Audio(memory.audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      setAudioElement(audio);
      audio.play();
      setIsPlayingAudio(true);
    } else {
      if (isPlayingAudio) {
        audioElement.pause();
        setIsPlayingAudio(false);
      } else {
        audioElement.play();
        setIsPlayingAudio(true);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#332C35]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-2xl bg-[#FFFBF7] border-4 border-[#FFE4E8] rounded-3xl p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Top Washi Tape */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-7 opacity-90 pointer-events-none rounded-sm border border-dashed border-[#FFB6C1]"
            style={{ backgroundColor: `${meta.color}80` }}
          />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#FFE4E8] pt-2">
            <div className="flex items-center space-x-3">
              <EmotionBadge emotion={memory.primaryEmotion} intensity={memory.emotionIntensity} size="lg" />
              {memory.isPrivate && (
                <span className="flex items-center space-x-1 text-xs text-[#FF80AB] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#FFB6C1]/50 font-display">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private Memory</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleDelete}
                className="p-2 text-[#7A6E7D] hover:text-rose-500 transition-colors rounded-full hover:bg-rose-50"
                title="Erase memory"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (audioElement) audioElement.pause();
                  onClose();
                }}
                className="p-2 text-[#7A6E7D] hover:text-[#332C35] transition-colors rounded-full hover:bg-[#FFE4E8]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="overflow-y-auto my-6 pr-2 space-y-6 flex-1">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-[#7A6E7D] font-display">
                <Calendar className="w-4 h-4 text-[#FF80AB]" />
                <span>{formattedDate}</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-[#332C35] font-bold leading-snug">
                {memory.title}
              </h2>
            </div>

            {/* Audio Memory Player */}
            {memory.audioUrl && (
              <div className="p-4 rounded-2xl bg-[#E1F5FE] border-2 border-[#81D4FA] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mic className="w-5 h-5 text-[#0288D1]" />
                  <span className="font-display font-bold text-xs text-[#0288D1]">Voice Recording Attached</span>
                </div>
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-[#81D4FA] text-[#0288D1] font-display font-bold text-xs shadow-xs hover:bg-[#F0F4C3]"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'Pause Voice' : 'Play Voice'}</span>
                </button>
              </div>
            )}

            <p className="text-[#4A3E4E] text-lg leading-relaxed font-sans whitespace-pre-wrap">
              {memory.content}
            </p>

            {/* Photos Gallery */}
            {memory.mediaUrls && memory.mediaUrls.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2 text-xs font-display font-bold text-[#F57F17]">
                  <Camera className="w-4 h-4" />
                  <span>Photo Memories ({memory.mediaUrls.length})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {memory.mediaUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Photo ${idx + 1}`}
                      className="w-full aspect-square object-cover rounded-2xl border-2 border-[#FFE4E8] shadow-xs"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Drawing Preview */}
            {memory.drawingUrl && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2 text-xs font-display font-bold text-[#8E24AA]">
                  <Palette className="w-4 h-4" />
                  <span>Doodle Drawing</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border-2 border-[#FFE4E8] text-center">
                  <img
                    src={memory.drawingUrl}
                    alt="Memory Drawing"
                    className="max-h-60 mx-auto rounded-xl object-contain"
                  />
                </div>
              </div>
            )}

            {/* Emotional Context */}
            <div className="bg-[#FFF0F3] p-5 rounded-2xl border border-[#FFB6C1]/40 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-display font-bold text-[#FF80AB] uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-[#FF80AB]" />
                <span>Emotional Atmosphere</span>
              </div>
              <p className="text-base text-[#4A3E4E] font-handwriting text-lg">
                "{meta.description}"
              </p>
              {memory.secondaryEmotions.length > 0 && (
                <div className="flex items-center space-x-2 text-xs text-[#7A6E7D] pt-1">
                  <span>Also felt:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {memory.secondaryEmotions.map((sec) => (
                      <span key={sec} className="bg-white text-[#332C35] px-2.5 py-0.5 rounded-full border border-[#FFB6C1]/30 font-display">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* People & Places metadata */}
            {(memory.place || memory.people.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                {memory.place && (
                  <div className="flex items-start space-x-2 text-[#5C5260] bg-white p-4 rounded-2xl border border-[#FFE4E8]">
                    <MapPin className="w-4 h-4 text-[#FF80AB] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-[#7A6E7D] block font-display">Where I was</span>
                      <span className="text-[#332C35] font-bold font-display">{memory.place}</span>
                    </div>
                  </div>
                )}

                {memory.people.length > 0 && (
                  <div className="flex items-start space-x-2 text-[#5C5260] bg-white p-4 rounded-2xl border border-[#FFE4E8]">
                    <Users className="w-4 h-4 text-[#FF80AB] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-[#7A6E7D] block font-display">People with me</span>
                      <span className="text-[#332C35] font-bold font-display">{memory.people.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
