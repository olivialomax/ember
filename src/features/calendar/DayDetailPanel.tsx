import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../tokens';
import { Entry, GratitudeItem, LifeEvent } from '../../types';
import { MetricTile } from '../../shared/components/MetricTile';
import { formatDateHeading } from '../../shared/utils/date';

interface DayDetailPanelProps {
  selectedDate: string;
  entry: Entry | null;
  events: LifeEvent[];
  gratitudeItems: GratitudeItem[];
  isLoading: boolean;
  onAddEvent: (title: string, note: string | null) => void;
  onDeleteEvent: (id: string) => void;
  isAdding: boolean;
}

export function DayDetailPanel({
  selectedDate,
  entry,
  events,
  gratitudeItems,
  isLoading,
  onAddEvent,
  onDeleteEvent,
  isAdding,
}: DayDetailPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  function handleSave() {
    const title = titleInput.trim();
    if (!title) return;
    onAddEvent(title, noteInput.trim() || null);
    setTitleInput('');
    setNoteInput('');
    setShowForm(false);
  }

  return (
    <View style={styles.panel}>
      {/* Date heading */}
      <Text style={styles.dateHeading}>{formatDateHeading(selectedDate)}</Text>

      {/* CHECK-IN */}
      <View style={styles.divider} />
      <Text style={styles.sectionLabel}>Check-in</Text>

      {isLoading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator color={colors.stone} size="small" />
        </View>
      ) : entry == null ? (
        <Text style={styles.emptyText}>No check-in recorded for this day.</Text>
      ) : (
        <>
          <View style={styles.metricsRow}>
            <MetricTile tracker="mood" value={entry.mood} />
            <MetricTile tracker="energy" value={entry.energy} />
            <MetricTile tracker="stress" value={entry.stress} />
            <MetricTile tracker="movement" value={entry.movement} />
            <MetricTile tracker="drinks" value={entry.drinks} />
          </View>
          {entry.journal_text != null && entry.journal_text.trim().length > 0 && (
            <View style={styles.journalBlock}>
              <Text style={styles.journalLabel}>Journal</Text>
              <Text style={styles.journalText}>{entry.journal_text}</Text>
            </View>
          )}
        </>
      )}

      {/* EVENTS */}
      <View style={styles.divider} />
      <Text style={styles.sectionLabel}>Events</Text>

      {events.map((event) => (
        <View key={event.id} style={styles.eventRow}>
          <View style={styles.accentBar} />
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            {event.note != null && event.note.length > 0 && (
              <Text style={styles.eventNote}>{event.note}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDeleteEvent(event.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      {events.length === 0 && !showForm && (
        <Text style={styles.emptyText}>Nothing noted for this day.</Text>
      )}

      {showForm ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.titleInput}
            placeholder="What happened?"
            placeholderTextColor={colors.stone}
            value={titleInput}
            onChangeText={setTitleInput}
            maxLength={80}
            autoFocus
          />
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note… (optional)"
            placeholderTextColor={colors.stone}
            value={noteInput}
            onChangeText={setNoteInput}
            multiline
            maxLength={300}
          />
          <View style={styles.formActions}>
            <TouchableOpacity
              onPress={() => {
                setShowForm(false);
                setTitleInput('');
                setNoteInput('');
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, (!titleInput.trim() || isAdding) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!titleInput.trim() || isAdding}
              activeOpacity={0.75}
            >
              {isAdding ? (
                <ActivityIndicator color={colors.warmWhite} size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addEventButton}
          onPress={() => setShowForm(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.addEventText}>+ Add an event</Text>
        </TouchableOpacity>
      )}

      {/* GRATITUDE */}
      <View style={styles.divider} />
      <Text style={styles.sectionLabel}>Gratitude</Text>

      {gratitudeItems.length === 0 ? (
        <Text style={styles.emptyText}>No gratitude items for this day.</Text>
      ) : (
        gratitudeItems.map((item) => (
          <View key={item.id} style={styles.gratitudeRow}>
            <View style={styles.accentBar} />
            <Text style={styles.gratitudeText}>{item.content}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    ...shadows.card,
  },
  dateHeading: {
    fontFamily: typography.display,
    fontSize: 17,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(44,40,37,0.06)',
    marginVertical: spacing.lg,
  },
  sectionLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: colors.stone,
    marginBottom: spacing.md,
  },
  loadingWrapper: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  emptyText: {
    fontFamily: typography.displayItalic,
    fontSize: 13,
    color: colors.stone,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  journalBlock: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  journalLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: colors.stone,
    marginBottom: spacing.xs,
  },
  journalText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSoft,
    fontStyle: 'italic',
    lineHeight: 13 * 1.5,
  },
  // Events
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.amberPale,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  accentBar: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: colors.amber,
  },
  eventContent: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  eventTitle: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.ink,
  },
  eventNote: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.stone,
    fontStyle: 'italic',
    marginTop: 2,
    lineHeight: 12 * 1.5,
  },
  deleteBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.stone,
    opacity: 0.6,
  },
  addForm: {
    marginTop: spacing.sm,
  },
  titleInput: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  noteInput: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSoft,
    fontStyle: 'italic',
    minHeight: 64,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  formActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.lg,
  },
  cancelText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.stone,
  },
  saveButton: {
    backgroundColor: colors.amber,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    minHeight: 36,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.warmWhite,
    letterSpacing: 0.02 * 14,
  },
  addEventButton: {
    borderWidth: 1,
    borderColor: colors.amber,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addEventText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.amber,
  },
  // Gratitude
  gratitudeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.amberPale,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  gratitudeText: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSoft,
    fontStyle: 'italic',
    lineHeight: 13 * 1.5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
});
