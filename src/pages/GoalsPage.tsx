import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, Trash2, Plus } from 'lucide-react';
import { useWeeklyDistanceGoal } from '@/hooks/useWeeklyDistanceGoal';
import { useMuscleGroupGoals } from '@/hooks/useMuscleGroupGoals';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const GoalsPage = () => {
  const { goal: distanceGoal, setWeeklyGoal: setDistanceGoal, deleteGoal: deleteDistanceGoal } = useWeeklyDistanceGoal();
  const { goals: muscleGoals, setGoal: setMuscleGoal, deleteGoal: deleteMuscleGoal } = useMuscleGroupGoals();
  
  const [distanceInput, setDistanceInput] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [setsInput, setSetsInput] = useState('');

  const handleSetDistanceGoal = () => {
    const distance = parseFloat(distanceInput);
    if (distance > 0) {
      setDistanceGoal(distance);
      setDistanceInput('');
    }
  };

  const handleSetMuscleGoal = () => {
    const sets = parseInt(setsInput);
    if (selectedMuscleGroup && sets > 0) {
      setMuscleGoal(selectedMuscleGroup, sets);
      setSelectedMuscleGroup('');
      setSetsInput('');
    }
  };

  const availableMuscleGroups = MUSCLE_GROUPS.filter(
    mg => !muscleGoals.find(g => g.muscle_group === mg)
  );

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Target className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Training Goals</h1>
      </div>

      {/* Weekly Distance Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Distance Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {distanceGoal ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{distanceGoal.target_distance} km/week</p>
                  <p className="text-sm text-muted-foreground">Current goal</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteDistanceGoal()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-distance">Update Goal</Label>
                <div className="flex gap-2">
                  <Input
                    id="update-distance"
                    type="number"
                    placeholder="Distance (km)"
                    value={distanceInput}
                    onChange={(e) => setDistanceInput(e.target.value)}
                    min="0"
                    step="0.5"
                  />
                  <Button onClick={handleSetDistanceGoal}>Update</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="new-distance">Set Weekly Distance Target</Label>
              <div className="flex gap-2">
                <Input
                  id="new-distance"
                  type="number"
                  placeholder="Distance (km)"
                  value={distanceInput}
                  onChange={(e) => setDistanceInput(e.target.value)}
                  min="0"
                  step="0.5"
                />
                <Button onClick={handleSetDistanceGoal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Set Goal
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Muscle Group Volume Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Muscle Group Volume Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {muscleGoals.length > 0 && (
            <div className="space-y-2">
              {muscleGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{goal.muscle_group}</p>
                    <p className="text-sm text-muted-foreground">
                      {goal.weekly_target_sets} sets/week
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMuscleGoal(goal.muscle_group)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {availableMuscleGroups.length > 0 && (
            <div className="space-y-2">
              <Label>Add Muscle Group Goal</Label>
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
                <Button onClick={handleSetMuscleGoal}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {muscleGoals.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No muscle group goals set. Add your first goal above.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground space-y-2 p-4 bg-muted/50 rounded-lg">
        <p className="font-medium">Recommendations:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Most muscle groups: 10-20 sets per week</li>
          <li>Smaller muscles (biceps, calves): 8-15 sets per week</li>
          <li>Larger muscles (legs, back): 12-22 sets per week</li>
        </ul>
      </div>
    </div>
  );
};

export default GoalsPage;
