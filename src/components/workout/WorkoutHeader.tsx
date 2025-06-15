
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface WorkoutHeaderProps {
  workoutName: string;
  onNameChange: (name: string) => void;
  onFinish: () => void;
  isSaving: boolean;
}

export const WorkoutHeader = ({ workoutName, onNameChange, onFinish, isSaving }: WorkoutHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Input
        placeholder="Workout Name (e.g. Push Day)"
        value={workoutName}
        onChange={(e) => onNameChange(e.target.value)}
        className="text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
      />
      <Button onClick={onFinish} disabled={isSaving}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Finish
      </Button>
    </div>
  );
};
