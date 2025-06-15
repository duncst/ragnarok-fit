
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Run } from '@/types';
import { format } from 'date-fns';
import StatItem from './StatItem';
import { getRunDuration } from '@/lib/historyUtils';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useDeleteActivity } from '@/hooks/useDeleteActivity';

const RunCard = ({ run }: { run: Run }) => {
    const { deleteRun, isDeletingRun } = useDeleteActivity();
    const avgPace = run.distance > 0 ? run.duration / run.distance : 0;
    const paceMinutes = Math.floor(avgPace / 60);
    const paceSeconds = Math.round(avgPace % 60).toString().padStart(2, '0');

    const handleDeleteRun = () => {
        deleteRun(run.id);
    };

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="outline" className="font-semibold text-card-foreground">{run.runType}</Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(run.date, 'MMM d, yyyy')}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{getRunDuration(run.duration)}</span>
                        </div>
                        <DeleteConfirmationDialog onConfirm={handleDeleteRun} isLoading={isDeletingRun} />
                    </div>
                </div>

                <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 text-sm">
                   <StatItem icon={MapPin} value={`${run.distance.toFixed(1)} km`} label="Distance" />
                   <StatItem icon={Clock} value={`${paceMinutes}:${paceSeconds}/km`} label="Avg Pace" />
                   {run.elevation && <StatItem value={`${run.elevation} m`} label="Elevation" />}
                   {run.avgHr && <StatItem color="bg-red-500" value={`${run.avgHr} bpm`} label="Avg HR" />}
                </div>
                
                {run.notes && (
                  <div className="bg-secondary/50 p-3 rounded-md text-sm text-muted-foreground">
                    <p>{run.notes}</p>
                  </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RunCard;
