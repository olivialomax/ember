import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../auth/useAuthStore';
import {
  getJournalEntries,
  getRecentJournalEntries,
  addJournalEntry,
  deleteJournalEntry,
} from '../../services/journal';
import { JournalEntry } from '../../types';
import { localDateISO } from '../../shared/utils/date';

const todayStr = () => localDateISO();

export function useJournal() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const today = todayStr();

  const [draftText, setDraftText] = useState('');

  const todayQuery = useQuery({
    queryKey: ['journal-today', user?.id, today],
    queryFn: () => getJournalEntries(user!.id, today),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  const historyQuery = useQuery({
    queryKey: ['journal-history', user?.id],
    queryFn: () => getRecentJournalEntries(user!.id, 60),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    select: (data: JournalEntry[]) => {
      const grouped: Record<string, JournalEntry[]> = {};
      for (const entry of data) {
        if (entry.date === today) continue;
        if (!grouped[entry.date]) grouped[entry.date] = [];
        grouped[entry.date].push(entry);
      }
      return grouped;
    },
  });

  const addMutation = useMutation({
    mutationFn: (body: string) => addJournalEntry(user!.id, today, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-today', user?.id, today] });
      queryClient.invalidateQueries({ queryKey: ['journal-history', user?.id] });
      setDraftText('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-today', user?.id, today] });
      queryClient.invalidateQueries({ queryKey: ['journal-history', user?.id] });
    },
  });

  function handleAdd() {
    const trimmed = draftText.trim();
    if (!trimmed) return;
    addMutation.mutate(trimmed);
  }

  const wordCount = draftText.trim() === '' ? 0 : draftText.trim().split(/\s+/).length;

  return {
    draftText,
    setDraftText,
    wordCount,
    handleAdd,
    isAdding: addMutation.isPending,
    todayEntries: todayQuery.data ?? [],
    isLoadingToday: todayQuery.isLoading,
    groupedHistory: historyQuery.data ?? {},
    isLoadingHistory: historyQuery.isLoading,
    deleteEntry: (id: string) => deleteMutation.mutate(id),
  };
}
