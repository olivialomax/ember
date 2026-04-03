import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../auth/useAuthStore';
import { useToday } from '../checkin/useToday';
import { getRecentEntries } from '../../services/entries';
import { Entry } from '../../types';

const todayStr = () => new Date().toISOString().split('T')[0];

export function useJournal() {
  const { user } = useAuthStore();
  const { entry, updateField, isSyncing } = useToday();

  // Local text state seeded from today's entry
  const [localText, setLocalText] = useState<string>(entry.journal_text ?? '');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleTextChange(text: string) {
    setLocalText(text);
    if (saveTimer.current != null) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateField('journal_text', text);
    }, 800);
  }

  const today = todayStr();

  const pastQuery = useQuery({
    queryKey: ['journal-history', user?.id],
    queryFn: () => getRecentEntries(user!.id, 60),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    select: (data: Entry[]) =>
      data.filter((e) => e.date !== today && e.journal_text != null && e.journal_text.trim() !== ''),
  });

  const wordCount = localText.trim() === '' ? 0 : localText.trim().split(/\s+/).length;

  return {
    localText,
    handleTextChange,
    wordCount,
    isSaving: isSyncing,
    pastEntries: pastQuery.data ?? [],
    isLoadingPast: pastQuery.isLoading,
  };
}
