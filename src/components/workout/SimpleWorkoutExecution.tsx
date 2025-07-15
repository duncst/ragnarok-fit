import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Settings, ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
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

export const SimpleWorkoutExecution: React.FC<SimpleWorkoutExecutionProps> = ({
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
  workoutTimer
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancelWorkout}
          className="text-muted-foreground"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">{workoutName}</h1>
          <p className="text-sm text-muted-foreground">{workoutTimer}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
          >
            <Settings className="h-6 w-6" />
          </Button>
          <Button
            onClick={onFinishWorkout}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Finish
          </Button>
        </div>
      </div>

      {/* Exercises */}
      <div className="p-4 space-y-4">
        {exercises.map((exercise, exerciseIndex) => (
          <div key={exercise.id} className="border border-border rounded-lg p-4 bg-card">
            {/* Exercise Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-blue-400">{exercise.name}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMoveExercise(exercise.id, 'up')}
                  disabled={exerciseIndex === 0}
                  className="h-8 w-8 text-muted-foreground"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMoveExercise(exercise.id, 'down')}
                  disabled={exerciseIndex === exercises.length - 1}
                  className="h-8 w-8 text-muted-foreground"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveExercise(exercise.id)}
                  className="h-8 w-8 text-muted-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sets Header */}
            <div className="grid grid-cols-[50px_1fr_1fr_1fr_40px] gap-1 sm:gap-2 mb-2 text-xs sm:text-sm text-muted-foreground">
              <div>Set</div>
              <div>Prev</div>
              <div>kg</div>
              <div>Reps</div>
              <div></div>
            </div>

            {/* Sets */}
            {exercise.sets.map((set, setIndex) => (
              <div key={set.id} className="grid grid-cols-[50px_1fr_1fr_1fr_40px] gap-1 sm:gap-2 mb-2 items-center">
                {/* Set Number */}
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-xs sm:text-sm font-medium">
                  {setIndex + 1}
                </div>

                {/* Previous Performance */}
                <div className="text-xs sm:text-sm text-muted-foreground text-center">
                  {/* This would need to come from exercise history */}
                  -
                </div>

                {/* Weight Input */}
                <Input
                  type="number"
                  placeholder="0"
                  value={set.weight || ''}
                  onChange={(e) => onUpdateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                  className="h-7 sm:h-8 text-xs sm:text-sm text-center bg-muted border-border"
                />

                {/* Reps Input */}
                <Input
                  type="number"
                  placeholder="0"
                  value={set.reps || ''}
                  onChange={(e) => onUpdateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                  className="h-7 sm:h-8 text-xs sm:text-sm text-center bg-muted border-border"
                />

                {/* Completion Circle */}
                <button
                  onClick={() => onToggleSet(exercise.id, set.id)}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${
                    set.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-muted-foreground'
                  }`}
                />
              </div>
            ))}

            {/* Add Set Button */}
            <Button
              variant="outline"
              onClick={() => onAddSet(exercise.id)}
              className="w-full mt-4 border-border bg-card hover:bg-muted"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Set (1:30)
            </Button>
          </div>
        ))}

        {/* Add Exercises Button */}
        <Button
          variant="outline"
          onClick={() => onAddExercise('New Exercise')}
          className="w-full border-border bg-card hover:bg-muted text-blue-400"
        >
          Add Exercises
        </Button>
      </div>
    </div>
  );
};