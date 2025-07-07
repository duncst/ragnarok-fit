
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Check, Plus } from 'lucide-react';
import { exercises } from '@/data/exercises';

const bodyParts = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body'];

interface SimpleExerciseSelectorProps {
  onExerciseSelect: (exerciseName: string) => void;
  trigger?: React.ReactNode;
}

export const SimpleExerciseSelector = ({ onExerciseSelect, trigger }: SimpleExerciseSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('All');

  const filteredExercises = useMemo(() => {
    const lowercasedTerm = searchValue.toLowerCase();
    return exercises
      .filter((exercise) => {
        // Filter by body part
        if (selectedBodyPart === 'All') return true;
        
        // Handle case where exercise.bodyPart might be an array or string
        if (Array.isArray(exercise.bodyPart)) {
          return exercise.bodyPart.some(part => part.toLowerCase() === selectedBodyPart.toLowerCase());
        }
        
        return exercise.bodyPart.toLowerCase() === selectedBodyPart.toLowerCase();
      })
      .filter((exercise) =>
        exercise.name.toLowerCase().includes(lowercasedTerm) ||
        (Array.isArray(exercise.bodyPart) 
          ? exercise.bodyPart.some(part => part.toLowerCase().includes(lowercasedTerm))
          : exercise.bodyPart.toLowerCase().includes(lowercasedTerm)
        )
      );
  }, [searchValue, selectedBodyPart]);

  const handleSelectExercise = (exerciseName: string) => {
    onExerciseSelect(exerciseName);
    setOpen(false);
    setSearchValue('');
    setSelectedBodyPart('All');
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
      <DialogContent className="sm:max-w-md h-[80vh] max-h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col flex-1 min-h-0 px-6">
          <div className="space-y-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Body Part Filter with improved mobile scrolling */}
            <div className="w-full">
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {bodyParts.map((part) => (
                    <Button
                      key={part}
                      variant={selectedBodyPart === part ? 'default' : 'secondary'}
                      size="sm"
                      className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs"
                      onClick={() => setSelectedBodyPart(part)}
                    >
                      {part}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0 pb-6">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No exercises found
              </div>
            ) : (
              <div className="space-y-1 pr-4">
                {filteredExercises.map((exercise) => (
                  <button
                    key={exercise.name}
                    onClick={() => handleSelectExercise(exercise.name)}
                    className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {Array.isArray(exercise.bodyPart) ? exercise.bodyPart.join(', ') : exercise.bodyPart}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
