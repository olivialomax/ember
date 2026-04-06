import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../auth/useAuthStore';
import { getRecentEntries } from '../../services/entries';
import { getRecentGratitudeItems } from '../../services/gratitude';
import { Entry, GratitudeItem, TrackerKey } from '../../types';
import { colors } from '../../tokens';

export interface CorrelationInsight {
  id: string;
  title: string;
  body: string;
  accent: string;
  visible: boolean;
  comparison?: {
    valueA: string;
    labelA: string;
    valueB: string;
    labelB: string;
  };
}

export interface InsightsData {
  weekAvg: Record<TrackerKey, number | null>;
  avg14: Record<TrackerKey, number | null>;
  series: Record<TrackerKey, (number | null)[]>; // 14 values, oldest first
  correlations: CorrelationInsight[];
  hasEnoughData: boolean;
  daysLogged: number;
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

function computeInsights(entries: Entry[], gratitudeItems: GratitudeItem[]): InsightsData {
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

  // Data gate: ≥5 entries in the last 30 days with at least a mood or energy value
  const daysLogged = recent30.filter((e) => e.mood !== null || e.energy !== null).length;
  const hasEnoughData = daysLogged >= 5;

  // ── Correlations ────────────────────────────────────────────────────────────

  const correlations: CorrelationInsight[] = [];

  // Overall mood average across recent30 (used by Best Day comparison)
  const overallMoodVals = recent30.filter((e) => e.mood !== null).map((e) => e.mood!);
  const overallMoodAvg = mean(overallMoodVals) ?? 0;

  // 1. Movement & Mood
  const withMov = recent30.filter((e) => (e.movement ?? 0) > 0 && e.mood !== null);
  const noMov = recent30.filter((e) => (e.movement ?? 0) === 0 && e.mood !== null);
  const movMoodAvg = mean(withMov.map((e) => e.mood!));
  const noMovMoodAvg = mean(noMov.map((e) => e.mood!));
  let movMoodBody = '';
  if (movMoodAvg !== null && noMovMoodAvg !== null) {
    const diff = movMoodAvg - noMovMoodAvg;
    if (diff > 0.5) movMoodBody = 'Moving makes a real difference for you. Your mood is meaningfully higher on active days.';
    else if (diff > 0.1) movMoodBody = 'You tend to feel a little better on days you move.';
    else if (diff >= -0.1) movMoodBody = 'Your mood stays fairly consistent whether you move or not.';
    else movMoodBody = 'Interestingly, your mood runs a little lower on active days — rest might suit you.';
  }
  correlations.push({
    id: 'movement-mood',
    title: 'Movement & Mood',
    body: movMoodBody,
    accent: colors.blueCalm,
    visible: withMov.length >= 3 && noMov.length >= 3,
    comparison: movMoodAvg !== null && noMovMoodAvg !== null
      ? { valueA: movMoodAvg.toFixed(1), labelA: 'active days', valueB: noMovMoodAvg.toFixed(1), labelB: 'rest days' }
      : undefined,
  });

  // 2. Stress & Drinks
  const hiStress = recent30.filter((e) => (e.stress ?? 0) >= 4 && e.drinks !== null);
  const loStress = recent30.filter((e) => (e.stress ?? 6) <= 2 && e.drinks !== null);
  const hiDrinks = mean(hiStress.map((e) => e.drinks!));
  const loDrinks = mean(loStress.map((e) => e.drinks!));
  let stressDrinksBody = '';
  if (hiDrinks !== null && loDrinks !== null) {
    const diff = hiDrinks - loDrinks;
    if (diff > 0.8) stressDrinksBody = 'High-stress days seem to come with noticeably more drinks. Worth keeping an eye on.';
    else if (diff > 0.3) stressDrinksBody = 'You tend to reach for a little more on stressful days.';
    else stressDrinksBody = 'Your drinking stays pretty steady regardless of stress levels.';
  }
  correlations.push({
    id: 'stress-drinks',
    title: 'Stress & Drinks',
    body: stressDrinksBody,
    accent: colors.stressRed,
    visible: hiStress.length >= 3 && loStress.length >= 3,
    comparison: hiDrinks !== null && loDrinks !== null
      ? { valueA: hiDrinks.toFixed(1), labelA: 'high-stress', valueB: loDrinks.toFixed(1), labelB: 'calm days' }
      : undefined,
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
  if (thisWeekMood !== null && lastWeekMood !== null) {
    if (thisWeekMood >= lastWeekMood + 0.1) wowBody = 'Your mood is on an upswing this week — keep it going.';
    else if (thisWeekMood <= lastWeekMood - 0.1) wowBody = 'Your mood has dipped slightly this week. That\'s okay — patterns shift.';
    else wowBody = 'Your mood has held steady week on week.';
  }
  correlations.push({
    id: 'wow-mood',
    title: 'Week on Week',
    body: wowBody,
    accent: colors.sage,
    visible: thisWeek.length >= 2 && lastWeek.length >= 2,
    comparison: thisWeekMood !== null && lastWeekMood !== null
      ? { valueA: thisWeekMood.toFixed(1), labelA: 'this week', valueB: lastWeekMood.toFixed(1), labelB: 'last week' }
      : undefined,
  });

  // 4. Best day of week (mood)
  const moodByDay: number[][] = [[], [], [], [], [], [], []];
  for (const e of recent30) {
    if (e.mood == null) continue;
    const d = new Date(`${e.date}T12:00:00`);
    moodByDay[d.getDay()].push(e.mood);
  }

  let bestDay = -1;
  let bestDayAvg = -1;
  for (let i = 0; i < 7; i++) {
    if (moodByDay[i].length >= 2) {
      const a = mean(moodByDay[i])!;
      if (a > bestDayAvg) { bestDayAvg = a; bestDay = i; }
    }
  }

  correlations.push({
    id: 'best-day',
    title: 'Your Best Days',
    body: bestDay >= 0 ? `Your ${DAYS[bestDay]}s tend to be your brightest days.` : '',
    accent: colors.energyGold,
    visible: bestDay >= 0,
    comparison: bestDay >= 0
      ? { valueA: bestDayAvg.toFixed(1), labelA: DAYS[bestDay] + 's', valueB: overallMoodAvg.toFixed(1), labelB: 'your average' }
      : undefined,
  });

  // 5. Gratitude & Mood
  const gratCountByDate = new Map<string, number>();
  for (const g of gratitudeItems) {
    gratCountByDate.set(g.date, (gratCountByDate.get(g.date) ?? 0) + 1);
  }
  const withGrat = recent30.filter((e) => (gratCountByDate.get(e.date) ?? 0) >= 3 && e.mood !== null);
  const noGrat = recent30.filter((e) => (gratCountByDate.get(e.date) ?? 0) < 3 && e.mood !== null);
  const gratMoodAvg = mean(withGrat.map((e) => e.mood!));
  const noGratMoodAvg = mean(noGrat.map((e) => e.mood!));
  let gratBody = '';
  if (gratMoodAvg !== null && noGratMoodAvg !== null) {
    const diff = gratMoodAvg - noGratMoodAvg;
    if (diff > 0.3) gratBody = 'Gratitude practice seems to lift your mood. Your scores are higher on days you reflect.';
    else if (diff > 0) gratBody = 'There\'s a slight mood lift on your gratitude days.';
    else gratBody = 'Your mood stays consistent regardless of gratitude practice — still a good habit.';
  }
  correlations.push({
    id: 'gratitude-mood',
    title: 'Gratitude & Mood',
    body: gratBody,
    accent: colors.sage,
    visible: withGrat.length >= 3 && noGrat.length >= 3,
    comparison: gratMoodAvg !== null && noGratMoodAvg !== null
      ? { valueA: gratMoodAvg.toFixed(1), labelA: 'gratitude days', valueB: noGratMoodAvg.toFixed(1), labelB: 'other days' }
      : undefined,
  });

  // 6. Stress & Movement
  const movStress = recent30.filter((e) => (e.movement ?? 0) > 0 && e.stress !== null);
  const noMovStress = recent30.filter((e) => (e.movement ?? 0) === 0 && e.stress !== null);
  const movStressAvg = mean(movStress.map((e) => e.stress!));
  const noMovStressAvg = mean(noMovStress.map((e) => e.stress!));
  let stressMovBody = '';
  if (movStressAvg !== null && noMovStressAvg !== null) {
    const diff = noMovStressAvg - movStressAvg;
    if (diff > 0.3) stressMovBody = 'Moving seems to take the edge off. Your stress is lower on active days.';
    else if (diff > 0) stressMovBody = 'A little less stress on days you move.';
    else stressMovBody = 'Your stress levels stay fairly steady whether you move or not.';
  }
  correlations.push({
    id: 'stress-movement',
    title: 'Stress & Movement',
    body: stressMovBody,
    accent: colors.stressRed,
    visible: movStress.length >= 3 && noMovStress.length >= 3,
    comparison: movStressAvg !== null && noMovStressAvg !== null
      ? { valueA: movStressAvg.toFixed(1), labelA: 'active days', valueB: noMovStressAvg.toFixed(1), labelB: 'rest days' }
      : undefined,
  });

  // 7. Energy by day of week
  const energyByDay: number[][] = [[], [], [], [], [], [], []];
  for (const e of recent30) {
    if (e.energy == null) continue;
    const d = new Date(`${e.date}T12:00:00`);
    energyByDay[d.getDay()].push(e.energy);
  }

  let bestEnergyDay = -1;
  let bestEnergyAvg = -1;
  for (let i = 0; i < 7; i++) {
    if (energyByDay[i].length >= 2) {
      const a = mean(energyByDay[i])!;
      if (a > bestEnergyAvg) { bestEnergyAvg = a; bestEnergyDay = i; }
    }
  }

  const overallEnergyVals = recent30.filter((e) => e.energy !== null).map((e) => e.energy!);
  const overallEnergyAvg = mean(overallEnergyVals) ?? 0;

  correlations.push({
    id: 'energy-day',
    title: 'Your Energy Peak',
    body: bestEnergyDay >= 0 ? `Your ${DAYS[bestEnergyDay]}s tend to be when your energy peaks.` : '',
    accent: colors.energyGold,
    visible: bestEnergyDay >= 0,
    comparison: bestEnergyDay >= 0
      ? { valueA: bestEnergyAvg.toFixed(1), labelA: DAYS[bestEnergyDay] + 's', valueB: overallEnergyAvg.toFixed(1), labelB: 'your average' }
      : undefined,
  });

  // 8. Drinks & next-day energy
  const highDrinkNextEnergy: number[] = [];
  const lowDrinkNextEnergy: number[] = [];
  for (const e of recent30) {
    if (e.drinks === null) continue;
    const d = new Date(`${e.date}T12:00:00`);
    d.setDate(d.getDate() + 1);
    const next = byDate.get(fmtDate(d));
    if (!next || next.energy === null) continue;
    if (e.drinks >= 2) highDrinkNextEnergy.push(next.energy);
    else lowDrinkNextEnergy.push(next.energy);
  }
  const highDrinkEnergyAvg = mean(highDrinkNextEnergy);
  const lowDrinkEnergyAvg = mean(lowDrinkNextEnergy);
  let drinksEnergyBody = '';
  if (highDrinkEnergyAvg !== null && lowDrinkEnergyAvg !== null) {
    const diff = lowDrinkEnergyAvg - highDrinkEnergyAvg;
    if (diff > 0.3) drinksEnergyBody = 'Your energy takes a hit the day after more drinks. Lighter nights seem to help.';
    else if (diff > 0) drinksEnergyBody = 'A slight energy dip the day after heavier drinking.';
    else drinksEnergyBody = 'Your next-day energy stays consistent regardless of how much you drink.';
  }
  correlations.push({
    id: 'drinks-energy',
    title: 'Drinks & Next-Day Energy',
    body: drinksEnergyBody,
    accent: colors.amber,
    visible: highDrinkNextEnergy.length >= 3 && lowDrinkNextEnergy.length >= 3,
    comparison: highDrinkEnergyAvg !== null && lowDrinkEnergyAvg !== null
      ? { valueA: lowDrinkEnergyAvg.toFixed(1), labelA: 'lighter nights', valueB: highDrinkEnergyAvg.toFixed(1), labelB: 'heavier nights' }
      : undefined,
  });

  // 9. Sleep & Mood
  const poorSleepDays = recent30.filter(
    (e) => (e.context_tags ?? []).includes('poor sleep') && e.mood !== null
  );
  const greatSleepDays = recent30.filter(
    (e) => (e.context_tags ?? []).includes('great sleep') && e.mood !== null
  );
  const poorSleepMood = mean(poorSleepDays.map((e) => e.mood!));
  const greatSleepMood = mean(greatSleepDays.map((e) => e.mood!));
  let sleepMoodBody = '';
  if (poorSleepMood !== null && greatSleepMood !== null) {
    const diff = greatSleepMood - poorSleepMood;
    if (diff > 1.0) sleepMoodBody = 'Sleep makes a striking difference for you. Your mood is much higher after great nights.';
    else if (diff > 0.4) sleepMoodBody = 'You tend to feel noticeably better after good sleep.';
    else sleepMoodBody = 'Your mood stays fairly resilient even after poor sleep.';
  } else if (poorSleepMood !== null) {
    sleepMoodBody = 'Poor sleep days tend to bring your mood down.';
  } else if (greatSleepMood !== null) {
    sleepMoodBody = 'Great sleep seems to give your mood a real boost.';
  }
  correlations.push({
    id: 'sleep-mood',
    title: 'Sleep & Mood',
    body: sleepMoodBody,
    accent: colors.blueCalm,
    visible:
      (poorSleepDays.length >= 3 || greatSleepDays.length >= 3) &&
      poorSleepMood !== null &&
      greatSleepMood !== null,
    comparison:
      poorSleepMood !== null && greatSleepMood !== null
        ? { valueA: greatSleepMood.toFixed(1), labelA: 'great sleep', valueB: poorSleepMood.toFixed(1), labelB: 'poor sleep' }
        : undefined,
  });

  // 10. Social Time & Mood
  const connectedDays = recent30.filter(
    (e) =>
      ((e.context_tags ?? []).includes('socialised') ||
        (e.context_tags ?? []).includes('family time')) &&
      e.mood !== null
  );
  const otherDays = recent30.filter(
    (e) =>
      !(e.context_tags ?? []).includes('socialised') &&
      !(e.context_tags ?? []).includes('family time') &&
      e.mood !== null
  );
  const connectedMood = mean(connectedDays.map((e) => e.mood!));
  const otherMood = mean(otherDays.map((e) => e.mood!));
  let socialMoodBody = '';
  if (connectedMood !== null && otherMood !== null) {
    const diff = connectedMood - otherMood;
    if (diff > 0.5) socialMoodBody = 'Connection lifts you. Your mood is meaningfully higher on social days.';
    else if (diff > 0.2) socialMoodBody = 'You tend to feel a little brighter on days you spend time with people.';
    else if (diff >= -0.2) socialMoodBody = 'Your mood stays consistent regardless of social time.';
    else socialMoodBody = 'You seem to recharge more on quieter days.';
  }
  correlations.push({
    id: 'social-mood',
    title: 'Social Time & Mood',
    body: socialMoodBody,
    accent: colors.sage,
    visible: connectedDays.length >= 3 && otherDays.length >= 3,
    comparison:
      connectedMood !== null && otherMood !== null
        ? { valueA: connectedMood.toFixed(1), labelA: 'social days', valueB: otherMood.toFixed(1), labelB: 'other days' }
        : undefined,
  });

  // 11. Stressful Events & Energy
  const stressEventDays = recent30.filter(
    (e) => (e.context_tags ?? []).includes('stressful event') && e.energy !== null
  );
  const calmDays = recent30.filter(
    (e) =>
      !(e.context_tags ?? []).includes('stressful event') &&
      !(e.context_tags ?? []).includes('sick') &&
      e.energy !== null
  );
  const stressEventEnergy = mean(stressEventDays.map((e) => e.energy!));
  const calmEnergy = mean(calmDays.map((e) => e.energy!));
  let stressEventBody = '';
  if (stressEventEnergy !== null && calmEnergy !== null) {
    const diff = calmEnergy - stressEventEnergy;
    if (diff > 0.6) stressEventBody = 'Stressful events seem to drain you. Your energy dips noticeably on those days.';
    else if (diff > 0.2) stressEventBody = 'Your energy tends to be a little lower when something stressful is happening.';
    else stressEventBody = 'You hold your energy pretty steadily even through stressful events.';
  }
  correlations.push({
    id: 'stress-event-energy',
    title: 'Stressful Events & Energy',
    body: stressEventBody,
    accent: colors.stressRed,
    visible: stressEventDays.length >= 3 && calmDays.length >= 3,
    comparison:
      stressEventEnergy !== null && calmEnergy !== null
        ? { valueA: calmEnergy.toFixed(1), labelA: 'calm days', valueB: stressEventEnergy.toFixed(1), labelB: 'stressful days' }
        : undefined,
  });

  return { weekAvg, avg14, series, correlations, hasEnoughData, daysLogged };
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

  const { data: gratitudeItems } = useQuery({
    queryKey: ['gratitude-history', user?.id],
    queryFn: () => getRecentGratitudeItems(user!.id, 60),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const result = useMemo<InsightsData>(
    () =>
      entries
        ? computeInsights(entries, gratitudeItems ?? [])
        : { weekAvg: defaultWeekAvg, avg14: defaultAvg14, series: defaultSeries, correlations: [], hasEnoughData: false, daysLogged: 0 },
    [entries, gratitudeItems]
  );

  return { ...result, isLoading };
}
