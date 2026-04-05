import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const mmkv = createMMKV({ id: 'profile-store' });

const mmkvStorage = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkv.set(name, value),
  removeItem: (name: string) => mmkv.remove(name),
};

interface ProfileState {
  avatar: string;
  setAvatar: (avatar: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      avatar: '🌿',
      setAvatar: (avatar) => set({ avatar }),
    }),
    {
      name: 'profile',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
