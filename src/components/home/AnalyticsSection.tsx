
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Zap, TrendingUp, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StrengthChart } from "@/components/StrengthChart";
import { RunChart } from "@/components/RunChart";
import { StatItem } from "@/components/StatItem";
import { ImageIcon } from "@/components/ImageIcon";
import type { Workout, Run } from '@/types';
import { useState } from 'react';

const VolumeIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/0ab4b431-dd06-4b92-8335-ff454c61eb04.png" alt="Volume icon" className={className} />
);

const TargetIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/069886d9-0f49-44aa-826f-3470ca94f1c1.png" alt="Target icon" className={className} />
);

interface AnalyticsSectionProps {
  workoutHistory?: Workout[];
  runHistory?: Run[];
  totalPRs: number;
  isLoading: boolean;
  strengthChartData: Array<{ day: string; volume: number; date: Date }>;
  runChartData: Array<{ day: string; distance: number; date: Date }>;
  workoutsThisWeek: number;
  runsThisWeek: number;
  totalVolume: number;
  totalDistance: number;
  bestPace: number;
}

const formatPace = (pace: number) => {
  if (pace === 0 || pace === Infinity) return "N/A";
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const AnalyticsSection = ({
  workoutHistory,
  runHistory,
  totalPRs,
  isLoading,
  strengthChartData,
  runChartData,
  workoutsThisWeek,
  runsThisWeek,
  totalVolume,
  totalDistance,
  bestPace
}: AnalyticsSectionProps) => {
  const [strengthOpen, setStrengthOpen] = useState(false);
  const [runningOpen, setRunningOpen] = useState(false);
  
  const totalWorkouts = workoutHistory?.length || 0;
  const totalRuns = runHistory?.length || 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <div className="space-y-4">
        <Collapsible open={strengthOpen} onOpenChange={setStrengthOpen}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Zap className="h-7 w-7 text-primary" />
                    Strength Training
                  </CardTitle>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${strengthOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                {isLoading ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                    <Skeleton className="h-[200px] w-full" />
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <StatItem icon={Zap} value={totalWorkouts} label="Workouts" />
                      <StatItem icon={TargetIcon} value={workoutsThisWeek} label="This Week" />
                      <StatItem icon={TrendingUp} value={totalPRs} label="PR's Set" />
                      <StatItem icon={VolumeIcon} value={`${(totalVolume / 1000).toFixed(1)}K`} label="Total Volume (kg)" />
                    </div>
                    <StrengthChart data={strengthChartData} />
                  </>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={runningOpen} onOpenChange={setRunningOpen}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <ImageIcon src="/lovable-uploads/ce6da73b-d67b-4c6a-9101-65cfa425f67a.png" alt="Running icon" className="h-8 w-8 text-primary" />
                    Running
                  </CardTitle>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${runningOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                {isLoading ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                    <Skeleton className="h-[200px] w-full" />
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <StatItem icon={Zap} value={totalRuns} label="Total Runs" />
                      <StatItem icon={TargetIcon} value={runsThisWeek} label="This Week" />
                      <StatItem icon={Zap} value={`${totalDistance.toFixed(1)} km`} label="Total Distance" />
                      <StatItem icon={TrendingUp} value={formatPace(bestPace)} label="Best Pace (min/km)" />
                    </div>
                    <RunChart data={runChartData} />
                  </>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
};
