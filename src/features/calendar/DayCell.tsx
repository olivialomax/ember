import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';
import { FlowLevel } from '../cycle/types';

export interface GridDay {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

// Rose ring border color per flow level — alpha encodes intensity
const FLOW_RING_COLORS: Record<FlowLevel, string> = {
  none: 'transparent',
  spotting: 'rgba(196, 132, 154, 0.30)',
  light: 'rgba(196, 132, 154, 0.50)',
  medium: 'rgba(196, 132, 154, 0.75)',
  heavy: 'rgba(196, 132, 154, 1.00)',
};

const DRINK_DOT_COLORS: Record<'under' | 'at' | 'over', string> = {
  under: colors.sage,
  at: colors.amber,
  over: colors.stressRed,
};

interface DayCellProps {
  day: GridDay;
  isSelected: boolean;
  hasCheckin: boolean;
  flowLevel: FlowLevel | null;
  drinkStatus: 'under' | 'at' | 'over' | null;
  onPress: () => void;
}

export function DayCell({ day, isSelected, hasCheckin, flowLevel, drinkStatus, onPress }: DayCellProps) {
  const ringBorderColor = (flowLevel && flowLevel !== 'none')
    ? FLOW_RING_COLORS[flowLevel]
    : 'transparent';

  const circleStyle = isSelected
    ? styles.circleSelected
    : (day.isToday || hasCheckin)
    ? styles.circleCheckin
    : null;

  const textStyle = isSelected
    ? styles.numberSelected
    : day.isToday
    ? styles.numberToday
    : styles.numberDefault;

  return (
    <TouchableOpacity
      style={[styles.cell, !day.isCurrentMonth && styles.cellOverflow]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.ring, { borderColor: ringBorderColor }]}>
        <View style={[styles.circle, circleStyle]}>
          <Text style={[styles.number, textStyle]}>{day.dayNumber}</Text>
        </View>
      </View>
      <View style={styles.dotRow}>
        {drinkStatus != null && (
          <View style={[styles.dot, { backgroundColor: DRINK_DOT_COLORS[drinkStatus] }]} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  cellOverflow: {
    opacity: 0.35,
  },
  ring: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCheckin: {
    backgroundColor: colors.sagePale,
  },
  circleSelected: {
    backgroundColor: colors.ink,
  },
  number: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    lineHeight: 14,
  },
  numberDefault: {
    color: colors.ink,
  },
  numberToday: {
    color: colors.sage,
  },
  numberSelected: {
    color: colors.warmWhite,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
    height: 5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
