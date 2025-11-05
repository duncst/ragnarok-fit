
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Zap, TrendingUp, ChevronDown, CheckCircle, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StrengthChart } from "@/components/StrengthChart";
import { RunChart } from "@/components/RunChart";
import { StatItem } from "@/components/StatItem";
import { ImageIcon } from "@/components/ImageIcon";
import { CalendarSection } from "@/components/forge/CalendarSection";
import { MuscleGroupVolumeTracker } from "@/components/MuscleGroupVolumeTracker";
import { WeeklyDistanceGoal } from "@/components/home/WeeklyDistanceGoal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCapabilityProgress } from "@/hooks/useCapabilityProgress";
import { cn } from "@/lib/utils";
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
  last7DaysDistance: number;
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
  last7DaysDistance,
  totalVolume,
  totalDistance,
  bestPace
}: AnalyticsSectionProps) => {
  const [strengthOpen, setStrengthOpen] = useState(false);
  const [runningOpen, setRunningOpen] = useState(false);
  const [pathsOpen, setPathsOpen] = useState(false);
  const [activePathTab, setActivePathTab] = useState('strength');
  
  const { capabilities: allCapabilities, toggleCapability, getPathProgress } = useCapabilityProgress();
  const capabilities = allCapabilities.filter(path => 
    path.name.toLowerCase() === 'strength' || path.name.toLowerCase() === 'endurance'
  );
  
  const totalWorkouts = workoutHistory?.length || 0;
  const totalRuns = runHistory?.length || 0;

  const getPathIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'strength': return <span className="text-primary">ᚢ</span>;
      case 'endurance': return <span className="text-primary">ᛇ</span>;
      default: return '🎯';
    }
  };

  const formatPathName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const getTierStatus = (tierIndex: number, isCompleted: boolean, path: any) => {
    const allPreviousCompleted = path.tiers.slice(0, tierIndex).every((tier: any) => tier.completed);
    
    if (isCompleted) return 'completed';
    if (tierIndex === 0 || allPreviousCompleted) return 'available';
    return 'locked';
  };

  const renderPathContent = (pathName: string) => {
    const pathIndex = capabilities.findIndex(path => path.name.toLowerCase() === pathName);
    if (pathIndex === -1) return null;

    const path = capabilities[pathIndex];
    const originalPathIndex = allCapabilities.findIndex(p => p.name === path.name);
    const progress = getPathProgress(originalPathIndex);

    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{getPathIcon(path.name)}</span>
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {formatPathName(path.name)}
          </h3>
          
          <p className="text-muted-foreground text-sm italic mb-4">{path.subtitle}</p>
        </div>

        <div className="space-y-3">
          {path.tiers.map((tier, index) => {
            const status = getTierStatus(index, tier.completed, path);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';

            return (
              <div
                key={tier.tier}
                onClick={() => !isLocked && toggleCapability(originalPathIndex, index)}
                className={cn(
                  "bg-card border rounded-lg p-3 transition-all cursor-pointer",
                  isCompleted && "border-green-500 bg-green-500/10",
                  isLocked && "opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>

                  <Badge 
                    variant={isCompleted ? "default" : "secondary"}
                    className={cn(
                      "font-bold px-2 py-0.5 text-xs",
                      isCompleted && "bg-green-600 text-white"
                    )}
                  >
                    Tier {tier.tier}
                  </Badge>

                  <h4 className="text-sm font-bold text-foreground">
                    {tier.title}
                  </h4>
                </div>

                <div className="ml-8">
                  <p className="text-xs text-muted-foreground">
                    {tier.requirement}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Saga</h2>
      <div className="space-y-4">
        <CalendarSection />
        
        <Collapsible open={strengthOpen} onOpenChange={setStrengthOpen}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Zap className="h-7 w-7 text-primary" />
                    Strength
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
                      <StatItem icon={VolumeIcon} value={`${(totalVolume / 1000).toFixed(1)}K`} label="Last 7-days Volume" />
                    </div>
                    <StrengthChart data={strengthChartData} />
                    <MuscleGroupVolumeTracker workoutHistory={workoutHistory} />
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
                    Endurance
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
                      <StatItem icon={TargetIcon} value={`${last7DaysDistance.toFixed(1)} km`} label="Last 7 Days Distance" />
                      <StatItem icon={Zap} value={`${totalDistance.toFixed(1)} km`} label="Total Distance" />
                      <StatItem icon={TrendingUp} value={formatPace(bestPace)} label="Best Pace (min/km)" />
                    </div>
                    <WeeklyDistanceGoal weeklyDistance={last7DaysDistance} />
                    <RunChart data={runChartData} />
                  </>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={pathsOpen} onOpenChange={setPathsOpen}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <ImageIcon src="/lovable-uploads/ba349eee-18d7-4d58-8a2b-dee8c1703e5f.png" alt="Paths icon" className="h-8 w-8" />
                    Capability Paths
                  </CardTitle>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${pathsOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <Tabs value={activePathTab} onValueChange={setActivePathTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="strength" className="flex items-center gap-2">
                      <span>ᚢ</span>
                      Strength
                    </TabsTrigger>
                    <TabsTrigger value="endurance" className="flex items-center gap-2">
                      <span>ᛇ</span>
                      Endurance
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="strength" className="mt-4">
                    {renderPathContent('strength')}
                  </TabsContent>

                  <TabsContent value="endurance" className="mt-4">
                    {renderPathContent('endurance')}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
};
