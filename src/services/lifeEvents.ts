import { supabase } from './supabase';
import { LifeEvent } from '../types';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export async function getLifeEventsForMonth(
  userId: string,
  year: number,
  month: number
): Promise<LifeEvent[]> {
  const monthStart = `${year}-${pad(month)}-01`;
  // Last day of the month: day 0 of the next month
  const lastDay = new Date(year, month, 0).getDate();
  const monthEnd = `${year}-${pad(month)}-${pad(lastDay)}`;

  const { data, error } = await supabase
    .from('life_events')
    .select('*')
    .eq('user_id', userId)
    .gte('date', monthStart)
    .lte('date', monthEnd)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addLifeEvent(
  userId: string,
  date: string,
  title: string,
  note: string | null
): Promise<LifeEvent> {
  const { data, error } = await supabase
    .from('life_events')
    .insert({ user_id: userId, date, title: title.trim(), note: note?.trim() ?? null })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLifeEvent(id: string): Promise<void> {
  const { error } = await supabase.from('life_events').delete().eq('id', id);
  if (error) throw error;
}
