import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { FlowLevel, CycleSymptom } from './types';
import { localDateISO } from '../../shared/utils/date';

const mmkv = createMMKV({ id: 'cycle-store' });

const mmkvStorage = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkv.set(name, value),
  removeItem: (name: string) => mmkv.remove(name),
};

interface CyclePendingLog {
  date: string;
  flow: FlowLevel | null;
  symptoms: CycleSymptom[];
  notes: string;
  synced: boolean;
}

interface CycleStoreState {
  pendingLog: CyclePendingLog;
  setFlow: (flow: FlowLevel | null) => void;
  setSymptoms: (symptoms: CycleSymptom[]) => void;
  setNotes: (notes: string) => void;
  resetLog: (date: string) => void;
  markSynced: () => void;
}

const today = () => localDateISO();

export const useCycleStore = create<CycleStoreState>()(
  persist(
    (set) => ({
      pendingLog: {
        date: today(),
        flow: null,
        symptoms: [],
        notes: '',
        synced: false,
      },
      setFlow: (flow) =>
        set((state) => ({
          pendingLog: { ...state.pendingLog, flow, synced: false },
        })),
      setSymptoms: (symptoms) =>
        set((state) => ({
          pendingLog: { ...state.pendingLog, symptoms, synced: false },
        })),
      setNotes: (notes) =>
        set((state) => ({
          pendingLog: { ...state.pendingLog, notes, synced: false },
        })),
      resetLog: (date) =>
        set({
          pendingLog: { date, flow: null, symptoms: [], notes: '', synced: false },
        }),
      markSynced: () =>
        set((state) => ({
          pendingLog: { ...state.pendingLog, synced: true },
        })),
    }),
    {
      name: 'cycle-log',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
