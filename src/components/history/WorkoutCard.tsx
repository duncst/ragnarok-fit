
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Dumbbell, BarChart2, Repeat, Eye } from 'lucide-react';
import type { Workout } from '@/types';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import StatItem from './StatItem';
import { getWorkoutDuration, getTotalSets, getTotalVolume } from '@/lib/historyUtils';
import { useDeleteActivity } from '@/hooks/useDeleteActivity';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { getWorkoutBadge, isHeroCallWorkout } from '@/lib/workoutUtils';
import WorkoutDetailsModal from './WorkoutDetailsModal';

const WorkoutCard = ({ workout }: { workout: Workout }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const navigate = useNavigate();
  const { deleteWorkout, isDeletingWorkout } = useDeleteActivity();

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

  const handleRepeatWorkout = () => {
    navigate('/workout/new', { state: { workout } });
  };

  const handleDeleteWorkout = () => {
    deleteWorkout(workout.id);
  };

  return (
    <>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className="font-semibold text-card-foreground">{displayName}</Badge>
                {workoutBadge && (
                  <Badge variant={workoutBadge.variant} className="text-xs flex-shrink-0">
                    <span className="mr-1">{workoutBadge.icon}</span>
                    {workoutBadge.text}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(workout.startTime, 'MMM d, yyyy')}</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Button variant="ghost" size="icon" onClick={() => setShowDetails(true)}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View details</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRepeatWorkout}>
                <Repeat className="h-4 w-4" />
                <span className="sr-only">Repeat workout</span>
              </Button>
              <DeleteConfirmationDialog onConfirm={handleDeleteWorkout} isLoading={isDeletingWorkout} />
              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-2">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 text-sm">
              <StatItem icon={Dumbbell} value={workout.exercises.length} label="Exercises" />
              <StatItem icon={BarChart2} value={totalSets} label="Completed Sets" />
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

      <WorkoutDetailsModal 
        workout={workout}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
};

export default WorkoutCard;
