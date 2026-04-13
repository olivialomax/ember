export type FlowLevel = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';

export type CycleSymptom =
  | 'cramps'
  | 'bloating'
  | 'fatigue'
  | 'headache'
  | 'mood changes'
  | 'tender';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'unknown';

export interface CycleLog {
  id: string;
  user_id: string;
  date: string; // ISO date e.g. "2026-04-01"
  flow: FlowLevel | null;
  symptoms: CycleSymptom[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CyclePhaseInfo {
  phase: CyclePhase;
  label: string;
  dayOfCycle: number;
  daysUntilNext: number;
  accent: string;
}
