
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar, CalendarCheck, ChevronDown } from 'lucide-react';

interface StreakTrackerProps {
  streakData: {
    currentStreak: number;
    weeklyCount: number;
    lastCompleted: string | null;
    completedDays?: string[]; // Array of completed day names
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

  // Generate array for 7 days of the week (Monday to Sunday)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get current week completion status
  const getWeeklyCompletionStatus = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    return weekDays.map((dayName, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      const isToday = dayDate.toDateString() === today.toDateString();
      const isPast = dayDate < today;
      
      // Convert day name to check against completed days
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayIndex = index === 6 ? 0 : index + 1; // Adjust for our Monday-start vs Sunday-start difference
      const completedDayName = dayNames[dayIndex];
      const isCompleted = streakData.completedDays?.includes(completedDayName) || false;
      
      return {
        name: dayName,
        isToday,
        isPast,
        isCompleted,
        isFuture: dayDate > today
      };
    });
  };

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

  const weeklyStatus = getWeeklyCompletionStatus();

  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2">
          <Badge variant={completedToday ? "default" : "outline"} className="flex items-center gap-1">
            {completedToday ? <CalendarCheck className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
            Weekly Progress: {streakData.weeklyCount}/5
          </Badge>
        </div>
        <ChevronDown className="h-4 w-4 transition-transform duration-200 ui-state-open:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2">
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

          {/* Weekly completion circles */}
          <div className="flex items-center justify-center gap-3">
            {weeklyStatus.map((day) => (
              <div key={day.name} className="flex flex-col items-center gap-1">
                <div className="text-xs text-muted-foreground">{day.name}</div>
                {day.isCompleted ? (
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                    <CalendarCheck className="h-3 w-3 text-white" />
                  </div>
                ) : day.isToday ? (
                  <div className="h-6 w-6 rounded-full border-2 border-primary bg-primary/20" />
                ) : day.isPast ? (
                  <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/50" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>

          {streakData.currentStreak > 0 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Current streak: <span className="font-bold text-primary">{streakData.currentStreak} days</span>
              </p>
            </div>
          )}
          
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
      </CollapsibleContent>
    </Collapsible>
  );
};
