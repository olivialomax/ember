import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  TextInput,
  Switch,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';
import { useAuth } from '../auth/useAuth';
import { useAuthStore } from '../auth/useAuthStore';
import { useProfileStore } from '../profile';
import { useNotificationStore } from '../notifications';
import { requestPermission, scheduleDaily, cancelReminder } from '../../services/notifications';
import { colors, radius, shadows, spacing, typography } from '../../tokens';

// Preset reminder times: 7am–10pm hourly
const REMINDER_TIMES: { hour: number; minute: number; label: string }[] = Array.from(
  { length: 16 },
  (_, i) => {
    const hour = i + 7;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const display = hour <= 12 ? hour : hour - 12;
    return { hour, minute: 0, label: `${display}:00 ${ampm}` };
  }
);

const AVATAR_OPTIONS = [
  '🌿', '🌸', '🌻', '🍃', '✨', '🌙',
  '☀️', '🌾', '🦋', '🌊', '🍀', '🌺',
  '🌱', '🫧', '🕊️', '🐚', '🌼', '🍂',
  '🦔', '🐝', '🌛', '🌬️', '🍵', '🪷',
];

export function SettingsScreen() {
  const { logout, updateDisplayName, isSubmitting, error } = useAuth();
  const { user } = useAuthStore();
  const { avatar, setAvatar } = useProfileStore();

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'You';
  const email = user?.email ?? '';

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(displayName);

  function handleEditName() {
    setNameValue(displayName);
    setEditingName(true);
  }

  async function handleSaveName() {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === displayName) {
      setEditingName(false);
      return;
    }
    await updateDisplayName(trimmed);
    setEditingName(false);
  }

  function handleCancelName() {
    setEditingName(false);
    setNameValue(displayName);
  }

  const { enabled: notifEnabled, hour, minute, setEnabled, setTime } = useNotificationStore();
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  async function handleToggleNotifications(val: boolean) {
    if (val) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permission needed',
          'To receive reminders, please enable notifications for Ember in your device Settings.',
          [{ text: 'OK' }]
        );
        return;
      }
      await scheduleDaily(hour, minute);
    } else {
      await cancelReminder();
    }
    setEnabled(val);
  }

  async function handleSelectTime(h: number, m: number) {
    setTime(h, m);
    setTimePickerVisible(false);
    if (notifEnabled) {
      await scheduleDaily(h, m);
    }
  }

  function formatTime(h: number, m: number): string {
    const ampm = h < 12 ? 'AM' : 'PM';
    const display = h === 0 ? 12 : h <= 12 ? h : h - 12;
    return `${display}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  function handleLogout() {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: logout },
      ]
    );
  }

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Settings</Text>
        <Text style={styles.heading}>Your account</Text>
      </View>

      {/* Profile card */}
      <View style={styles.section}>
        <View style={styles.card}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </View>
          <View style={styles.profileText}>
            {editingName ? (
              <View style={styles.nameEditRow}>
                <TextInput
                  style={styles.nameInput}
                  value={nameValue}
                  onChangeText={setNameValue}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                  maxLength={40}
                  selectTextOnFocus
                />
                <View style={styles.nameActions}>
                  <TouchableOpacity onPress={handleSaveName} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color={colors.sage} />
                    ) : (
                      <Text style={styles.nameSave}>Save</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCancelName}>
                    <Text style={styles.nameCancel}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={handleEditName} activeOpacity={0.7}>
                <View style={styles.nameRow}>
                  <Text style={styles.displayName}>{displayName}</Text>
                  <Text style={styles.nameEditHint}>Edit</Text>
                </View>
              </TouchableOpacity>
            )}
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
      </View>

      {/* Avatar picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Your icon</Text>
        <View style={styles.pickerCard}>
          <FlatList
            data={AVATAR_OPTIONS}
            keyExtractor={(item) => item}
            numColumns={6}
            scrollEnabled={false}
            columnWrapperStyle={styles.pickerRow}
            contentContainerStyle={styles.pickerGrid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  item === avatar && styles.pickerOptionSelected,
                ]}
                onPress={() => setAvatar(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.pickerEmoji}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Reminders */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Reminders</Text>
        <View style={styles.actionList}>
          <View style={styles.reminderRow}>
            <Text style={styles.reminderLabel}>Daily check-in reminder</Text>
            <Switch
              value={notifEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.cream, true: colors.sageLight }}
              thumbColor={notifEnabled ? colors.sage : colors.stone}
            />
          </View>
          {notifEnabled && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.reminderRow}
                onPress={() => setTimePickerVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.reminderLabel}>Remind me at</Text>
                <Text style={styles.reminderTimeValue}>{formatTime(hour, minute)}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Time picker modal */}
      <Modal
        visible={timePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setTimePickerVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.timePickerSheet}>
                <View style={styles.timePickerHandle} />
                <Text style={styles.timePickerTitle}>Choose a time</Text>
                <ScrollView
                  style={styles.timePickerScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {REMINDER_TIMES.map((t) => {
                    const selected = t.hour === hour && t.minute === minute;
                    return (
                      <TouchableOpacity
                        key={t.label}
                        style={[styles.timeOption, selected && styles.timeOptionSelected]}
                        onPress={() => handleSelectTime(t.hour, t.minute)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.timeOptionText, selected && styles.timeOptionTextSelected]}>
                          {t.label}
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

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.actionList}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isSubmitting}
            activeOpacity={0.75}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.stressRed} size="small" />
            ) : (
              <Text style={styles.logoutText}>Sign out</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Error */}
      {error != null && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 52,
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
  section: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    ...shadows.card,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.sagePale,
    borderWidth: 2,
    borderColor: colors.sageLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  pickerCard: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.subtle,
  },
  pickerGrid: {
    gap: spacing.sm,
  },
  pickerRow: {
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  pickerOption: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.cream,
  },
  pickerOptionSelected: {
    backgroundColor: colors.sagePale,
    borderWidth: 2,
    borderColor: colors.sageLight,
  },
  pickerEmoji: {
    fontSize: 24,
  },
  profileText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  displayName: {
    fontFamily: typography.displayMedium,
    fontSize: 17,
    color: colors.ink,
  },
  nameEditHint: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.stone,
    opacity: 0.7,
  },
  nameEditRow: {
    gap: spacing.xs,
  },
  nameInput: {
    fontFamily: typography.displayMedium,
    fontSize: 17,
    color: colors.ink,
    borderBottomWidth: 1,
    borderBottomColor: colors.sageLight,
    paddingBottom: 2,
    paddingTop: 0,
  },
  nameActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  nameSave: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.sage,
  },
  nameCancel: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.stone,
  },
  email: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.stone,
    marginTop: 2,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
  },
  reminderLabel: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.ink,
  },
  reminderTimeValue: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.sage,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cream,
    marginHorizontal: spacing.xl,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(44,40,37,0.35)',
    justifyContent: 'flex-end',
  },
  timePickerSheet: {
    backgroundColor: colors.warmWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.md,
    paddingBottom: 40,
    maxHeight: '60%',
    ...shadows.card,
  },
  timePickerHandle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.stone,
    opacity: 0.2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  timePickerTitle: {
    fontFamily: typography.display,
    fontSize: 20,
    color: colors.ink,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  timePickerScroll: {
    paddingHorizontal: spacing.xl,
  },
  timeOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  timeOptionSelected: {
    backgroundColor: colors.sagePale,
  },
  timeOptionText: {
    fontFamily: typography.body,
    fontSize: 16,
    color: colors.inkSoft,
  },
  timeOptionTextSelected: {
    fontFamily: typography.bodyMedium,
    color: colors.sage,
  },
  actionList: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.subtle,
  },
  logoutButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  logoutText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.stressRed,
    letterSpacing: 0.02 * 14,
  },
  errorContainer: {
    marginHorizontal: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.amberPale,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.amber,
  },
  errorText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSoft,
  },
});
