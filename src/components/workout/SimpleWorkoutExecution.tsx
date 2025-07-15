import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Check } from 'lucide-react';
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
  onAddSet,
  onUpdateSet,
  onToggleSet,
  onFinishWorkout,
  onCancelWorkout,
  workoutTimer
}) => {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{workoutName}</h1>
        <p className="text-muted-foreground">{workoutTimer}</p>
      </div>

      {/* Exercises */}
      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardHeader>
            <CardTitle>{exercise.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {exercise.sets.map((set, setIndex) => (
              <div key={set.id} className="flex items-center gap-2 p-2 border rounded">
                <span className="w-8 text-sm text-muted-foreground">
                  {setIndex + 1}
                </span>
                
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    placeholder="Weight"
                    value={set.weight || ''}
                    onChange={(e) => onUpdateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                    className="w-20 h-8"
                  />
                  <span className="text-xs text-muted-foreground">kg</span>
                </div>

                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    placeholder="Reps"
                    value={set.reps || ''}
                    onChange={(e) => onUpdateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                    className="w-16 h-8"
                  />
                  <span className="text-xs text-muted-foreground">reps</span>
                </div>

                <Button
                  size="sm"
                  variant={set.completed ? "default" : "outline"}
                  onClick={() => onToggleSet(exercise.id, set.id)}
                  className="ml-auto"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddSet(exercise.id)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Set
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Actions */}
      <div className="space-y-2 pt-4">
        <Button
          onClick={onFinishWorkout}
          className="w-full"
          size="lg"
        >
          Finish Workout
        </Button>
        <Button
          variant="outline"
          onClick={onCancelWorkout}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};