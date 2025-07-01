
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ExerciseHistoryData {
  weight: number;
  reps: number;
  lastUsed: string;
}

export const useExerciseHistory = () => {
  const { user } = useAuth();
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, ExerciseHistoryData>>({});

  useEffect(() => {
    if (!user) return;

    const fetchExerciseHistory = async () => {
      try {
        // Get the most recent workout data for each exercise
        const { data: recentSets, error } = await supabase
          .from('workout_sets')
          .select(`
            weight,
            reps,
            workout_exercises!inner(
              name,
              workouts!inner(
                end_time,
                user_id
              )
            )
          `)
          .eq('workout_exercises.workouts.user_id', user.id)
          .not('workout_exercises.workouts.end_time', 'is', null)
          .order('workout_exercises.workouts.end_time', { ascending: false });

        if (error) {
          console.error('Error fetching exercise history:', error);
          return;
        }

        // Process the data to get the most recent weight/reps for each exercise
        const historyMap: Record<string, ExerciseHistoryData> = {};
        
        recentSets?.forEach((set: any) => {
          const exerciseName = set.workout_exercises.name;
          const endTime = set.workout_exercises.workouts.end_time;
          
          if (!historyMap[exerciseName] || new Date(endTime) > new Date(historyMap[exerciseName].lastUsed)) {
            historyMap[exerciseName] = {
              weight: set.weight,
              reps: set.reps,
              lastUsed: endTime
            };
          }
        });

        setExerciseHistory(historyMap);
      } catch (error) {
        console.error('Error in fetchExerciseHistory:', error);
      }
    };

    fetchExerciseHistory();
  }, [user]);

  const getExerciseDefaults = (exerciseName: string) => {
    const history = exerciseHistory[exerciseName];
    return {
      weight: history?.weight || 20,
      reps: history?.reps || 8
    };
  };

  return { getExerciseDefaults };
};
