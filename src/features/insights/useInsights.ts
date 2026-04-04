import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../auth/useAuthStore';
import { getRecentEntries } from '../../services/entries';
import { Entry, TrackerKey } from '../../types';
import { colors } from '../../tokens';

export interface CorrelationInsight {
  id: string;
  title: string;
  body: string;
  accent: string;
  visible: boolean;
}

export interface InsightsData {
  weekAvg: Record<TrackerKey, number | null>;
  avg14: Record<TrackerKey, number | null>;
  series: Record<TrackerKey, (number | null)[]>; // 14 values, oldest first
  correlations: CorrelationInsight[];
  hasEnoughData: boolean;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/** Returns YYYY-MM-DD for a Date using local time. */
function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Returns array of date strings going back `days` days, oldest first. */
function dateRange(days: number): string[] {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(fmtDate(d));
  }
  return out;
}

// ─── computation ──────────────────────────────────────────────────────────────

const TRACKERS: TrackerKey[] = ['mood', 'energy', 'stress', 'movement', 'drinks'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function computeInsights(entries: Entry[]): InsightsData {
  const today = fmtDate(new Date());
  const byDate = new Map(entries.map((e) => [e.date, e]));

  const dates14 = dateRange(14);
  const dates7 = dates14.slice(-7);
  const cutoff30 = fmtDate((() => { const d = new Date(); d.setDate(d.getDate() - 30); return d; })());
  const recent30 = entries.filter((e) => e.date >= cutoff30);

  // 7-day averages
  const weekAvg = {} as Record<TrackerKey, number | null>;
  for (const key of TRACKERS) {
    const vals = dates7
      .map((d) => byDate.get(d)?.[key] ?? null)
      .filter((v): v is number => v !== null);
    weekAvg[key] = mean(vals);
  }

  // 14-day averages
  const avg14 = {} as Record<TrackerKey, number | null>;
  for (const key of TRACKERS) {
    const vals = dates14
      .map((d) => byDate.get(d)?.[key] ?? null)
      .filter((v): v is number => v !== null);
    avg14[key] = mean(vals);
  }

  // 14-day series (oldest first, for sparkline left → right)
  const series = {} as Record<TrackerKey, (number | null)[]>;
  for (const key of TRACKERS) {
    series[key] = dates14.map((d) => byDate.get(d)?.[key] ?? null);
  }

  // Enough data gate: ≥5 entries in the last 30 days with at least a mood or energy value
  const hasEnoughData =
    recent30.filter((e) => e.mood !== null || e.energy !== null).length >= 5;

  // ── Correlations ────────────────────────────────────────────────────────────

  const correlations: CorrelationInsight[] = [];

  // 1. Movement + Mood
  const withMov = recent30.filter((e) => (e.movement ?? 0) > 0 && e.mood !== null);
  const noMov = recent30.filter((e) => (e.movement ?? 0) === 0 && e.mood !== null);
  const movMoodAvg = mean(withMov.map((e) => e.mood!));
  const noMovMoodAvg = mean(noMov.map((e) => e.mood!));
  correlations.push({
    id: 'movement-mood',
    title: 'Movement & Mood',
    body:
      movMoodAvg !== null && noMovMoodAvg !== null
        ? `Days you move, your mood averages ${movMoodAvg}/5 — vs ${noMovMoodAvg}/5 on rest days.`
        : '',
    accent: colors.blueCalm,
    visible: withMov.length >= 3 && noMov.length >= 3,
  });

  // 2. Stress + Drinks
  const hiStress = recent30.filter((e) => (e.stress ?? 0) >= 4 && e.drinks !== null);
  const loStress = recent30.filter((e) => (e.stress ?? 6) <= 2 && e.drinks !== null);
  const hiDrinks = mean(hiStress.map((e) => e.drinks!));
  const loDrinks = mean(loStress.map((e) => e.drinks!));
  correlations.push({
    id: 'stress-drinks',
    title: 'Stress & Drinks',
    body:
      hiDrinks !== null && loDrinks !== null
        ? `On high-stress days you average ${hiDrinks} drinks — vs ${loDrinks} on calmer days.`
        : '',
    accent: colors.stressRed,
    visible: hiStress.length >= 3 && loStress.length >= 3,
  });

  // 3. Week over week mood
  const todayDate = new Date();
  const daysFromMon = (todayDate.getDay() + 6) % 7;
  const thisMonday = new Date(todayDate);
  thisMonday.setDate(todayDate.getDate() - daysFromMon);
  const thisMondayStr = fmtDate(thisMonday);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  const lastMondayStr = fmtDate(lastMonday);

  const thisWeek = entries.filter((e) => e.date >= thisMondayStr && e.date <= today && e.mood !== null);
  const lastWeek = entries.filter((e) => e.date >= lastMondayStr && e.date < thisMondayStr && e.mood !== null);
  const thisWeekMood = mean(thisWeek.map((e) => e.mood!));
  const lastWeekMood = mean(lastWeek.map((e) => e.mood!));

  let wowBody = '';
  if (thisWeekMood !== null && lastWeekMood !== null && lastWeekMood > 0) {
    const pct = Math.abs(Math.round(((thisWeekMood - lastWeekMood) / lastWeekMood) * 100));
    const dir = thisWeekMood >= lastWeekMood ? 'up' : 'down';
    wowBody = `Your mood this week is trending ${dir} ${pct}% from last week.`;
  }
  correlations.push({
    id: 'wow-mood',
    title: 'Week on Week',
    body: wowBody,
    accent: colors.sage,
    visible: thisWeek.length >= 2 && lastWeek.length >= 2,
  });

  // 4. Best day of week
  const moodByDay: number[][] = [[], [], [], [], [], [], []];
  for (const e of recent30) {
    if (e.mood == null) continue;
    // Use noon local time to avoid DST edge cases when parsing date-only strings
    const d = new Date(`${e.date}T12:00:00`);
    moodByDay[d.getDay()].push(e.mood);
  }

  let bestDay = -1;
  let bestAvg = -1;
  for (let i = 0; i < 7; i++) {
    if (moodByDay[i].length >= 2) {
      const a = mean(moodByDay[i])!;
      if (a > bestAvg) { bestAvg = a; bestDay = i; }
    }
  }

  correlations.push({
    id: 'best-day',
    title: 'Your Best Days',
    body: bestDay >= 0 ? `Your ${DAYS[bestDay]}s tend to be your brightest days.` : '',
    accent: colors.energyGold,
    visible: bestDay >= 0,
  });

  return { weekAvg, avg14, series, correlations, hasEnoughData };
}

// ─── defaults ─────────────────────────────────────────────────────────────────

const defaultWeekAvg: Record<TrackerKey, number | null> = {
  mood: null, energy: null, stress: null, movement: null, drinks: null,
};
const defaultAvg14: Record<TrackerKey, number | null> = {
  mood: null, energy: null, stress: null, movement: null, drinks: null,
};
const defaultSeries: Record<TrackerKey, (number | null)[]> = {
  mood: [], energy: [], stress: [], movement: [], drinks: [],
};

// ─── hook ────────────────────────────────────────────────────────────────────

export function useInsights() {
  const { user } = useAuthStore();

  const { data: entries, isLoading } = useQuery({
    queryKey: ['recent-entries', user?.id],
    queryFn: () => getRecentEntries(user!.id, 60),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const result = useMemo<InsightsData>(
    () => (entries ? computeInsights(entries) : { weekAvg: defaultWeekAvg, avg14: defaultAvg14, series: defaultSeries, correlations: [], hasEnoughData: false }),
    [entries]
  );

  return { ...result, isLoading };
}
