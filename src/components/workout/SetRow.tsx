
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { WorkoutSet } from '@/types';

interface SetRowProps {
  set: WorkoutSet;
  setIndex: number;
  onUpdate: (field: 'reps' | 'weight', value: number) => void;
  onToggle: () => void;
}

export const SetRow = ({ set, setIndex, onUpdate, onToggle }: SetRowProps) => {
  return (
    <div className="grid grid-cols-4 gap-2 items-center">
      <span className="font-bold text-center">{setIndex + 1}</span>
      <Input
        type="number"
        value={set.weight}
        onChange={(e) => onUpdate('weight', parseInt(e.target.value) || 0)}
        className="w-full text-center"
      />
      <Input
        type="number"
        value={set.reps}
        onChange={(e) => onUpdate('reps', parseInt(e.target.value) || 0)}
        className="w-full text-center"
      />
      <Button
        variant="ghost"
        size="icon"
        className="justify-self-center"
        onClick={onToggle}
      >
        {set.completed ? (
          <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        ) : (
          <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
        )}
      </Button>
    </div>
  );
};
