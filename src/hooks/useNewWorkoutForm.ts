import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast as sonnerToast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Exercise, WorkoutSet, WorkoutTemplate } from '@/types';

export const useNewWorkoutForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const template = location.state?.template as WorkoutTemplate | undefined;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['Bodyweight']);

  useEffect(() => {
    if (template) {
      setWorkoutName(template.name);
      const exercisesFromTemplate: Exercise[] = template.exercises.map((templateEx, exIndex) => ({
        id: `ex-${Date.now()}-${exIndex}`,
        name: templateEx.name,
        sets: Array.from({ length: templateEx.sets }, (_, setIndex) => ({
          id: `set-${Date.now()}-${exIndex}-${setIndex}`,
          reps: 8,
          weight: 20,
          completed: false,
        })),
      }));
      setExercises(exercisesFromTemplate);
    }
  }, [template]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: '',
      sets: [{ id: `set-${Date.now()}`, reps: 8, weight: 20, completed: false }],
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const updateExerciseName = (exerciseId: string, name: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === exerciseId ? { ...ex, name } : ex))
    );
  };

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1] || { reps: 8, weight: 20 };
          const newSet: WorkoutSet = {
            id: `set-${Date.now()}`,
            reps: lastSet.reps,
            weight: lastSet.weight,
            completed: false,
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'reps' | 'weight',
    value: number
  ) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id === setId) {
                return { ...set, [field]: value };
              }
              return set;
            }),
          };
        }
        return ex;
      })
    );
  };

  const handleToggleSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id === setId) {
                return { ...set, completed: !set.completed };
              }
              return set;
            }),
          };
        }
        return ex;
      })
    );
  };

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

  const generateWorkoutMutation = useMutation({
    mutationFn: async ({ equipment }: { equipment: string[] }) => {
      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: { equipment },
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

  const finishWorkout = () => {
    const workoutNameOrDefault = workoutName.trim() || `Workout - ${new Date().toLocaleDateString()}`;
    saveWorkoutMutation.mutate({ exercises, name: workoutNameOrDefault });
  };

  return {
    workoutName,
    setWorkoutName,
    exercises,
    addExercise,
    removeExercise,
    updateExerciseName,
    addSet,
    updateSet,
    handleToggleSet,
    finishWorkout,
    saveWorkoutMutation,
    generateWorkoutMutation,
    selectedEquipment,
    setSelectedEquipment,
  };
};
