import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';
import { TrackerKey } from '../../types';

const TRACKER_META: Record<
  TrackerKey,
  { label: string; unit?: string; color: string; icon: string }
> = {
  mood: { label: 'Mood', color: colors.sage, icon: '◐' },
  energy: { label: 'Energy', color: colors.energyGold, icon: '◑' },
  stress: { label: 'Stress', color: colors.stressRed, icon: '◒' },
  movement: { label: 'Move', unit: 'min', color: colors.blueCalm, icon: '◓' },
  drinks: { label: 'Drinks', color: colors.amber, icon: '◔' },
};

interface MetricTileProps {
  tracker: TrackerKey;
  value: number | null | undefined;
}

export function MetricTile({ tracker, value }: MetricTileProps) {
  const meta = TRACKER_META[tracker];
  const hasValue = value != null && !(meta.unit === 'min' && value === 0);

  const displayValue = hasValue
    ? meta.unit
      ? `${value}${meta.unit}`
      : String(value)
    : '—';

  const isScore = tracker === 'mood' || tracker === 'energy' || tracker === 'stress';

  return (
    <View style={styles.tile}>
      <Text style={[styles.icon, { color: meta.color }]}>{meta.icon}</Text>
      <Text style={[styles.value, isScore && styles.valueScore, { color: hasValue ? meta.color : colors.stone }]}>
        {displayValue}
      </Text>
      <Text style={[styles.label, isScore && styles.labelScore]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  icon: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  value: {
    fontFamily: typography.displayMedium,
    fontSize: 20,
    lineHeight: 20,
  },
  valueScore: {
    fontSize: 28,
    lineHeight: 28,
  },
  label: {
    fontFamily: typography.body,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.08 * 9,
    color: colors.stone,
    marginTop: 3,
  },
  labelScore: {
    marginTop: 8,
  },
});
