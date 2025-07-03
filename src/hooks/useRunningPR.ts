
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";
import type { Run } from '@/types';

const TRACKED_DISTANCES = [1, 5, 10]; // km

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const useRunningPR = () => {
  const checkAndSaveRunningPR = async (run: Pick<Run, 'distance' | 'duration'>) => {
    // Check if this is a tracked distance
    if (!TRACKED_DISTANCES.includes(run.distance)) {
      return;
    }

    const exerciseName = `${run.distance}k Run`;
    const pacePerKm = run.duration / run.distance; // seconds per km

    try {
      const { data: new_pr_id, error } = await supabase.rpc('upsert_personal_record', {
        p_exercise_name: exerciseName,
        p_one_rep_max: pacePerKm, // Store pace as the "record" (lower is better)
      });

      if (error) {
        throw error;
      }
      
      if (new_pr_id) {
        sonnerToast.success("New Running PR!", {
          description: `${exerciseName}: ${formatTime(run.duration)}`,
        });
      }

    } catch (error) {
      console.error("Error saving running PR:", error);
      sonnerToast.error("Failed to save running PR", { description: (error as Error).message });
    }
  };

  return { checkAndSaveRunningPR };
};
