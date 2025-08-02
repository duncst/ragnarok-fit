import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Workout } from '@/types';
import { subDays, isWithinInterval, startOfDay } from 'date-fns';
import { isHeroCallWorkout } from '@/lib/workoutUtils';

interface MuscleGroupVolumeTrackerProps {
  workoutHistory?: Workout[];
}

const MUSCLE_GROUP_MAPPING: Record<string, string> = {
  // Chest
  'Chest': 'Chest',
  
  // Back 
  'Back': 'Back',
  
  // Legs
  'Legs': 'Legs',
  
  // Shoulders
  'Shoulders': 'Shoulders',
  
  // Arms (Biceps/Triceps combined)
  'Arms': 'Arms',
  
  // Core
  'Core': 'Core',
  
  // Map other body parts to main groups
  'Full Body': 'Core', // Full body exercises often work core heavily
  'Cardio': 'Legs', // Cardio primarily uses legs
};

const getMuscleGroupColor = (sets: number) => {
  if (sets >= 20) return 'bg-destructive text-destructive-foreground'; // Overtrained - Red
  if (sets >= 10) return 'bg-green-500 text-white'; // Optimal - Green
  if (sets >= 6) return 'bg-orange-500 text-white'; // Slightly low but okay - Orange
  return 'bg-orange-600 text-white'; // Neglected - Dark Orange
};

const getMuscleGroupStatus = (sets: number) => {
  if (sets >= 20) return { label: 'Overtrained', icon: AlertTriangle };
  if (sets >= 10) return { label: 'Optimal', icon: CheckCircle2 };
  if (sets >= 6) return { label: 'Low Volume', icon: Zap };
  return { label: 'Neglected Rune', icon: AlertTriangle };
};

export const MuscleGroupVolumeTracker = ({ workoutHistory }: MuscleGroupVolumeTrackerProps) => {
  const today = new Date();
  const last7DaysInterval = { start: startOfDay(subDays(today, 6)), end: new Date() };

  const muscleGroupSets = {
    Chest: 0,
    Back: 0,
    Legs: 0,
    Shoulders: 0,
    Arms: 0,
    Core: 0,
  };

  // Calculate sets per muscle group from the last 7 days
  workoutHistory
    ?.filter(workout => 
      isWithinInterval(workout.startTime, last7DaysInterval) && 
      !isHeroCallWorkout(workout.name || '')
    )
    .forEach(workout => {
      workout.exercises.forEach(exercise => {
        const bodyPart = exercise.name; // We'll need to map this to body parts
        
        // Try to find the exercise in our exercise database to get the proper body part
        // For now, we'll use a simple mapping based on exercise name keywords
        let muscleGroup = 'Core'; // Default fallback
        
        // Simple keyword-based mapping for common exercises
        const exerciseName = exercise.name.toLowerCase();
        if (exerciseName.includes('bench') || exerciseName.includes('chest') || 
            exerciseName.includes('push') || exerciseName.includes('dip') || 
            exerciseName.includes('fly')) {
          muscleGroup = 'Chest';
        } else if (exerciseName.includes('pull') || exerciseName.includes('row') || 
                   exerciseName.includes('lat') || exerciseName.includes('deadlift') ||
                   exerciseName.includes('back')) {
          muscleGroup = 'Back';
        } else if (exerciseName.includes('squat') || exerciseName.includes('lunge') || 
                   exerciseName.includes('leg') || exerciseName.includes('calf') ||
                   exerciseName.includes('glute') || exerciseName.includes('hip')) {
          muscleGroup = 'Legs';
        } else if (exerciseName.includes('shoulder') || exerciseName.includes('press') && 
                   !exerciseName.includes('bench') || exerciseName.includes('raise') ||
                   exerciseName.includes('shrug')) {
          muscleGroup = 'Shoulders';
        } else if (exerciseName.includes('curl') || exerciseName.includes('tricep') || 
                   exerciseName.includes('bicep') || exerciseName.includes('arm')) {
          muscleGroup = 'Arms';
        } else if (exerciseName.includes('plank') || exerciseName.includes('crunch') || 
                   exerciseName.includes('core') || exerciseName.includes('abs') ||
                   exerciseName.includes('twist') || exerciseName.includes('sit-up')) {
          muscleGroup = 'Core';
        }

        // Count completed sets
        const completedSets = exercise.sets.filter(set => set.completed).length;
        if (muscleGroup in muscleGroupSets) {
          muscleGroupSets[muscleGroup as keyof typeof muscleGroupSets] += completedSets;
        }
      });
    });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-4 w-4 text-primary" />
          Muscle Group Volume (7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {Object.entries(muscleGroupSets).map(([muscleGroup, sets]) => {
            const status = getMuscleGroupStatus(sets);
            const StatusIcon = status.icon;
            
            return (
              <div key={muscleGroup} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <StatusIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-xs truncate">{muscleGroup}</p>
                    <p className="text-xs text-muted-foreground">{sets} sets</p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-1.5 py-0.5 flex-shrink-0 ${getMuscleGroupColor(sets)}`}
                >
                  {status.label}
                </Badge>
              </div>
            );
          })}
        </div>
        
        <div className="p-2 bg-muted/30 rounded-md">
          <h4 className="text-xs font-medium mb-1">Weekly Targets</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded bg-green-500 flex-shrink-0"></div>
              <span>10-20 sets: Optimal range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded bg-orange-500 flex-shrink-0"></div>
              <span>6-9 sets: Low volume</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded bg-destructive flex-shrink-0"></div>
              <span>20+ sets: Overtrained</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded bg-orange-600 flex-shrink-0"></div>
              <span>&lt;6 sets: Neglected Rune</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};