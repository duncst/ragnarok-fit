
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Workout, Run } from '@/types';
import { Tables } from '@/integrations/supabase/types';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ActivityCard } from "./home/ActivityCard";

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
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Recent Activity</h2>
                <Button asChild variant="ghost" size="sm">
                    <Link to="/forge">
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
                    {combinedHistory.map(activity => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            )}
        </div>
    );
};
