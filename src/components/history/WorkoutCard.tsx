
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Dumbbell, BarChart2, Repeat, Check } from 'lucide-react';
import type { Workout } from '@/types';
import { format } from 'date-fns';
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
import { useNavigate } from 'react-router-dom';
import StatItem from './StatItem';
import { getWorkoutDuration, getTotalSets, getTotalVolume } from '@/lib/historyUtils';
import { useDeleteActivity } from '@/hooks/useDeleteActivity';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const WorkoutCard = ({ workout }: { workout: Workout }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { deleteWorkout, isDeletingWorkout } = useDeleteActivity();

  const totalSets = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);
  const avgPerSet = totalSets > 0 ? totalVolume / totalSets : 0;
  const duration = getWorkoutDuration(workout);

  const handleRepeatWorkout = () => {
    navigate('/workout/new', { state: { workout } });
  };

  const handleDeleteWorkout = () => {
    deleteWorkout(workout.id);
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
            <div className="flex items-center gap-0.5">
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
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workout.exercises.map(exercise =>
                      exercise.sets.map((set, index) => (
                        <TableRow key={set.id} className={!set.completed ? 'text-muted-foreground' : ''}>
                          <TableCell className="font-medium">{index === 0 ? exercise.name : ''}</TableCell>
                          <TableCell className="text-right">{index + 1}</TableCell>
                          <TableCell className="text-right">{set.reps}</TableCell>
                          <TableCell className="text-right">{set.weight > 0 ? `${set.weight}kg` : 'BW'}</TableCell>
                          <TableCell className="text-right">
                            {set.completed && <Check className="h-4 w-4 inline text-green-500" />}
                          </TableCell>
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

export default WorkoutCard;
