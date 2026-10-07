import type { CreateMemoryPayload, LoginDTO, Memory, User } from '../types/index.js';

const API_BASE = 'http://localhost:5000/api';
const LOCAL_STORAGE_KEY = 'myself_local_memories_v1';
const LOCAL_USER_KEY = 'myself_local_user_v1';

export const getStoredToken = (): string | null => {
  return localStorage.getItem('myself_auth_token');
};

export const setStoredToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('myself_auth_token', token);
  } else {
    localStorage.removeItem('myself_auth_token');
  }
};

export const api = {
  // File Upload API (Audio, Photos, Drawings)
  async uploadFile(file: File | Blob, filename?: string): Promise<string> {
    const token = getStoredToken();
    const formData = new FormData();
    const name = filename || (file instanceof File ? file.name : `recording-${Date.now()}.webm`);
    formData.append('file', file, name);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return data.url;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'File upload failed.');
      }
    } catch (e: any) {
      console.warn('Backend upload failed, converting file to DataURL preview.');
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file locally.'));
        reader.readAsDataURL(file);
      });
    }
  },

  // Authentication & Predefined Login
  async login(data: LoginDTO): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setStoredToken(result.token);
        return result;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Invalid credentials.');
      }
    } catch (e: any) {
      if (e.message && !e.message.includes('fetch')) throw e;
    }

    // Local fallback if server offline
    const savedUser = localStorage.getItem(LOCAL_USER_KEY);
    const user: User = savedUser
      ? JSON.parse(savedUser)
      : {
          id: 'usr_default',
          email: data.email,
          name: 'Myself Author',
          hasPasscode: false,
        };
    const token = 'mock_token_' + Date.now();
    setStoredToken(token);
    return { user, token };
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getStoredToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // ignore
    }

    const savedUser = localStorage.getItem(LOCAL_USER_KEY);
    if (savedUser) return JSON.parse(savedUser);
    return {
      id: 'usr_me',
      email: 'owner@myself.private',
      name: 'Myself Author',
      hasPasscode: false,
    };
  },

  // PIN Passcode Endpoints
  async setupPasscode(passcode: string, confirmPasscode: string): Promise<boolean> {
    const token = getStoredToken();
    if (!token) throw new Error('Authentication required.');

    const res = await fetch(`${API_BASE}/auth/passcode/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ passcode, confirmPasscode }),
    });

    if (res.ok) {
      return true;
    } else {
      const err = await res.json();
      throw new Error(err.message || 'Failed to setup PIN passcode.');
    }
  },

  async verifyPasscode(passcode: string): Promise<boolean> {
    const token = getStoredToken();
    if (!token) throw new Error('Authentication required.');

    const res = await fetch(`${API_BASE}/auth/passcode/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ passcode }),
    });

    if (res.ok) {
      return true;
    } else {
      const err = await res.json();
      throw new Error(err.message || 'Incorrect PIN passcode.');
    }
  },

  async removePasscode(): Promise<boolean> {
    const token = getStoredToken();
    if (!token) return true;

    const res = await fetch(`${API_BASE}/auth/passcode`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  },

  // Memory CRUD
  async fetchMemories(): Promise<Memory[]> {
    const token = getStoredToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/memories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        // Fallback
      }
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  },

  async createMemory(payload: CreateMemoryPayload): Promise<Memory> {
    const token = getStoredToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/memories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          return await res.json();
        } else {
          const err = await res.json();
          throw new Error(err.message || 'Failed to save memory to database.');
        }
      } catch (e: any) {
        if (e.message && !e.message.includes('fetch')) throw e;
      }
    }

    const newMem: Memory = {
      id: 'mem_' + Date.now(),
      title: payload.title,
      content: payload.content,
      primaryEmotion: payload.primaryEmotion,
      emotionIntensity: payload.emotionIntensity,
      secondaryEmotions: payload.secondaryEmotions || [],
      people: payload.people || [],
      place: payload.place,
      tags: payload.tags || [],
      isPrivate: Boolean(payload.isPrivate),
      isLocked: Boolean(payload.isLocked),
      unlockDate: payload.unlockDate,
      mediaUrls: payload.mediaUrls || [],
      audioUrl: payload.audioUrl,
      drawingUrl: payload.drawingUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = await this.fetchMemories();
    const updated = [newMem, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newMem;
  },

  async deleteMemory(id: string): Promise<boolean> {
    const token = getStoredToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/memories/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        // Fallback
      }
    }

    const existing = await this.fetchMemories();
    const filtered = existing.filter((m) => m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};
