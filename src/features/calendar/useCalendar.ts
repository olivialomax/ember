import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../auth/useAuthStore';
import { getRecentEntries } from '../../services/entries';
import { getLifeEventsForMonth, addLifeEvent, deleteLifeEvent } from '../../services/lifeEvents';
import { LifeEvent } from '../../types';
import { localDateISO } from '../../shared/utils/date';

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const todayISO = () => localDateISO();

export function useCalendar() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const today = todayISO();

  const now = new Date();
  const [{ year, month }, setYearMonth] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });
  const [selectedDate, setSelectedDate] = useState(today);

  function goToPrevMonth() {
    setYearMonth(({ year, month }) => {
      const newMonth = month === 1 ? 12 : month - 1;
      const newYear = month === 1 ? year - 1 : year;
      setSelectedDate(toISO(newYear, newMonth, 1));
      return { year: newYear, month: newMonth };
    });
  }

  function goToNextMonth() {
    setYearMonth(({ year, month }) => {
      const newMonth = month === 12 ? 1 : month + 1;
      const newYear = month === 12 ? year + 1 : year;
      setSelectedDate(toISO(newYear, newMonth, 1));
      return { year: newYear, month: newMonth };
    });
  }

  // Check-in dots — reuse the same cache key as useStreaks (zero extra network calls)
  const entriesQuery = useQuery({
    queryKey: ['recent-entries', user?.id],
    queryFn: () => getRecentEntries(user!.id, 60),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const eventsQuery = useQuery({
    queryKey: ['life-events-month', user?.id, year, month],
    queryFn: () => getLifeEventsForMonth(user!.id, year, month),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  const checkinDates = new Set((entriesQuery.data ?? []).map((e) => e.date));
  const allEvents = eventsQuery.data ?? [];
  const eventDates = new Set(allEvents.map((e) => e.date));
  const eventsForSelected = allEvents.filter((e) => e.date === selectedDate);

  const addMutation = useMutation({
    mutationFn: ({ title, note }: { title: string; note: string | null }) =>
      addLifeEvent(user!.id, selectedDate, title, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['life-events-month', user?.id, year, month] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLifeEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['life-events-month', user?.id, year, month] });
    },
  });

  return {
    year,
    month,
    selectedDate,
    setSelectedDate,
    goToPrevMonth,
    goToNextMonth,
    checkinDates,
    eventDates,
    eventsForSelected,
    isLoadingEvents: eventsQuery.isLoading,
    addEvent: (title: string, note: string | null) => addMutation.mutate({ title, note }),
    deleteEvent: (id: string) => deleteMutation.mutate(id),
    isAdding: addMutation.isPending,
  };
}
