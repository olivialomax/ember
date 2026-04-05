import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const mmkv = createMMKV({ id: 'notification-store' });

const mmkvStorage = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkv.set(name, value),
  removeItem: (name: string) => mmkv.remove(name),
};

interface NotificationState {
  enabled: boolean;
  hour: number;
  minute: number;
  setEnabled: (val: boolean) => void;
  setTime: (hour: number, minute: number) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      enabled: false,
      hour: 20,   // 8pm default
      minute: 0,
      setEnabled: (val) => set({ enabled: val }),
      setTime: (hour, minute) => set({ hour, minute }),
    }),
    {
      name: 'notifications',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
