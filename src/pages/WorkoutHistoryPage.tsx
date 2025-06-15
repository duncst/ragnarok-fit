import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Dumbbell, BarChart2, MapPin, Heart, Repeat } from 'lucide-react';
import type { Workout, Run } from '@/types';
import { format, formatDistanceStrict } from 'date-fns';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tables } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';

const StatItem = ({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon?: React.ElementType;
  value: string | number;
  label: string;
  color?: string;
}) => (
  <div className="flex items-center gap-2">
    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    {color && <div className={`h-3 w-3 rounded-full ${color}`} />}
    <div>
      <p className="font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

const getWorkoutDuration = (workout: Workout) => {
    if (!workout.endTime) return 'N/A';
    const duration = formatDistanceStrict(workout.endTime, workout.startTime);
    // make it more readable like 1h 15m
    return duration
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h');
};

const getTotalSets = (workout: Workout) => {
  return workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
};

const getTotalVolume = (workout: Workout) => {
  return workout.exercises.reduce((vol, ex) => 
    vol + ex.sets.reduce((setVol, set) => 
      setVol + (set.completed ? set.reps * set.weight : 0), 0), 0);
};

const getRunDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && hours === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
};

const WorkoutCard = ({ workout }: { workout: Workout }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const totalSets = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);
  const avgPerSet = totalSets > 0 ? totalVolume / totalSets : 0;
  const duration = getWorkoutDuration(workout);

  const handleRepeatWorkout = () => {
    navigate('/workout/new', { state: { workout } });
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className="font-semibold text-card-foreground">{workout.name}</Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                <span>{format(workout.startTime, 'MMM d, yyyy')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleRepeatWorkout}>
                <Repeat className="h-4 w-4" />
                <span className="sr-only">Repeat workout</span>
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 text-sm">
              <StatItem icon={Dumbbell} value={workout.exercises.length} label="Exercises" />
              <StatItem icon={BarChart2} value={totalSets} label="Sets" />
              <StatItem color="bg-purple-500" value={`${Math.round(totalVolume).toLocaleString()}`} label="Total Volume (kg)" />
              <StatItem color="bg-orange-500" value={`${Math.round(avgPerSet)}`} label="Avg per Set" />
          </div>
          
          {workout.notes && (
            <div className="bg-secondary/50 p-3 rounded-md text-sm text-muted-foreground">
              <p>{workout.notes}</p>
            </div>
          )}

          <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full">
                {isOpen ? 'Hide exercises' : 'Show exercises'}
              </Button>
          </CollapsibleTrigger>
        </CardContent>

        <CollapsibleContent>
            <div className="border-t p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exercise</TableHead>
                      <TableHead className="text-right">Set</TableHead>
                      <TableHead className="text-right">Reps</TableHead>
                      <TableHead className="text-right">Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workout.exercises.map(exercise =>
                      exercise.sets.map((set, index) => (
                        <TableRow key={set.id}>
                          <TableCell className="font-medium">{index === 0 ? exercise.name : ''}</TableCell>
                          <TableCell className="text-right">{index + 1}</TableCell>
                          <TableCell className="text-right">{set.reps}</TableCell>
                          <TableCell className="text-right">{set.weight > 0 ? `${set.weight}kg` : 'BW'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
            </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

const RunCard = ({ run }: { run: Run }) => {
    const avgPace = run.distance > 0 ? run.duration / run.distance : 0;
    const paceMinutes = Math.floor(avgPace / 60);
    const paceSeconds = Math.round(avgPace % 60).toString().padStart(2, '0');

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="outline" className="font-semibold text-card-foreground">{run.runType}</Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(run.date, 'MMM d, yyyy')}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{getRunDuration(run.duration)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 text-sm">
                   <StatItem icon={MapPin} value={`${run.distance.toFixed(1)} km`} label="Distance" />
                   <StatItem icon={Clock} value={`${paceMinutes}:${paceSeconds}/km`} label="Avg Pace" />
                   {run.elevation && <StatItem value={`${run.elevation} m`} label="Elevation" />}
                   {run.avgHr && <StatItem color="bg-red-500" value={`${run.avgHr} bpm`} label="Avg HR" />}
                </div>
                
                {run.notes && (
                  <div className="bg-secondary/50 p-3 rounded-md text-sm text-muted-foreground">
                    <p>{run.notes}</p>
                  </div>
                )}
            </CardContent>
        </Card>
    );
};

const WorkoutHistoryPage = () => {
  const { user } = useAuth();

  const { data: workoutHistory, isLoading: isLoadingWorkouts } = useQuery<Workout[]>({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase.rpc('get_user_workouts');

      if (error) {
        console.error('Error fetching workouts:', error);
        throw new Error('Failed to fetch workout history.');
      }

      if (!data) return [];
      
      // The RPC returns a JSONB object, which Tanstack Query will parse.
      // We need to convert date strings to Date objects.
      const parsedWorkouts = (data as any[]).map(workout => ({
        ...workout,
        startTime: new Date(workout.startTime),
        endTime: workout.endTime ? new Date(workout.endTime) : undefined,
      }));

      return parsedWorkouts;
    },
    enabled: !!user,
  });

  const { data: runHistory, isLoading: isLoadingRuns } = useQuery<Run[]>({
    queryKey: ['runs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('runs')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching runs:', error);
        throw new Error('Failed to fetch run history.');
      }

      if (!data) return [];
      
      const parsedRuns = (data as Tables<'runs'>[]).map(run => ({
        id: run.id,
        distance: run.distance,
        duration: run.duration,
        runType: run.run_type,
        date: new Date(run.date),
        notes: run.notes,
        elevation: run.elevation,
        avgHr: run.avg_hr,
      }));

      return parsedRuns;
    },
    enabled: !!user,
  });

  const isLoading = isLoadingWorkouts || isLoadingRuns;

  const combinedHistory = [
    ...(workoutHistory || []).map(w => ({ ...w, type: 'workout' as const, date: w.startTime })),
    ...(runHistory || []).map(r => ({ ...r, type: 'run' as const }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">History</h1>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-secondary text-sm">{combinedHistory.length} total activities</p>
      </div>
      
      {combinedHistory.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>No activities recorded yet.</p>
            <p>Go to "New Workout" to log your first session!</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {combinedHistory.map(item => {
          if (item.type === 'workout') {
            return <WorkoutCard key={item.id} workout={item} />
          }
          if (item.type === 'run') {
            return <RunCard key={item.id} run={item} />
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default WorkoutHistoryPage;
