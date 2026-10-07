import type { EmotionMeta, EmotionType } from '../types/index.js';

export const EMOTIONS: Record<EmotionType, EmotionMeta> = {
  Nostalgic: {
    name: 'Nostalgic',
    color: '#FFDAC1',
    bgGradient: 'from-[#FFDAC1]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Looking back with a warm smile and gentle memories ✨',
  },
  Peaceful: {
    name: 'Peaceful',
    color: '#B5EAD7',
    bgGradient: 'from-[#B5EAD7]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'A quiet heart, soft breezes, and still waters inside 🍃',
  },
  Grateful: {
    name: 'Grateful',
    color: '#FFB7B2',
    bgGradient: 'from-[#FFB7B2]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Thankful for all the little treasures in my day 🎁',
  },
  Happy: {
    name: 'Happy',
    color: '#FFE082',
    bgGradient: 'from-[#FFE082]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Bouncy sunshine, laughter, and pure joy ☀️',
  },
  Loved: {
    name: 'Loved',
    color: '#FFB6C1',
    bgGradient: 'from-[#FFB6C1]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Held closely like a warm blanket and cozy hug 💖',
  },
  Calm: {
    name: 'Calm',
    color: '#C7E9C0',
    bgGradient: 'from-[#C7E9C0]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Resting gently in the soft present moment 🌸',
  },
  Hopeful: {
    name: 'Hopeful',
    color: '#A8E6CF',
    bgGradient: 'from-[#A8E6CF]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'A bright dawn waiting just around the corner 🌈',
  },
  Excited: {
    name: 'Excited',
    color: '#FF80AB',
    bgGradient: 'from-[#FF80AB]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Butterflies in my tummy and eagerness for tomorrow 🎉',
  },
  Proud: {
    name: 'Proud',
    color: '#E1BEE7',
    bgGradient: 'from-[#E1BEE7]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Honoring my hard work and celebrating my growth 🌟',
  },
  Sad: {
    name: 'Sad',
    color: '#C7CEEA',
    bgGradient: 'from-[#C7CEEA]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'A tender heart that needs a quiet blanket and rest 🌧️',
  },
  Lonely: {
    name: 'Lonely',
    color: '#D4C1EC',
    bgGradient: 'from-[#D4C1EC]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Wishing for a friend to share quiet thoughts with ☁️',
  },
  Angry: {
    name: 'Angry',
    color: '#FF9AA2',
    bgGradient: 'from-[#FF9AA2]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Sparks inside wanting boundaries and understanding ⚡',
  },
  Overwhelmed: {
    name: 'Overwhelmed',
    color: '#E2F0CB',
    bgGradient: 'from-[#E2F0CB]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Too many things at once; taking deep slow breaths 🍃',
  },
  Confused: {
    name: 'Confused',
    color: '#BCE7FD',
    bgGradient: 'from-[#BCE7FD]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Untangling messy thoughts into clear ideas 🧩',
  },
  Afraid: {
    name: 'Afraid',
    color: '#DDA0DD',
    bgGradient: 'from-[#DDA0DD]/30 via-[#FFF5F5] to-[#FDF8F5]',
    description: 'Uncertainty whispering, looking for safety 🧸',
  },
};

export const ALL_EMOTION_NAMES = Object.keys(EMOTIONS) as EmotionType[];
