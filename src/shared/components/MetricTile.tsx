import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';
import { TrackerKey } from '../../types';

const TRACKER_META: Record<
  TrackerKey,
  { label: string; unit?: string; color: string }
> = {
  mood: { label: 'Mood', color: colors.sage },
  energy: { label: 'Energy', color: colors.energyGold },
  stress: { label: 'Stress', color: colors.stressRed },
  movement: { label: 'Move', unit: 'min', color: colors.blueCalm },
  drinks: { label: 'Drinks', color: colors.amber },
};

interface MetricTileProps {
  tracker: TrackerKey;
  value: number | null | undefined;
}

export function MetricTile({ tracker, value }: MetricTileProps) {
  const meta = TRACKER_META[tracker];
  const hasValue = value != null && !(meta.unit === 'min' && value === 0);

  const numericDisplay = hasValue ? String(value) : '—';
const isScore = tracker === 'mood' || tracker === 'energy' || tracker === 'stress' || tracker === 'drinks' || tracker === 'movement';

  return (
    <View style={styles.tile}>
      <Text style={[styles.value, isScore && styles.valueScore, { color: hasValue ? meta.color : colors.stone }]}>
        {numericDisplay}
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
  value: {
    fontFamily: typography.displayMedium,
    fontSize: 20,
    lineHeight: 20,
  },
  valueScore: {
    fontSize: 32,
    lineHeight: 32,
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
