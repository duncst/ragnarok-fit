import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Target, Edit3, Trash2, Check, X } from 'lucide-react';
import { useWeeklyDistanceGoal } from '@/hooks/useWeeklyDistanceGoal';

interface WeeklyDistanceGoalProps {
  weeklyDistance: number;
}

export const WeeklyDistanceGoal = ({ weeklyDistance }: WeeklyDistanceGoalProps) => {
  const { goal, isLoading, setWeeklyGoal, deleteGoal } = useWeeklyDistanceGoal();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setInputValue(goal ? goal.target_distance.toString() : '');
  };

  const handleSave = async () => {
    const target = parseFloat(inputValue);
    if (target > 0) {
      await setWeeklyGoal(target);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue('');
  };

  const handleDelete = async () => {
    await deleteGoal();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4 text-primary" />
            Weekly Distance Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!goal && !isEditing) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4 text-primary" />
            Weekly Distance Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">Set a weekly distance target</p>
            <Button onClick={handleEdit} size="sm" className="w-full">
              <Target className="h-4 w-4 mr-2" />
              Set Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const targetDistance = goal?.target_distance || 0;
  const progressPercent = targetDistance > 0 ? Math.min((weeklyDistance / targetDistance) * 100, 100) : 0;
  const remaining = Math.max(targetDistance - weeklyDistance, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4 text-primary" />
            Weekly Distance Goal
          </CardTitle>
          {!isEditing && goal && (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Enter distance (km)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="0"
                step="0.1"
                className="text-sm"
              />
              <span className="text-xs text-muted-foreground">km</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="flex-1">
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {weeklyDistance.toFixed(1)} / {targetDistance}km
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {remaining > 0 
                ? `${remaining.toFixed(1)}km remaining` 
                : progressPercent >= 100 
                  ? '🎉 Goal achieved!' 
                  : ''
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};