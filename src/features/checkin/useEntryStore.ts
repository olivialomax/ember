import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { TrackerKey } from '../../types';
import { localDateISO } from '../../shared/utils/date';

const mmkv = createMMKV({ id: 'entry-store' });

const mmkvStorage = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkv.set(name, value),
  removeItem: (name: string) => mmkv.remove(name),
};

export type EntryDraft = Partial<Record<TrackerKey, number>> & {
  journal_text?: string;
  context_tags?: string[] | null;
  date: string;
  synced: boolean;
};

interface EntryStoreState {
  draft: EntryDraft;
  setField: (field: TrackerKey | 'journal_text', value: number | string) => void;
  setTags: (tags: string[] | null) => void;
  resetDraft: (date: string) => void;
  markSynced: () => void;
}

const today = () => localDateISO();

export const useEntryStore = create<EntryStoreState>()(
  persist(
    (set) => ({
      draft: {
        date: today(),
        synced: false,
      },
      setField: (field, value) =>
        set((state) => ({
          draft: { ...state.draft, [field]: value, synced: false },
        })),
      setTags: (tags) =>
        set((state) => ({
          draft: { ...state.draft, context_tags: tags, synced: false },
        })),
      resetDraft: (date) =>
        set({
          draft: { date, synced: false },
        }),
      markSynced: () =>
        set((state) => ({
          draft: { ...state.draft, synced: true },
        })),
    }),
    {
      name: 'entry-draft',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
