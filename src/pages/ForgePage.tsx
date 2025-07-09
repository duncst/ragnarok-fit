
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Flame, CalendarCheck, Sword } from 'lucide-react';
import ForgeWorkoutHistory from '@/components/forge/ForgeWorkoutHistory';
import { MonthlyActivityCalendar } from '@/components/forge/MonthlyActivityCalendar';
import { useForgeProgress } from '@/hooks/useForgeProgress';
import { useHeroCallData } from '@/hooks/useHeroCallData';
import { Skeleton } from '@/components/ui/skeleton';

const ForgePage = () => {
  const { forgeProgress, isLoading } = useForgeProgress();
  const { stats } = useHeroCallData();

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
      const isCompleted = stats.completedDays?.includes(completedDayName) || false;
      
      return {
        name: dayName,
        isToday,
        isPast,
        isCompleted,
        isFuture: dayDate > today
      };
    });
  };

  const weeklyStatus = getWeeklyCompletionStatus();

  return (
    <div className="space-y-6">
      {/* Daily Hero's Call Progress Tracker */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/20 border-orange-500/30">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Daily Forging Progress</h1>
                <p className="text-sm text-muted-foreground">Complete daily challenges or your own workouts to advance</p>
              </div>
            </div>
            
            <div className="bg-black/10 dark:bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">
                  Current Title
                </Badge>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-32 mx-auto" />
              ) : (
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{forgeProgress.currentTitle}</p>
              )}
            </div>

            {/* Weekly Progress Circles */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>This week's progress ({stats.weeklyCount}/5 days to forge the week)</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                {weeklyStatus.map((day, index) => (
                  <div key={day.name} className="flex flex-col items-center gap-1">
                    <div className="text-xs text-muted-foreground">{day.name}</div>
                    {day.isCompleted ? (
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                        <CalendarCheck className="h-3 w-3 text-white" />
                      </div>
                    ) : day.isToday ? (
                      <div className="h-6 w-6 rounded-full border-2 border-orange-500 bg-orange-500/20" />
                    ) : day.isPast ? (
                      <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/50" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Forging Progress</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="font-medium text-foreground">{forgeProgress.currentWeek} of {forgeProgress.totalWeeks} weeks</span>
                )}
              </div>
              {isLoading ? (
                <Skeleton className="h-3 w-full" />
              ) : (
                <Progress value={forgeProgress.progressPercentage} className="h-3" />
              )}
              <p className="text-xs text-muted-foreground">
                Complete daily challenges or your own workouts to advance through forging weeks and earn new titles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Activity Calendar */}
      <MonthlyActivityCalendar />

      <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Sword className="h-5 w-5 text-primary" />
            Workout History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ForgeWorkoutHistory />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Halls of Valhalla</h3>
            </div>
            <p className="text-muted-foreground">
              Where elite members are recognized for their legendary achievements
            </p>
            <Badge variant="secondary" className="bg-primary/20 text-foreground border-primary/30">
              <Lock className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default ForgePage;
