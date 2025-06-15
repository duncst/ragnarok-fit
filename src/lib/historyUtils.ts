
import type { Workout } from '@/types';
import { formatDistanceStrict } from 'date-fns';

export const getWorkoutDuration = (workout: Workout) => {
    if (!workout.endTime) return 'N/A';
    const duration = formatDistanceStrict(workout.endTime, workout.startTime);
    // make it more readable like 1h 15m
    return duration
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h');
};

export const getTotalSets = (workout: Workout) => {
  return workout.exercises.reduce((acc, ex) => 
    acc + ex.sets.filter(set => set.completed).length, 0);
};

export const getTotalVolume = (workout: Workout) => {
  return workout.exercises.reduce((vol, ex) => 
    vol + ex.sets.reduce((setVol, set) => 
      setVol + (set.completed ? set.reps * set.weight : 0), 0), 0);
};

export const getRunDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && hours === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
};
