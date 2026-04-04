import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../tokens';
import { DayCell, GridDay } from './DayCell';
import { localDateISO } from '../../shared/utils/date';

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: string;
  checkinDates: Set<string>;
  eventDates: Set<string>;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function buildGrid(year: number, month: number): GridDay[] {
  const todayStr = localDateISO();
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayRaw = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const firstDayMon = (firstDayRaw + 6) % 7; // Mon=0 … Sun=6

  const grid: GridDay[] = [];

  // Leading overflow from previous month
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
  for (let i = firstDayMon - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const date = toISO(prevYear, prevMonth, d);
    grid.push({ date, dayNumber: d, isCurrentMonth: false, isToday: date === todayStr });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = toISO(year, month, d);
    grid.push({ date, dayNumber: d, isCurrentMonth: true, isToday: date === todayStr });
  }

  // Trailing overflow to complete rows of 7
  const trailing = (7 - (grid.length % 7)) % 7;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  for (let d = 1; d <= trailing; d++) {
    const date = toISO(nextYear, nextMonth, d);
    grid.push({ date, dayNumber: d, isCurrentMonth: false, isToday: date === todayStr });
  }

  return grid;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarGrid({
  year,
  month,
  selectedDate,
  checkinDates,
  eventDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  const weeks = chunk(buildGrid(year, month), 7);

  return (
    <View>
      {/* Month navigation header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onPrevMonth}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.arrow}
        >
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{monthLabel}</Text>
        <TouchableOpacity
          onPress={onNextMonth}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.arrow}
        >
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Weekday labels */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((d) => (
          <Text key={d} style={styles.weekdayLabel}>{d}</Text>
        ))}
      </View>

      {/* Day rows */}
      {weeks.map((week, i) => (
        <View key={i} style={styles.weekRow}>
          {week.map((day) => (
            <DayCell
              key={day.date}
              day={day}
              isSelected={day.date === selectedDate}
              hasCheckin={checkinDates.has(day.date)}
              hasEvent={eventDates.has(day.date)}
              onPress={() => onSelectDate(day.date)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  arrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontFamily: typography.display,
    fontSize: 24,
    color: colors.ink,
    lineHeight: 28,
  },
  monthTitle: {
    fontFamily: typography.display,
    fontSize: 17,
    color: colors.ink,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekdayLabel: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.06 * 9,
    color: colors.stone,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
  },
});
