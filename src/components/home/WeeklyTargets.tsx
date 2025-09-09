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
      {/* Muscle Group Volume Tracker */}
      <MuscleGroupVolumeTracker workoutHistory={workoutHistory} />

      {/* Weekly Distance Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
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