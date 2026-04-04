import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../auth/useAuthStore';
import { getRecentEntries } from '../../services/entries';
import { getRecentGratitudeItems } from '../../services/gratitude';
import { calculateStreaks, calculateGratitudeStreak } from '../../services/streaks';
import { StreakData } from '../../types';
import { localDateISO } from '../../shared/utils/date';

const todayStr = () => localDateISO();

const EMPTY: StreakData = {
  journal_streak: 0,
  gratitude_streak: 0,
  mindful_streak: 0,
};

export function useStreaks() {
  const { user } = useAuthStore();
  const today = todayStr();

  const entriesQuery = useQuery({
    queryKey: ['recent-entries', user?.id],
    queryFn: () => getRecentEntries(user!.id, 60),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    select: (entries) => calculateStreaks(entries, today),
  });

  const gratitudeQuery = useQuery({
    queryKey: ['gratitude-history', user?.id],
    queryFn: () => getRecentGratitudeItems(user!.id, 60),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    select: (items) => calculateGratitudeStreak(items, today),
  });

  const streaks: StreakData = {
    ...(entriesQuery.data ?? EMPTY),
    gratitude_streak: gratitudeQuery.data ?? 0,
  };

  return {
    streaks,
    isLoading: entriesQuery.isLoading || gratitudeQuery.isLoading,
  };
}
