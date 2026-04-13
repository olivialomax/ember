import { supabase } from './supabase';
import { CycleLog } from '../features/cycle/types';
import { localDateISOMinus } from '../shared/utils/date';

export async function getCycleLog(userId: string, date: string): Promise<CycleLog | null> {
  const { data, error } = await supabase
    .from('cycle_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getRecentCycleLogs(userId: string, days: number = 90): Promise<CycleLog[]> {
  const sinceStr = localDateISOMinus(days);
  const { data, error } = await supabase
    .from('cycle_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', sinceStr)
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertCycleLog(
  userId: string,
  date: string,
  fields: Partial<Omit<CycleLog, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at'>>
): Promise<CycleLog> {
  const { data, error } = await supabase
    .from('cycle_logs')
    .upsert(
      { user_id: userId, date, ...fields, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
