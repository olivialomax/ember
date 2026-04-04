import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';
import { FadeUpSection } from '../../shared/components/FadeUpSection';
import { StreakCard } from '../streaks/StreakCard';
import { useStreaks } from '../streaks/useStreaks';
import { colors, radius, shadows, spacing, typography } from '../../tokens';

export function InsightsScreen() {
  const { streaks } = useStreaks();

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

        {/* Streaks */}
        <FadeUpSection delay={0}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Streaks</Text>
            </View>
            <View style={styles.streaksRow}>
              <StreakCard label="Mindful" count={streaks.mindful_streak} accentColor={colors.sage} />
              <StreakCard label="Journal" count={streaks.journal_streak} accentColor={colors.energyGold} />
              <StreakCard label="Gratitude" count={streaks.gratitude_streak} accentColor={colors.amber} />
            </View>
          </View>
        </FadeUpSection>

        {/* Patterns placeholder */}
        <FadeUpSection delay={100}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your patterns</Text>
            </View>
            <View style={styles.patternsCard}>
              <Text style={styles.patternsText}>
                Keep logging — your patterns will emerge here.
              </Text>
            </View>
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
  streaksRow: {
    flexDirection: 'row',
    gap: 10,
  },
  patternsCard: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    paddingVertical: 22,
    paddingHorizontal: spacing.xl,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  patternsText: {
    fontFamily: typography.displayItalic,
    fontSize: 14,
    color: colors.stone,
    textAlign: 'center',
    lineHeight: 14 * 1.6,
  },
});
