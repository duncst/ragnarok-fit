
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RestTimerSettings } from './RestTimerSettings';
import { RotateCcw, Settings, Plus } from 'lucide-react';
import { SimpleExerciseSelector } from './SimpleExerciseSelector';
import { ExerciseCard } from './ExerciseCard';
import { useExerciseHistory } from '@/hooks/useExerciseHistory';
import type { Exercise } from '@/types';

interface SimpleWorkoutExecutionProps {
  workoutName: string;
  exercises: Exercise[];
  onAddExercise: (exerciseName: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onMoveExercise: (exerciseId: string, direction: 'up' | 'down') => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'weight' | 'reps' | 'duration' | 'distance', value: number) => void;
  onToggleSet: (exerciseId: string, setId: string) => void;
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
  workoutTimer: string;
  restDuration: number;
  onRestDurationChange: (duration: number) => void;
}

export const SimpleWorkoutExecution = ({
  workoutName,
  exercises,
  onAddExercise,
  onRemoveExercise,
  onMoveExercise,
  onAddSet,
  onUpdateSet,
  onToggleSet,
  onFinishWorkout,
  onCancelWorkout,
  workoutTimer,
  restDuration,
  onRestDurationChange,
}: SimpleWorkoutExecutionProps) => {
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showRestSettings, setShowRestSettings] = useState(false);

  const handleFinishClick = () => {
    const hasIncompleteSets = exercises.some(ex => ex.sets.some(set => !set.completed && (set.weight > 0 || set.reps > 0 || set.duration > 0 || set.distance > 0)));
    if (hasIncompleteSets) {
      setShowFinishDialog(true);
    } else {
      onFinishWorkout();
    }
  };

  const handleCompleteAllSets = () => {
    exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (!set.completed && (set.weight > 0 || set.reps > 0 || set.duration > 0 || set.distance > 0)) {
          onToggleSet(exercise.id, set.id);
        }
      });
    });
    setShowFinishDialog(false);
    onFinishWorkout();
  };

  const formatRestTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onCancelWorkout}>
            <RotateCcw className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-semibold">{workoutName}</h1>
            <p className="text-sm text-muted-foreground">{workoutTimer}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowRestSettings(true)}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button 
              onClick={handleFinishClick}
              className="bg-green-500 hover:bg-green-600"
            >
              Finish
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-20">
        {/* Exercise Cards */}
        {exercises.map((exercise, exerciseIndex) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            totalExercises={exercises.length}
            onRemove={onRemoveExercise}
            onMove={onMoveExercise}
            onUpdateName={() => {}} // Read-only during workout
            onAddSet={onAddSet}
            onUpdateSet={onUpdateSet}
            onToggleSet={onToggleSet}
          />
        ))}
        
        {/* Add Exercise */}
        <SimpleExerciseSelector
          onExerciseSelect={onAddExercise}
          trigger={
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Plus className="h-5 w-5" />
                  <span>Add Exercise</span>
                </div>
              </CardContent>
            </Card>
          }
        />

        {/* Workout Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleFinishClick}
            className="w-full bg-green-500 hover:bg-green-600"
            size="lg"
          >
            Finish Workout
          </Button>
          <Button
            variant="ghost"
            onClick={onCancelWorkout}
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Cancel Workout
          </Button>
        </div>
      </div>

      {/* Finish Workout Dialog */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">🎉 Finish Workout?</DialogTitle>
            <DialogDescription className="text-center">
              There are valid sets in this workout that have not been marked as complete.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={handleCompleteAllSets}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Complete Unfinished Sets
            </Button>
            <Button
              onClick={onCancelWorkout}
              variant="outline"
              className="w-full text-red-500 border-red-200 hover:bg-red-50"
            >
              Cancel Workout
            </Button>
            <Button
              onClick={() => setShowFinishDialog(false)}
              variant="ghost"
              className="w-full"
            >
              Continue Workout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rest Timer Settings Dialog */}
      <Dialog open={showRestSettings} onOpenChange={setShowRestSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rest Timer Settings</DialogTitle>
          </DialogHeader>
          <RestTimerSettings
            restDuration={restDuration}
            onRestDurationChange={onRestDurationChange}
          />
          <Button onClick={() => setShowRestSettings(false)} className="mt-4">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
