import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../tokens';
import { TrackerKey } from '../../types';
import { Sparkline } from '../../shared/components/Sparkline';

const TRACKER_META: Record<
  TrackerKey,
  { label: string; unit?: string; color: string; icon: string }
> = {
  mood:     { label: 'Mood',     color: colors.sage,       icon: '◐' },
  energy:   { label: 'Energy',   color: colors.energyGold, icon: '◑' },
  stress:   { label: 'Stress',   color: colors.stressRed,  icon: '◒' },
  movement: { label: 'Movement', color: colors.blueCalm,   icon: '◓', unit: 'min' },
  drinks:   { label: 'Drinks',   color: colors.amber,      icon: '◔' },
};

interface TrendCardProps {
  tracker: TrackerKey;
  series: (number | null)[];
  avg: number | null;
}

export function TrendCard({ tracker, series, avg }: TrendCardProps) {
  const meta = TRACKER_META[tracker];
  const [sparkWidth, setSparkWidth] = useState(0);

  const displayAvg =
    avg !== null
      ? meta.unit
        ? `${avg} ${meta.unit}`
        : String(avg)
      : '—';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Left: icon + label */}
        <View style={styles.labelCol}>
          <Text style={[styles.icon, { color: meta.color }]}>{meta.icon}</Text>
          <Text style={styles.label}>{meta.label}</Text>
        </View>

        {/* Centre: sparkline */}
        <View
          style={styles.sparkCol}
          onLayout={(e) => setSparkWidth(e.nativeEvent.layout.width)}
        >
          {sparkWidth > 0 && (
            <Sparkline data={series} color={meta.color} width={sparkWidth} height={40} />
          )}
        </View>

        {/* Right: 7-day avg */}
        <View style={styles.valueCol}>
          <Text style={[styles.avgValue, { color: avg !== null ? meta.color : colors.stone }]}>
            {displayAvg}
          </Text>
          <Text style={styles.avgLabel}>7-day avg</Text>
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
  labelCol: {
    width: 58,
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontFamily: typography.body,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.08 * 9,
    color: colors.stone,
  },
  sparkCol: {
    flex: 1,
  },
  valueCol: {
    width: 52,
    alignItems: 'flex-end',
  },
  avgValue: {
    fontFamily: typography.displayMedium,
    fontSize: 22,
    lineHeight: 22,
  },
  avgLabel: {
    fontFamily: typography.body,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.08 * 9,
    color: colors.stone,
    marginTop: 3,
  },
});
