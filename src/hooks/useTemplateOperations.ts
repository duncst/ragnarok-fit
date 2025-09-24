import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { TemplateExercise } from "@/types";

export const useTemplateOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createTemplateMutation = useMutation({
    mutationFn: async ({ name, exercises, isPublic: is_public }: { name: string, exercises: TemplateExercise[], isPublic: boolean }) => {
      const { data: templateData, error: templateError } = await supabase
        .from('workout_templates')
        .insert({ name, is_public })
        .select()
        .single();
      if (templateError) throw templateError;

      const exercisesToInsert = exercises.map((ex, index) => ({
        workout_template_id: templateData.id,
        exercise_name: ex.name,
        sets: ex.sets,
        order: index,
      }));
      const { error: exercisesError } = await supabase
        .from('workout_template_exercises')
        .insert(exercisesToInsert);
      if (exercisesError) {
        await supabase.from('workout_templates').delete().eq('id', templateData.id);
        throw exercisesError;
      }
      return templateData;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Template created." });
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
    },
    onError: (error: any) => {
      toast({ title: "Error creating template", description: error.message, variant: "destructive" });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, is_public }: { id: string, is_public: boolean }) => {
      const { error } = await supabase.from('workout_templates').update({ is_public }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast({ title: "Success", description: `Template is now ${variables.is_public ? 'public' : 'private'}.` });
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
    },
    onError: (error: any) => {
      toast({ title: "Error updating template", description: error.message, variant: "destructive" });
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workout_templates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Template deleted." });
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting template", description: error.message, variant: "destructive" });
    }
  });

  return {
    createTemplateMutation,
    updateTemplateMutation,
    deleteTemplateMutation,
  };
};