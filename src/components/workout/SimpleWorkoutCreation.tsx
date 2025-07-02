
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { SimpleExerciseSelector } from './SimpleExerciseSelector';
import type { Exercise } from '@/types';

interface SimpleWorkoutCreationProps {
  workoutName: string;
  onWorkoutNameChange: (name: string) => void;
  exercises: Exercise[];
  onAddExercise: (exerciseName: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onStartWorkout: () => void;
  onCancel: () => void;
}

export const SimpleWorkoutCreation = ({
  workoutName,
  onWorkoutNameChange,
  exercises,
  onAddExercise,
  onRemoveExercise,
  onStartWorkout,
  onCancel,
}: SimpleWorkoutCreationProps) => {
  const canStartWorkout = exercises.length > 0;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">New Workout</h1>
        <Button 
          onClick={onStartWorkout} 
          disabled={!canStartWorkout}
          className="bg-green-500 hover:bg-green-600"
        >
          Start
        </Button>
      </div>

      {/* Workout Name */}
      <div className="p-4 border-b">
        <Input
          placeholder="Workout Name"
          value={workoutName}
          onChange={(e) => onWorkoutNameChange(e.target.value)}
          className="text-lg font-medium border-none px-0 focus-visible:ring-0"
        />
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {exercises.map((exercise, index) => (
            <Card key={exercise.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-600">
                      {exercise.name || `Exercise ${index + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveExercise(exercise.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <SimpleExerciseSelector
            onExerciseSelect={onAddExercise}
            trigger={
              <Button variant="outline" className="w-full justify-center py-6">
                <Plus className="h-5 w-5 mr-2" />
                Add Exercise
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};
