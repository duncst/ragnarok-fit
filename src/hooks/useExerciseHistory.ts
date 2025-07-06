
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ExerciseHistoryData {
  weight: number;
  reps: number;
  duration: number;
  distance: number;
  lastUsed: string;
}

export const useExerciseHistory = () => {
  const { user } = useAuth();
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, ExerciseHistoryData>>({});

  useEffect(() => {
    if (!user) return;

    const fetchExerciseHistory = async () => {
      try {
        // Get list of unique exercise names from recent workouts
        const { data: exercises, error: exercisesError } = await supabase
          .from('workout_exercises')
          .select(`
            name,
            workouts!inner(user_id, end_time)
          `)
          .eq('workouts.user_id', user.id)
          .not('workouts.end_time', 'is', null);

        if (exercisesError) {
          console.error('Error fetching exercises:', exercisesError);
          return;
        }

        // Get unique exercise names
        const uniqueExercises = [...new Set(exercises?.map(ex => ex.name) || [])];
        
        // Fetch last data for each exercise using the new function
        const historyMap: Record<string, ExerciseHistoryData> = {};
        
        for (const exerciseName of uniqueExercises) {
          const { data: lastData, error } = await supabase
            .rpc('get_last_exercise_data', { p_exercise_name: exerciseName });

          if (error) {
            console.error(`Error fetching data for ${exerciseName}:`, error);
            continue;
          }

          if (lastData && lastData.length > 0) {
            const data = lastData[0];
            historyMap[exerciseName] = {
              weight: data.last_weight || 0,
              reps: data.last_reps || 0,
              duration: data.last_duration || 0,
              distance: data.last_distance || 0,
              lastUsed: data.last_used || ''
            };
          }
        }

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
      reps: history?.reps || 8,
      duration: history?.duration || 0,
      distance: history?.distance || 0
    };
  };

  const getExercisePrevious = (exerciseName: string) => {
    const history = exerciseHistory[exerciseName];
    if (!history) return null;
    
    return {
      weight: history.weight,
      reps: history.reps,
      duration: history.duration,
      distance: history.distance,
      lastUsed: history.lastUsed
    };
  };

  return { getExerciseDefaults, getExercisePrevious };
};
