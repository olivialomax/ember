export interface User {
  id: string;
  email: string;
  display_name: string | null;
  drink_limit: number | null;
  drink_limits_weekly: Record<string, number> | null;
  reminder_enabled: boolean;
  reminder_time: string | null; // ISO time string e.g. "08:00"
  cycle_tracker_enabled: boolean;
  average_cycle_length: number; // default 28
  last_period_start: string | null; // ISO date e.g. "2026-04-01"
  created_at: string;
}

export interface Entry {
  id: string;
  user_id: string;
  date: string; // ISO date string e.g. "2026-04-03"
  mood: number | null; // 1–5
  energy: number | null; // 1–5
  stress: number | null; // 1–5
  movement: number | null; // minutes
  drinks: number | null; // count
  context_tags: string[] | null;
  journal_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface GratitudeItem {
  id: string;
  user_id: string;
  date: string; // ISO date string
  content: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;       // ISO date string e.g. "2026-04-10"
  body: string;
  created_at: string; // full ISO timestamp — used for time display
}

export interface StreakData {
  journal_streak: number;
  gratitude_streak: number;
  mindful_streak: number;
}

export interface WeeklyInsight {
  week_start: string; // ISO date string
  avg_mood: number | null;
  avg_energy: number | null;
  avg_stress: number | null;
  total_drinks: number | null;
  movement_days: number | null;
  mood_trend: 'up' | 'down' | 'flat' | null;
}

export type TrackerKey = 'mood' | 'energy' | 'stress' | 'movement' | 'drinks';

export interface LifeEvent {
  id: string;
  user_id: string;
  date: string; // ISO date string e.g. "2026-04-03"
  title: string;
  note: string | null;
  created_at: string;
}
