import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';
import { FadeUpSection } from '../../shared/components/FadeUpSection';
import { CalendarGrid } from './CalendarGrid';
import { DayDetailPanel } from './DayDetailPanel';
import { useCalendar } from './useCalendar';
import { useProfile } from '../profile';
import { colors, spacing } from '../../tokens';

export function CalendarScreen() {
  const {
    year,
    month,
    selectedDate,
    setSelectedDate,
    goToPrevMonth,
    goToNextMonth,
    entriesData,
    checkinDates,
    eventDates,
    cycleLogs,
    entryForSelected,
    eventsForSelected,
    gratitudeForSelected,
    isLoadingDayDetail,
    addEvent,
    deleteEvent,
    isAdding,
  } = useCalendar();

  const { profile } = useProfile();

  const drinkStatusDates: Record<string, 'under' | 'at' | 'over'> = {};
  if (profile?.drink_limits_weekly) {
    for (const entry of entriesData) {
      if (entry.drinks == null) continue;
      const dow = String(new Date(entry.date + 'T00:00:00').getDay());
      const limit = profile.drink_limits_weekly[dow];
      if (limit == null) continue;
      if (entry.drinks < limit) drinkStatusDates[entry.date] = 'under';
      else if (entry.drinks === limit) drinkStatusDates[entry.date] = 'at';
      else drinkStatusDates[entry.date] = 'over';
    }
  }

  const selectedDow = String(new Date(selectedDate + 'T00:00:00').getDay());
  const drinkGoalForSelected = profile?.drink_limits_weekly?.[selectedDow] ?? null;

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <FadeUpSection delay={0}>
          <View style={styles.section}>
            <CalendarGrid
              year={year}
              month={month}
              selectedDate={selectedDate}
              checkinDates={checkinDates}
              cycleLogs={cycleLogs}
              drinkStatusDates={drinkStatusDates}
              onSelectDate={setSelectedDate}
              onPrevMonth={goToPrevMonth}
              onNextMonth={goToNextMonth}
            />
          </View>
        </FadeUpSection>

        <FadeUpSection delay={100}>
          <View style={styles.detailSection}>
            <DayDetailPanel
              selectedDate={selectedDate}
              entry={entryForSelected}
              events={eventsForSelected}
              gratitudeItems={gratitudeForSelected}
              isLoading={isLoadingDayDetail}
              onAddEvent={addEvent}
              onDeleteEvent={deleteEvent}
              isAdding={isAdding}
              drinkGoal={drinkGoalForSelected}
            />
          </View>
        </FadeUpSection>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: spacing.xxl,
    paddingBottom: 90,
  },
  section: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.warmWhite,
    borderRadius: 24,
    padding: spacing.xxl,
    shadowColor: '#2C2825',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  detailSection: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
});
