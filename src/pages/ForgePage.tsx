
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Crown, Lock, Flame, CalendarCheck, Sword } from 'lucide-react';
import ForgeWorkoutHistory from '@/components/forge/ForgeWorkoutHistory';
import { MonthlyActivityCalendar } from '@/components/forge/MonthlyActivityCalendar';
import { useForgeProgress } from '@/hooks/useForgeProgress';
import { useHeroCallData } from '@/hooks/useHeroCallData';
import { Skeleton } from '@/components/ui/skeleton';

// Forge titles progression
const FORGE_TITLES = [
  { minWeeks: 0, title: "Apprentice" },
  { minWeeks: 1, title: "Forge Initiate" },
  { minWeeks: 2, title: "Iron Shaper" },
  { minWeeks: 4, title: "Disciple of Flame" },
  { minWeeks: 6, title: "Steel Forger" },
  { minWeeks: 8, title: "Master Smith" },
  { minWeeks: 10, title: "Forge Master" },
  { minWeeks: 12, title: "Legendary Artisan" },
];

// Rotating forge quotes
const FORGE_QUOTES = [
  "Discipline is the spark. Action is the forge.",
  "In the crucible of persistence, legends are born.",
  "Every rep is a hammer blow upon the anvil of greatness.",
  "The flames of effort forge the soul of a warrior.",
  "What is forged in struggle cannot be broken by comfort.",
  "True strength is tempered through consistent action.",
];

const ForgePage = () => {
  const { forgeProgress, isLoading } = useForgeProgress();
  const { stats } = useHeroCallData();

  // Get next title info
  const getNextTitleInfo = () => {
    const currentWeeks = forgeProgress.currentWeek;
    const nextTitle = FORGE_TITLES.find(title => title.minWeeks > currentWeeks);
    
    if (!nextTitle) return null;
    
    const weeksNeeded = nextTitle.minWeeks - currentWeeks;
    return {
      nextTitle: nextTitle.title,
      weeksNeeded,
      currentTitle: forgeProgress.currentTitle
    };
  };

  // Get random quote (changes based on current week for pseudo-rotation)
  const getCurrentQuote = () => {
    const quoteIndex = forgeProgress.currentWeek % FORGE_QUOTES.length;
    return FORGE_QUOTES[quoteIndex];
  };

  const nextTitleInfo = getNextTitleInfo();
  const currentQuote = getCurrentQuote();

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
      <Accordion type="multiple" defaultValue={["daily-progress", "monthly-calendar"]} className="w-full space-y-4">
        {/* Daily Hero's Call Progress Tracker */}
        <AccordionItem value="daily-progress" className="bg-gradient-to-r from-orange-500/10 to-red-500/20 border-orange-500/30 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <div className="text-left">
                <h1 className="text-xl font-bold text-foreground">Daily Forging Progress</h1>
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
                        {nextTitleInfo.weeksNeeded} more Forging Week{nextTitleInfo.weeksNeeded !== 1 ? 's' : ''} to ascend:
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
          </AccordionContent>
        </AccordionItem>

        {/* Monthly Activity Calendar */}
        <AccordionItem value="monthly-calendar" className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              <span className="text-foreground text-xl font-bold">Behold your Deeds</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <MonthlyActivityCalendar />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Ritual Quote Section */}
      <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border-muted">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">Words of the Forge</span>
              <Flame className="h-4 w-4 text-primary" />
            </div>
            <blockquote className="text-lg font-medium text-foreground italic">
              "{currentQuote}"
            </blockquote>
          </div>
        </CardContent>
      </Card>

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
