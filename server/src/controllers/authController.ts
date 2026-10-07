import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'myself_secret_key_emotion_manuscript_2026';
const DIARY_LOGIN_ID = process.env.DIARY_LOGIN_ID || 'owner@myself.private';
const DIARY_PASSWORD = process.env.DIARY_PASSWORD || 'SecretDiaryPassword2026!';

// Automatically seed or ensure the predefined owner account exists on server start
export const ensurePredefinedOwnerAccount = async () => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: DIARY_LOGIN_ID },
    });

    if (!existingUser) {
      const passwordHash = await bcrypt.hash(DIARY_PASSWORD, 10);
      await prisma.user.create({
        data: {
          email: DIARY_LOGIN_ID,
          name: 'Myself Author',
          passwordHash,
          passcodeHash: null,
        },
      });
      console.log(`🔒 Predefined diary owner account ready (${DIARY_LOGIN_ID})`);
    } else {
      // Synchronize password hash if env variable password changed
      const matches = await bcrypt.compare(DIARY_PASSWORD, existingUser.passwordHash);
      if (!matches) {
        const newHash = await bcrypt.hash(DIARY_PASSWORD, 10);
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { passwordHash: newHash },
        });
        console.log(`🔒 Predefined diary owner credentials updated.`);
      }
    }
  } catch (error) {
    console.error('Error ensuring predefined owner account:', error);
  }
};

// Login with predefined credentials (No public registration allowed)
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Login ID and password are required.' });
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Login ID or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Login ID or password.' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPasscode: Boolean(user.passcodeHash),
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during authentication.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Authentication required.' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, passcodeHash: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ message: 'User profile not found.' });

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      hasPasscode: Boolean(user.passcodeHash),
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching profile.' });
  }
};

export const setupPasscode = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { passcode, confirmPasscode } = req.body;

    if (!userId) return res.status(401).json({ message: 'Authentication required.' });

    if (!passcode || !/^\d{4}$/.test(passcode)) {
      return res.status(400).json({ message: 'PIN passcode must be exactly 4 digits.' });
    }

    if (passcode !== confirmPasscode) {
      return res.status(400).json({ message: 'PIN passcodes do not match.' });
    }

    const passcodeHash = await bcrypt.hash(passcode, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passcodeHash },
    });

    res.json({ message: 'Diary PIN passcode set successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error setting passcode PIN.' });
  }
};

export const verifyPasscode = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { passcode } = req.body;

    if (!userId) return res.status(401).json({ message: 'Authentication required.' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passcodeHash) {
      return res.status(400).json({ message: 'No passcode PIN configured for this diary.' });
    }

    const isMatch = await bcrypt.compare(passcode, user.passcodeHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect PIN passcode. Please try again.' });
    }

    res.json({ success: true, message: 'Diary unlocked.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error verifying passcode PIN.' });
  }
};

export const removePasscode = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Authentication required.' });

    await prisma.user.update({
      where: { id: userId },
      data: { passcodeHash: null },
    });

    res.json({ message: 'Diary PIN passcode removed.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error removing passcode PIN.' });
  }
};
