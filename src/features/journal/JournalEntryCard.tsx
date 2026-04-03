import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';
import { Entry } from '../../types';

interface JournalEntryCardProps {
  entry: Entry;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{formatDate(entry.date)}</Text>
      <Text style={styles.preview} numberOfLines={3}>
        {entry.journal_text}
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
  date: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.12 * 10,
    color: colors.stone,
    marginBottom: spacing.sm,
  },
  preview: {
    fontFamily: typography.displayItalic,
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 14 * 1.6,
  },
});
