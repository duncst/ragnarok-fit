import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Settings, ChevronUp, ChevronDown, Trash2, Plus, GripVertical, Pause, SkipForward } from 'lucide-react';
import type { Exercise } from '@/types';
import { useExerciseHistory } from '@/hooks/useExerciseHistory';
import { SimpleExerciseSelector } from '@/components/workout/SimpleExerciseSelector';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const { getExercisePrevious } = useExerciseHistory();
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});
  const [showRestTimer, setShowRestTimer] = useState(true);
  const [restTime, setRestTime] = useState(40); // Mock rest time

  const totalSets = exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  const completedSets = exercises.reduce((total, exercise) => 
    total + exercise.sets.filter(set => set.completed).length, 0
  );

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Overall Progress Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-medium text-muted-foreground">Overall Progress</h2>
        <span className="text-lg font-medium text-foreground">
          {completedSets} / {totalSets} sets
        </span>
      </div>

      {/* Rest Timer */}
      {showRestTimer && (
        <div className="m-4 p-6 bg-card border border-border rounded-2xl">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {formatTime(restTime)}
            </div>
            <div className="text-lg text-muted-foreground mb-6">Rest Time</div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 bg-muted/20"
                onClick={() => {/* Pause timer logic */}}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button
                className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setShowRestTimer(false)}
              >
                Skip Rest
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drag to reorder hint */}
      <div className="flex items-center justify-center gap-2 py-3 text-muted-foreground">
        <GripVertical className="h-4 w-4" />
        <span className="text-sm">Drag exercises to reorder them</span>
      </div>

      {/* Exercises */}
      <div className="px-4 pb-4 space-y-4">
        {exercises.map((exercise, exerciseIndex) => {
          const completedSetsCount = exercise.sets.filter(set => set.completed).length;
          const isExpanded = expandedExercises[exercise.id] ?? true;
          const previous = getExercisePrevious(exercise.name);
          
          return (
            <div key={exercise.id} className="border border-border rounded-2xl bg-card">
              <Collapsible open={isExpanded} onOpenChange={() => toggleExercise(exercise.id)}>
                <CollapsibleTrigger className="w-full p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-medium text-foreground">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {completedSetsCount} / {exercise.sets.length} sets completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {previous && (
                        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
                          Last: {previous.weight}kg × {previous.reps}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    {/* Column Headers */}
                    <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto_auto] gap-3 mb-3 text-sm text-muted-foreground">
                      <div className="text-center">Set</div>
                      <div className="text-center">Prev</div>
                      <div className="text-center">kg</div>
                      <div className="text-center">Reps</div>
                      <div className="text-center">Done</div>
                      <div className="text-center">Actions</div>
                    </div>

                    {/* Sets */}
                    {exercise.sets.map((set, setIndex) => (
                      <div key={set.id} className="grid grid-cols-[auto_1fr_1fr_1fr_auto_auto] gap-3 mb-3 items-center">
                        {/* Set Number */}
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {setIndex + 1}
                        </div>

                        {/* Previous Performance */}
                        <div className="text-sm text-center">
                          {previous ? previous.reps : '-'}
                        </div>

                        {/* Weight Input */}
                        <Input
                          type="number"
                          placeholder="0"
                          value={set.weight || ''}
                          onChange={(e) => onUpdateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="h-10 text-center bg-muted/50 border-border rounded-lg"
                        />

                        {/* Reps Input */}
                        <Input
                          type="number"
                          placeholder="15"
                          value={set.reps || ''}
                          onChange={(e) => onUpdateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                          className="h-10 text-center bg-muted/50 border-border rounded-lg"
                        />

                        {/* Completion Circle */}
                        <button
                          onClick={() => onToggleSet(exercise.id, set.id)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            set.completed 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-orange-500'
                          }`}
                        >
                          {set.completed && (
                            <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-white" />
                            </div>
                          )}
                        </button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {/* Add Set Button */}
                    <Button
                      variant="outline"
                      onClick={() => onAddSet(exercise.id)}
                      className="w-full mt-4 h-12 border-dashed border-muted-foreground/30 bg-transparent hover:bg-muted/50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Set (1:30)
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}

        {/* Add Exercises Button */}
        <SimpleExerciseSelector
          onExerciseSelect={onAddExercise}
          trigger={
            <Button
              variant="outline"
              className="w-full h-12 border-border bg-card hover:bg-muted text-blue-400"
            >
              Add Exercises
            </Button>
          }
        />

        {/* Cancel Workout Button */}
        <Button
          variant="outline"
          onClick={onCancelWorkout}
          className="w-full h-12 border-border bg-card hover:bg-muted text-destructive"
        >
          Cancel Workout
        </Button>
      </div>
    </div>
  );
};