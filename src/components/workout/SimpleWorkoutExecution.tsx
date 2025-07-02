
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RestTimerSettings } from './RestTimerSettings';
import { RotateCcw, MoreHorizontal, Plus, Check, Settings } from 'lucide-react';
import { SimpleExerciseSelector } from './SimpleExerciseSelector';
import type { Exercise } from '@/types';

interface SimpleWorkoutExecutionProps {
  workoutName: string;
  exercises: Exercise[];
  onAddExercise: (exerciseName: string) => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => void;
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
    const hasIncompleteSets = exercises.some(ex => ex.sets.some(set => !set.completed && (set.weight > 0 || set.reps > 0)));
    if (hasIncompleteSets) {
      setShowFinishDialog(true);
    } else {
      onFinishWorkout();
    }
  };

  const handleCompleteAllSets = () => {
    exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (!set.completed && (set.weight > 0 || set.reps > 0)) {
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
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

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {exercises.map((exercise, exerciseIndex) => (
            <Card key={exercise.id} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-blue-600">
                    {exercise.name || `Exercise ${exerciseIndex + 1}`}
                  </h3>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                {/* Set Headers */}
                <div className="grid grid-cols-[40px_50px_1fr_1fr_50px] text-sm font-medium text-muted-foreground">
                  <span>Set</span>
                  <span className="text-center">Prev</span>
                  <span className="text-center">kg</span>
                  <span className="text-center">Reps</span>
                  <span></span>
                </div>
                
                {/* Sets */}
                {exercise.sets.map((set, setIndex) => (
                  <div key={set.id} className="grid grid-cols-[40px_50px_1fr_1fr_50px] items-center">
                    <span className="font-medium text-center bg-muted rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {setIndex + 1}
                    </span>
                    <div className="text-center text-xs text-muted-foreground">
                      {/* Previous set data would go here */}
                      -
                    </div>
                    <Input
                      type="number"
                      value={set.weight === 0 ? '' : set.weight}
                      onChange={(e) => onUpdateSet(exercise.id, set.id, 'weight', parseInt(e.target.value) || 0)}
                      className="text-center h-8 text-sm"
                      placeholder="0"
                    />
                    <Input
                      type="number"
                      value={set.reps === 0 ? '' : set.reps}
                      onChange={(e) => onUpdateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                      className="text-center h-8 text-sm"
                      placeholder="0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleSet(exercise.id, set.id)}
                      className="h-8 w-8"
                    >
                      {set.completed ? (
                        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                    </Button>
                  </div>
                ))}
                
                {/* Add Set Button */}
                <Button
                  variant="outline"
                  onClick={() => onAddSet(exercise.id)}
                  className="w-full mt-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Set ({formatRestTime(restDuration)})
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {/* Add Exercise Button */}
          <SimpleExerciseSelector
            onExerciseSelect={onAddExercise}
            trigger={
              <Button variant="outline" className="w-full py-6 text-blue-500 border-blue-200">
                Add Exercises
              </Button>
            }
          />
          
          {/* Cancel Workout Button */}
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
              Cancel
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
