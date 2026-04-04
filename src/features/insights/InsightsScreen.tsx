import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';
import { FadeUpSection } from '../../shared/components/FadeUpSection';
import { MetricTile } from '../../shared/components/MetricTile';
import { StreakCard } from '../streaks/StreakCard';
import { useStreaks } from '../streaks/useStreaks';
import { useInsights } from './useInsights';
import { TrendCard } from './TrendCard';
import { CorrelationCard } from './CorrelationCard';
import { colors, radius, shadows, spacing, typography } from '../../tokens';
import { TrackerKey } from '../../types';

const TRACKERS: TrackerKey[] = ['mood', 'energy', 'stress', 'movement', 'drinks'];

export function InsightsScreen() {
  const { streaks } = useStreaks();
  const { weekAvg, avg14, series, correlations, hasEnoughData, daysLogged } = useInsights();

  const visibleCorrelations = correlations.filter((c) => c.visible);

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Insights</Text>
          <Text style={styles.heading}>
            Your{' '}
            <Text style={styles.headingAccent}>progress.</Text>
          </Text>
        </View>

        {/* This Week */}
        <FadeUpSection delay={0}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>This week</Text>
            </View>
            <View style={styles.weekCard}>
              <View style={styles.tilesRow}>
                {TRACKERS.map((key) => (
                  <MetricTile key={key} tracker={key} value={weekAvg[key]} />
                ))}
              </View>
            </View>
          </View>
        </FadeUpSection>

        {/* Streaks */}
        <FadeUpSection delay={100}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Streaks</Text>
            </View>
            <View style={styles.streaksRow}>
              <StreakCard label="Mindful"   count={streaks.mindful_streak}   accentColor={colors.sage} />
              <StreakCard label="Journal"   count={streaks.journal_streak}   accentColor={colors.energyGold} />
              <StreakCard label="Gratitude" count={streaks.gratitude_streak} accentColor={colors.amber} />
            </View>
          </View>
        </FadeUpSection>

        {/* Trends */}
        <FadeUpSection delay={200}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>14-day trends</Text>
              <Text style={styles.sectionSubtitle}>14-day average</Text>
            </View>
            {TRACKERS.map((key) => (
              <TrendCard
                key={key}
                tracker={key}
                series={series[key]}
                avg={avg14[key]}
              />
            ))}
          </View>
        </FadeUpSection>

        {/* Patterns */}
        <FadeUpSection delay={300}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your patterns</Text>
            </View>
            {hasEnoughData && visibleCorrelations.length > 0 ? (
              visibleCorrelations.map((insight) => (
                <CorrelationCard key={insight.id} insight={insight} />
              ))
            ) : (
              <View style={styles.patternsPlaceholder}>
                <Text style={styles.patternsCount}>{daysLogged} / 5 days logged</Text>
                <Text style={styles.patternsText}>
                  Keep going — your patterns will start to emerge once you've checked in a few more times.
                </Text>
              </View>
            )}
          </View>
        </FadeUpSection>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 90,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.xl,
  },
  eyebrow: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
    marginBottom: spacing.xs,
  },
  heading: {
    fontFamily: typography.display,
    fontSize: 26,
    color: colors.ink,
    lineHeight: 26 * 1.2,
  },
  headingAccent: {
    fontFamily: typography.displayItalic,
    color: colors.sage,
  },
  section: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.display,
    fontSize: 17,
    color: colors.ink,
  },
  sectionSubtitle: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.stone,
    marginTop: 2,
  },
  weekCard: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    ...shadows.subtle,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  streaksRow: {
    flexDirection: 'row',
    gap: 10,
  },
  patternsPlaceholder: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    paddingVertical: 22,
    paddingHorizontal: spacing.xl,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  patternsCount: {
    fontFamily: typography.display,
    fontSize: 20,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  patternsText: {
    fontFamily: typography.displayItalic,
    fontSize: 14,
    color: colors.stone,
    textAlign: 'center',
    lineHeight: 14 * 1.6,
  },
});
