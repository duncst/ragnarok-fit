
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";
import type { Exercise, WorkoutSet } from '@/types';

const MAJOR_LIFTS = [
  'bench press',
  'bent over row',
  'squat',
  'deadlift',
  'pullups'
].map(lift => lift.toLowerCase());

const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  // Epley formula
  return weight * (1 + reps / 30);
};

export const useOneRepMax = () => {
  const checkAndSave1RM = async (exercise: Pick<Exercise, 'name'>, set: Pick<WorkoutSet, 'weight' | 'reps'>) => {
    if (
      !exercise.name ||
      !MAJOR_LIFTS.includes(exercise.name.toLowerCase()) ||
      set.weight <= 0 ||
      set.reps <= 0
    ) {
      return;
    }

    const oneRepMax = calculate1RM(set.weight, set.reps);

    try {
      const { data: new_pr_id, error } = await supabase.rpc('upsert_personal_record', {
        p_exercise_name: exercise.name,
        p_one_rep_max: oneRepMax,
      });

      if (error) {
        throw error;
      }
      
      if (new_pr_id) {
        sonnerToast.success("New Personal Record!", {
            description: `${exercise.name}: ${oneRepMax.toFixed(1)}kg 1RM`,
        });
      }

    } catch (error) {
      console.error("Error saving 1RM:", error);
      sonnerToast.error("Failed to save PR", { description: (error as Error).message });
    }
  };

  return { checkAndSave1RM };
};
