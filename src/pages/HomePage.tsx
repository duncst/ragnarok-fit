import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Plus, ArrowRight, Calendar, TrendingUp, Zap, Target, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { StrengthChart } from "@/components/StrengthChart";
import { RunChart } from "@/components/RunChart";
import { StatItem } from "@/components/StatItem";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecentActivity } from "@/components/RecentActivity";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Workout, Run, PersonalRecord } from '@/types';
import { Tables } from '@/integrations/supabase/types';
import { subDays, format, isSameWeek, startOfDay, isWithinInterval } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "@/components/ImageIcon";
import { BodyMetricsTracker } from "@/components/BodyMetricsTracker";
import OnboardingSettings from "@/components/onboarding/OnboardingSettings";

const VolumeIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/0ab4b431-dd06-4b92-8335-ff454c61eb04.png" alt="Volume icon" className={className} />
);

const TargetIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/069886d9-0f49-44aa-826f-3470ca94f1c1.png" alt="Target icon" className={className} />
);

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

  const { data: personalRecords, isLoading: isLoadingPRs } = useQuery<PersonalRecord[]>({
    queryKey: ['personal_records', user?.id],
    queryFn: async () => {
        if (!user) return [];
        const { data, error } = await supabase
            .from('personal_records')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw new Error('Failed to fetch personal records.');
        return data || [];
    },
    enabled: !!user,
  });

  const isLoading = isLoadingWorkouts || isLoadingRuns || isLoadingPRs;

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

  // Process personal records to separate 1RM and Valhalla scores
  const oneRepMaxRecords = personalRecords?.filter(pr => !pr.exercise_name.includes('(Valhalla)')) || [];
  const valhallaRecords = personalRecords?.filter(pr => pr.exercise_name.includes('(Valhalla)')) || [];
  
  const totalPRs = personalRecords?.length || 0;

  // Format records for display
  const formatPRsForDisplay = (records: PersonalRecord[], isValhalla: boolean = false) => {
    return records.map(pr => ({
      exercise: pr.exercise_name,
      value: isValhalla 
        ? `${Number(pr.one_rep_max).toFixed(1)}` 
        : `${Number(pr.one_rep_max).toFixed(1)} kg`,
      date: format(new Date(pr.date), 'yyyy-MM-dd'),
      type: isValhalla ? 'valhalla' : 'weight'
    }));
  };

  const allPRsForDisplay = [
    ...formatPRsForDisplay(oneRepMaxRecords, false),
    ...formatPRsForDisplay(valhallaRecords, true)
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Button asChild variant="secondary">
          <Link to="/run">
            <ImageIcon src="/lovable-uploads/ce6da73b-d67b-4c6a-9101-65cfa425f67a.png" alt="Running icon" className="mr-2 h-7 w-7" /> Start Run
          </Link>
        </Button>
        <Button asChild>
          <Link to="/workout/new">
            <Plus className="mr-2 h-6 w-6" /> Start Workout
          </Link>
        </Button>
      </div>
      
      <RecentActivity />

      <OnboardingSettings />

      <div>
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Zap className="h-7 w-7 text-primary" />
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
                    <StatItem icon={Zap} value={totalWorkouts} label="Workouts" />
                    <StatItem icon={TargetIcon} value={workoutsThisWeek} label="This Week" />
                    <StatItem icon={TrendingUp} value={totalPRs} label="PR's Set" />
                    <StatItem icon={VolumeIcon} value={`${(totalVolume / 1000).toFixed(1)}K`} label="Total Volume (kg)" />
                  </div>
                  <StrengthChart data={strengthChartData} />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <ImageIcon src="/lovable-uploads/ce6da73b-d67b-4c6a-9101-65cfa425f67a.png" alt="Running icon" className="h-8 w-8 text-primary" />
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
                    <StatItem icon={Zap} value={totalRuns} label="Total Runs" />
                    <StatItem icon={TargetIcon} value={runsThisWeek} label="This Week" />
                    <StatItem icon={Zap} value={`${totalDistance.toFixed(1)} km`} label="Total Distance" />
                    <StatItem icon={TrendingUp} value={formatPace(bestPace)} label="Best Pace (min/km)" />
                  </div>
                  <RunChart data={runChartData} />
                </>
              )}
            </CardContent>
          </Card>
          
          <BodyMetricsTracker />
          
          <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <TrendingUp className="text-primary" />
                        Personal Records
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
              {isLoading ? (
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Exercise</TableHead>
                        <TableHead className="text-center">Type</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allPRsForDisplay.length > 0 ? (
                          allPRsForDisplay.slice(0, 5).map((item, index) => (
                              <TableRow key={`${item.exercise}-${index}`}>
                                  <TableCell className="font-medium">{item.exercise}</TableCell>
                                  <TableCell className="text-center">
                                    {item.type === 'valhalla' ? (
                                      <span className="inline-flex items-center text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                        ⚔️ Valhalla
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        💪 1RM
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">{item.value}</TableCell>
                                  <TableCell className="text-right text-muted-foreground text-xs">{item.date}</TableCell>
                              </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                              No personal records yet.
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
