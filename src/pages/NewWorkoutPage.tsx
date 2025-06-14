
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Trash2, Check } from 'lucide-react';
import type { Exercise, WorkoutSet } from '@/types';
import { useNavigate } from 'react-router-dom';

const NewWorkoutPage = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);

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

  const finishWorkout = () => {
    // In a real app, we would save the workout here
    console.log('Workout Finished:', { exercises });
    navigate('/');
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">New Workout</h1>
        <Button onClick={finishWorkout}>Finish</Button>
      </div>

      {exercises.map((exercise, exerciseIndex) => (
        <Card key={exercise.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Input
                placeholder={`Exercise ${exerciseIndex + 1}`}
                value={exercise.name}
                onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                className="text-lg font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
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

      <Button variant="secondary" className="w-full" onClick={addExercise}>
        <Plus className="h-4 w-4 mr-2" /> Add Exercise
      </Button>
    </div>
  );
};

export default NewWorkoutPage;

