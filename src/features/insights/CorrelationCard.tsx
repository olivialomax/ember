import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../tokens';
import { CorrelationInsight } from './useInsights';

interface CorrelationCardProps {
  insight: CorrelationInsight;
}

export function CorrelationCard({ insight }: CorrelationCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: insight.accent }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{insight.title}</Text>
        {insight.comparison && (
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonCol}>
              <Text style={[styles.compVal, { color: insight.accentText ?? insight.accent }]}>
                {insight.comparison.valueA}
              </Text>
              <Text style={styles.compLabel}>{insight.comparison.labelA}</Text>
            </View>
            <View style={styles.comparisonCol}>
              <Text style={[styles.compVal, { color: insight.accentText ?? insight.accent }]}>
                {insight.comparison.valueB}
              </Text>
              <Text style={styles.compLabel}>{insight.comparison.labelB}</Text>
            </View>
          </View>
        )}
        <Text style={styles.body}>{insight.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.subtle,
  },
  accent: {
    width: 3,
  },
  content: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  comparisonCol: {
    alignItems: 'flex-start',
  },
  compVal: {
    fontFamily: typography.displayMedium,
    fontSize: 22,
    lineHeight: 22,
  },
  compLabel: {
    fontFamily: typography.body,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.1 * 10,
    color: colors.stone,
    marginTop: 3,
  },
  body: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 13 * 1.55,
  },
});
