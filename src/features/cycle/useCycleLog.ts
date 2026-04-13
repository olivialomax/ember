import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../auth/useAuthStore';
import { useCycleStore } from './useCycleStore';
import { getCycleLog, upsertCycleLog } from '../../services/cycle';
import { CycleLog, FlowLevel, CycleSymptom } from './types';
import { localDateISO } from '../../shared/utils/date';

const todayStr = () => localDateISO();

export interface SubmitCycleLogFields {
  flow: FlowLevel | null;
  symptoms: CycleSymptom[];
  notes: string;
}

export function useCycleLog() {
  const { user } = useAuthStore();
  const { pendingLog, setFlow, setSymptoms, setNotes, markSynced } = useCycleStore();
  const queryClient = useQueryClient();
  const today = todayStr();

  const query = useQuery({
    queryKey: ['cycle-log', user?.id, today],
    queryFn: () => getCycleLog(user!.id, today),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Merge: local draft wins if unsynced, remote wins once synced
  const log: Partial<CycleLog> = {
    ...(query.data ?? {}),
    ...(!pendingLog.synced && pendingLog.date === today
      ? {
          flow: pendingLog.flow ?? query.data?.flow ?? null,
          symptoms: pendingLog.symptoms.length > 0
            ? pendingLog.symptoms
            : (query.data?.symptoms ?? []),
          notes: pendingLog.notes || query.data?.notes || null,
        }
      : {}),
  };

  const mutation = useMutation({
    mutationFn: (fields: Partial<Omit<CycleLog, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at'>>) =>
      upsertCycleLog(user!.id, today, fields),
    onSuccess: (saved) => {
      queryClient.setQueryData(['cycle-log', user?.id, today], saved);
      markSynced();
    },
  });

  function submitLog(fields: SubmitCycleLogFields) {
    // Write to MMKV first (offline-safe)
    setFlow(fields.flow);
    setSymptoms(fields.symptoms);
    setNotes(fields.notes);
    // Then sync to Supabase
    if (user) {
      mutation.mutate({
        flow: fields.flow,
        symptoms: fields.symptoms,
        notes: fields.notes || null,
      });
    }
  }

  const hasLoggedToday =
    query.data != null ||
    (!pendingLog.synced && pendingLog.date === today && pendingLog.flow !== null);

  return {
    log,
    isLoading: query.isLoading,
    isSyncing: mutation.isPending,
    hasLoggedToday,
    submitLog,
  };
}
