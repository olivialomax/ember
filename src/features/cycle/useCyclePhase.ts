import { useMemo } from 'react';
import { colors } from '../../tokens';
import { CyclePhase, CyclePhaseInfo } from './types';

export function useCyclePhase(
  lastPeriodStart: string | null,
  cycleLength: number
): CyclePhaseInfo {
  return useMemo(() => {
    if (!lastPeriodStart) {
      return {
        phase: 'unknown' as CyclePhase,
        label: 'Set up your cycle',
        dayOfCycle: 0,
        daysUntilNext: 0,
        accent: colors.rose,
      };
    }

    const start = new Date(lastPeriodStart + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const dayOfCycle = Math.floor((today.getTime() - start.getTime()) / msPerDay) + 1;

    let phase: CyclePhase;
    let label: string;
    let accent: string;

    if (dayOfCycle <= 5) {
      phase = 'menstrual';
      label = 'Your period';
      accent = colors.rose;
    } else if (dayOfCycle <= 13) {
      phase = 'follicular';
      label = 'Follicular phase';
      accent = colors.sage;
    } else if (dayOfCycle <= 16) {
      phase = 'ovulation';
      label = 'Ovulation window';
      accent = colors.energyGold;
    } else {
      phase = 'luteal';
      label = 'Luteal phase';
      accent = colors.amber;
    }

    const daysUntilNext = Math.max(0, cycleLength - dayOfCycle + 1);

    return { phase, label, dayOfCycle, daysUntilNext, accent };
  }, [lastPeriodStart, cycleLength]);
}
