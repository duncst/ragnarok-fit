
import { subDays, format, isSameWeek, startOfDay, isWithinInterval, isSameDay } from 'date-fns';
import { isHeroCallWorkout } from '@/lib/workoutUtils';
import type { Workout, Run } from '@/types';

export const useAnalyticsData = (workoutHistory?: Workout[], runHistory?: Run[]) => {
  const today = new Date();
  const last7DaysInterval = { start: startOfDay(subDays(today, 6)), end: new Date() };

  // Strength Stats - include Hero's Call workouts
  const workoutsThisWeek = workoutHistory?.filter(w => isSameWeek(w.startTime, today, { weekStartsOn: 1 })).length || 0;
  
  const totalVolume = workoutHistory?.reduce((total, workout) => {
    // For Hero's Call workouts, we don't have traditional sets/reps/weight data
    // So we only count regular workouts for volume calculation
    if (isHeroCallWorkout(workout.name || '')) {
      return total;
    }
    
    return total + workout.exercises.reduce((workoutTotal, exercise) => {
      return workoutTotal + exercise.sets.reduce((exerciseTotal, set) => {
        return exerciseTotal + (set.completed ? set.reps * set.weight : 0);
      }, 0);
    }, 0);
  }, 0) || 0;

  const strengthChartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    return { day: format(date, 'E'), volume: 0, date: startOfDay(date) };
  });

  workoutHistory?.filter(w => isWithinInterval(w.startTime, last7DaysInterval)).forEach(workout => {
    const chartEntry = strengthChartData.find(d => isSameDay(d.date, workout.startTime));
    
    if (chartEntry) {
      // For Hero's Call workouts, add a nominal volume to show activity on the chart
      if (isHeroCallWorkout(workout.name || '')) {
        chartEntry.volume += 100; // Add a base value for Hero's Call completion
      } else {
        const workoutVolume = workout.exercises.reduce((acc, ex) => 
          acc + ex.sets.reduce((setAcc, set) => setAcc + (set.completed ? set.reps * set.weight : 0), 0), 0);
        chartEntry.volume += workoutVolume;
      }
    }
  });
  
  // Running Stats
  const runsThisWeek = runHistory?.filter(r => isSameWeek(r.date, today, { weekStartsOn: 1 })).length || 0;
  const totalDistance = runHistory?.reduce((total, run) => total + run.distance, 0) || 0;
  
  const bestPace = runHistory && runHistory.length > 0
    ? Math.min(...runHistory.map(r => r.distance > 0 ? (r.duration / 60) / r.distance : Infinity).filter(p => !isNaN(p) && isFinite(p)))
    : 0;

  const runChartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    return { day: format(date, 'E'), distance: 0, date: startOfDay(date) };
  });
  
  runHistory?.filter(r => isWithinInterval(r.date, last7DaysInterval)).forEach(run => {
    const chartEntry = runChartData.find(d => isSameDay(d.date, run.date));
    if (chartEntry) {
      chartEntry.distance += run.distance;
    }
  });

  return {
    strengthChartData,
    runChartData,
    workoutsThisWeek,
    runsThisWeek,
    totalVolume,
    totalDistance,
    bestPace
  };
};
