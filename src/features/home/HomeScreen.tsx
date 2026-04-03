import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';
import { useGratitude } from '../gratitude';
import { TodayCard } from '../checkin/TodayCard';
import { StreakCard } from '../streaks/StreakCard';
import { useStreaks } from '../streaks/useStreaks';
import { useAuthStore } from '../auth/useAuthStore';
import { colors, spacing, typography } from '../../tokens';

// ─── Greeting helpers ────────────────────────────────────────────────────────

function getGreeting(): { prefix: string; accent: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { prefix: 'Good morning,', accent: 'sunshine' };
  if (hour < 17) return { prefix: 'Good afternoon,', accent: 'friend' };
  if (hour < 21) return { prefix: 'Good evening,', accent: 'lovely' };
  return { prefix: 'Good night,', accent: 'you' };
}

function getFirstName(user: { display_name?: string | null; email?: string } | null): string {
  if (!user) return 'there';
  if (user.display_name) return user.display_name.split(' ')[0];
  return user.email?.split('@')[0] ?? 'there';
}

// ─── Animated section wrapper ────────────────────────────────────────────────

function FadeUpSection({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

type RootNavProp = NativeStackNavigationProp<{ CheckIn: undefined; Gratitude: undefined }>;

export function HomeScreen() {
  const navigation = useNavigation<RootNavProp>();
  const { user } = useAuthStore();
  const { streaks } = useStreaks();
  const { items: gratitudeItems, meetsMinimum: gratitudeMet } = useGratitude();
  const greeting = getGreeting();
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
          <View style={styles.greetingRow}>
            <Text style={styles.greeting}>
              {greeting.prefix}{' '}
              <Text style={styles.greetingAccent}>{greeting.accent}</Text>
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
              <TouchableOpacity>
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
  greetingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
