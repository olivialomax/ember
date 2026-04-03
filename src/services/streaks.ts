import { Entry, GratitudeItem, StreakData } from '../types';

/**
 * Calculates streak lengths from a list of entries sorted newest-first.
 * A streak is the number of consecutive days (ending today or yesterday)
 * where the relevant field was filled in.
 */
export function calculateStreaks(entries: Entry[], today: string): StreakData {
  return {
    journal_streak: countStreak(entries, today, (e) => !!e.journal_text?.trim()),
    gratitude_streak: 0, // Gratitude items are a separate table — calculated in useStreaks
    mindful_streak: countStreak(
      entries,
      today,
      (e) =>
        e.mood !== null &&
        e.energy !== null &&
        e.stress !== null &&
        e.movement !== null &&
        e.drinks !== null
    ),
  };
}

/**
 * Calculates the gratitude streak from a flat list of GratitudeItems.
 * A day earns streak credit only if it has >= minPerDay items.
 */
export function calculateGratitudeStreak(
  items: GratitudeItem[],
  today: string,
  minPerDay = 3
): number {
  // Count items per date
  const countByDate = new Map<string, number>();
  for (const item of items) {
    countByDate.set(item.date, (countByDate.get(item.date) ?? 0) + 1);
  }

  let streak = 0;
  const cursor = new Date(today);
  let allowedGap = true;

  while (true) {
    const dateStr = cursor.toISOString().split('T')[0];
    const count = countByDate.get(dateStr) ?? 0;

    if (count >= minPerDay) {
      streak++;
      allowedGap = false;
    } else if (allowedGap && dateStr === today) {
      // Today not yet logged — don't break the streak
      allowedGap = false;
    } else {
      break;
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function countStreak(
  entries: Entry[],
  today: string,
  predicate: (entry: Entry) => boolean
): number {
  const byDate = new Map(entries.map((e) => [e.date, e]));

  let streak = 0;
  const cursor = new Date(today);

  // Allow streak to include today (even if not yet logged) or yesterday
  // Start counting from today; if today isn't logged, we allow one gap
  let allowedGap = true;

  while (true) {
    const dateStr = cursor.toISOString().split('T')[0];
    const entry = byDate.get(dateStr);

    if (entry && predicate(entry)) {
      streak++;
      allowedGap = false;
    } else if (allowedGap && dateStr === today) {
      // Today not yet logged — don't break the streak
      allowedGap = false;
    } else {
      break;
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
