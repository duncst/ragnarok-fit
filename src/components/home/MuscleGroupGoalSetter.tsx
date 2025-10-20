import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Target, Edit } from 'lucide-react';
import { useMuscleGroupGoals } from '@/hooks/useMuscleGroupGoals';

const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
];

export const MuscleGroupGoalSetter = () => {
  const { goals, setGoal, getGoal } = useMuscleGroupGoals();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [setsInput, setSetsInput] = useState('');

  const handleMuscleGroupChange = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup);
    const existingGoal = getGoal(muscleGroup);
    if (existingGoal) {
      setSetsInput(existingGoal.weekly_target_sets.toString());
    } else {
      setSetsInput('');
    }
  };

  const handleSetMuscleGoal = () => {
    const sets = parseInt(setsInput);
    if (selectedMuscleGroup && sets > 0) {
      setGoal(selectedMuscleGroup, sets);
      setSelectedMuscleGroup('');
      setSetsInput('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSelectedMuscleGroup('');
    setSetsInput('');
  };

  const existingGoal = selectedMuscleGroup ? getGoal(selectedMuscleGroup) : null;
  const isUpdating = !!existingGoal;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-5 w-5" />
          Set Muscle Group Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isAdding ? (
          <div className="space-y-3">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">Add or update weekly training targets</p>
              <Button onClick={() => setIsAdding(true)} size="sm" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Set Goal
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium">{isUpdating ? 'Update' : 'Add'} Muscle Group Goal</p>
            <div className="flex gap-2">
              <Select value={selectedMuscleGroup} onValueChange={handleMuscleGroupChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent>
                  {MUSCLE_GROUPS.map((mg) => (
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
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSetMuscleGoal} size="sm" className="flex-1">
                {isUpdating ? <Edit className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                {isUpdating ? 'Update' : 'Add'}
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
