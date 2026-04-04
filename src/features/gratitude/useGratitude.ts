import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../auth/useAuthStore';
import {
  getGratitudeItems,
  addGratitudeItem,
  deleteGratitudeItem,
} from '../../services/gratitude';
import { localDateISO } from '../../shared/utils/date';

const todayStr = () => localDateISO();

const MAX_ITEMS = 5;
const MIN_FOR_STREAK = 3;

export function useGratitude() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const today = todayStr();

  const queryKey = ['gratitude', user?.id, today];

  const query = useQuery({
    queryKey,
    queryFn: () => getGratitudeItems(user!.id, today),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  const items = query.data ?? [];

  const addMutation = useMutation({
    mutationFn: (content: string) => addGratitudeItem(user!.id, today, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['gratitude-history', user?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGratitudeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['gratitude-history', user?.id] });
    },
  });

  return {
    items,
    isLoading: query.isLoading,
    addItem: (content: string) => addMutation.mutate(content),
    deleteItem: (id: string) => deleteMutation.mutate(id),
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
    meetsMinimum: items.length >= MIN_FOR_STREAK,
    canAddMore: items.length < MAX_ITEMS,
    minForStreak: MIN_FOR_STREAK,
  };
}
