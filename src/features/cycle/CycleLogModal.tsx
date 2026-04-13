import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, shadows, spacing, typography } from '../../tokens';
import { useProfile } from '../profile';
import { useCycleLog } from './useCycleLog';
import { FlowLevel, CycleSymptom } from './types';
import { formatDateHeading, localDateISO, localDateISOMinus } from '../../shared/utils/date';

const FLOW_LEVELS: { value: FlowLevel; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'spotting', label: 'Spotting' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];

const SYMPTOMS: CycleSymptom[] = [
  'cramps',
  'bloating',
  'fatigue',
  'headache',
  'mood changes',
  'tender',
];

const SYMPTOM_LABELS: Record<CycleSymptom, string> = {
  cramps: 'Cramps',
  bloating: 'Bloating',
  fatigue: 'Fatigue',
  headache: 'Headache',
  'mood changes': 'Mood changes',
  tender: 'Tender',
};

function buildDateOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  for (let i = 0; i < 60; i++) {
    const val = localDateISOMinus(i);
    const label = i === 0 ? 'Today' : i === 1 ? 'Yesterday' : formatDateHeading(val);
    options.push({ value: val, label });
  }
  return options;
}

const DATE_OPTIONS = buildDateOptions();

export function CycleLogModal() {
  const navigation = useNavigation();
  const { profile, update: updateProfile } = useProfile();
  const { log, isSyncing, submitLog } = useCycleLog();

  const [flow, setFlow] = useState<FlowLevel | null>(null);
  const [symptoms, setSymptoms] = useState<CycleSymptom[]>([]);
  const [notes, setNotes] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Pre-fill from existing log
  useEffect(() => {
    if (log.flow != null) setFlow(log.flow);
    if (log.symptoms && log.symptoms.length > 0) setSymptoms(log.symptoms as CycleSymptom[]);
    if (log.notes) setNotes(log.notes);
  }, [log.flow, log.notes]);

  const selectedPeriodStart = profile?.last_period_start ?? null;
  const selectedPeriodLabel = selectedPeriodStart
    ? (DATE_OPTIONS.find((o) => o.value === selectedPeriodStart)?.label ?? formatDateHeading(selectedPeriodStart))
    : 'Set date';

  function handleSelectDate(val: string) {
    updateProfile({ last_period_start: val });
    setDatePickerVisible(false);
  }

  function toggleSymptom(symptom: CycleSymptom) {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }

  function handleSave() {
    submitLog({ flow, symptoms, notes });
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Cycle</Text>
          <Text style={styles.heading}>
            How are you{'\n'}
            <Text style={styles.headingAccent}>feeling today?</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          accessibilityLabel="Close"
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Period start */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Last period started</Text>
          <TouchableOpacity
            style={styles.dateRow}
            onPress={() => setDatePickerVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dateValue, !selectedPeriodStart && styles.datePlaceholder]}>
              {selectedPeriodLabel}
            </Text>
            <Text style={styles.dateChevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Flow */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Flow</Text>
          <View style={styles.chipRow}>
            {FLOW_LEVELS.map(({ value, label }) => {
              const selected = flow === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => setFlow(selected ? null : value)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Symptoms */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Symptoms</Text>
          <View style={styles.chipGrid}>
            {SYMPTOMS.map((symptom) => {
              const selected = symptoms.includes(symptom);
              return (
                <TouchableOpacity
                  key={symptom}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleSymptom(symptom)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {SYMPTOM_LABELS[symptom]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Anything else on your mind…"
            placeholderTextColor={colors.stone}
            multiline
            numberOfLines={3}
            autoCorrect
            autoCapitalize="sentences"
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isSyncing && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSyncing}
          activeOpacity={0.8}
        >
          {isSyncing ? (
            <ActivityIndicator color={colors.warmWhite} size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Date picker modal */}
      <Modal
        visible={datePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDatePickerVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.datePickerSheet}>
                <View style={styles.datePickerHandle} />
                <Text style={styles.datePickerTitle}>When did it start?</Text>
                <ScrollView
                  style={styles.datePickerScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {DATE_OPTIONS.map((opt) => {
                    const selected = selectedPeriodStart === opt.value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        style={[styles.dateOption, selected && styles.dateOptionSelected]}
                        onPress={() => handleSelectDate(opt.value)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.dateOptionText, selected && styles.dateOptionTextSelected]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    color: colors.rose,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  closeText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.stone,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  section: {
    paddingVertical: spacing.lg,
  },
  sectionLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
    marginBottom: spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.warmWhite,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadows.subtle,
  },
  dateValue: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.ink,
  },
  datePlaceholder: {
    color: colors.stone,
    fontStyle: 'italic',
  },
  dateChevron: {
    fontFamily: typography.display,
    fontSize: 18,
    color: colors.stone,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(44,40,37,0.07)',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.warmWhite,
    borderWidth: 1,
    borderColor: 'rgba(44,40,37,0.10)',
  },
  chipSelected: {
    backgroundColor: colors.rosePale,
    borderColor: colors.rose,
  },
  chipText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSoft,
  },
  chipTextSelected: {
    fontFamily: typography.bodyMedium,
    color: colors.rose,
  },
  notesInput: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 14 * 1.5,
    minHeight: 80,
    textAlignVertical: 'top',
    ...shadows.subtle,
  },
  footer: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: 40,
    paddingTop: spacing.md,
    backgroundColor: colors.cream,
  },
  saveButton: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.warmWhite,
    letterSpacing: 0.02 * 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(44,40,37,0.35)',
    justifyContent: 'flex-end',
  },
  datePickerSheet: {
    backgroundColor: colors.warmWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.md,
    paddingBottom: 40,
    maxHeight: '60%',
    ...shadows.card,
  },
  datePickerHandle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.stone,
    opacity: 0.2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  datePickerTitle: {
    fontFamily: typography.display,
    fontSize: 20,
    color: colors.ink,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  datePickerScroll: {
    paddingHorizontal: spacing.xl,
  },
  dateOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  dateOptionSelected: {
    backgroundColor: colors.rosePale,
  },
  dateOptionText: {
    fontFamily: typography.body,
    fontSize: 16,
    color: colors.inkSoft,
  },
  dateOptionTextSelected: {
    fontFamily: typography.bodyMedium,
    color: colors.rose,
  },
});
