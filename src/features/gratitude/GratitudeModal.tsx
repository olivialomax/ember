import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, shadows, spacing, typography } from '../../tokens';
import { GratitudeItemRow } from './GratitudeItemRow';
import { useGratitude } from './useGratitude';

export function GratitudeModal() {
  const navigation = useNavigation();
  const { items, isLoading, addItem, deleteItem, isAdding, meetsMinimum, canAddMore, minForStreak } =
    useGratitude();
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<TextInput>(null);

  function handleAdd() {
    const trimmed = inputText.trim();
    if (!trimmed || !canAddMore) return;
    addItem(trimmed);
    setInputText('');
    inputRef.current?.focus();
  }

  const progressText = meetsMinimum
    ? 'Streak earned ✓'
    : `${items.length} of ${minForStreak} for today's streak`;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Gratitude</Text>
          <Text style={styles.heading}>
            Grateful{' '}
            <Text style={styles.headingAccent}>for.</Text>
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

      {/* Progress pill */}
      <View style={styles.pillRow}>
        <View style={[styles.pill, meetsMinimum && styles.pillEarned]}>
          <Text style={[styles.pillText, meetsMinimum && styles.pillTextEarned]}>
            {progressText}
          </Text>
        </View>
      </View>

      {/* Items list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <ActivityIndicator color={colors.stone} style={styles.loader} />
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>
            What's one small thing that made today a little better?
          </Text>
        ) : (
          items.map((item) => (
            <GratitudeItemRow key={item.id} item={item} onDelete={deleteItem} />
          ))
        )}
      </ScrollView>

      {/* Input footer */}
      <View style={styles.footer}>
        {!canAddMore ? (
          <Text style={styles.maxReachedText}>You've added the maximum of 5 for today.</Text>
        ) : (
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="I'm grateful for…"
              placeholderTextColor={colors.stone}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
              editable={!isAdding}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                (!inputText.trim() || isAdding) && styles.addButtonDisabled,
              ]}
              onPress={handleAdd}
              disabled={!inputText.trim() || isAdding}
              activeOpacity={0.75}
            >
              {isAdding ? (
                <ActivityIndicator color={colors.warmWhite} size="small" />
              ) : (
                <Text style={styles.addButtonText}>Add</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    color: colors.amber,
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
  pillRow: {
    paddingHorizontal: spacing.xxxl,
    marginBottom: spacing.lg,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212,149,106,0.12)',
    borderRadius: 10,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  pillEarned: {
    backgroundColor: colors.amberPale,
  },
  pillText: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.stone,
    lineHeight: 12.5 * 1.5,
  },
  pillTextEarned: {
    color: colors.amber,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  loader: {
    marginTop: spacing.xl,
  },
  emptyText: {
    fontFamily: typography.displayItalic,
    fontSize: 15,
    color: colors.stone,
    lineHeight: 15 * 1.6,
    marginTop: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: 40,
    paddingTop: spacing.md,
    backgroundColor: colors.cream,
  },
  maxReachedText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.stone,
    textAlign: 'center',
    opacity: 0.7,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.warmWhite,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontFamily: typography.displayItalic,
    fontSize: 14,
    color: colors.ink,
    ...shadows.subtle,
  },
  addButton: {
    backgroundColor: colors.amber,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    minHeight: 44,
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.warmWhite,
    letterSpacing: 0.02 * 14,
  },
});
