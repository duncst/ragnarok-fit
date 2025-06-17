
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { X, Plus, Check, Horn } from 'lucide-react';
import { ExerciseSelector } from '@/components/ExerciseSelector';
import { SetRow } from './SetRow';
import { getExerciseType } from '@/utils/exerciseTypes';
import type { Exercise } from '@/types';

interface WorkoutCookModeProps {
  workoutName: string;
  exercises: Exercise[];
  onExitCookMode: () => void;
  onUpdateExerciseName: (exerciseId: string, name: string) => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'reps' | 'weight' | 'duration' | 'distance', value: number) => void;
  onToggleSet: (exerciseId: string, setId: string) => void;
  onFinishWorkout: () => void;
  isSaving: boolean;
  isWorkoutActive: boolean;
  formattedDuration: string;
}

export const WorkoutCookMode = ({
  workoutName,
  exercises,
  onExitCookMode,
  onUpdateExerciseName,
  onAddSet,
  onUpdateSet,
  onToggleSet,
  onFinishWorkout,
  isSaving,
  isWorkoutActive,
  formattedDuration,
}: WorkoutCookModeProps) => {
  const getHeaderLabels = (exerciseType: string) => {
    switch (exerciseType) {
      case 'time':
        return ['Set', 'Duration', 'Reps', 'Done'];
      case 'distance':
        return ['Set', 'Duration', 'Distance', 'Done'];
      case 'weight_distance_time':
        return ['Set', 'Weight (kg)', 'Time/Distance', 'Done'];
      case 'reps':
        return ['Set', '', 'Reps', 'Done'];
      default:
        return ['Set', 'Weight (kg)', 'Reps', 'Done'];
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="min-h-screen p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-4 bg-background/95 backdrop-blur-sm z-10 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <Horn className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">{workoutName || 'Workout Mode'}</h1>
              {isWorkoutActive && (
                <div className="text-lg font-semibold text-green-600">
                  {formattedDuration}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onFinishWorkout} disabled={isSaving} size="lg">
              Finish Workout
            </Button>
            <Button variant="outline" size="icon" onClick={onExitCookMode}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-6 pb-6">
          {exercises.map((exercise, exerciseIndex) => {
            const exerciseType = exercise.type || getExerciseType(exercise.name);
            const headerLabels = getHeaderLabels(exerciseType);

            return (
              <Card key={exercise.id} className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <ExerciseSelector
                        placeholder={`Exercise ${exerciseIndex + 1}`}
                        value={exercise.name}
                        onChange={(name) => onUpdateExerciseName(exercise.id, name)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-3 text-base font-semibold text-muted-foreground text-center">
                    <span className="text-left">{headerLabels[0]}</span>
                    <span>{headerLabels[1]}</span>
                    <span>{headerLabels[2]}</span>
                    <span>{headerLabels[3]}</span>
                  </div>
                  {exercise.sets.map((set, setIndex) => (
                    <div key={set.id} className="p-2 rounded-lg bg-muted/50">
                      <SetRow
                        set={set}
                        setIndex={setIndex}
                        onUpdate={(field, value) => onUpdateSet(exercise.id, set.id, field, value)}
                        onToggle={() => onToggleSet(exercise.id, set.id)}
                        exerciseType={exerciseType}
                      />
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => onAddSet(exercise.id)}
                    className="w-full"
                  >
                    <Plus className="h-5 w-5 mr-2" /> Add Set
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
