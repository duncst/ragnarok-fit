import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { exercises as allExercises } from "@/data/exercises";
import type { TemplateExercise, WorkoutTemplate } from "@/types";

export const useWorkoutTemplates = () => {
  const { user } = useAuth();

  return useQuery<WorkoutTemplate[]>({
    queryKey: ['workout-templates', user?.id],
    queryFn: async () => {
      const { data: templatesData, error: templatesError } = await supabase
        .from('workout_templates')
        .select('*, workout_template_exercises(*)')
        .order('created_at', { ascending: false })
        .order('order', { foreignTable: 'workout_template_exercises', ascending: true });

      if (templatesError) throw templatesError;

      const populatedTemplates: WorkoutTemplate[] = templatesData.map(template => {
        const exercises: TemplateExercise[] = template.workout_template_exercises
          .map((ex: any) => {
            const exerciseDef = allExercises.find(e => e.name === ex.exercise_name);
            if (!exerciseDef) return null;
            return { ...exerciseDef, sets: ex.sets };
          })
          .filter((ex): ex is TemplateExercise => ex !== null);

        return {
          id: template.id,
          name: template.name,
          is_public: template.is_public,
          user_id: template.user_id,
          created_at: template.created_at,
          exercises: exercises,
        };
      });
      return populatedTemplates;
    },
    enabled: !!user,
  });
};