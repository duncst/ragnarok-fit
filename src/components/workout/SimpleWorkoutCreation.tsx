
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Play, X, Check } from 'lucide-react';
import { ExerciseSelector } from '@/components/ExerciseSelector';
import type { Exercise, WorkoutSet } from '@/types';

interface SimpleWorkoutCreationProps {
  onStartWorkout: (workoutName: string, exercises: Exercise[]) => void;
  onCancel: () => void;
}

export const SimpleWorkoutCreation = ({ onStartWorkout, onCancel }: SimpleWorkoutCreationProps) => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: '',
      sets: [],
    };
    setExercises(prev => [...prev, newExercise]);
  };

  const updateExerciseName = (exerciseId: string, name: string) => {
    setExercises(prev =>
      prev.map(ex => ex.id === exerciseId ? { ...ex, name } : ex)
    );
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const handleStartWorkout = () => {
    const workoutNameOrDefault = workoutName.trim() || `Workout - ${new Date().toLocaleDateString()}`;
    
    // Add default sets to exercises that don't have any
    const exercisesWithSets = exercises.map(exercise => {
      if (exercise.sets.length === 0 && exercise.name.trim() !== '') {
        return {
          ...exercise,
          sets: [
            {
              id: `set-${Date.now()}-${exercise.id}`,
              reps: 0,
              weight: 0,
              completed: false,
            }
          ]
        };
      }
      return exercise;
    }).filter(ex => ex.name.trim() !== ''); // Remove exercises without names

    onStartWorkout(workoutNameOrDefault, exercisesWithSets);
  };

  const canStartWorkout = exercises.some(ex => ex.name.trim() !== '');

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">New Workout</h1>
        <p className="text-muted-foreground text-sm">Add exercises to get started</p>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="Workout Name (optional)"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="text-center"
        />

        <div className="space-y-2">
          {exercises.map((exercise, index) => (
            <Card key={exercise.id} className="relative">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <ExerciseSelector
                      placeholder="Add Exercise"
                      value={exercise.name}
                      onChange={(name) => updateExerciseName(exercise.id, name)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(exercise.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addExercise}
            className="w-full h-12 border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleStartWorkout}
            disabled={!canStartWorkout}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Workout
          </Button>
        </div>
      </div>
    </div>
  );
};
