import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Save, X, ChefHat, Play, Pause } from 'lucide-react';

interface WorkoutHeaderProps {
  workoutName: string;
  onNameChange: (name: string) => void;
  onFinish: () => void;
  onCancel: () => void;
  isSaving: boolean;
  onSaveAsTemplate: () => void;
  isSavingAsTemplate: boolean;
  onEnterCookMode?: () => void;
  isWorkoutActive: boolean;
  onToggleWorkout: () => void;
}

export const WorkoutHeader = ({ 
  workoutName, 
  onNameChange, 
  onFinish, 
  onCancel,
  isSaving, 
  onSaveAsTemplate, 
  isSavingAsTemplate,
  onEnterCookMode,
  isWorkoutActive,
  onToggleWorkout
}: WorkoutHeaderProps) => {
  return (
    <div className="flex justify-between items-center gap-2">
      <Input
        placeholder="Workout Name (e.g. Push Day)"
        value={workoutName}
        onChange={(e) => onNameChange(e.target.value)}
        className="text-2xl font-bold h-auto"
      />
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onToggleWorkout} 
          disabled={isSaving || isSavingAsTemplate}
        >
          {isWorkoutActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span className="sr-only">{isWorkoutActive ? 'Pause workout' : 'Start workout'}</span>
        </Button>
        <Button variant="outline" size="icon" onClick={onCancel} disabled={isSaving || isSavingAsTemplate}>
          <X className="h-4 w-4" />
          <span className="sr-only">Cancel workout</span>
        </Button>
        <Button variant="outline" size="icon" onClick={onSaveAsTemplate} disabled={isSavingAsTemplate || isSaving}>
          {isSavingAsTemplate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="sr-only">Save as template</span>
        </Button>
        {onEnterCookMode && (
          <Button variant="outline" size="icon" onClick={onEnterCookMode} disabled={isSaving || isSavingAsTemplate}>
            <ChefHat className="h-4 w-4" />
            <span className="sr-only">Enter cook mode</span>
          </Button>
        )}
        <Button onClick={onFinish} disabled={isSaving || isSavingAsTemplate}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Finish
        </Button>
      </div>
    </div>
  );
};
