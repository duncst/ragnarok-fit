
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Clock, Weight, Repeat, MapPin, Dumbbell, ChevronUp, ChevronDown } from 'lucide-react';
import { ExerciseSelector } from '@/components/ExerciseSelector';
import { SetRow } from './SetRow';
import { getExerciseType } from '@/utils/exerciseTypes';
import type { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseIndex: number;
  totalExercises: number;
  onRemove: (exerciseId: string) => void;
  onMove?: (exerciseId: string, direction: 'up' | 'down') => void;
  onUpdateName: (exerciseId: string, name: string) => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'reps' | 'weight' | 'duration' | 'distance', value: number) => void;
  onToggleSet: (exerciseId: string, setId: string) => void;
}

export const ExerciseCard = ({
  exercise,
  exerciseIndex,
  totalExercises,
  onRemove,
  onMove,
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

  const getExerciseTypeIcon = () => {
    switch (exerciseType) {
      case 'time':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'distance':
        return <MapPin className="h-4 w-4 text-purple-500" />;
      case 'weight_distance_time':
        return <Dumbbell className="h-4 w-4 text-red-500" />;
      case 'reps':
        return <Repeat className="h-4 w-4 text-green-500" />;
      default:
        return <Weight className="h-4 w-4 text-orange-500" />;
    }
  };

  const getExerciseTypeLabel = () => {
    switch (exerciseType) {
      case 'time':
        return 'Time-based';
      case 'distance':
        return 'Time + distance';
      case 'weight_distance_time':
        return 'Weight + time + distance';
      case 'reps':
        return 'Reps only';
      default:
        return 'Weight + reps';
    }
  };

  const headerLabels = getHeaderLabels();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <ExerciseSelector
              placeholder={`Exercise ${exerciseIndex + 1}`}
              value={exercise.name}
              onChange={(name) => onUpdateName(exercise.id, name)}
            />
            {exercise.name && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                {getExerciseTypeIcon()}
                <span>{getExerciseTypeLabel()}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {onMove && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onMove(exercise.id, 'up')}
                  disabled={exerciseIndex === 0}
                  className="h-8 w-8"
                  aria-label={`Move ${exercise.name || `exercise ${exerciseIndex + 1}`} up`}
                >
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onMove(exercise.id, 'down')}
                  disabled={exerciseIndex === totalExercises - 1}
                  className="h-8 w-8"
                  aria-label={`Move ${exercise.name || `exercise ${exerciseIndex + 1}`} down`}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={() => onRemove(exercise.id)} className="h-8 w-8" aria-label={`Remove ${exercise.name || `exercise ${exerciseIndex + 1}`}`}>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
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
