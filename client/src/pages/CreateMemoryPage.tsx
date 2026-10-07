import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Users, Lock, Tag, Sparkles } from 'lucide-react';
import { ALL_EMOTION_NAMES, EMOTIONS } from '../utils/emotions.js';
import type { EmotionType } from '../types/index.js';
import { useMemoryStore } from '../store/useMemoryStore.js';
import { VoiceRecorder } from '../components/VoiceRecorder.js';
import { DrawingCanvas } from '../components/DrawingCanvas.js';
import { PhotoUploader } from '../components/PhotoUploader.js';

export const CreateMemoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { addMemory } = useMemoryStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [primaryEmotion, setPrimaryEmotion] = useState<EmotionType>('Happy');
  const [emotionIntensity, setEmotionIntensity] = useState<number>(85);
  const [peopleInput, setPeopleInput] = useState('');
  const [place, setPlace] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [drawingUrl, setDrawingUrl] = useState<string | undefined>(undefined);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const activeEmotionMeta = EMOTIONS[primaryEmotion];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please give your memory a cute title! ✨');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Tell me a little story about what happened.');
      return;
    }

    setErrorMsg('');
    setIsSaving(true);

    try {
      const people = peopleInput
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await addMemory({
        title,
        content,
        primaryEmotion,
        emotionIntensity,
        people,
        place: place.trim() || undefined,
        tags,
        isPrivate,
        audioUrl,
        drawingUrl,
        mediaUrls,
      });

      navigate('/my-world');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to preserve memory.');
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-[#FFE4E8]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-sm font-display text-[#7A6E7D] hover:text-[#FF80AB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My World</span>
        </button>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-[#332C35]">
          Tell me about today ✨
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FFF0F3] border-2 border-[#FFB6C1] text-[#FF80AB] text-sm font-display">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold block">
            Memory Title
          </label>
          <input
            type="text"
            placeholder="The afternoon we built a secret fort..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border-3 border-[#FFE4E8] rounded-3xl px-6 py-4 text-xl font-display font-bold text-[#332C35] placeholder-[#7A6E7D]/40 focus:outline-none focus:border-[#FF80AB] transition-colors shadow-xs"
          />
        </div>

        {/* Story Content */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold block">
            Write What Happened
          </label>
          <textarea
            rows={6}
            placeholder="Describe the moment, the laughter, the quiet thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white border-3 border-[#FFE4E8] rounded-3xl p-6 text-base text-[#4A3E4E] placeholder-[#7A6E7D]/40 focus:outline-none focus:border-[#FF80AB] transition-colors leading-relaxed font-sans shadow-xs"
          />
        </div>

        {/* Voice Recording Section */}
        <VoiceRecorder
          onAudioSaved={(url) => setAudioUrl(url)}
          existingAudioUrl={audioUrl}
          onRemoveAudio={() => setAudioUrl(undefined)}
        />

        {/* Photo Attachment Section */}
        <PhotoUploader
          onPhotosUpdated={(urls) => setMediaUrls(urls)}
          existingPhotoUrls={mediaUrls}
        />

        {/* Drawing Canvas Section */}
        <DrawingCanvas
          onDrawingSaved={(url) => setDrawingUrl(url)}
          existingDrawingUrl={drawingUrl}
          onRemoveDrawing={() => setDrawingUrl(undefined)}
        />

        {/* Emotion Picker */}
        <div className="p-6 rounded-3xl bg-white border-3 border-[#FFE4E8] space-y-6 shadow-scrapbook">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-display font-bold text-[#FF80AB]">
              <Heart className="w-5 h-5 fill-[#FF80AB]" />
              <span>How did this moment feel?</span>
            </div>
            <span
              className="text-xs px-3 py-1.5 rounded-full font-display font-bold"
              style={{
                backgroundColor: `${activeEmotionMeta.color}40`,
                color: '#332C35',
                border: `2px solid ${activeEmotionMeta.color}`,
              }}
            >
              {primaryEmotion} ({emotionIntensity}%)
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {ALL_EMOTION_NAMES.map((emo) => {
              const meta = EMOTIONS[emo];
              const isSelected = primaryEmotion === emo;
              return (
                <button
                  type="button"
                  key={emo}
                  onClick={() => setPrimaryEmotion(emo)}
                  className={`px-3 py-2.5 rounded-2xl text-xs font-display font-bold transition-all text-center border-2 ${
                    isSelected
                      ? 'bg-[#FFF0F3] text-[#332C35] scale-105 shadow-xs'
                      : 'bg-[#FDF8F5] text-[#7A6E7D] hover:bg-white'
                  }`}
                  style={{
                    borderColor: isSelected ? meta.color : '#FFE4E8',
                  }}
                >
                  {emo}
                </button>
              );
            })}
          </div>

          <p className="text-base font-handwriting text-[#7A6E7D]">
            "{activeEmotionMeta.description}"
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-display font-bold text-[#7A6E7D]">
              <span>Emotional Intensity</span>
              <span className="text-[#FF80AB]">{emotionIntensity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={emotionIntensity}
              onChange={(e) => setEmotionIntensity(Number(e.target.value))}
              className="w-full h-2 bg-[#FFE4E8] rounded-lg appearance-none cursor-pointer accent-[#FF80AB]"
            />
          </div>
        </div>

        {/* People & Places */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-[#FF80AB]" />
              <span>Who was with me?</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah, Mom, David"
              value={peopleInput}
              onChange={(e) => setPeopleInput(e.target.value)}
              className="w-full bg-white border-3 border-[#FFE4E8] rounded-2xl px-5 py-3.5 text-sm font-display text-[#332C35] placeholder-[#7A6E7D]/40 focus:outline-none focus:border-[#FF80AB]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#FF80AB]" />
              <span>Where I was</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Grandma's Garden, Seaside Pier"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full bg-white border-3 border-[#FFE4E8] rounded-2xl px-5 py-3.5 text-sm font-display text-[#332C35] placeholder-[#7A6E7D]/40 focus:outline-none focus:border-[#FF80AB]"
            />
          </div>
        </div>

        {/* Tags & Privacy */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border-3 border-[#FFE4E8] shadow-xs">
          <div className="flex-1 space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold flex items-center space-x-1.5">
              <Tag className="w-4 h-4 text-[#FF80AB]" />
              <span>Tags & keywords</span>
            </label>
            <input
              type="text"
              placeholder="e.g. summer, beach, stars"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-transparent text-sm font-display text-[#332C35] placeholder-[#7A6E7D]/40 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl border-2 text-xs font-display font-bold transition-all ${
              isPrivate
                ? 'bg-[#FFF0F3] border-[#FF80AB] text-[#FF80AB]'
                : 'bg-[#FDF8F5] border-[#FFE4E8] text-[#7A6E7D]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{isPrivate ? 'Private Memory' : 'Standard Memory'}</span>
          </button>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-3 px-10 py-4 rounded-full bg-gradient-to-r from-[#FF80AB] to-[#FFB6C1] text-white font-display font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isSaving ? 'Keeping this moment...' : 'Keep this moment ✨'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
