
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { WorkoutSet } from '@/types';
import { formatDuration, parseDurationInput, formatDistance, parseDistanceInput } from '@/utils/exerciseTypes';

interface SetRowProps {
  set: WorkoutSet;
  setIndex: number;
  onUpdate: (field: 'reps' | 'weight' | 'duration' | 'distance', value: number) => void;
  onToggle: () => void;
  exerciseType?: 'weight' | 'time' | 'reps' | 'distance' | 'weight_distance_time';
}

export const SetRow = ({ set, setIndex, onUpdate, onToggle, exerciseType = 'weight' }: SetRowProps) => {
  const handleDurationChange = (value: string) => {
    const seconds = parseDurationInput(value);
    onUpdate('duration', seconds);
  };

  const handleDistanceChange = (value: string) => {
    const meters = parseDistanceInput(value);
    onUpdate('distance', meters);
  };

  const handleNumberChange = (field: 'reps' | 'weight', value: string) => {
    // Allow empty string and convert to 0, or parse the number
    const numValue = value === '' ? 0 : (parseInt(value) || 0);
    onUpdate(field, numValue);
  };

  return (
    <div className="grid grid-cols-4 gap-2 items-center">
      <span className="font-bold text-center">{setIndex + 1}</span>
      
      {exerciseType === 'weight' && (
        <>
          <Input
            type="number"
            value={set.weight === 0 ? '' : set.weight}
            onChange={(e) => handleNumberChange('weight', e.target.value)}
            className="w-full text-center"
            placeholder="Weight"
          />
          <Input
            type="number"
            value={set.reps === 0 ? '' : set.reps}
            onChange={(e) => handleNumberChange('reps', e.target.value)}
            className="w-full text-center"
            placeholder="Reps"
          />
        </>
      )}
      
      {exerciseType === 'time' && (
        <>
          <Input
            type="text"
            value={set.duration ? formatDuration(set.duration) : ''}
            onChange={(e) => handleDurationChange(e.target.value)}
            className="w-full text-center"
            placeholder="MM:SS"
          />
          <Input
            type="number"
            value={set.reps === 0 ? '' : set.reps}
            onChange={(e) => handleNumberChange('reps', e.target.value)}
            className="w-full text-center"
            placeholder="Reps"
          />
        </>
      )}
      
      {exerciseType === 'distance' && (
        <>
          <Input
            type="text"
            value={set.duration ? formatDuration(set.duration) : ''}
            onChange={(e) => handleDurationChange(e.target.value)}
            className="w-full text-center"
            placeholder="MM:SS"
          />
          <Input
            type="text"
            value={set.distance ? `${set.distance}` : ''}
            onChange={(e) => handleDistanceChange(e.target.value)}
            className="w-full text-center"
            placeholder="Distance (m)"
          />
        </>
      )}
      
      {exerciseType === 'weight_distance_time' && (
        <>
          <Input
            type="number"
            value={set.weight === 0 ? '' : set.weight}
            onChange={(e) => handleNumberChange('weight', e.target.value)}
            className="w-full text-center"
            placeholder="Weight"
          />
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              value={set.duration ? formatDuration(set.duration) : ''}
              onChange={(e) => handleDurationChange(e.target.value)}
              className="w-full text-center text-xs"
              placeholder="MM:SS"
            />
            <Input
              type="text"
              value={set.distance ? `${set.distance}` : ''}
              onChange={(e) => handleDistanceChange(e.target.value)}
              className="w-full text-center text-xs"
              placeholder="Distance"
            />
          </div>
        </>
      )}
      
      {exerciseType === 'reps' && (
        <>
          <div className="text-center text-muted-foreground">-</div>
          <Input
            type="number"
            value={set.reps === 0 ? '' : set.reps}
            onChange={(e) => handleNumberChange('reps', e.target.value)}
            className="w-full text-center"
            placeholder="Reps"
          />
        </>
      )}
      
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
