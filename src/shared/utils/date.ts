/** Formats a YYYY-MM-DD date string as a long human-readable heading, e.g. "Saturday 4 April". */
export function formatDateHeading(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** Returns today's date in YYYY-MM-DD format using local time, not UTC. */
export function localDateISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Returns a past date N days ago in YYYY-MM-DD local time.
 * Used for date-range queries in services.
 */
export function localDateISOMinus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
