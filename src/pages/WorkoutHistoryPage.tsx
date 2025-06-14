import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Dumbbell, BarChart2, MapPin, Heart } from 'lucide-react';
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

const workoutHistory: Workout[] = [
  {
    id: 'workout-1',
    name: 'Push Day',
    startTime: new Date('2025-06-10T09:00:00'),
    endTime: new Date('2025-06-10T10:15:00'),
    notes: 'Great session, hit new PR on bench!',
    exercises: [
      { id: 'ex-1-1', name: 'Bench Press', sets: [ { id: 's1', reps: 8, weight: 80, completed: true }, { id: 's2', reps: 8, weight: 80, completed: true }, { id: 's3', reps: 6, weight: 85, completed: true } ]},
      { id: 'ex-1-2', name: 'Overhead Press', sets: [ { id: 's1', reps: 10, weight: 40, completed: true }, { id: 's2', reps: 10, weight: 40, completed: true }, { id: 's3', reps: 8, weight: 45, completed: true } ]},
      { id: 'ex-1-3', name: 'Incline Dumbbell Press', sets: [ { id: 's1', reps: 12, weight: 25, completed: true }, { id: 's2', reps: 12, weight: 25, completed: true }, { id: 's3', reps: 10, weight: 25, completed: true } ]},
      { id: 'ex-1-4', name: 'Tricep Pushdown', sets: [ { id: 's1', reps: 15, weight: 20, completed: true }, { id: 's2', reps: 15, weight: 20, completed: true }, { id: 's3', reps: 12, weight: 25, completed: true } ]},
      { id: 'ex-1-5', name: 'Lateral Raises', sets: [ { id: 's1', reps: 15, weight: 10, completed: true }, { id: 's2', reps: 15, weight: 10, completed: true }, { id: 's3', reps: 15, weight: 10, completed: true } ]},
      { id: 'ex-1-6', name: 'Chest Flys', sets: [ { id: 's1', reps: 12, weight: 15, completed: true }, { id: 's2', reps: 12, weight: 15, completed: true }]},
      { id: 'ex-1-7', name: 'Front Raises', sets: [ { id: 's1', reps: 12, weight: 10, completed: true }, { id: 's2', reps: 12, weight: 10, completed: true }]},
      { id: 'ex-1-8', name: 'Push Ups', sets: [ { id: 's1', reps: 20, weight: 0, completed: true }, { id: 's2', reps: 18, weight: 0, completed: true }]},
    ],
  },
  {
    id: 'workout-2',
    name: 'Pull Day',
    startTime: new Date('2025-06-08T17:30:00'),
    endTime: new Date('2025-06-08T19:00:00'),
    exercises: [
        { id: 'ex-2-1', name: 'Deadlift', sets: [ { id: 's1', reps: 5, weight: 130, completed: true }, { id: 's2', reps: 5, weight: 130, completed: true }, { id: 's3', reps: 3, weight: 140, completed: true } ]},
        { id: 'ex-2-2', name: 'Pull Ups', sets: [ { id: 's1', reps: 8, weight: 0, completed: true }, { id: 's2', reps: 6, weight: 0, completed: true }, { id: 's3', reps: 5, weight: 0, completed: true } ]},
        { id: 'ex-2-3', name: 'Bent Over Rows', sets: [ { id: 's1', reps: 10, weight: 60, completed: true }, { id: 's2', reps: 10, weight: 60, completed: true }, { id: 's3', reps: 8, weight: 65, completed: true } ]},
        { id: 'ex-2-4', name: 'Bicep Curls', sets: [ { id: 's1', reps: 12, weight: 15, completed: true }, { id: 's2', reps: 12, weight: 15, completed: true }, { id: 's3', reps: 10, weight: 15, completed: true } ]},
        { id: 'ex-2-5', name: 'Face Pulls', sets: [ { id: 's1', reps: 15, weight: 15, completed: true }, { id: 's2', reps: 15, weight: 15, completed: true }, { id: 's3', reps: 15, weight: 15, completed: true } ]},
        { id: 'ex-2-6', name: 'Lat Pulldowns', sets: [ { id: 's1', reps: 12, weight: 50, completed: true }, { id: 's2', reps: 10, weight: 55, completed: true }]},
        { id: 'ex-2-7', name: 'Hammer Curls', sets: [ { id: 's1', reps: 12, weight: 12, completed: true }, { id: 's2', reps: 10, weight: 12, completed: true }]},
    ]
  },
  {
    id: 'workout-3',
    name: 'Leg Day',
    startTime: new Date('2025-06-06T08:00:00'),
    endTime: new Date('2025-06-06T09:45:00'),
    notes: 'Focused on high volume squats',
    exercises: [
        { id: 'ex-3-1', name: 'Squats', sets: [ { id: 's1', reps: 10, weight: 100, completed: true }, { id: 's2', reps: 10, weight: 100, completed: true }, { id: 's3', reps: 8, weight: 110, completed: true }, { id: 's4', reps: 8, weight: 110, completed: true } ]},
        { id: 'ex-3-2', name: 'Leg Press', sets: [ { id: 's1', reps: 12, weight: 200, completed: true }, { id: 's2', reps: 12, weight: 200, completed: true }, { id: 's3', reps: 10, weight: 220, completed: true } ]},
        { id: 'ex-3-3', name: 'Leg Curls', sets: [ { id: 's1', reps: 15, weight: 40, completed: true }, { id: 's2', reps: 15, weight: 40, completed: true }, { id: 's3', reps: 12, weight: 45, completed: true } ]},
        { id: 'ex-3-4', name: 'Leg Extensions', sets: [ { id: 's1', reps: 15, weight: 40, completed: true }, { id: 's2', reps: 15, weight: 40, completed: true }, { id: 's3', reps: 12, weight: 45, completed: true } ]},
        { id: 'ex-3-5', name: 'Calf Raises', sets: [ { id: 's1', reps: 20, weight: 50, completed: true }, { id: 's2', reps: 20, weight: 50, completed: true }, { id: 's3', reps: 15, weight: 60, completed: true } ]},
        { id: 'ex-3-6', name: 'Goblet Squats', sets: [ { id: 's1', reps: 12, weight: 20, completed: true }, { id: 's2', reps: 12, weight: 20, completed: true }]},
    ]
  }
];

const runHistory: Run[] = [
  {
    id: 'run-1',
    distance: 12.9,
    duration: 4320, // 1h 12m
    runType: 'Long Run',
    date: new Date('2025-06-10T08:00:00'),
    notes: 'Felt strong throughout, negative split',
    elevation: 75,
    avgHr: 155,
  },
  {
    id: 'run-2',
    distance: 8.0,
    duration: 2520, // 42m
    runType: 'Tempo Run',
    date: new Date('2025-06-08T08:00:00'),
    elevation: 37,
    avgHr: 168,
  },
  {
    id: 'run-3',
    distance: 5.6,
    duration: 1875, // 31m 15s
    runType: 'Easy Run',
    date: new Date('2025-06-06T18:00:00'),
    elevation: 26,
    avgHr: 145,
  },
  {
    id: 'run-4',
    distance: 6.8,
    duration: 2100, // 35m
    runType: 'Interval Training',
    date: new Date('2025-06-04T19:00:00'),
    elevation: 29,
    avgHr: 175,
  }
];


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
  const totalSets = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);
  const avgPerSet = totalSets > 0 ? totalVolume / totalSets : 0;
  const duration = getWorkoutDuration(workout);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className="font-semibold">{workout.name}</Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                <span>{format(workout.startTime, 'MMM d, yyyy')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
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
                        <Badge variant="outline" className="font-semibold">{run.runType}</Badge>
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

  const combinedHistory = [
    ...workoutHistory.map(w => ({ ...w, type: 'workout' as const, date: w.startTime })),
    ...runHistory.map(r => ({ ...r, type: 'run' as const }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted-foreground text-sm">{combinedHistory.length} total activities</p>
      </div>
      
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
