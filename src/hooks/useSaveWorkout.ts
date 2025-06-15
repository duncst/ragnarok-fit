
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast as sonnerToast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Exercise } from '@/types';

export const useSaveWorkout = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const saveWorkoutMutation = useMutation({
        mutationFn: async ({ exercises, name }: { exercises: Exercise[], name: string }) => {
            if (!user) throw new Error("You must be logged in to save a workout.");

            const { data: workoutData, error: workoutError } = await supabase
                .from('workouts')
                .insert({ user_id: user.id, name: name || null, end_time: new Date().toISOString() })
                .select()
                .single();

            if (workoutError) throw workoutError;

            for (const [exerciseIndex, exercise] of exercises.entries()) {
                if (!exercise.name) continue;

                const { data: exerciseData, error: exerciseError } = await supabase
                    .from('workout_exercises')
                    .insert({
                        workout_id: workoutData.id,
                        name: exercise.name,
                        "order": exerciseIndex,
                    })
                    .select()
                    .single();
                
                if (exerciseError) {
                    console.error('Error inserting exercise, rolling back workout');
                    await supabase.from('workouts').delete().eq('id', workoutData.id);
                    throw exerciseError;
                };

                if (exercise.sets.length > 0) {
                    const setsToInsert = exercise.sets.map((set, setIndex) => ({
                        workout_exercise_id: exerciseData.id,
                        reps: set.reps,
                        weight: set.weight,
                        completed: set.completed,
                        "order": setIndex,
                    }));
                    
                    const { error: setsError } = await supabase
                        .from('workout_sets')
                        .insert(setsToInsert);
                        
                    if (setsError) {
                        console.error('Error inserting sets, rolling back workout');
                        await supabase.from('workouts').delete().eq('id', workoutData.id);
                        throw setsError;
                    };
                }
            }
            return workoutData;
        },
        onSuccess: () => {
            sonnerToast.success("Workout saved successfully!");
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
            navigate('/history');
        },
        onError: (error) => {
            sonnerToast.error("Failed to save workout", { description: (error as Error).message });
        }
    });

    const finishWorkout = ({ exercises, name }: { exercises: Exercise[], name: string }) => {
        const workoutNameOrDefault = name.trim() || `Workout - ${new Date().toLocaleDateString()}`;
        saveWorkoutMutation.mutate({ exercises, name: workoutNameOrDefault });
    };

    return { saveWorkoutMutation, finishWorkout };
};
