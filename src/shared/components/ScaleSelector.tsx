import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';

interface ScaleSelectorProps {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  colors: string[];
}

const SCALE_LABELS: Record<number, string> = {
  1: 'Very low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Very high',
};

export function ScaleSelector({ label, value, onChange, colors }: ScaleSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n;
          return (
            <TouchableOpacity
              key={n}
              style={[
                styles.option,
                selected && { backgroundColor: colors[n - 1], borderColor: colors[n - 1] },
              ]}
              onPress={() => onChange(n)}
              activeOpacity={0.7}
              accessibilityLabel={`${label} ${n} — ${SCALE_LABELS[n]}`}
            >
              <Text style={[styles.optionNumber, selected && styles.optionNumberSelected]}>
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.scaleEndLabels}>
        <Text style={styles.endLabel}>Low</Text>
        <Text style={styles.endLabel}>High</Text>
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
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    borderWidth: 1.5,
    borderColor: 'rgba(44,40,37,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionNumber: {
    fontFamily: typography.displayMedium,
    fontSize: 17,
    color: colors.stone,
  },
  optionNumberSelected: {
    color: colors.warmWhite,
  },
  scaleEndLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingHorizontal: 2,
  },
  endLabel: {
    fontFamily: typography.body,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.08 * 9,
    color: colors.stone,
    opacity: 0.6,
  },
});
