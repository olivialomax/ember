import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, trackerTextColors, typography } from '../../tokens';
import { TrackerKey } from '../../types';

const TRACKER_META: Record<
  TrackerKey,
  { label: string; unit?: string; color: string; textColor: string }
> = {
  mood:     { label: 'Mood',   color: colors.sage,       textColor: trackerTextColors.mood },
  energy:   { label: 'Energy', color: colors.energyGold, textColor: trackerTextColors.energy },
  stress:   { label: 'Stress', color: colors.stressRed,  textColor: trackerTextColors.stress },
  movement: { label: 'Move',   color: colors.blueCalm,   textColor: trackerTextColors.movement, unit: 'min' },
  drinks:   { label: 'Drinks', color: colors.amber,      textColor: trackerTextColors.drinks },
};

interface MetricTileProps {
  tracker: TrackerKey;
  value: number | null | undefined;
  drinkLimit?: number | null;
}

export function MetricTile({ tracker, value, drinkLimit }: MetricTileProps) {
  const meta = TRACKER_META[tracker];
  const hasValue = value != null && !(meta.unit === 'min' && value === 0);

  const numericDisplay = hasValue ? String(value) : '—';
const isScore = tracker === 'mood' || tracker === 'energy' || tracker === 'stress' || tracker === 'drinks' || tracker === 'movement';

  const showArrow = tracker === 'drinks' && drinkLimit != null && value != null && value !== drinkLimit;
  const arrowUp = showArrow && value > drinkLimit!;

  return (
    <View style={styles.tile}>
      {showArrow ? (
        <View style={styles.valueRow}>
          <Text style={[styles.value, styles.valueScore, { color: meta.textColor }]}>
            {numericDisplay}
          </Text>
          <Text style={[styles.arrow, { color: arrowUp ? trackerTextColors.stress : trackerTextColors.mood }]}>
            {arrowUp ? '↑' : '↓'}
          </Text>
        </View>
      ) : (
        <Text style={[styles.value, isScore && styles.valueScore, { color: hasValue ? meta.textColor : colors.stone }]}>
          {numericDisplay}
        </Text>
      )}
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
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  arrow: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    lineHeight: 32,
  },
});
