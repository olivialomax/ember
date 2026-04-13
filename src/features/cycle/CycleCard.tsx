import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useProfile } from '../profile';
import { useCyclePhase } from './useCyclePhase';
import { useCycleLog } from './useCycleLog';
import { colors, radius, shadows, spacing, typography } from '../../tokens';

interface CycleCardProps {
  onLogPress: () => void;
}

export function CycleCard({ onLogPress }: CycleCardProps) {
  const { profile } = useProfile();
  const lastPeriodStart = profile?.last_period_start ?? null;
  const cycleLength = profile?.average_cycle_length ?? 28;

  const phaseInfo = useCyclePhase(lastPeriodStart, cycleLength);
  const { hasLoggedToday } = useCycleLog();

  const isEmpty = !lastPeriodStart;

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>Cycle</Text>
        {!isEmpty && (
          <View style={[styles.phaseBadge, { borderLeftColor: phaseInfo.accent }]}>
            <Text style={[styles.phaseText, { color: phaseInfo.accent }]}>
              {phaseInfo.label}
            </Text>
          </View>
        )}
      </View>

      {isEmpty ? (
        /* Empty state */
        <Text style={styles.emptyText}>
          Track your cycle to see phase insights and log how you're feeling each day.
        </Text>
      ) : (
        /* Stats row */
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: phaseInfo.accent }]}>
              {phaseInfo.dayOfCycle}
            </Text>
            <Text style={styles.statLabel}>day of cycle</Text>
          </View>
          {phaseInfo.daysUntilNext > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{phaseInfo.daysUntilNext}</Text>
              <Text style={styles.statLabel}>days to next period</Text>
            </View>
          )}
        </View>
      )}

      {/* Log button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onLogPress}
        activeOpacity={0.8}
      >
        <View style={styles.pulseDot} />
        <Text style={styles.buttonText}>
          {isEmpty
            ? 'Set start date'
            : hasLoggedToday
            ? 'Update today'
            : 'Log today'}
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
    gap: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
  },
  phaseBadge: {
    backgroundColor: colors.rosePale,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderLeftWidth: 3,
  },
  phaseText: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.02 * 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  statItem: {
    gap: 2,
  },
  statValue: {
    fontFamily: typography.displayMedium,
    fontSize: 20,
    color: colors.ink,
    lineHeight: 20,
  },
  statLabel: {
    fontFamily: typography.body,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.08 * 9,
    color: colors.stone,
    marginTop: 3,
  },
  emptyText: {
    fontFamily: typography.displayItalic,
    fontSize: 13,
    color: colors.stone,
    lineHeight: 13 * 1.5,
  },
  button: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.roseLight,
  },
  buttonText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.warmWhite,
    letterSpacing: 0.02 * 14,
  },
});
