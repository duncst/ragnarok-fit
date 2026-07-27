
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast as sonnerToast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useForgedWeekCheck } from '@/contexts/ForgedWeekContext';
import { useBrotherhoodActivities } from '@/hooks/useBrotherhoodActivities';
import type { Exercise } from '@/types';

export const useSaveWorkout = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { checkForNewForgedWeek } = useForgedWeekCheck();
    const { addActivity } = useBrotherhoodActivities();

    const saveWorkoutMutation = useMutation({
        mutationFn: async ({ exercises, name, notes, forgeMessage }: { exercises: Exercise[], name: string, notes?: string, forgeMessage?: string }) => {
            if (!user) throw new Error("You must be logged in to save a workout.");

            const { data: workoutData, error: workoutError } = await supabase
                .from('workouts')
                .insert({ user_id: user.id, name: name || null, notes: notes || null, end_time: new Date().toISOString() })
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
                        duration: set.duration ?? null,
                        distance: set.distance ?? null,
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
        onSuccess: async (workoutData, { name, notes, forgeMessage }) => {
            sonnerToast.success("Workout saved successfully!");
            
            // Record brotherhood activity for non-Hero's Call workouts
            if (!name.startsWith("Hero's Call:")) {
                await addActivity('workout', `Completed strength training: ${name}`, undefined, forgeMessage || notes);
            }
            
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
            // Invalidate hero call stats since regular workouts now count towards streaks
            queryClient.invalidateQueries({ queryKey: ['hero-call-stats', user?.id] });
            // Invalidate forge progress since it depends on all workout completions
            queryClient.invalidateQueries({ queryKey: ['forge-progress', user?.id] });
            
            // Check for new forged week
            checkForNewForgedWeek();
            
            // Return workout data and name for potential Valhalla score recording
            return { workoutData, name };
        },
        onError: (error) => {
            sonnerToast.error("Failed to save workout", { description: (error as Error).message });
        }
    });

    const finishWorkout = ({ exercises, name, notes, forgeMessage, onValhallaScorePrompt, onCelebration }: { 
        exercises: Exercise[], 
        name: string,
        notes?: string,
        forgeMessage?: string,
        onValhallaScorePrompt?: (workoutName: string) => void,
        onCelebration?: (workoutName: string, duration: string) => void
    }) => {
        const workoutNameOrDefault = name.trim() || `Workout - ${new Date().toLocaleDateString()}`;
        
        // Check if this is a Valhalla workout
        const isValhallaWorkout = workoutNameOrDefault.match(/^(THOR|FENRIR|HEL|NJORD|ODIN)$/i);
        
        // Check if this is a Hero's Call workout
        const isHeroCallWorkout = workoutNameOrDefault.startsWith("Hero's Call:");
        
        saveWorkoutMutation.mutate({ exercises, name: workoutNameOrDefault, notes, forgeMessage }, {
            onSuccess: () => {
                if (isValhallaWorkout && onValhallaScorePrompt) {
                    // Prompt user to record their Valhalla score
                    onValhallaScorePrompt(workoutNameOrDefault);
                } else if (!isHeroCallWorkout && onCelebration) {
                    // Show celebration for regular workouts (not Hero's Call)
                    onCelebration(workoutNameOrDefault, '');
                } else {
                    // Navigate to history for Hero's Call or if no celebration handler
                    navigate('/history');
                }
            }
        });
    };

    return { saveWorkoutMutation, finishWorkout };
};
