import { supabase } from './supabase';
import { JournalEntry } from '../types';
import { localDateISOMinus } from '../shared/utils/date';

export async function getJournalEntries(userId: string, date: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getRecentJournalEntries(
  userId: string,
  days: number = 60
): Promise<JournalEntry[]> {
  const sinceStr = localDateISOMinus(days);

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', sinceStr)
    .order('date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addJournalEntry(
  userId: string,
  date: string,
  body: string
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({ user_id: userId, date, body: body.trim() })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id);
  if (error) throw error;
}
