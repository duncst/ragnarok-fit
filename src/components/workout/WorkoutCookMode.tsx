import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { X, Plus, Check, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { ExerciseSelector } from '@/components/ExerciseSelector';
import { SetRow } from './SetRow';
import { getExerciseType } from '@/utils/exerciseTypes';
import type { Exercise } from '@/types';

interface WorkoutCookModeProps {
  workoutName: string;
  exercises: Exercise[];
  onExitCookMode: () => void;
  onAddExercise: () => void;
  onRemoveExercise: (exerciseId: string) => void;
  onMoveExercise: (exerciseId: string, direction: 'up' | 'down') => void;
  onUpdateExerciseName: (exerciseId: string, name: string) => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'reps' | 'weight' | 'duration' | 'distance', value: number) => void;
  onToggleSet: (exerciseId: string, setId: string) => void;
  onFinishWorkout: () => void;
  isSaving: boolean;
  isWorkoutActive?: boolean;
  formattedDuration?: string;
  onToggleWorkout?: () => void;
}

export const WorkoutCookMode = ({
  workoutName,
  exercises,
  onExitCookMode,
  onAddExercise,
  onRemoveExercise,
  onMoveExercise,
  onUpdateExerciseName,
  onAddSet,
  onUpdateSet,
  onToggleSet,
  onFinishWorkout,
  isSaving,
  isWorkoutActive,
  formattedDuration,
  onToggleWorkout,
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
        <div className="sticky top-4 bg-background/95 backdrop-blur-sm z-10 p-4 rounded-lg border">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img 
                src="/lovable-uploads/38b9fb87-79d2-4f6f-a531-145b342ab186.png" 
                alt="Horn icon" 
                className="h-8 w-8 flex-shrink-0"
              />
              <h1 className="text-xl sm:text-2xl font-bold truncate">
                {workoutName || 'Workout Mode'}
              </h1>
            </div>
            <Button variant="outline" size="icon" onClick={onExitCookMode} className="flex-shrink-0" aria-label="Exit workout mode">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Controls Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {formattedDuration && (
              <div className="text-lg font-semibold text-white bg-green-600 px-3 py-1 rounded-md">
                {formattedDuration}
              </div>
            )}
            {onToggleWorkout && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onToggleWorkout}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isWorkoutActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="hidden sm:inline">
                  {isWorkoutActive ? 'Pause' : 'Start'}
                </span>
              </Button>
            )}
            <Button 
              onClick={onFinishWorkout} 
              disabled={isSaving} 
              size="sm"
              className="flex items-center gap-2"
            >
              <span>Finish</span>
            </Button>
          </div>
        </div>

        {/* Add Exercise Button */}
        <div className="sticky top-20 z-10">
          <Button 
            onClick={onAddExercise}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
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
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onMoveExercise(exercise.id, 'up')}
                        disabled={exerciseIndex === 0}
                        className="h-8 w-8"
                        aria-label={`Move ${exercise.name || `exercise ${exerciseIndex + 1}`} up`}
                      >
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onMoveExercise(exercise.id, 'down')}
                        disabled={exerciseIndex === exercises.length - 1}
                        className="h-8 w-8"
                        aria-label={`Move ${exercise.name || `exercise ${exerciseIndex + 1}`} down`}
                      >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onRemoveExercise(exercise.id)}
                        className="h-8 w-8"
                        aria-label={`Remove ${exercise.name || `exercise ${exerciseIndex + 1}`}`}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
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
