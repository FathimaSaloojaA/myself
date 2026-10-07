export interface User {
  id: string;
  email: string;
  name: string;
  hasPasscode: boolean;
  createdAt?: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  passcode?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export type EmotionType =
  | 'Happy'
  | 'Sad'
  | 'Peaceful'
  | 'Angry'
  | 'Excited'
  | 'Grateful'
  | 'Loved'
  | 'Lonely'
  | 'Confused'
  | 'Nostalgic'
  | 'Hopeful'
  | 'Afraid'
  | 'Proud'
  | 'Calm'
  | 'Overwhelmed';

export interface EmotionMeta {
  name: EmotionType;
  color: string;
  bgGradient: string;
  description: string;
}

export interface Memory {
  id: string;
  userId?: string;
  title: string;
  content: string;
  primaryEmotion: EmotionType;
  emotionIntensity: number;
  secondaryEmotions: string[];
  people: string[];
  place?: string;
  tags: string[];
  isPrivate: boolean;
  isLocked: boolean;
  unlockDate?: string;
  mediaUrls: string[];
  audioUrl?: string;
  drawingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemoryPayload {
  title: string;
  content: string;
  primaryEmotion: EmotionType;
  emotionIntensity: number;
  secondaryEmotions?: string[];
  people?: string[];
  place?: string;
  tags?: string[];
  isPrivate?: boolean;
  isLocked?: boolean;
  unlockDate?: string;
  mediaUrls?: string[];
  audioUrl?: string;
  drawingUrl?: string;
}
