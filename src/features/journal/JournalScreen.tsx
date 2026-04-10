import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';
import { JournalEntryCard } from './JournalEntryCard';
import { useJournal } from './useJournal';
import { colors, radius, shadows, spacing, typography } from '../../tokens';

export function JournalScreen() {
  const {
    draftText,
    setDraftText,
    wordCount,
    handleAdd,
    isAdding,
    todayEntries,
    isLoadingToday,
    groupedHistory,
    isLoadingHistory,
  } = useJournal();

  const today = new Date()
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase();

  const historyDates = Object.keys(groupedHistory);

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

        {/* Today's card */}
        <View style={styles.section}>
          <View style={styles.writeCard}>
            <Text style={styles.cardEyebrow}>Today</Text>

            {/* Existing entries for today */}
            {isLoadingToday ? (
              <ActivityIndicator color={colors.stone} style={styles.loadingInCard} />
            ) : todayEntries.length > 0 ? (
              <View style={styles.todayEntries}>
                {todayEntries.map((entry, index) => (
                  <View key={entry.id}>
                    {index > 0 && <View style={styles.entryDivider} />}
                    <JournalEntryCard entry={entry} maxLines={0} />
                  </View>
                ))}
                <View style={styles.composeDivider} />
              </View>
            ) : null}

            {/* Compose area */}
            <TextInput
              style={styles.input}
              value={draftText}
              onChangeText={setDraftText}
              multiline
              placeholder={todayEntries.length > 0 ? 'Add another thought...' : "What's on your mind?"}
              placeholderTextColor={colors.stone}
              textAlignVertical="top"
              scrollEnabled={false}
            />

            {/* Footer row */}
            <View style={styles.cardFooter}>
              <Text style={styles.wordCount}>
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </Text>
              <TouchableOpacity
                style={[styles.saveButton, (!draftText.trim() || isAdding) && styles.saveButtonDisabled]}
                onPress={handleAdd}
                disabled={!draftText.trim() || isAdding}
                activeOpacity={0.8}
              >
                {isAdding ? (
                  <ActivityIndicator size="small" color={colors.warmWhite} />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Previous entries */}
        {isLoadingHistory ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.stone} />
          </View>
        ) : historyDates.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Previous entries</Text>
            {historyDates.map((date) => (
              <View key={date} style={styles.historyGroup}>
                {groupedHistory[date].map((entry) => (
                  <JournalEntryCard key={entry.id} entry={entry} maxLines={4} />
                ))}
              </View>
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
  loadingInCard: {
    marginBottom: spacing.lg,
  },
  todayEntries: {
    marginBottom: spacing.md,
  },
  entryDivider: {
    height: 1,
    backgroundColor: 'rgba(44,40,37,0.07)',
    marginVertical: spacing.sm,
  },
  composeDivider: {
    height: 1,
    backgroundColor: 'rgba(44,40,37,0.07)',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  input: {
    fontFamily: typography.displayItalic,
    fontSize: 16,
    color: colors.ink,
    lineHeight: 16 * 1.7,
    minHeight: 120,
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
  saveButton: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.35,
  },
  saveButtonText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.warmWhite,
    letterSpacing: 0.02 * 13,
  },
  sectionLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
    marginBottom: spacing.md,
  },
  historyGroup: {
    marginBottom: spacing.sm,
  },
  loadingRow: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});
