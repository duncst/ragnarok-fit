
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Check, X, Play, Pause } from 'lucide-react';
import { SetRow } from './SetRow';
import { getExerciseType } from '@/utils/exerciseTypes';
import type { Exercise } from '@/types';

interface SimpleWorkoutExecutionProps {
  workoutName: string;
  exercises: Exercise[];
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'reps' | 'weight' | 'duration' | 'distance', value: number) => void;
  onToggleSet: (exerciseId: string, setId: string) => void;
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
  isWorkoutActive: boolean;
  formattedDuration: string;
  onToggleWorkout: () => void;
  isSaving: boolean;
}

export const SimpleWorkoutExecution = ({
  workoutName,
  exercises,
  onAddSet,
  onUpdateSet,
  onToggleSet,
  onFinishWorkout,
  onCancelWorkout,
  isWorkoutActive,
  formattedDuration,
  onToggleWorkout,
  isSaving,
}: SimpleWorkoutExecutionProps) => {
  const getHeaderLabels = (exerciseType: string) => {
    switch (exerciseType) {
      case 'time':
        return ['Set', 'Duration', 'Reps', '✓'];
      case 'distance':
        return ['Set', 'Duration', 'Distance', '✓'];
      case 'weight_distance_time':
        return ['Set', 'Weight', 'Time/Dist', '✓'];
      case 'reps':
        return ['Set', '', 'Reps', '✓'];
      default:
        return ['Set', 'Weight', 'Reps', '✓'];
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold truncate">{workoutName}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelWorkout}
            disabled={isSaving}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleWorkout}
              disabled={isSaving}
            >
              {isWorkoutActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="ml-1">{isWorkoutActive ? 'Pause' : 'Start'}</span>
            </Button>
            {isWorkoutActive && (
              <div className="text-sm font-medium text-green-600">
                {formattedDuration}
              </div>
            )}
          </div>
          <Button
            onClick={onFinishWorkout}
            disabled={isSaving}
            size="sm"
          >
            {isSaving ? 'Saving...' : 'Finish'}
          </Button>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4 pb-6">
        {exercises.map((exercise) => {
          const exerciseType = exercise.type || getExerciseType(exercise.name);
          const headerLabels = getHeaderLabels(exerciseType);

          return (
            <Card key={exercise.id}>
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-lg">{exercise.name}</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Header row */}
                <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground">
                  {headerLabels.map((label, index) => (
                    <div key={index} className={index === 0 ? 'text-left' : 'text-center'}>
                      {label}
                    </div>
                  ))}
                </div>

                {/* Sets */}
                <div className="space-y-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={set.id} className="bg-muted/30 rounded-md p-2">
                      <SetRow
                        set={set}
                        setIndex={setIndex}
                        onUpdate={(field, value) => onUpdateSet(exercise.id, set.id, field, value)}
                        onToggle={() => onToggleSet(exercise.id, set.id)}
                        exerciseType={exerciseType}
                      />
                    </div>
                  ))}
                </div>

                {/* Add Set Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddSet(exercise.id)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Set
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
