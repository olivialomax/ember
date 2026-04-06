import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, shadows, spacing, typography } from '../../tokens';
import { MetricTile } from '../../shared/components/MetricTile';
import { useToday } from './useToday';
import { useProfile } from '../profile';
import type { CheckInStackParamList } from '../../navigation';

type Nav = NativeStackNavigationProp<CheckInStackParamList, 'CheckInSummary'>;

const TRACKERS = ['mood', 'energy', 'stress', 'movement', 'drinks'] as const;

const SUMMARY_MESSAGES = [
  { heading: 'Lovely.', body: 'Every check-in is a small act of self-awareness.' },
  { heading: 'Noted.', body: 'You showed up for yourself today — that counts.' },
  { heading: 'There you are.', body: 'Knowing how you feel is the first step to feeling better.' },
  { heading: 'Saved.', body: 'Small moments of reflection add up to something meaningful.' },
];

function getDailyMessage() {
  const day = new Date().getDay();
  return SUMMARY_MESSAGES[day % SUMMARY_MESSAGES.length];
}

export function CheckInSummaryScreen() {
  const navigation = useNavigation<Nav>();
  const { entry } = useToday();
  const { profile } = useProfile();
  const todayDow = String(new Date().getDay());
  const todayDrinkGoal = profile?.drink_limits_weekly?.[todayDow] ?? null;
  const message = getDailyMessage();

  // Fade-up animation
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  function handleDone() {
    navigation.getParent()?.goBack();
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inner, { opacity, transform: [{ translateY }] }]}>
        {/* Message */}
        <View style={styles.messageBlock}>
          <Text style={styles.heading}>{message.heading}</Text>
          <Text style={styles.body}>{message.body}</Text>
        </View>

        {/* Summary card */}
        <View style={styles.card}>
          <Text style={styles.cardEyebrow}>Today's log</Text>
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
          {(entry.context_tags ?? []).length > 0 && (
            <View style={styles.tagsBlock}>
              <Text style={styles.tagsEyebrow}>Context</Text>
              <View style={styles.tagsRow}>
                {entry.context_tags!.map((tag) => (
                  <View key={tag} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Done button */}
        <TouchableOpacity style={styles.button} onPress={handleDone} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    justifyContent: 'center',
  },
  inner: {
    paddingHorizontal: spacing.xxxl,
  },
  messageBlock: {
    marginBottom: spacing.xxl,
  },
  heading: {
    fontFamily: typography.display,
    fontSize: 26,
    color: colors.ink,
    lineHeight: 26 * 1.2,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: typography.displayItalic,
    fontSize: 15,
    color: colors.sage,
    lineHeight: 15 * 1.5,
  },
  card: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  cardEyebrow: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
    marginBottom: spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tagsBlock: {
    marginTop: spacing.lg,
  },
  tagsEyebrow: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
    marginBottom: spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagChip: {
    backgroundColor: colors.sagePale,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  tagChipText: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.sage,
  },
  button: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  buttonText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.warmWhite,
    letterSpacing: 0.02 * 14,
  },
});
