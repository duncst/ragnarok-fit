
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Footprints, Plus, ArrowRight, Calendar, TrendingUp, Zap, Target, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { StrengthChart } from "@/components/StrengthChart";
import { RunChart } from "@/components/RunChart";
import { StatItem } from "@/components/StatItem";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecentActivity } from "@/components/RecentActivity";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Workout, Run } from '@/types';
import { Tables } from '@/integrations/supabase/types';
import { subDays, format, isSameWeek, startOfDay, isWithinInterval } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

const oneRepMaxes = [
    { exercise: "Bench Press", weight: "100 kg", date: "2025-06-10" },
    { exercise: "Squat", weight: "140 kg", date: "2025-06-01" },
    { exercise: "Deadlift", weight: "180 kg", date: "2025-05-25" },
    { exercise: "Overhead Press", weight: "60 kg", date: "2025-06-12" },
];

const HomePage = () => {
  const { user } = useAuth();

  const { data: workoutHistory, isLoading: isLoadingWorkouts } = useQuery<Workout[]>({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
        if (!user) return [];
        const { data, error } = await supabase.rpc('get_user_workouts');
        if (error) throw new Error('Failed to fetch workout history.');
        if (!data) return [];
        return (data as any[]).map(workout => ({
            ...workout,
            startTime: new Date(workout.startTime),
            endTime: workout.endTime ? new Date(workout.endTime) : undefined,
        }));
    },
    enabled: !!user,
  });

  const { data: runHistory, isLoading: isLoadingRuns } = useQuery<Run[]>({
      queryKey: ['runs', user?.id],
      queryFn: async () => {
          if (!user) return [];
          const { data, error } = await supabase.from('runs').select('*').order('date', { ascending: false });
          if (error) throw new Error('Failed to fetch run history.');
          if (!data) return [];
          return (data as Tables<'runs'>[]).map(run => ({
              id: run.id,
              distance: run.distance,
              duration: run.duration,
              runType: run.run_type,
              date: new Date(run.date),
              notes: run.notes,
              elevation: run.elevation,
              avgHr: run.avg_hr,
          }));
      },
      enabled: !!user,
  });

  const isLoading = isLoadingWorkouts || isLoadingRuns;

  const today = new Date();
  const last7DaysInterval = { start: startOfDay(subDays(today, 6)), end: new Date() };

  // Strength Stats
  const totalWorkouts = workoutHistory?.length || 0;
  const workoutsThisWeek = workoutHistory?.filter(w => isSameWeek(w.startTime, today, { weekStartsOn: 1 })).length || 0;
  const totalVolume = workoutHistory?.reduce((total, workout) => {
    return total + workout.exercises.reduce((workoutTotal, exercise) => {
      return workoutTotal + exercise.sets.reduce((exerciseTotal, set) => {
        return exerciseTotal + (set.completed ? set.reps * set.weight : 0);
      }, 0);
    }, 0);
  }, 0) || 0;

  const strengthChartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    return { day: format(date, 'E'), volume: 0, date: startOfDay(date) };
  });

  workoutHistory?.filter(w => isWithinInterval(w.startTime, last7DaysInterval)).forEach(workout => {
    const workoutDay = startOfDay(workout.startTime);
    const chartEntry = strengthChartData.find(d => d.date.getTime() === workoutDay.getTime());
    
    if (chartEntry) {
      const workoutVolume = workout.exercises.reduce((acc, ex) => 
        acc + ex.sets.reduce((setAcc, set) => setAcc + (set.completed ? set.reps * set.weight : 0), 0), 0);
      chartEntry.volume += workoutVolume;
    }
  });
  
  // Running Stats
  const totalRuns = runHistory?.length || 0;
  const runsThisWeek = runHistory?.filter(r => isSameWeek(r.date, today, { weekStartsOn: 1 })).length || 0;
  const totalDistance = runHistory?.reduce((total, run) => total + run.distance, 0) || 0;
  
  const bestPace = runHistory && runHistory.length > 0
    ? Math.min(...runHistory.map(r => r.distance > 0 ? (r.duration / 60) / r.distance : Infinity).filter(p => !isNaN(p) && isFinite(p)))
    : 0;

  const formatPace = (pace: number) => {
      if (pace === 0 || pace === Infinity) return "N/A";
      const minutes = Math.floor(pace);
      const seconds = Math.round((pace - minutes) * 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const runChartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    return { day: format(date, 'E'), distance: 0, date: startOfDay(date) };
  });
  
  runHistory?.filter(r => isWithinInterval(r.date, last7DaysInterval)).forEach(run => {
    const runDay = startOfDay(run.date);
    const chartEntry = runChartData.find(d => d.date.getTime() === runDay.getTime());
    if (chartEntry) {
      chartEntry.distance += run.distance;
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Button asChild className="bg-green-500 hover:bg-green-600 text-primary-foreground">
          <Link to="/run">
            <Footprints className="mr-2 h-5 w-5" /> Start Run
          </Link>
        </Button>
        <Button asChild>
          <Link to="/workout/new">
            <Plus className="mr-2 h-5 w-5" /> Start Workout
          </Link>
        </Button>
      </div>
      
      <RecentActivity />

      <div>
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Dumbbell className="text-primary" />
                Strength Training
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
               {isLoading ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-[200px] w-full" />
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <StatItem icon={Calendar} value={totalWorkouts} label="Workouts" />
                    <StatItem icon={Target} value={workoutsThisWeek} label="This Week" />
                    <StatItem icon={TrendingUp} value={12} label="PR's Set" />
                    <StatItem icon={Zap} value={`${(totalVolume / 1000).toFixed(1)}K`} label="Total Volume (kg)" />
                  </div>
                  <StrengthChart data={strengthChartData} />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Footprints className="text-primary" />
                Running
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
               {isLoading ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-[200px] w-full" />
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <StatItem icon={Calendar} value={totalRuns} label="Total Runs" />
                    <StatItem icon={Target} value={runsThisWeek} label="This Week" />
                    <StatItem icon={Zap} value={`${totalDistance.toFixed(1)} km`} label="Total Distance" />
                    <StatItem icon={TrendingUp} value={formatPace(bestPace)} label="Best Pace (min/km)" />
                  </div>
                  <RunChart data={runChartData} />
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <TrendingUp className="text-primary" />
                        1 Rep Max PRs
                    </CardTitle>
                    <Button asChild variant="outline" size="sm">
                        <Link to="/1rm-calculator">
                            <Calculator className="mr-2 h-4 w-4" />
                            Calculator
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Exercise</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {oneRepMaxes.map(item => (
                            <TableRow key={item.exercise}>
                                <TableCell className="font-medium">{item.exercise}</TableCell>
                                <TableCell className="text-right">{item.weight}</TableCell>
                                <TableCell className="text-right text-muted-foreground text-xs">{item.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
