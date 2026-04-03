import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing, typography, shadows } from '../../tokens';
import { EmberInput } from '../../shared/components/EmberInput';
import { useAuth } from './useAuth';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function SignupScreen({ navigation }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const { register, isSubmitting, error, clearError } = useAuth();

  async function handleSignup() {
    if (!email || !password || !displayName) return;
    await register(email, password, displayName);
    // If no error thrown, show confirmation nudge
    if (!error) setDone(true);
  }

  if (done) {
    return (
      <View style={styles.root}>
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmEmoji}>✉️</Text>
          <Text style={styles.confirmTitle}>Check your inbox</Text>
          <Text style={styles.confirmBody}>
            We've sent a confirmation link to{'\n'}
            <Text style={styles.confirmEmail}>{email}</Text>
            {'\n\n'}Once confirmed, come back and sign in.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Back to sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back link */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.backText}>← Sign in</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.wordmark}>ember</Text>
          <Text style={styles.tagline}>your daily reflection</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Start your journey</Text>
          <Text style={styles.cardSubtitle}>
            A few details to get you set up. No pressure — you can always update these later.
          </Text>

          <View style={styles.fields}>
            <EmberInput
              label="Your name"
              value={displayName}
              onChangeText={(t) => { clearError(); setDisplayName(t); }}
              returnKeyType="next"
              placeholder="What should we call you?"
              autoCapitalize="words"
            />
            <EmberInput
              label="Email"
              value={email}
              onChangeText={(t) => { clearError(); setEmail(t); }}
              keyboardType="email-address"
              returnKeyType="next"
              placeholder="you@example.com"
            />
            <EmberInput
              label="Password"
              value={password}
              onChangeText={(t) => { clearError(); setPassword(t); }}
              secureToggle
              returnKeyType="done"
              onSubmitEditing={handleSignup}
              placeholder="At least 6 characters"
              error={error}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (isSubmitting || !email || !password || !displayName) && styles.buttonDisabled,
            ]}
            onPress={handleSignup}
            disabled={isSubmitting || !email || !password || !displayName}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.warmWhite} size="small" />
            ) : (
              <Text style={styles.buttonText}>Create account</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing you agree to Ember's{' '}
            <Text style={styles.termsLink}>Terms</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backRow: {
    marginBottom: spacing.xl,
  },
  backText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.stone,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  wordmark: {
    fontFamily: typography.displayItalic,
    fontSize: 42,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: typography.body,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.12,
    color: colors.stone,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    ...shadows.card,
  },
  cardTitle: {
    fontFamily: typography.display,
    fontSize: 22,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.stone,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  fields: {
    marginBottom: spacing.sm,
  },
  button: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.warmWhite,
    letterSpacing: 0.02 * 14,
  },
  terms: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.stone,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 16,
  },
  termsLink: {
    color: colors.inkSoft,
  },
  // Confirmation state
  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  confirmEmoji: {
    fontSize: 48,
    marginBottom: spacing.xl,
  },
  confirmTitle: {
    fontFamily: typography.display,
    fontSize: 24,
    color: colors.ink,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  confirmBody: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.stone,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  confirmEmail: {
    fontFamily: typography.bodyMedium,
    color: colors.inkSoft,
  },
});
