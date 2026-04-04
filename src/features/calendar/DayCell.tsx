import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';

export interface GridDay {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface DayCellProps {
  day: GridDay;
  isSelected: boolean;
  hasCheckin: boolean;
  hasEvent: boolean;
  onPress: () => void;
}

export function DayCell({ day, isSelected, hasCheckin, hasEvent, onPress }: DayCellProps) {
  const circleStyle = isSelected
    ? styles.circleSelected
    : day.isToday
    ? styles.circleToday
    : null;

  const textStyle = isSelected
    ? styles.numberSelected
    : day.isToday
    ? styles.numberToday
    : !day.isCurrentMonth
    ? styles.numberOverflow
    : styles.numberDefault;

  return (
    <TouchableOpacity style={styles.cell} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.circle, circleStyle]}>
        <Text style={[styles.number, textStyle]}>{day.dayNumber}</Text>
      </View>
      <View style={styles.dotRow}>
        {hasCheckin && <View style={[styles.dot, styles.checkinDot]} />}
        {hasEvent && <View style={[styles.dot, styles.eventDot]} />}
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
  circle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleToday: {
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
  numberOverflow: {
    color: colors.stone,
    opacity: 0.35,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
    marginTop: 3,
    height: 5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  checkinDot: {
    backgroundColor: colors.sage,
  },
  eventDot: {
    backgroundColor: colors.amber,
  },
});
