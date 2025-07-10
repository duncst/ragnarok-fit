import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActivityData {
  date: string;
  hasWorkout: boolean;
  hasRun: boolean;
  hasHeroCall: boolean;
  hasValhalla: boolean;
}

export const MonthlyActivityCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { data: activities, isLoading } = useQuery<ActivityData[]>({
    queryKey: ['monthly-activities', user?.id, format(currentDate, 'yyyy-MM')],
    queryFn: async () => {
      if (!user) return [];
      
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      
      // Query all activity types for the month
      const [workoutsRes, runsRes, heroCallsRes, valhallaRes] = await Promise.all([
        supabase
          .from('workouts')
          .select('end_time')
          .not('end_time', 'is', null)
          .gte('end_time', monthStart.toISOString())
          .lte('end_time', monthEnd.toISOString()),
        supabase
          .from('runs')
          .select('date')
          .gte('date', monthStart.toISOString())
          .lte('date', monthEnd.toISOString()),
        supabase
          .from('hero_call_completions')
          .select('completed_at')
          .gte('completed_at', monthStart.toISOString())
          .lte('completed_at', monthEnd.toISOString()),
        supabase
          .from('valhalla_challenges')
          .select('completed_at')
          .gte('completed_at', monthStart.toISOString())
          .lte('completed_at', monthEnd.toISOString())
      ]);

      if (workoutsRes.error) throw workoutsRes.error;
      if (runsRes.error) throw runsRes.error;
      if (heroCallsRes.error) throw heroCallsRes.error;
      if (valhallaRes.error) throw valhallaRes.error;

      // Group by date
      const activityMap = new Map<string, ActivityData>();
      
      // Process workouts
      workoutsRes.data?.forEach(workout => {
        const dateKey = format(new Date(workout.end_time!), 'yyyy-MM-dd');
        const existing = activityMap.get(dateKey) || { date: dateKey, hasWorkout: false, hasRun: false, hasHeroCall: false, hasValhalla: false };
        existing.hasWorkout = true;
        activityMap.set(dateKey, existing);
      });

      // Process runs
      runsRes.data?.forEach(run => {
        const dateKey = format(new Date(run.date), 'yyyy-MM-dd');
        const existing = activityMap.get(dateKey) || { date: dateKey, hasWorkout: false, hasRun: false, hasHeroCall: false, hasValhalla: false };
        existing.hasRun = true;
        activityMap.set(dateKey, existing);
      });

      // Process hero calls
      heroCallsRes.data?.forEach(heroCall => {
        const dateKey = format(new Date(heroCall.completed_at), 'yyyy-MM-dd');
        const existing = activityMap.get(dateKey) || { date: dateKey, hasWorkout: false, hasRun: false, hasHeroCall: false, hasValhalla: false };
        existing.hasHeroCall = true;
        activityMap.set(dateKey, existing);
      });

      // Process valhalla challenges
      valhallaRes.data?.forEach(valhalla => {
        const dateKey = format(new Date(valhalla.completed_at), 'yyyy-MM-dd');
        const existing = activityMap.get(dateKey) || { date: dateKey, hasWorkout: false, hasRun: false, hasHeroCall: false, hasValhalla: false };
        existing.hasValhalla = true;
        activityMap.set(dateKey, existing);
      });

      return Array.from(activityMap.values());
    },
    enabled: !!user,
  });

  const getActivityForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return activities?.find(activity => activity.date === dateKey);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const ActivityIndicators = ({ date }: { date: Date }) => {
    const activity = getActivityForDate(date);
    if (!activity) return null;

    const indicators = [];
    
    if (activity.hasWorkout) {
      indicators.push(
        <div key="workout" className="w-2 h-2 rounded-full bg-blue-500" title="Workout" />
      );
    }
    if (activity.hasRun) {
      indicators.push(
        <div key="run" className="w-2 h-2 rounded-full bg-green-500" title="Run" />
      );
    }
    if (activity.hasHeroCall) {
      indicators.push(
        <div key="hero-call" className="w-2 h-2 rounded-full bg-orange-500" title="Hero's Call" />
      );
    }
    if (activity.hasValhalla) {
      indicators.push(
        <div key="valhalla" className="w-2 h-2 rounded-full bg-purple-500" title="Valhalla Challenge" />
      );
    }

    return (
      <div className="flex gap-1 mt-1 justify-center">
        {indicators}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium text-foreground min-w-[120px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Workout</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Run</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Hero's Call</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Valhalla</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          month={currentDate}
          onMonthChange={setCurrentDate}
          className="rounded-md border pointer-events-auto"
          classNames={{
            day: cn(
              "h-12 w-12 p-0 font-normal aria-selected:opacity-100 flex flex-col items-center justify-center relative"
            ),
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
          }}
          components={{
            DayContent: ({ date }) => (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <span className="text-sm">{format(date, 'd')}</span>
                <ActivityIndicators date={date} />
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};