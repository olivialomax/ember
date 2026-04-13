import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, trackerTextColors, typography } from '../../tokens';
import { TrackerKey } from '../../types';
import { Sparkline } from '../../shared/components/Sparkline';

const TRACKER_META: Record<
  TrackerKey,
  { label: string; unit?: string; color: string; textColor: string }
> = {
  mood:     { label: 'Mood',     color: colors.sage,       textColor: trackerTextColors.mood },
  energy:   { label: 'Energy',   color: colors.energyGold, textColor: trackerTextColors.energy },
  stress:   { label: 'Stress',   color: colors.stressRed,  textColor: trackerTextColors.stress },
  movement: { label: 'Movement', color: colors.blueCalm,   textColor: trackerTextColors.movement, unit: 'min' },
  drinks:   { label: 'Drinks',   color: colors.amber,      textColor: trackerTextColors.drinks },
};

interface TrendCardProps {
  tracker: TrackerKey;
  series: (number | null)[];
  avg: number | null;
}

export function TrendCard({ tracker, series, avg }: TrendCardProps) {
  const meta = TRACKER_META[tracker];
  const [sparkWidth, setSparkWidth] = useState(0);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Left: avg value + tracker name (stacked) */}
        <View style={styles.leftCol}>
          <Text style={[styles.avgValue, { color: avg !== null ? meta.textColor : colors.stone }]}>
            {avg !== null ? String(avg) : '—'}
          </Text>
          {avg !== null && meta.unit && (
            <Text style={styles.unit}>{meta.unit}</Text>
          )}
          <Text style={styles.label}>{meta.label}</Text>
        </View>

        {/* Right: sparkline */}
        <View
          style={styles.sparkCol}
          onLayout={(e) => setSparkWidth(e.nativeEvent.layout.width)}
        >
          {sparkWidth > 0 && (
            <Sparkline data={series} color={meta.color} width={sparkWidth} height={40} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    ...shadows.subtle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  leftCol: {
    width: 68,
    alignItems: 'center',
  },
  avgValue: {
    fontFamily: typography.displayMedium,
    fontSize: 26,
    lineHeight: 26,
  },
  unit: {
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.stone,
    marginTop: 1,
  },
  label: {
    fontFamily: typography.body,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.08 * 9,
    color: colors.stone,
    marginTop: 3,
  },
  sparkCol: {
    flex: 1,
  },
});
