import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';

interface EmberInputProps extends TextInputProps {
  label: string;
  error?: string | null;
  secureToggle?: boolean;
}

export function EmberInput({ label, error, secureToggle, style, ...props }: EmberInputProps) {
  const [revealed, setRevealed] = useState(false);
  const isSecure = secureToggle && !revealed;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, !!error && styles.inputRowError]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.stone}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {secureToggle && (
          <TouchableOpacity
            onPress={() => setRevealed((r) => !r)}
            style={styles.revealButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.revealText}>{revealed ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14,
    color: colors.stone,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(44, 40, 37, 0.1)',
    paddingHorizontal: spacing.md,
  },
  inputRowError: {
    borderColor: colors.stressRed,
  },
  input: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: spacing.md,
  },
  revealButton: {
    paddingLeft: spacing.sm,
  },
  revealText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.stone,
  },
  error: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.stressRed,
    marginTop: spacing.xs,
  },
});
