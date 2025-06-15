
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface WorkoutHeaderProps {
  workoutName: string;
  onNameChange: (name: string) => void;
  onFinish: () => void;
  isSaving: boolean;
  onSaveAsTemplate: () => void;
  isSavingAsTemplate: boolean;
}

export const WorkoutHeader = ({ workoutName, onNameChange, onFinish, isSaving, onSaveAsTemplate, isSavingAsTemplate }: WorkoutHeaderProps) => {
  return (
    <div className="flex justify-between items-center gap-2">
      <Input
        placeholder="Workout Name (e.g. Push Day)"
        value={workoutName}
        onChange={(e) => onNameChange(e.target.value)}
        className="text-2xl font-bold h-auto"
      />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onSaveAsTemplate} disabled={isSavingAsTemplate || isSaving}>
          {isSavingAsTemplate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="sr-only">Save as template</span>
        </Button>
        <Button onClick={onFinish} disabled={isSaving || isSavingAsTemplate}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Finish
        </Button>
      </div>
    </div>
  );
};
