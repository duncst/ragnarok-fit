
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Dumbbell, BarChart2 } from 'lucide-react';
import type { Workout } from '@/types';
import { format, formatDistanceStrict } from 'date-fns';

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

const WorkoutHistoryPage = () => {

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workout History</h1>
        <p className="text-muted-foreground text-sm">{workoutHistory.length} total workouts</p>
      </div>
      
      <div className="space-y-4">
        {workoutHistory.map(workout => {
          const totalSets = getTotalSets(workout);
          const totalVolume = getTotalVolume(workout);
          const avgPerSet = totalSets > 0 ? totalVolume / totalSets : 0;
          const duration = getWorkoutDuration(workout);

          return (
            <Card key={workout.id}>
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutHistoryPage;
