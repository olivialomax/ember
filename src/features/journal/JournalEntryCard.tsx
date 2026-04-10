import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';
import { JournalEntry } from '../../types';

interface JournalEntryCardProps {
  entry: JournalEntry;
  maxLines?: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function JournalEntryCard({ entry, maxLines = 4 }: JournalEntryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.meta}>
        <Text style={styles.date}>{formatDate(entry.date)}</Text>
        <Text style={styles.time}>{formatTime(entry.created_at)}</Text>
      </View>
      <Text style={styles.preview} numberOfLines={maxLines || undefined}>
        {entry.body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  date: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.12 * 10,
    color: colors.stone,
  },
  time: {
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.stone,
    opacity: 0.6,
  },
  preview: {
    fontFamily: typography.displayItalic,
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 14 * 1.6,
  },
});
