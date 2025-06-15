
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface WorkoutActionsProps {
  onAddExercise: () => void;
}

export const WorkoutActions = ({ onAddExercise }: WorkoutActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" className="w-full" onClick={onAddExercise}>
        <Plus className="h-4 w-4 mr-2" /> Add Exercise
      </Button>
    </div>
  );
};
