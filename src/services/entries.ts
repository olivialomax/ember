import { supabase } from './supabase';
import { Entry } from '../types';
import { localDateISOMinus } from '../shared/utils/date';

export async function getEntry(userId: string, date: string): Promise<Entry | null> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getRecentEntries(userId: string, days: number = 30): Promise<Entry[]> {
  const sinceStr = localDateISOMinus(days);

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', sinceStr)
    .order('date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function upsertEntry(
  userId: string,
  date: string,
  fields: Partial<Omit<Entry, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at'>>
): Promise<Entry> {
  const { data, error } = await supabase
    .from('entries')
    .upsert(
      { user_id: userId, date, ...fields, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
