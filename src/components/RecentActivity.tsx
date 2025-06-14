
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Workout, Run } from '@/types';
import { Tables } from '@/integrations/supabase/types';
import { formatDistanceStrict, formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ImageIcon } from "./ImageIcon";

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

export const RecentActivity = () => {
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

    const isLoading = isLoadingWorkouts || isLoadingRuns;

    const combinedHistory = [
        ...(workoutHistory || []).map(w => ({ ...w, type: 'workout' as const, date: w.startTime })),
        ...(runHistory || []).map(r => ({ ...r, type: 'run' as const }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);

    const renderActivity = (activity: (Workout & {type: 'workout', date: Date}) | (Run & {type: 'run'})) => {
        const name = activity.type === 'workout' ? activity.name : activity.runType;
        const details = activity.type === 'workout' 
            ? `${activity.exercises.length} exercises • ${getWorkoutDuration(activity)}`
            : `${activity.distance.toFixed(1)} km • ${getRunDuration(activity.duration)}`;
        
        return (
            <Card key={activity.id}>
                <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-secondary p-3 rounded-full">
                            {activity.type === 'workout' ? <Zap className="h-6 w-6 text-primary" /> : <ImageIcon src="/lovable-uploads/ce6da73b-d67b-4c6a-9101-65cfa425f67a.png" alt="Running icon" className="h-7 w-7 text-primary" />}
                        </div>
                        <div>
                            <p className="font-semibold">{name}</p>
                            <p className="text-sm text-muted-foreground">{details}</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDistanceToNow(activity.date, { addSuffix: true })}</p>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Recent Activity</h2>
                <Button asChild variant="ghost" size="sm">
                    <Link to="/history">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
            {isLoading ? (
                <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : combinedHistory.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        <p>No recent activity.</p>
                        <p className="text-sm">Complete a workout or run to see it here.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {combinedHistory.map(renderActivity)}
                </div>
            )}
        </div>
    );
};
