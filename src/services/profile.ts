import { supabase } from './supabase';
import { User } from '../types';

export async function getProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  fields: Partial<Pick<User, 'drink_limit' | 'drink_limits_weekly' | 'display_name' | 'reminder_enabled' | 'reminder_time'>>
): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
