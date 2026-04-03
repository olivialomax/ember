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

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isSubmitting, error, clearError } = useAuth();

  async function handleLogin() {
    if (!email || !password) return;
    await login(email, password);
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
        {/* Wordmark */}
        <View style={styles.header}>
          <Text style={styles.wordmark}>ember</Text>
          <Text style={styles.tagline}>your daily reflection</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>
            Good to see you again. How are you feeling today?
          </Text>

          <View style={styles.fields}>
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
              onSubmitEditing={handleLogin}
              placeholder="••••••••"
              error={error}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, (isSubmitting || !email || !password) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting || !email || !password}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.warmWhite} size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New here?{' '}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.footerLink}>Create an account</Text>
          </TouchableOpacity>
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
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.stone,
  },
  footerLink: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.sage,
  },
});
