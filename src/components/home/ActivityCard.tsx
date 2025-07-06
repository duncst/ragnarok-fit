
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { formatDistanceToNow, formatDistanceStrict } from 'date-fns';
import { ImageIcon } from "@/components/ImageIcon";
import { Badge } from "@/components/ui/badge";
import { getWorkoutBadge, isHeroCallWorkout } from "@/lib/workoutUtils";
import type { Workout, Run } from '@/types';

type Activity = (Workout & {type: 'workout', date: Date}) | (Run & {type: 'run'});

interface ActivityCardProps {
  activity: Activity;
}

const getWorkoutDuration = (workout: Workout) => {
    if (!workout.endTime) return 'N/A';
    const duration = formatDistanceStrict(workout.endTime, workout.startTime);
    return duration
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h');
};

const getRunDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
};

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  // Clean up the name for Hero's Call workouts
  let displayName = activity.type === 'workout' ? activity.name : activity.runType;
  if (activity.type === 'workout' && isHeroCallWorkout(activity.name)) {
    // Remove "Hero's Call: " prefix for display since we show it in the badge
    displayName = activity.name.replace("Hero's Call: ", "");
  }
  
  const details = activity.type === 'workout' 
    ? `${activity.exercises.length} exercises • ${getWorkoutDuration(activity)}`
    : `${activity.distance.toFixed(1)} km • ${getRunDuration(activity.duration)}`;
  
  const workoutBadge = activity.type === 'workout' ? getWorkoutBadge(activity.name) : null;
  
  return (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-secondary p-3 rounded-full">
            {activity.type === 'workout' ? 
              <Zap className="h-6 w-6 text-primary" /> : 
              <ImageIcon src="/lovable-uploads/ce6da73b-d67b-4c6a-9101-65cfa425f67a.png" alt="Running icon" className="h-7 w-7 text-primary" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold truncate">{displayName}</p>
              {workoutBadge && (
                <Badge variant={workoutBadge.variant} className="text-xs flex-shrink-0">
                  <span className="mr-1">{workoutBadge.icon}</span>
                  {workoutBadge.text}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{details}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground flex-shrink-0 ml-2">
          {formatDistanceToNow(activity.date, { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
};
