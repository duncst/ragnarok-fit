import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WeeklyDistanceGoal } from "./WeeklyDistanceGoal";
import { MuscleGroupVolumeTracker } from "@/components/MuscleGroupVolumeTracker";
import spearIcon from "@/assets/spear-icon.png";
import type { Workout } from '@/types';

interface WeeklyTargetsProps {
  weeklyDistance: number;
  workoutHistory?: Workout[];
}

export const WeeklyTargets = ({ weeklyDistance, workoutHistory }: WeeklyTargetsProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="weekly-targets">
        <AccordionTrigger className="text-xl font-semibold">
          <div className="flex items-center gap-2">
            <img src={spearIcon} alt="Spear icon" className="h-8 w-8" />
            Weekly Targets
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6">
            {/* Muscle Group Volume Tracker */}
            <MuscleGroupVolumeTracker workoutHistory={workoutHistory} />

            {/* Weekly Distance Goal */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <img src={spearIcon} alt="Spear icon" className="h-6 w-6" />
                  Weekly Distance Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyDistanceGoal weeklyDistance={weeklyDistance} />
              </CardContent>
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};