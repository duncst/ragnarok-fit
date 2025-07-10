import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Workout, Run } from '@/types';
import { Tables } from '@/integrations/supabase/types';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Zap, Calendar, Eye, RotateCcw, History } from 'lucide-react';
import { ImageIcon } from '@/components/ImageIcon';
import { getWorkoutBadge, isHeroCallWorkout } from '@/lib/workoutUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import WorkoutDetailsModal from '@/components/history/WorkoutDetailsModal';

interface WorkoutHistoryAccordionProps {
  onRedoWorkout?: (workout: Workout) => void;
  className?: string;
}

export const WorkoutHistoryAccordion = ({ onRedoWorkout, className }: WorkoutHistoryAccordionProps) => {
  const { user } = useAuth();
  const [selectedWorkout, setSelectedWorkout] = React.useState<Workout | null>(null);
  const [showDetails, setShowDetails] = React.useState(false);

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

  const combinedHistory = [
    ...(workoutHistory || []).map(w => ({ ...w, type: 'workout' as const, date: w.startTime })),
    ...(runHistory || []).map(r => ({ ...r, type: 'run' as const }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);

  const handleViewWorkoutDetails = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowDetails(true);
  };

  const handleRedoWorkout = (workout: Workout) => {
    if (onRedoWorkout) {
      onRedoWorkout(workout);
    }
  };

  const renderHistoryContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }

    if (combinedHistory.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No activities recorded yet</p>
          <p className="text-sm">Start your forge journey today!</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-64">
        <div className="space-y-2">
          {combinedHistory.map((activity) => {
            let displayName = activity.type === 'workout' ? activity.name : activity.runType;
            if (activity.type === 'workout' && isHeroCallWorkout(activity.name)) {
              displayName = activity.name.replace("Hero's Call: ", "");
            }
            
            const workoutBadge = activity.type === 'workout' ? getWorkoutBadge(activity.name) : null;
            
            return (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex-shrink-0">
                  {activity.type === 'workout' ? (
                    <Zap className="h-5 w-5 text-primary" />
                  ) : (
                    <ImageIcon src="/lovable-uploads/ce6da73b-d67b-4c6a-9101-65cfa425f67a.png" alt="Running icon" className="h-5 w-5 text-primary" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm truncate">{displayName}</p>
                    {workoutBadge && (
                      <Badge variant={workoutBadge.variant} className="text-xs flex-shrink-0">
                        <span className="mr-1">{workoutBadge.icon}</span>
                        {workoutBadge.text}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(activity.date, 'MMM d')} • {formatDistanceToNow(activity.date, { addSuffix: true })}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {activity.type === 'workout' && onRedoWorkout && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRedoWorkout(activity)}
                      className="flex-shrink-0"
                      title="Redo this workout"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  {activity.type === 'workout' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewWorkoutDetails(activity)}
                      className="flex-shrink-0"
                      title="View workout details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className={className}>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="workout-history" className="border border-muted rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span className="font-medium">Recent Workouts</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {renderHistoryContent()}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <WorkoutDetailsModal 
        workout={selectedWorkout}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </div>
  );
};