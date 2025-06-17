
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast as sonnerToast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Exercise, Workout } from '@/types';

export const useSaveWorkout = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const saveWorkoutMutation = useMutation({
        mutationFn: async (workoutData: Workout) => {
            if (!user) throw new Error("You must be logged in to save a workout.");

            const { data: workoutDbData, error: workoutError } = await supabase
                .from('workouts')
                .insert({ 
                    user_id: user.id, 
                    name: workoutData.name || null, 
                    start_time: workoutData.startTime.toISOString(),
                    end_time: workoutData.endTime?.toISOString() || new Date().toISOString(),
                    notes: workoutData.notes || null
                })
                .select()
                .single();

            if (workoutError) throw workoutError;

            for (const [exerciseIndex, exercise] of workoutData.exercises.entries()) {
                if (!exercise.name) continue;

                const { data: exerciseData, error: exerciseError } = await supabase
                    .from('workout_exercises')
                    .insert({
                        workout_id: workoutDbData.id,
                        name: exercise.name,
                        "order": exerciseIndex,
                    })
                    .select()
                    .single();
                
                if (exerciseError) {
                    console.error('Error inserting exercise, rolling back workout');
                    await supabase.from('workouts').delete().eq('id', workoutDbData.id);
                    throw exerciseError;
                }

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
                        await supabase.from('workouts').delete().eq('id', workoutDbData.id);
                        throw setsError;
                    }
                }
            }
            return workoutDbData;
        },
        onSuccess: () => {
            sonnerToast.success("Workout saved successfully!");
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
        },
        onError: (error) => {
            sonnerToast.error("Failed to save workout", { description: (error as Error).message });
        }
    });

    const saveWorkout = async (workout: Workout, startTime?: Date, endTime?: Date) => {
        try {
            const workoutToSave = {
                ...workout,
                startTime: startTime || workout.startTime,
                endTime: endTime || workout.endTime || new Date(),
            };
            await saveWorkoutMutation.mutateAsync(workoutToSave);
            return true;
        } catch (error) {
            return false;
        }
    };

    return { 
        saveWorkout, 
        isSaving: saveWorkoutMutation.isPending 
    };
};
