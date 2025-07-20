import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Flame, CalendarCheck } from 'lucide-react';
import { useHeroCallData } from '@/hooks/useHeroCallData';
import { useForgeData } from '@/hooks/useForgeData';

const ForgeProgressSection = () => {
  const { stats } = useHeroCallData();
  const { forgeProgress, isLoading, nextTitleInfo } = useForgeData();

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
    <AccordionItem value="daily-progress" className="bg-gradient-to-r from-orange-500/10 to-red-500/20 border-orange-500/30 rounded-lg">
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <div className="text-left">
            <h1 className="text-xl font-bold text-foreground">How will you answer the Hero's Call?</h1>
            <p className="text-sm text-muted-foreground">Complete daily challenges or your own workouts to advance</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="text-center space-y-4">
          <div className="bg-black/10 dark:bg-white/10 rounded-lg p-4 space-y-3">
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

            {/* Next Title Progress */}
            {nextTitleInfo && !isLoading && (
              <div className="pt-2 border-t border-orange-500/20">
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Next challenge to ascend:
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <span className="text-orange-600 dark:text-orange-400">{nextTitleInfo.currentTitle}</span>
                    <span className="text-muted-foreground">➔</span>
                    <span className="text-primary font-bold">{nextTitleInfo.nextTitle}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Weekly Progress Circles */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>This Week's Forge ({stats.weeklyCount}/5 days to forge the week)</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              {weeklyStatus.map((day, index) => {
                const runeMap = {
                  'Mon': 'ᚱ',
                  'Tue': 'ᚢ',
                  'Wed': 'ᚦ',
                  'Thu': 'ᚨ',
                  'Fri': 'ᛏ',
                  'Sat': 'ᛜ',
                  'Sun': 'ᛉ'
                };
                
                return (
                  <div key={day.name} className="flex flex-col items-center gap-1">
                    <div className="text-xs text-muted-foreground">{day.name}</div>
                    <div className={`h-8 w-8 flex items-center justify-center text-xl font-bold ${
                      day.isCompleted 
                        ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' 
                        : 'text-muted-foreground/50'
                    }`}>
                      {runeMap[day.name]}
                    </div>
                  </div>
                );
              })}
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
      </AccordionContent>
    </AccordionItem>
  );
};

export default ForgeProgressSection;