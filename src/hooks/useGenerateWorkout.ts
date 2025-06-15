
import { useMutation } from '@tanstack/react-query';
import { toast as sonnerToast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import type { Exercise } from '@/types';

type UseGenerateWorkoutProps = {
    setWorkoutName: (name: string) => void;
    setExercises: (exercises: Exercise[]) => void;
}

export const useGenerateWorkout = ({ setWorkoutName, setExercises }: UseGenerateWorkoutProps) => {
    const generateWorkoutMutation = useMutation({
        mutationFn: async ({ equipment, focus }: { equipment: string[], focus: string }) => {
            const { data, error } = await supabase.functions.invoke('generate-workout', {
                body: { equipment, focusArea: focus },
            });
            if (error) {
                if (error.context && error.context.error) {
                    const detailedError = error.context.error as { message: string; type?: string };
                    if (detailedError.type === 'insufficient_quota') {
                        throw new Error("You've exceeded your OpenAI API quota. Please check your plan and billing details on the OpenAI website.");
                    }
                    throw new Error(detailedError.message || 'An unknown error occurred while generating the workout.');
                }
                throw new Error(error.message);
            }
            if (!data) throw new Error("No data returned from the function.");
            return data as { name: string; exercises: { name: string; sets: { reps: number; weight: number }[] }[] };
        },
        onSuccess: (data) => {
            sonnerToast.success("AI workout generated successfully!");
            setWorkoutName(data.name);
            const exercisesFromAI: Exercise[] = data.exercises.map((templateEx, exIndex) => ({
                id: `ex-${Date.now()}-${exIndex}`,
                name: templateEx.name,
                sets: templateEx.sets.map((set, setIndex) => ({
                    id: `set-${Date.now()}-${exIndex}-${setIndex}`,
                    reps: set.reps,
                    weight: set.weight,
                    completed: false,
                })),
            }));
            setExercises(exercisesFromAI);
        },
        onError: (error) => {
            sonnerToast.error("Failed to generate workout", { description: (error as Error).message });
        }
    });

    return { generateWorkoutMutation };
};
