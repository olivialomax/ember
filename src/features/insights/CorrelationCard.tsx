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
  body: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 13 * 1.55,
  },
});
