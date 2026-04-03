import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../tokens';

interface StreakCardProps {
  label: string;
  count: number;
  accentColor: string;
}

export function StreakCard({ label, count, accentColor }: StreakCardProps) {
  return (
    <View style={[styles.card, { borderTopColor: accentColor }]}>
      <Text style={[styles.count, { color: accentColor }]}>{count}</Text>
      <Text style={styles.unit}>day{count !== 1 ? 's' : ''}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.warmWhite,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderTopWidth: 3,
    ...shadows.subtle,
  },
  count: {
    fontFamily: typography.displayMedium,
    fontSize: 26,
    lineHeight: 26,
  },
  unit: {
    fontFamily: typography.body,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.06 * 9,
    color: colors.stone,
    marginTop: 2,
  },
  label: {
    fontFamily: typography.body,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.06 * 10,
    color: colors.stone,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
