
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Dumbbell, BarChart2 } from 'lucide-react';
import type { Workout } from '@/types';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Check } from 'lucide-react';
import { getWorkoutDuration, getTotalSets, getTotalVolume } from '@/lib/historyUtils';
import { getWorkoutBadge, isHeroCallWorkout } from '@/lib/workoutUtils';

interface WorkoutDetailsModalProps {
  workout: Workout | null;
  isOpen: boolean;
  onClose: () => void;
}

const WorkoutDetailsModal = ({ workout, isOpen, onClose }: WorkoutDetailsModalProps) => {
  if (!workout) return null;

  const totalSets = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);
  const avgPerSet = totalSets > 0 ? totalVolume / totalSets : 0;
  const duration = getWorkoutDuration(workout);
  const workoutBadge = getWorkoutBadge(workout.name);

  // Clean up the name for Hero's Call workouts
  let displayName = workout.name;
  if (isHeroCallWorkout(workout.name)) {
    displayName = workout.name.replace("Hero's Call: ", "");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <span>{displayName}</span>
            {workoutBadge && (
              <Badge variant={workoutBadge.variant} className="text-xs">
                <span className="mr-1">{workoutBadge.icon}</span>
                {workoutBadge.text}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workout Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">{format(workout.startTime, 'MMM d, yyyy')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-medium">{duration}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Exercises</p>
                <p className="font-medium">{workout.exercises.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total Sets</p>
                <p className="font-medium">{totalSets}</p>
              </div>
            </div>
          </div>

          {/* Volume Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold text-purple-600">{Math.round(totalVolume).toLocaleString()} kg</p>
            </div>
            
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Average per Set</p>
              <p className="text-2xl font-bold text-orange-600">{Math.round(avgPerSet)} kg</p>
            </div>
          </div>

          {/* Exercise Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Exercise Details</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exercise</TableHead>
                  <TableHead className="text-right">Set</TableHead>
                  <TableHead className="text-right">Reps</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workout.exercises.map(exercise =>
                  exercise.sets.map((set, index) => (
                    <TableRow key={set.id} className={!set.completed ? 'text-muted-foreground' : ''}>
                      <TableCell className="font-medium">
                        {index === 0 ? exercise.name : ''}
                      </TableCell>
                      <TableCell className="text-right">{index + 1}</TableCell>
                      <TableCell className="text-right">{set.reps}</TableCell>
                      <TableCell className="text-right">
                        {set.weight > 0 ? `${set.weight}kg` : 'BW'}
                      </TableCell>
                      <TableCell className="text-right">
                        {set.completed ? `${(set.reps * set.weight).toFixed(1)}kg` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {set.completed && <Check className="h-4 w-4 inline text-green-500" />}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Notes */}
          {workout.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm">{workout.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutDetailsModal;
