import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../auth/useAuthStore';
import { getProfile, updateProfile } from '../../services/profile';
import { User } from '../../types';

export function useProfile() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000,
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (fields: Partial<Pick<User, 'drink_limit' | 'drink_limits_weekly' | 'display_name' | 'reminder_enabled' | 'reminder_time'>>) =>
      updateProfile(user!.id, fields),
    onSuccess: (updated) => {
      queryClient.setQueryData(['profile', user?.id], updated);
    },
  });

  return { profile: profile ?? null, isLoading, update, isUpdating };
}
