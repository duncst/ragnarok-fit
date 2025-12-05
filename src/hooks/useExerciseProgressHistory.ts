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

interface BodyweightRecord {
  date: string;
  weight: number;
}

// Bodyweight exercises that should use user's bodyweight
const BODYWEIGHT_EXERCISES = [
  'pull-ups',
  'chin-ups',
  'dips',
  'push-ups',
  'muscle-ups',
  'pike push-ups',
  'handstand push-ups',
  'inverted rows',
  'hanging leg raises',
  'body rows',
];

const isBodyweightExercise = (exerciseName: string): boolean => {
  return BODYWEIGHT_EXERCISES.some(
    (bw) => exerciseName.toLowerCase().includes(bw.toLowerCase()) ||
            bw.toLowerCase().includes(exerciseName.toLowerCase())
  );
};

// Epley formula for estimated 1RM: weight × (1 + reps/30)
const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 0 || weight === 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

// Find the closest bodyweight record to a given date
const getBodyweightForDate = (
  date: string,
  bodyweightRecords: BodyweightRecord[]
): number => {
  if (bodyweightRecords.length === 0) return 0;
  
  const targetDate = new Date(date).getTime();
  let closest = bodyweightRecords[0];
  let closestDiff = Math.abs(new Date(closest.date).getTime() - targetDate);
  
  for (const record of bodyweightRecords) {
    const diff = Math.abs(new Date(record.date).getTime() - targetDate);
    if (diff < closestDiff) {
      closest = record;
      closestDiff = diff;
    }
  }
  
  return closest.weight;
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
        const isBodyweight = isBodyweightExercise(exerciseName);
        
        // Fetch bodyweight records if this is a bodyweight exercise
        let bodyweightRecords: BodyweightRecord[] = [];
        if (isBodyweight) {
          const { data: metrics } = await supabase
            .from('body_metrics')
            .select('date, weight')
            .not('weight', 'is', null)
            .order('date', { ascending: true });
          
          bodyweightRecords = (metrics || [])
            .filter((m) => m.weight !== null)
            .map((m) => ({ date: m.date, weight: m.weight as number }));
        }

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

          // Get bodyweight for this workout date
          const workoutBodyweight = isBodyweight
            ? getBodyweightForDate(workout.end_time!, bodyweightRecords)
            : 0;

          let totalVolume = 0;
          let maxEstimated1RM = 0;
          let totalSets = 0;
          let maxWeight = 0;
          let maxReps = 0;

          matchingExercises.forEach((exercise) => {
            exercise.workout_sets?.forEach((set) => {
              if (set.completed && set.reps > 0) {
                // For bodyweight exercises, use bodyweight + any additional weight
                const effectiveWeight = isBodyweight
                  ? workoutBodyweight + (set.weight || 0)
                  : set.weight;
                
                if (effectiveWeight > 0) {
                  const setVolume = effectiveWeight * set.reps;
                  totalVolume += setVolume;
                  totalSets++;

                  const estimated1RM = calculate1RM(effectiveWeight, set.reps);
                  if (estimated1RM > maxEstimated1RM) {
                    maxEstimated1RM = estimated1RM;
                  }

                  if (effectiveWeight > maxWeight) {
                    maxWeight = effectiveWeight;
                  }
                  if (set.reps > maxReps) {
                    maxReps = set.reps;
                  }
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
