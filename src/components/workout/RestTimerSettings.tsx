
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Timer } from 'lucide-react';

interface RestTimerSettingsProps {
  restDuration: number;
  onRestDurationChange: (duration: number) => void;
}

export const RestTimerSettings = ({ restDuration, onRestDurationChange }: RestTimerSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold flex items-center">
          <Timer className="mr-2 h-5 w-5" />
          Rest Timer
        </h3>
        <p className="text-sm text-muted-foreground">Adjust your rest time between sets.</p>
      </div>
      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="rest-duration">Duration</Label>
          <span className="text-sm font-medium">{restDuration}s</span>
        </div>
        <Slider
          id="rest-duration"
          min={30}
          max={300}
          step={15}
          value={[restDuration]}
          onValueChange={(value) => onRestDurationChange(value[0])}
        />
      </div>
    </div>
  );
};
