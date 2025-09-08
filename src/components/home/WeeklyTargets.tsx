import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WeeklyDistanceGoal } from "./WeeklyDistanceGoal";
import { Dumbbell, Target } from "lucide-react";

interface WeeklyTargetsProps {
  totalVolume: number;
  weeklyDistance: number;
}

export const WeeklyTargets = ({ totalVolume, weeklyDistance }: WeeklyTargetsProps) => {
  // Simple volume target - can be made configurable later
  const volumeTarget = 10000; // 10,000kg weekly target
  const volumeProgress = Math.min((totalVolume / volumeTarget) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5" />
          Weekly Targets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strength Volume Target */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Strength Volume</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {totalVolume.toLocaleString()}kg / {volumeTarget.toLocaleString()}kg
            </span>
          </div>
          <Progress value={volumeProgress} className="h-2" />
          {volumeProgress >= 100 && (
            <p className="text-xs text-green-600 font-medium">🎯 Weekly volume target achieved!</p>
          )}
        </div>

        {/* Weekly Distance Goal */}
        <WeeklyDistanceGoal weeklyDistance={weeklyDistance} />
      </CardContent>
    </Card>
  );
};