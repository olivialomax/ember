import { supabase } from './supabase';
import { GratitudeItem } from '../types';
import { localDateISOMinus } from '../shared/utils/date';

export async function getGratitudeItems(userId: string, date: string): Promise<GratitudeItem[]> {
  const { data, error } = await supabase
    .from('gratitude_items')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getRecentGratitudeItems(
  userId: string,
  days: number = 60
): Promise<GratitudeItem[]> {
  const sinceStr = localDateISOMinus(days);

  const { data, error } = await supabase
    .from('gratitude_items')
    .select('*')
    .eq('user_id', userId)
    .gte('date', sinceStr)
    .order('date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addGratitudeItem(
  userId: string,
  date: string,
  content: string
): Promise<GratitudeItem> {
  const { data, error } = await supabase
    .from('gratitude_items')
    .insert({ user_id: userId, date, content: content.trim() })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGratitudeItem(id: string): Promise<void> {
  const { error } = await supabase.from('gratitude_items').delete().eq('id', id);
  if (error) throw error;
}
