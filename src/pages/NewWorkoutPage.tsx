
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { Exercise, WorkoutSet } from '@/types';
import { useNavigate } from 'react-router-dom';

const NewWorkoutPage = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: 'New Exercise',
      sets: [{ id: `set-${Date.now()}`, reps: 8, weight: 20, completed: false }],
    };
    setExercises([...exercises, newExercise]);
  };

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newSet: WorkoutSet = { id: `set-${Date.now()}`, reps: 8, weight: 20, completed: false };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    );
  };
  
  const finishWorkout = () => {
    // In a real app, we would save the workout here
    console.log("Workout Finished:", { exercises });
    navigate('/');
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">New Workout</h1>
        <Button onClick={finishWorkout}>Finish</Button>
      </div>

      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardHeader>
            <CardTitle className="text-lg">{exercise.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground font-medium">
              <span>Set</span>
              <span>Weight (kg)</span>
              <span>Reps</span>
              <span></span>
            </div>
            {exercise.sets.map((set, setIndex) => (
              <div key={set.id} className="grid grid-cols-4 gap-2 items-center">
                <span className="font-bold">{setIndex + 1}</span>
                <Input type="number" defaultValue={set.weight} className="w-full" />
                <Input type="number" defaultValue={set.reps} className="w-full" />
                <Button variant="ghost" size="icon" className="text-green-500">
                    <div className="h-6 w-6 rounded-full border-2 border-green-500" />
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
