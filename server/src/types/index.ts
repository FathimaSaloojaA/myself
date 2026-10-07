import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
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

export interface CreateMemoryDTO {
  title: string;
  content: string;
  primaryEmotion: string;
  emotionIntensity?: number;
  secondaryEmotions?: string[];
  people?: string[];
  place?: string;
  tags?: string[];
  isPrivate?: boolean;
  isLocked?: boolean;
  unlockDate?: string;
}
