import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, shadows, spacing, typography } from '../../tokens';
import { ScaleSelector } from '../../shared/components/ScaleSelector';
import { StepperInput } from '../../shared/components/StepperInput';
import { TagSelector } from '../../shared/components/TagSelector';
import { CONTEXT_TAGS } from '../../constants/tags';
import { useToday } from './useToday';
import { useProfile } from '../profile';
import { useCycleLog } from '../cycle/useCycleLog';
import type { FlowLevel } from '../cycle/types';
import type { CheckInStackParamList } from '../../navigation';

type Nav = NativeStackNavigationProp<CheckInStackParamList, 'CheckInForm'>;

const GOOD_HIGH_COLORS = [colors.stressRed, colors.amber, colors.energyGold, colors.sageLight, colors.sage];
const GOOD_LOW_COLORS = [colors.sage, colors.sageLight, colors.energyGold, colors.amber, colors.stressRed];

const FLOW_OPTIONS: { value: FlowLevel; label: string }[] = [
  { value: 'spotting', label: 'Spotting' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];

export function CheckInScreen() {
  const navigation = useNavigation<Nav>();
  const { entry, submitAll, isSyncing } = useToday();
  const { profile } = useProfile();
  const { log: cycleLog, submitLog: submitCycleLog } = useCycleLog();
  const cycleEnabled = profile?.cycle_tracker_enabled ?? false;

  // Initialise local state from any existing entry values
  const [mood, setMood] = useState<number | null>(entry.mood ?? null);
  const [energy, setEnergy] = useState<number | null>(entry.energy ?? null);
  const [stress, setStress] = useState<number | null>(entry.stress ?? null);
  const [movement, setMovement] = useState<number | null>(entry.movement ?? null);
  const [drinks, setDrinks] = useState<number | null>(entry.drinks ?? null);
  const [contextTags, setContextTags] = useState<string[]>(entry.context_tags ?? []);
  const [cycleFlow, setCycleFlow] = useState<FlowLevel | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Pre-fill flow from today's existing cycle log once loaded
  useEffect(() => {
    if (cycleLog?.flow && cycleLog.flow !== 'none') {
      setCycleFlow(cycleLog.flow);
    }
  }, [cycleLog?.flow]);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    setShowScrollHint(distanceFromBottom > 40);
  }

  function handleSubmit() {
    submitAll({ mood, energy, stress, movement, drinks, context_tags: contextTags.length > 0 ? contextTags : null });
    if (cycleEnabled && cycleFlow) {
      submitCycleLog({ flow: cycleFlow, symptoms: [], notes: '' });
    }
    navigation.navigate('CheckInSummary');
  }

  const hasRequiredFields = mood != null && energy != null && stress != null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Daily check-in</Text>
        <TouchableOpacity
          onPress={() => navigation.getParent()?.goBack()}
          style={styles.closeButton}
          accessibilityLabel="Close check-in"
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scrollContainer}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.heading}>How was your day?</Text>
        <Text style={styles.subheading}>
          A moment of honesty is all it takes.
        </Text>

        {/* Scale selectors */}
        <View style={styles.section}>
          <ScaleSelector
            label="Mood"
            value={mood}
            onChange={setMood}
            colors={GOOD_HIGH_COLORS}
          />
          <ScaleSelector
            label="Energy"
            value={energy}
            onChange={setEnergy}
            colors={GOOD_HIGH_COLORS}
          />
          <ScaleSelector
            label="Stress"
            value={stress}
            onChange={setStress}
            colors={GOOD_LOW_COLORS}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Steppers */}
        <View style={styles.section}>
          <StepperInput
            label="Movement"
            value={movement}
            onChange={setMovement}
            min={0}
            max={240}
            step={5}
            unit="min"
          />
          <StepperInput
            label="Drinks"
            value={drinks}
            onChange={setDrinks}
            min={0}
            max={20}
            step={1}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Context tags */}
        <TagSelector
          tags={CONTEXT_TAGS}
          selected={contextTags}
          onChange={setContextTags}
        />

        {/* Cycle flow — only shown when tracking is enabled */}
        {cycleEnabled && (
          <>
            <View style={styles.divider} />
            <View style={styles.cycleSection}>
              <Text style={styles.cycleLabel}>Today's flow</Text>
              <View style={styles.flowRow}>
                {FLOW_OPTIONS.map(({ value, label }) => {
                  const selected = cycleFlow === value;
                  return (
                    <TouchableOpacity
                      key={value}
                      style={[styles.flowPill, selected && styles.flowPillSelected]}
                      onPress={() => setCycleFlow(selected ? null : value)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.flowPillText, selected && styles.flowPillTextSelected]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>
      {showScrollHint && (
        <View style={styles.scrollFade} pointerEvents="none">
          <View style={styles.scrollFadeLayer1} />
          <View style={styles.scrollFadeLayer2} />
          <View style={styles.scrollFadeLayer3} />
          <Text style={styles.scrollChevron}>›</Text>
        </View>
      )}
      </View>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !hasRequiredFields && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!hasRequiredFields || isSyncing}
          activeOpacity={0.85}
        >
          {isSyncing ? (
            <ActivityIndicator color={colors.warmWhite} size="small" />
          ) : (
            <>
              <View style={styles.pulseDot} />
              <Text style={styles.buttonText}>Save check-in</Text>
            </>
          )}
        </TouchableOpacity>
        {!hasRequiredFields && (
          <Text style={styles.hint}>Rate mood, energy, and stress to continue</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  eyebrow: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.stone,
  },
  scrollContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  scrollFadeLayer1: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: colors.cream,
    opacity: 0.3,
  },
  scrollFadeLayer2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: colors.cream,
    opacity: 0.45,
  },
  scrollFadeLayer3: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: colors.cream,
    opacity: 0.65,
  },
  scrollChevron: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.stone,
    opacity: 0.5,
    transform: [{ rotate: '90deg' }],
  },
  content: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  heading: {
    fontFamily: typography.display,
    fontSize: 26,
    color: colors.ink,
    lineHeight: 26 * 1.2,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontFamily: typography.displayItalic,
    fontSize: 14,
    color: colors.sage,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(44,40,37,0.07)',
    marginBottom: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: 40,
    paddingTop: spacing.md,
    backgroundColor: colors.cream,
  },
  button: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.card,
  },
  buttonDisabled: {
    opacity: 0.4,
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
  hint: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.stone,
    textAlign: 'center',
    marginTop: spacing.sm,
    opacity: 0.7,
  },
  cycleSection: {
    marginBottom: spacing.sm,
  },
  cycleLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
    marginBottom: spacing.md,
  },
  flowRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  flowPill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: 'rgba(44,40,37,0.10)',
  },
  flowPillSelected: {
    backgroundColor: colors.rosePale,
    borderColor: colors.rose,
  },
  flowPillText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.stone,
  },
  flowPillTextSelected: {
    color: colors.rose,
  },
});
