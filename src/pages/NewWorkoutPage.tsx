
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Trash2, Check, Loader2, Sparkles } from 'lucide-react';
import type { Exercise, WorkoutSet, WorkoutTemplate } from '@/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExerciseSelector } from '@/components/ExerciseSelector';

const NewWorkoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const template = location.state?.template as WorkoutTemplate | undefined;

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: `ex-${Date.now()}`,
      name: 'Bench Press',
      sets: [{ id: `set-${Date.now()}`, reps: 8, weight: 60, completed: false }],
    }
  ]);
  const [workoutName, setWorkoutName] = useState('');

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

      // 1. Create the workout
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert({ user_id: user.id, name: name || null, end_time: new Date().toISOString() })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // 2. Create workout exercises and sets
      for (const [exerciseIndex, exercise] of exercises.entries()) {
        if (!exercise.name) continue; // Don't save exercises without a name

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
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-workout');

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned from the function.");
      }
      
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

  return (
    <div className="space-y-4 pb-16">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Workout Name (e.g. Push Day)"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
        />
        <Button onClick={finishWorkout} disabled={saveWorkoutMutation.isPending}>
          {saveWorkoutMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Finish
        </Button>
      </div>

      {exercises.map((exercise, exerciseIndex) => (
        <Card key={exercise.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <ExerciseSelector
                placeholder={`Exercise ${exerciseIndex + 1}`}
                value={exercise.name}
                onChange={(name) => updateExerciseName(exercise.id, name)}
              />
              <Button variant="ghost" size="icon" onClick={() => removeExercise(exercise.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground font-medium text-center">
              <span className="text-left">Set</span>
              <span>Weight (kg)</span>
              <span>Reps</span>
              <span>Done</span>
            </div>
            {exercise.sets.map((set, setIndex) => (
              <div key={set.id} className="grid grid-cols-4 gap-2 items-center">
                <span className="font-bold text-center">{setIndex + 1}</span>
                <Input
                  type="number"
                  value={set.weight}
                  onChange={(e) =>
                    updateSet(exercise.id, set.id, 'weight', parseInt(e.target.value) || 0)
                  }
                  className="w-full text-center"
                />
                <Input
                  type="number"
                  value={set.reps}
                  onChange={(e) =>
                    updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)
                  }
                  className="w-full text-center"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="justify-self-center"
                  onClick={() => handleToggleSet(exercise.id, set.id)}
                >
                  {set.completed ? (
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                  )}
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addSet(exercise.id)}>
              <Plus className="h-4 w-4 mr-2" /> Add Set
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-2">
        <Button variant="secondary" className="w-full" onClick={addExercise}>
          <Plus className="h-4 w-4 mr-2" /> Add Exercise
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => generateWorkoutMutation.mutate()}
          disabled={generateWorkoutMutation.isPending}
        >
          {generateWorkoutMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate with AI
        </Button>
      </div>
    </div>
  );
};

export default NewWorkoutPage;
