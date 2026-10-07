import { create } from 'zustand';
import type { User } from '../types/index.js';
import { api, setStoredToken, getStoredToken } from '../services/api.js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isUnlocked: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setupPasscode: (passcode: string, confirmPasscode: string) => Promise<void>;
  unlockDiary: (pin: string) => Promise<boolean>;
  removePasscode: () => Promise<void>;
  lockDiary: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isUnlocked: true,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = getStoredToken();
      if (token) {
        const user = await api.getCurrentUser();
        if (user) {
          set({
            user,
            isAuthenticated: true,
            isUnlocked: !user.hasPasscode,
            isLoading: false,
          });
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    set({ user: null, isAuthenticated: false, isUnlocked: true, isLoading: false });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user } = await api.login({ email, password });
      set({
        user,
        isAuthenticated: true,
        isUnlocked: !user.hasPasscode,
        isLoading: false,
      });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  setupPasscode: async (passcode: string, confirmPasscode: string) => {
    await api.setupPasscode(passcode, confirmPasscode);
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, hasPasscode: true } });
    }
  },

  unlockDiary: async (pin: string) => {
    try {
      await api.verifyPasscode(pin);
      set({ isUnlocked: true });
      return true;
    } catch (e) {
      set({ isUnlocked: false });
      throw e;
    }
  },

  removePasscode: async () => {
    await api.removePasscode();
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, hasPasscode: false }, isUnlocked: true });
    }
  },

  logout: () => {
    setStoredToken(null);
    set({ user: null, isAuthenticated: false, isUnlocked: true });
  },

  lockDiary: () => {
    set({ isUnlocked: false });
  },
}));
