
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarCheck } from 'lucide-react';

interface StreakTrackerProps {
  streakData: {
    currentStreak: number;
    weeklyCount: number;
    lastCompleted: string | null;
  };
  completedToday: boolean;
  onMarkComplete?: () => void;
  showFullDisplay?: boolean;
}

export const StreakTracker = ({ 
  streakData, 
  completedToday, 
  onMarkComplete, 
  showFullDisplay = false 
}: StreakTrackerProps) => {
  const progressPercentage = Math.min((streakData.weeklyCount / 5) * 100, 100);

  if (!showFullDisplay) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={completedToday ? "default" : "outline"} className="flex items-center gap-1">
          {completedToday ? <CalendarCheck className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
          {streakData.weeklyCount}/5 this week
        </Badge>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">Weekly Progress</p>
          <p className="text-xs text-muted-foreground">Complete 5 days out of 7 to forge your week</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{streakData.weeklyCount}/5</p>
          <p className="text-xs text-muted-foreground">days this week</p>
        </div>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {!completedToday && onMarkComplete && (
        <Button 
          onClick={onMarkComplete}
          size="sm" 
          className="w-full"
        >
          Mark Today's Challenge Complete
        </Button>
      )}
      
      {completedToday && (
        <div className="flex items-center justify-center gap-2 text-sm text-green-600">
          <CalendarCheck className="h-4 w-4" />
          Today's challenge completed! 🔥
        </div>
      )}
    </div>
  );
};
