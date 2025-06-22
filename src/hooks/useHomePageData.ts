
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Workout, Run, PersonalRecord } from '@/types';
import { Tables } from '@/integrations/supabase/types';
import { subDays, format, isSameWeek, startOfDay, isWithinInterval } from 'date-fns';
import { isHeroCallWorkout } from '@/lib/workoutUtils';

export const useHomePageData = () => {
  const { user } = useAuth();

  const { data: workoutHistory, isLoading: isLoadingWorkouts } = useQuery<Workout[]>({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
        if (!user) return [];
        const { data, error } = await supabase.rpc('get_user_workouts');
        if (error) throw new Error('Failed to fetch workout history.');
        if (!data) return [];
        return (data as any[]).map(workout => ({
            ...workout,
            startTime: new Date(workout.startTime),
            endTime: workout.endTime ? new Date(workout.endTime) : undefined,
        }));
    },
    enabled: !!user,
  });

  const { data: runHistory, isLoading: isLoadingRuns } = useQuery<Run[]>({
      queryKey: ['runs', user?.id],
      queryFn: async () => {
          if (!user) return [];
          const { data, error } = await supabase.from('runs').select('*').order('date', { ascending: false });
          if (error) throw new Error('Failed to fetch run history.');
          if (!data) return [];
          return (data as Tables<'runs'>[]).map(run => ({
              id: run.id,
              distance: run.distance,
              duration: run.duration,
              runType: run.run_type,
              date: new Date(run.date),
              notes: run.notes,
              elevation: run.elevation,
              avgHr: run.avg_hr,
          }));
      },
      enabled: !!user,
  });

  const { data: personalRecords, isLoading: isLoadingPRs } = useQuery<PersonalRecord[]>({
    queryKey: ['personal_records', user?.id],
    queryFn: async () => {
        if (!user) return [];
        const { data, error } = await supabase
            .from('personal_records')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw new Error('Failed to fetch personal records.');
        return data || [];
    },
    enabled: !!user,
  });

  const isLoading = isLoadingWorkouts || isLoadingRuns || isLoadingPRs;

  // Calculate derived data
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
    const workoutDay = startOfDay(workout.startTime);
    const chartEntry = strengthChartData.find(d => d.date.getTime() === workoutDay.getTime());
    
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
    const runDay = startOfDay(run.date);
    const chartEntry = runChartData.find(d => d.date.getTime() === runDay.getTime());
    if (chartEntry) {
      chartEntry.distance += run.distance;
    }
  });

  const totalPRs = personalRecords?.length || 0;

  return {
    workoutHistory,
    runHistory,
    personalRecords,
    isLoading,
    strengthChartData,
    runChartData,
    workoutsThisWeek,
    runsThisWeek,
    totalVolume,
    totalDistance,
    bestPace,
    totalPRs
  };
};
