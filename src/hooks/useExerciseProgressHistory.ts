import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ExerciseSession {
  date: string;
  volume: number; // total weight × reps
  estimated1RM: number;
  totalSets: number;
  maxWeight: number;
  maxReps: number;
}

// Epley formula for estimated 1RM: weight × (1 + reps/30)
const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 0 || weight === 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

export const useExerciseProgressHistory = (exerciseName: string) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ExerciseSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !exerciseName) {
      setIsLoading(false);
      return;
    }

    const fetchExerciseProgress = async () => {
      setIsLoading(true);
      try {
        // Fetch all completed workouts with this exercise
        const { data: workouts, error } = await supabase
          .from('workouts')
          .select(`
            id,
            end_time,
            workout_exercises!inner (
              id,
              name,
              workout_sets (
                weight,
                reps,
                completed
              )
            )
          `)
          .eq('user_id', user.id)
          .not('end_time', 'is', null)
          .order('end_time', { ascending: true });

        if (error) {
          console.error('Error fetching exercise progress:', error);
          setIsLoading(false);
          return;
        }

        // Filter and process workouts containing this exercise
        const exerciseSessions: ExerciseSession[] = [];

        workouts?.forEach((workout) => {
          const matchingExercises = workout.workout_exercises.filter(
            (ex) => ex.name.toLowerCase() === exerciseName.toLowerCase()
          );

          if (matchingExercises.length === 0) return;

          let totalVolume = 0;
          let maxEstimated1RM = 0;
          let totalSets = 0;
          let maxWeight = 0;
          let maxReps = 0;

          matchingExercises.forEach((exercise) => {
            exercise.workout_sets?.forEach((set) => {
              if (set.completed && set.weight > 0) {
                const setVolume = set.weight * set.reps;
                totalVolume += setVolume;
                totalSets++;

                const estimated1RM = calculate1RM(set.weight, set.reps);
                if (estimated1RM > maxEstimated1RM) {
                  maxEstimated1RM = estimated1RM;
                }

                if (set.weight > maxWeight) {
                  maxWeight = set.weight;
                }
                if (set.reps > maxReps) {
                  maxReps = set.reps;
                }
              }
            });
          });

          if (totalSets > 0) {
            exerciseSessions.push({
              date: workout.end_time!,
              volume: totalVolume,
              estimated1RM: Math.round(maxEstimated1RM * 10) / 10,
              totalSets,
              maxWeight,
              maxReps,
            });
          }
        });

        setSessions(exerciseSessions);
      } catch (error) {
        console.error('Error in fetchExerciseProgress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExerciseProgress();
  }, [user, exerciseName]);

  return { sessions, isLoading };
};
