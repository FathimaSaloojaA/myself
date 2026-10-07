import { create } from 'zustand';
import type { Memory, CreateMemoryPayload, EmotionType } from '../types/index.js';
import { api } from '../services/api.js';

interface MemoryState {
  memories: Memory[];
  selectedEmotionFilter: EmotionType | 'All';
  searchQuery: string;
  isLoading: boolean;
  activeMemoryModal: Memory | null;
  loadMemories: () => Promise<void>;
  addMemory: (payload: CreateMemoryPayload) => Promise<Memory>;
  deleteMemory: (id: string) => Promise<void>;
  setEmotionFilter: (emotion: EmotionType | 'All') => void;
  setSearchQuery: (query: string) => void;
  setActiveMemoryModal: (memory: Memory | null) => void;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memories: [],
  selectedEmotionFilter: 'All',
  searchQuery: '',
  isLoading: false,
  activeMemoryModal: null,

  loadMemories: async () => {
    set({ isLoading: true });
    try {
      const data = await api.fetchMemories();
      set({ memories: data, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  addMemory: async (payload) => {
    set({ isLoading: true });
    try {
      const created = await api.createMemory(payload);
      set((state) => ({
        memories: [created, ...state.memories],
        isLoading: false,
      }));
      return created;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  deleteMemory: async (id) => {
    try {
      await api.deleteMemory(id);
      set((state) => ({
        memories: state.memories.filter((m) => m.id !== id),
        activeMemoryModal: state.activeMemoryModal?.id === id ? null : state.activeMemoryModal,
      }));
    } catch (e) {
      console.error(e);
    }
  },

  setEmotionFilter: (emotion) => set({ selectedEmotionFilter: emotion }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveMemoryModal: (memory) => set({ activeMemoryModal: memory }),
}));
