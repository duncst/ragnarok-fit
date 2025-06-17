
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ExerciseSelector } from '@/components/ExerciseSelector';
import { SetRow } from './SetRow';
import { getExerciseType } from '@/utils/exerciseTypes';
import type { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseIndex: number;
  onRemove: (exerciseId: string) => void;
  onUpdateName: (exerciseId: string, name: string) => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'reps' | 'weight' | 'duration', value: number) => void;
  onToggleSet: (exerciseId: string, setId: string) => void;
}

export const ExerciseCard = ({
  exercise,
  exerciseIndex,
  onRemove,
  onUpdateName,
  onAddSet,
  onUpdateSet,
  onToggleSet,
}: ExerciseCardProps) => {
  const exerciseType = exercise.type || getExerciseType(exercise.name);

  const getHeaderLabels = () => {
    switch (exerciseType) {
      case 'time':
        return ['Set', 'Duration', 'Reps', 'Done'];
      case 'reps':
        return ['Set', '', 'Reps', 'Done'];
      default:
        return ['Set', 'Weight (kg)', 'Reps', 'Done'];
    }
  };

  const headerLabels = getHeaderLabels();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <ExerciseSelector
            placeholder={`Exercise ${exerciseIndex + 1}`}
            value={exercise.name}
            onChange={(name) => onUpdateName(exercise.id, name)}
          />
          <Button variant="ghost" size="icon" onClick={() => onRemove(exercise.id)}>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground font-medium text-center">
          <span className="text-left">{headerLabels[0]}</span>
          <span>{headerLabels[1]}</span>
          <span>{headerLabels[2]}</span>
          <span>{headerLabels[3]}</span>
        </div>
        {exercise.sets.map((set, setIndex) => (
          <SetRow
            key={set.id}
            set={set}
            setIndex={setIndex}
            onUpdate={(field, value) => onUpdateSet(exercise.id, set.id, field, value)}
            onToggle={() => onToggleSet(exercise.id, set.id)}
            exerciseType={exerciseType}
          />
        ))}
        <Button variant="outline" size="sm" onClick={() => onAddSet(exercise.id)}>
          <Plus className="h-4 w-4 mr-2" /> Add Set
        </Button>
      </CardContent>
    </Card>
  );
};
