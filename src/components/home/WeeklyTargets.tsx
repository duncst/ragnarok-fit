import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyDistanceGoal } from "./WeeklyDistanceGoal";
import { MuscleGroupVolumeTracker } from "@/components/MuscleGroupVolumeTracker";
import { Target } from "lucide-react";
import type { Workout } from '@/types';

interface WeeklyTargetsProps {
  weeklyDistance: number;
  workoutHistory?: Workout[];
}

export const WeeklyTargets = ({ weeklyDistance, workoutHistory }: WeeklyTargetsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Weekly Targets</h2>
      </div>
      
      {/* Muscle Group Volume Tracker */}
      <MuscleGroupVolumeTracker workoutHistory={workoutHistory} />

      {/* Weekly Distance Goal */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-primary" />
            Weekly Distance Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyDistanceGoal weeklyDistance={weeklyDistance} />
        </CardContent>
      </Card>
    </div>
  );
};