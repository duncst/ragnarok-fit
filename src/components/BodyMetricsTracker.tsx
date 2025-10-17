import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, HeartPulse, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BodyMetrics } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { StatItem } from '@/components/StatItem';
import { format } from 'date-fns';
import weightIcon from '@/assets/weight-icon.png';

export const BodyMetricsTracker = () => {
    const { user } = useAuth();
    
    const { data: bodyMetrics, isLoading } = useQuery<BodyMetrics[]>({
        queryKey: ['body_metrics', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('body_metrics')
                .select('*')
                .order('date', { ascending: false })
                .limit(1);

            if (error) throw new Error('Failed to fetch body metrics.');
            return data || [];
        },
        enabled: !!user,
    });
    
    const latestMetrics = bodyMetrics?.[0];

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <HeartPulse className="text-primary" />
                        Body Metrics
                    </CardTitle>
                    <Button asChild variant="outline" size="sm">
                        <Link to="/log-body-metrics">
                            <Plus className="mr-2 h-4 w-4" />
                            Log
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : latestMetrics ? (
                    <div>
                        <div className="grid grid-cols-2 gap-4">
                            <StatItem 
                                icon={weightIcon} 
                                value={latestMetrics.weight ? `${latestMetrics.weight} kg` : 'N/A'} 
                                label="Weight" 
                            />
                            <StatItem 
                                icon={Zap} 
                                value={latestMetrics.vo2_max || 'N/A'} 
                                label="VO2 Max" 
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 text-right">
                           Last updated: {format(new Date(latestMetrics.date), 'dd MMM yyyy')}
                        </p>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        <p>No body metrics logged yet.</p>
                        <p className="text-sm">Click "Log" to add your first entry.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
