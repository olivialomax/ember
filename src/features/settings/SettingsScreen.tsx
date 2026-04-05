import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';
import { useAuth } from '../auth/useAuth';
import { useAuthStore } from '../auth/useAuthStore';
import { useProfileStore } from '../profile';
import { colors, radius, shadows, spacing, typography } from '../../tokens';

const AVATAR_OPTIONS = [
  '🌿', '🌸', '🌻', '🍃', '✨', '🌙',
  '☀️', '🌾', '🦋', '🌊', '🍀', '🌺',
  '🌱', '🫧', '🕊️', '🐚', '🌼', '🍂',
  '🦔', '🐝', '🌛', '🌬️', '🍵', '🪷',
];

export function SettingsScreen() {
  const { logout, isSubmitting, error } = useAuth();
  const { user } = useAuthStore();
  const { avatar, setAvatar } = useProfileStore();

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'You';
  const email = user?.email ?? '';

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
            <Text style={styles.displayName}>{displayName}</Text>
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
  displayName: {
    fontFamily: typography.displayMedium,
    fontSize: 17,
    color: colors.ink,
  },
  email: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.stone,
    marginTop: 2,
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
