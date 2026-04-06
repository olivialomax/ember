import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../tokens';
import { MetricTile } from '../../shared/components/MetricTile';
import { useToday } from './useToday';
import { useProfile } from '../profile';

const TRACKERS = ['mood', 'energy', 'stress', 'movement', 'drinks'] as const;

interface TodayCardProps {
  onCheckInPress: () => void;
}

export function TodayCard({ onCheckInPress }: TodayCardProps) {
  const { entry, isLoading, isSyncing, hasAnyValue } = useToday();
  const { profile } = useProfile();
  const todayDow = String(new Date().getDay());
  const todayDrinkGoal = profile?.drink_limits_weekly?.[todayDow] ?? null;

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>Today</Text>
        {isSyncing && (
          <ActivityIndicator size="small" color={colors.sageLight} style={styles.syncDot} />
        )}
      </View>

      {/* Metric tiles */}
      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.stone} />
        </View>
      ) : (
        <View style={styles.metricsRow}>
          {TRACKERS.map((key) => (
            <MetricTile
                key={key}
                tracker={key}
                value={entry[key] as number | null}
                drinkLimit={key === 'drinks' ? todayDrinkGoal : undefined}
              />
          ))}
        </View>
      )}

      {/* CTA */}
      <TouchableOpacity
        style={styles.button}
        onPress={onCheckInPress}
        activeOpacity={0.85}
      >
        {/* Live pulse dot */}
        <View style={styles.pulseDot} />
        <Text style={styles.buttonText}>
          {hasAnyValue ? 'Update check-in' : "Log today's check-in"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  eyebrow: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14,
    color: colors.stone,
  },
  syncDot: {
    marginLeft: spacing.xs,
  },
  loadingRow: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg + 2, // 18px
  },
  button: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.sageLight,
  },
  buttonText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.warmWhite,
    letterSpacing: 0.02 * 14,
  },
});
