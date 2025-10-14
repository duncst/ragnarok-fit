
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast as sonnerToast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Exercise } from '@/types';

export const useSaveAsTemplate = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const saveAsTemplateMutation = useMutation({
        mutationFn: async ({ exercises, name }: { exercises: Exercise[], name: string }) => {
            if (!user) throw new Error("You must be logged in to save a template.");
            if (!name) throw new Error("Please provide a name for the template.");

            const { data: templateData, error: templateError } = await supabase
                .from('workout_templates')
                .insert({
                    user_id: user.id,
                    name: name,
                })
                .select()
                .single();

            if (templateError) throw templateError;

            if (exercises.length > 0) {
                const templateExercisesToInsert = exercises
                    .filter(ex => ex.name.trim() !== '')
                    .map((exercise, index) => ({
                        workout_template_id: templateData.id,
                        exercise_name: exercise.name,
                        sets: exercise.sets.length,
                        order: index,
                    }));
                
                if (templateExercisesToInsert.length > 0) {
                    const { error: exercisesError } = await supabase
                        .from('workout_template_exercises')
                        .insert(templateExercisesToInsert);
            
                    if (exercisesError) {
                        await supabase.from('workout_templates').delete().eq('id', templateData.id);
                        throw exercisesError;
                    }
                }
            }

            return templateData;
        },
        onSuccess: () => {
            sonnerToast.success("Template saved successfully! You can now reuse this workout.");
            queryClient.invalidateQueries({ queryKey: ['workout_templates'] });
            queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
        },
        onError: (error) => {
            sonnerToast.error("Failed to save as template", { description: (error as Error).message });
        }
    });

    const saveAsTemplate = ({ exercises, name }: { exercises: Exercise[], name: string }) => {
        const templateName = name.trim();
        if (!templateName) {
            sonnerToast.error("Please enter a name for the template.");
            return;
        }
        if (exercises.every(e => e.name.trim() === '')) {
            sonnerToast.error("Cannot save an empty template.");
            return;
        }
        saveAsTemplateMutation.mutate({ exercises, name: templateName });
    };

    return { saveAsTemplateMutation, saveAsTemplate };
};
