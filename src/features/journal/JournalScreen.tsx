import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';
import { JournalEntryCard } from './JournalEntryCard';
import { useJournal } from './useJournal';
import { colors, radius, shadows, spacing, typography } from '../../tokens';

export function JournalScreen() {
  const { localText, handleTextChange, wordCount, isSaving, pastEntries, isLoadingPast } =
    useJournal();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Small delay so the tab transition settles before focusing
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const today = new Date()
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase();

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Journal</Text>
          <Text style={styles.heading}>
            Write it{' '}
            <Text style={styles.headingAccent}>out.</Text>
          </Text>
          <Text style={styles.dateLabel}>{today}</Text>
        </View>

        {/* Today's write card */}
        <View style={styles.section}>
          <View style={styles.writeCard}>
            <Text style={styles.cardEyebrow}>Today</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={localText}
              onChangeText={handleTextChange}
              multiline
              placeholder="What's on your mind?"
              placeholderTextColor={colors.stone}
              textAlignVertical="top"
              scrollEnabled={false}
            />
            {/* Footer row */}
            <View style={styles.cardFooter}>
              <Text style={styles.wordCount}>
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </Text>
              {isSaving && (
                <ActivityIndicator size="small" color={colors.sageLight} />
              )}
              {!isSaving && localText.length > 0 && (
                <Text style={styles.savedLabel}>Saved</Text>
              )}
            </View>
          </View>
        </View>

        {/* Past entries */}
        {isLoadingPast ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.stone} />
          </View>
        ) : pastEntries.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Previous entries</Text>
            {pastEntries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </View>
        ) : null}
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
    fontSize: 26,
    color: colors.sage,
  },
  dateLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.12 * 11,
    color: colors.stone,
    marginTop: spacing.xs,
  },
  section: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  writeCard: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    padding: spacing.xxl,
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
  input: {
    fontFamily: typography.displayItalic,
    fontSize: 16,
    color: colors.ink,
    lineHeight: 16 * 1.7,
    minHeight: 160,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44,40,37,0.07)',
  },
  wordCount: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.stone,
    opacity: 0.7,
  },
  savedLabel: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.sage,
    opacity: 0.8,
  },
  sectionLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
    marginBottom: spacing.md,
  },
  loadingRow: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});
