import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';

interface StepperInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export function StepperInput({ label, value, onChange, min, max, step, unit }: StepperInputProps) {
  const atMin = value <= min;
  const atMax = value >= max;

  function decrement() {
    if (!atMin) onChange(Math.max(min, value - step));
  }

  function increment() {
    if (!atMax) onChange(Math.min(max, value + step));
  }

  const displayValue = unit ? `${value} ${unit}` : String(value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, atMin && styles.buttonDisabled]}
          onPress={decrement}
          disabled={atMin}
          activeOpacity={0.7}
          accessibilityLabel={`Decrease ${label}`}
        >
          <Text style={[styles.buttonText, atMin && styles.buttonTextDisabled]}>−</Text>
        </TouchableOpacity>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{displayValue}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, atMax && styles.buttonDisabled]}
          onPress={increment}
          disabled={atMax}
          activeOpacity={0.7}
          accessibilityLabel={`Increase ${label}`}
        >
          <Text style={[styles.buttonText, atMax && styles.buttonTextDisabled]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.14 * 10,
    color: colors.stone,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    borderWidth: 1.5,
    borderColor: 'rgba(44,40,37,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontFamily: typography.display,
    fontSize: 22,
    color: colors.ink,
    lineHeight: 26,
  },
  buttonTextDisabled: {
    color: colors.stone,
  },
  valueContainer: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontFamily: typography.displayMedium,
    fontSize: 20,
    color: colors.ink,
    lineHeight: 20,
  },
});
