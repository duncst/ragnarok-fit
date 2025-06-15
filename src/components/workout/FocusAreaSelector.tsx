
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const focusAreas = ['Full Body', 'Upper Body', 'Lower Body', 'Push', 'Pull', 'Legs'];

interface FocusAreaSelectorProps {
  selectedFocus: string;
  onFocusChange: (value: string) => void;
}

export const FocusAreaSelector: React.FC<FocusAreaSelectorProps> = ({ selectedFocus, onFocusChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="focus-area">Focus Area</Label>      
      <Select value={selectedFocus} onValueChange={onFocusChange}>
        <SelectTrigger id="focus-area">
          <SelectValue placeholder="Select a focus area" />
        </SelectTrigger>
        <SelectContent>
          {focusAreas.map((area) => (
            <SelectItem key={area} value={area}>
              {area}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
