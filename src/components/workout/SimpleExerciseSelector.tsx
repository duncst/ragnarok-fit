
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, Check, Plus } from 'lucide-react';
import { exercises } from '@/data/exercises';

interface SimpleExerciseSelectorProps {
  onExerciseSelect: (exerciseName: string) => void;
  trigger?: React.ReactNode;
}

export const SimpleExerciseSelector = ({ onExerciseSelect, trigger }: SimpleExerciseSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    exercise.bodyPart.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectExercise = (exerciseName: string) => {
    onExerciseSelect(exerciseName);
    setOpen(false);
    setSearchValue('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start text-muted-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No exercises found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredExercises.map((exercise) => (
                  <button
                    key={exercise.name}
                    onClick={() => handleSelectExercise(exercise.name)}
                    className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">{exercise.bodyPart}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
