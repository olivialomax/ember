import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';
import { FadeUpSection } from '../../shared/components/FadeUpSection';
import { useGratitude } from '../gratitude';
import { TodayCard } from '../checkin/TodayCard';
import { StreakCard } from '../streaks/StreakCard';
import { useStreaks } from '../streaks/useStreaks';
import { useAuthStore } from '../auth/useAuthStore';
import { useProfileStore } from '../profile';
import { colors, radius, shadows, spacing, typography } from '../../tokens';

// ─── Greeting helpers ────────────────────────────────────────────────────────

function getGreetingPrefix(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  if (hour < 21) return 'Good evening,';
  return 'Good night,';
}

function getFirstName(user: { display_name?: string | null; email?: string } | null): string {
  if (!user) return 'there';
  if (user.display_name) return user.display_name.split(' ')[0];
  return user.email?.split('@')[0] ?? 'there';
}

// ─── Main screen ─────────────────────────────────────────────────────────────

type RootNavProp = NativeStackNavigationProp<{ CheckIn: undefined; Gratitude: undefined }>;
type TabNavProp = BottomTabNavigationProp<{ Insights: undefined; Settings: undefined }>;

export function HomeScreen() {
  const navigation = useNavigation<RootNavProp>();
  const tabNavigation = useNavigation<TabNavProp>();
  const { user } = useAuthStore();
  const { avatar } = useProfileStore();
  const { streaks } = useStreaks();
  const { items: gratitudeItems, meetsMinimum: gratitudeMet } = useGratitude();

  const greetingPrefix = getGreetingPrefix();
  const firstName = getFirstName(
    user
      ? {
          display_name: (user.user_metadata?.display_name as string | undefined) ?? null,
          email: user.email,
        }
      : null
  );

  function handleCheckIn() {
    navigation.navigate('CheckIn');
  }

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.greetingBlock}>
              <View style={styles.greetingRow}>
                <Text style={styles.greeting}>
                  {greetingPrefix}{' '}
                  <Text style={styles.greetingAccent}>{firstName}</Text>
                </Text>
              </View>
              <Text style={styles.subGreeting}>
                {new Date().toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                }).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => tabNavigation.navigate('Settings')}
              activeOpacity={0.75}
            >
              <Text style={styles.avatarEmoji}>{avatar}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Today card ─────────────────────────────────────────────── */}
        <FadeUpSection delay={0}>
          <View style={styles.section}>
            <TodayCard onCheckInPress={handleCheckIn} />
          </View>
        </FadeUpSection>

        {/* ── Streaks ────────────────────────────────────────────────── */}
        <FadeUpSection delay={100}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Streaks</Text>
              <TouchableOpacity onPress={() => tabNavigation.navigate('Insights')}>
                <Text style={styles.sectionLink}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.streaksRow}>
              <StreakCard
                label="Mindful"
                count={streaks.mindful_streak}
                accentColor={colors.sage}
              />
              <StreakCard
                label="Journal"
                count={streaks.journal_streak}
                accentColor={colors.energyGold}
              />
              <StreakCard
                label="Gratitude"
                count={streaks.gratitude_streak}
                accentColor={colors.amber}
              />
            </View>
          </View>
        </FadeUpSection>

        {/* ── Insights placeholder ───────────────────────────────────── */}
        <FadeUpSection delay={200}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>This week</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>See insights</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.insightsPlaceholder}>
              <Text style={styles.insightsPlaceholderText}>
                Log a few days to start seeing your patterns.
              </Text>
            </View>
          </View>
        </FadeUpSection>

        {/* ── Gratitude ──────────────────────────────────────────────── */}
        <FadeUpSection delay={300}>
          <View style={[styles.section, styles.lastSection]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Grateful for</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Gratitude')}>
                <Text style={styles.sectionLink}>
                  {gratitudeItems.length > 0 ? 'Edit' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>

            {gratitudeItems.length === 0 ? (
              <TouchableOpacity
                style={styles.gratitudePlaceholder}
                onPress={() => navigation.navigate('Gratitude')}
                activeOpacity={0.8}
              >
                <Text style={styles.gratitudePlaceholderText}>
                  What's one small thing that made today a little better?
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.gratitudeList}>
                {gratitudeItems.slice(0, 3).map((item) => (
                  <View key={item.id} style={styles.gratitudePreviewRow}>
                    <View style={styles.gratitudePreviewAccent} />
                    <Text style={styles.gratitudePreviewText} numberOfLines={2}>
                      {item.content}
                    </Text>
                  </View>
                ))}
                {!gratitudeMet && (
                  <Text style={styles.gratitudeProgressHint}>
                    {gratitudeItems.length} of 3 — add more for streak credit
                  </Text>
                )}
              </View>
            )}
          </View>
        </FadeUpSection>
      </ScrollView>
    </ScreenWrapper>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 90, // nav clearance
  },
  header: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  greetingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: colors.sagePale,
    borderWidth: 2,
    borderColor: colors.sageLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  greeting: {
    fontFamily: typography.display,
    fontSize: 26,
    color: colors.ink,
    lineHeight: 26 * 1.2,
  },
  greetingAccent: {
    fontFamily: typography.displayItalic,
    fontSize: 26,
    color: colors.sage,
    lineHeight: 26 * 1.2,
  },
  subGreeting: {
    fontFamily: typography.bodyMedium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.12,
    color: colors.stone,
    marginTop: spacing.xs,
  },
  section: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.display,
    fontSize: 17,
    color: colors.ink,
  },
  sectionLink: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.stone,
  },
  streaksRow: {
    flexDirection: 'row',
    gap: 10,
  },
  insightsPlaceholder: {
    backgroundColor: colors.warmWhite,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  insightsPlaceholderText: {
    fontFamily: typography.displayItalic,
    fontSize: 14,
    color: colors.stone,
    textAlign: 'center',
    lineHeight: 20,
  },
  gratitudePlaceholder: {
    backgroundColor: colors.amberPale,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: colors.amber,
  },
  gratitudePlaceholderText: {
    fontFamily: typography.body,
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.inkSoft,
    lineHeight: 13 * 1.5,
  },
  gratitudeList: {
    gap: spacing.sm,
  },
  gratitudePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.amberPale,
    borderRadius: 14,
    overflow: 'hidden',
  },
  gratitudePreviewAccent: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: colors.amber,
  },
  gratitudePreviewText: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.inkSoft,
    lineHeight: 13 * 1.5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  gratitudeProgressHint: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.amber,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
});
