import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Target } from 'lucide-react';
import { useMuscleGroupGoals } from '@/hooks/useMuscleGroupGoals';

const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Triceps',
  'Biceps',
  'Legs',
  'Core',
  'Glutes',
  'Forearms',
  'Calves',
];

export const MuscleGroupGoalSetter = () => {
  const { goals, setGoal } = useMuscleGroupGoals();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [setsInput, setSetsInput] = useState('');

  const handleSetMuscleGoal = () => {
    const sets = parseInt(setsInput);
    if (selectedMuscleGroup && sets > 0) {
      setGoal(selectedMuscleGroup, sets);
      setSelectedMuscleGroup('');
      setSetsInput('');
    }
  };

  const availableMuscleGroups = MUSCLE_GROUPS.filter(
    mg => !goals.find(g => g.muscle_group === mg)
  );

  if (availableMuscleGroups.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-5 w-5" />
          Muscle Group Volume Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Add Muscle Group Goal</p>
            <div className="flex gap-2">
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent>
                  {availableMuscleGroups.map((mg) => (
                    <SelectItem key={mg} value={mg}>
                      {mg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Sets/week"
                value={setsInput}
                onChange={(e) => setSetsInput(e.target.value)}
                min="1"
                className="w-32"
              />
              <Button onClick={handleSetMuscleGoal} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {goals.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No muscle group goals set. Add your first goal above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
