import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../types';

const safeParseJSON = (data: string | undefined | null, fallback: any = []) => {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

const formatMemory = (mem: any) => ({
  ...mem,
  secondaryEmotions: safeParseJSON(mem.secondaryEmotions),
  people: safeParseJSON(mem.people),
  tags: safeParseJSON(mem.tags),
  mediaUrls: safeParseJSON(mem.mediaUrls),
});

export const getMemories = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized.' });

    const memories = await prisma.memory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(memories.map(formatMemory));
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error retrieving memories.' });
  }
};

export const getMemoryById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ message: 'Unauthorized.' });

    const memory = await prisma.memory.findFirst({
      where: { id, userId },
    });

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found.' });
    }

    res.json(formatMemory(memory));
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching memory.' });
  }
};

export const createMemory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized.' });

    const {
      title,
      content,
      primaryEmotion,
      emotionIntensity = 80,
      secondaryEmotions = [],
      people = [],
      place,
      tags = [],
      isPrivate = false,
      isLocked = false,
      unlockDate,
      mediaUrls = [],
      audioUrl,
      drawingUrl,
    } = req.body;

    if (!title || !content || !primaryEmotion) {
      return res.status(400).json({
        message: 'A memory requires a title, content, and a primary emotion.',
      });
    }

    const newMemory = await prisma.memory.create({
      data: {
        userId,
        title,
        content,
        primaryEmotion,
        emotionIntensity: Number(emotionIntensity),
        secondaryEmotions: JSON.stringify(secondaryEmotions),
        people: JSON.stringify(people),
        place: place || null,
        tags: JSON.stringify(tags),
        isPrivate: Boolean(isPrivate),
        isLocked: Boolean(isLocked),
        unlockDate: unlockDate ? new Date(unlockDate) : null,
        mediaUrls: JSON.stringify(mediaUrls),
        audioUrl: audioUrl || null,
        drawingUrl: drawingUrl || null,
      },
    });

    res.status(201).json(formatMemory(newMemory));
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating memory.' });
  }
};

export const deleteMemory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ message: 'Unauthorized.' });

    const existingMemory = await prisma.memory.findFirst({
      where: { id, userId },
    });

    if (!existingMemory) {
      return res.status(404).json({ message: 'Memory not found.' });
    }

    await prisma.memory.delete({
      where: { id },
    });

    res.json({ message: 'Memory erased safely.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting memory.' });
  }
};
