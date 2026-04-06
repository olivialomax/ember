import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../auth/useAuthStore';
import { useEntryStore } from './useEntryStore';
import { getEntry, upsertEntry } from '../../services/entries';
import { Entry, TrackerKey } from '../../types';
import { localDateISO } from '../../shared/utils/date';

const todayStr = () => localDateISO();

export function useToday() {
  const { user } = useAuthStore();
  const { draft, setField, setTags, markSynced } = useEntryStore();
  const queryClient = useQueryClient();
  const today = todayStr();

  const query = useQuery({
    queryKey: ['entry', user?.id, today],
    queryFn: () => getEntry(user!.id, today),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Merge: remote data wins for synced fields; local draft fills the rest
  const entry: Partial<Entry> = {
    ...(query.data ?? {}),
    // Only overlay draft fields that haven't been synced to remote yet
    ...(!draft.synced && draft.date === today
      ? {
          mood: draft.mood ?? query.data?.mood ?? null,
          energy: draft.energy ?? query.data?.energy ?? null,
          stress: draft.stress ?? query.data?.stress ?? null,
          movement: draft.movement ?? query.data?.movement ?? null,
          drinks: draft.drinks ?? query.data?.drinks ?? null,
          context_tags: draft.context_tags ?? query.data?.context_tags ?? null,
          journal_text: draft.journal_text ?? query.data?.journal_text ?? null,
        }
      : {}),
  };

  const mutation = useMutation({
    mutationFn: (payload: {
      fields: Partial<Omit<Entry, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at'>>;
      markSyncedOnSuccess: boolean;
    }) => upsertEntry(user!.id, today, payload.fields),
    onSuccess: (saved, variables) => {
      queryClient.setQueryData(['entry', user?.id, today], saved);
      queryClient.invalidateQueries({ queryKey: ['recent-entries', user?.id] });
      if (variables.markSyncedOnSuccess) markSynced();
    },
  });

  function updateField(field: TrackerKey | 'journal_text', value: number | string) {
    // Write locally first (offline-first)
    setField(field, value);
    // Then attempt to sync — do NOT mark draft as synced; only submitAll does that
    if (user) {
      mutation.mutate({ fields: { [field]: value }, markSyncedOnSuccess: false });
    }
  }

  function submitAll(
    fields: Partial<Omit<Entry, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at'>>
  ) {
    // Write each field to MMKV first (synchronous, offline-safe)
    (Object.keys(fields) as Array<keyof typeof fields>).forEach((key) => {
      const val = fields[key];
      if (val == null) return;
      if (key === 'context_tags') {
        setTags(val as string[] | null);
      } else {
        setField(key as TrackerKey, val as number);
      }
    });
    // Single upsert with all fields — mark draft as synced once confirmed
    if (user) {
      mutation.mutate({ fields, markSyncedOnSuccess: true });
    }
  }

  const hasAnyValue =
    entry.mood != null ||
    entry.energy != null ||
    entry.stress != null ||
    entry.movement != null ||
    entry.drinks != null;

  return {
    entry,
    isLoading: query.isLoading,
    isSyncing: mutation.isPending,
    hasAnyValue,
    updateField,
    submitAll,
  };
}
