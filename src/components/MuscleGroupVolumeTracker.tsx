import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Zap, AlertTriangle, CheckCircle2, ChevronDown, Target } from "lucide-react";
import type { Workout } from '@/types';
import { subDays, isWithinInterval, startOfDay, format } from 'date-fns';
import { isHeroCallWorkout } from '@/lib/workoutUtils';
import { useState } from 'react';
import { useMuscleGroupGoals } from '@/hooks/useMuscleGroupGoals';

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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const { getGoal } = useMuscleGroupGoals();

  // Enhanced data structure to track detailed information
  const muscleGroupData: Record<string, {
    totalSets: number;
    workoutDetails: Array<{
      date: string;
      workoutName: string;
      exercises: Array<{
        name: string;
        completedSets: number;
      }>;
    }>;
  }> = {
    Chest: { totalSets: 0, workoutDetails: [] },
    Back: { totalSets: 0, workoutDetails: [] },
    Legs: { totalSets: 0, workoutDetails: [] },
    Shoulders: { totalSets: 0, workoutDetails: [] },
    Arms: { totalSets: 0, workoutDetails: [] },
    Core: { totalSets: 0, workoutDetails: [] },
  };

  const getMuscleGroupFromExercise = (exerciseName: string): string => {
    const name = exerciseName.toLowerCase();
    if (name.includes('bench') || name.includes('chest') || 
        (name.includes('push') && !name.includes('pushdown')) || name.includes('dip') || 
        name.includes('fly') || name.includes('incline')) {
      return 'Chest';
    } else if (name.includes('squat') || name.includes('lunge') || 
               name.includes('leg') || name.includes('calf') ||
               name.includes('glute') || name.includes('hip') ||
               name.includes('stiff-leg') || name.includes('stiff leg')) {
      return 'Legs';
    } else if (name.includes('pull') || name.includes('row') || 
               (name.includes('lat') && !name.includes('lateral')) || name.includes('deadlift') ||
               name.includes('back')) {
      return 'Back';
    } else if (name.includes('shoulder') || (name.includes('press') && 
               !name.includes('bench') && !name.includes('incline')) || name.includes('raise') ||
               name.includes('lateral') || name.includes('shrug')) {
      return 'Shoulders';
    } else if (name.includes('curl') || name.includes('tricep') || 
               name.includes('bicep') || name.includes('arm') ||
               name.includes('pushdown')) {
      return 'Arms';
    } else if (name.includes('plank') || name.includes('crunch') || 
               name.includes('core') || name.includes('abs') ||
               name.includes('twist') || name.includes('sit-up')) {
      return 'Core';
    }
    return 'Core'; // Default fallback
  };

  // Calculate detailed sets per muscle group from the last 7 days
  workoutHistory
    ?.filter(workout => 
      isWithinInterval(workout.startTime, last7DaysInterval) && 
      !isHeroCallWorkout(workout.name || '')
    )
    .forEach(workout => {
      const workoutDate = format(workout.startTime, 'MMM d');
      const workoutName = workout.name || 'Workout';
      
      // Group exercises by muscle group for this workout
      const exercisesByMuscleGroup: Record<string, Array<{ name: string; completedSets: number; }>> = {};
      
      workout.exercises.forEach(exercise => {
        const muscleGroup = getMuscleGroupFromExercise(exercise.name);
        const completedSets = exercise.sets.filter(set => set.completed).length;
        
        if (completedSets > 0) {
          if (!exercisesByMuscleGroup[muscleGroup]) {
            exercisesByMuscleGroup[muscleGroup] = [];
          }
          exercisesByMuscleGroup[muscleGroup].push({
            name: exercise.name,
            completedSets
          });
          
          muscleGroupData[muscleGroup].totalSets += completedSets;
        }
      });
      
      // Add workout details to each muscle group that was worked
      Object.entries(exercisesByMuscleGroup).forEach(([muscleGroup, exercises]) => {
        muscleGroupData[muscleGroup].workoutDetails.push({
          date: workoutDate,
          workoutName,
          exercises
        });
      });
    });

  const toggleExpanded = (muscleGroup: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(muscleGroup)) {
      newExpanded.delete(muscleGroup);
    } else {
      newExpanded.add(muscleGroup);
    }
    setExpandedGroups(newExpanded);
  };

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
          {Object.entries(muscleGroupData).map(([muscleGroup, data]) => {
            const status = getMuscleGroupStatus(data.totalSets);
            const StatusIcon = status.icon;
            const isExpanded = expandedGroups.has(muscleGroup);
            const goal = getGoal(muscleGroup);
            const progressPercent = goal ? Math.min((data.totalSets / goal.weekly_target_sets) * 100, 100) : 0;
            
            return (
              <Collapsible key={muscleGroup} open={isExpanded} onOpenChange={() => toggleExpanded(muscleGroup)}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-start justify-between p-3 bg-muted/50 rounded-md hover:bg-muted/70 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {goal && <Target className="h-4 w-4 text-primary" />}
                        <span className="font-medium">{muscleGroup}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {goal 
                            ? `${data.totalSets}/${goal.weekly_target_sets} sets`
                            : `${data.totalSets} sets`
                          }
                        </span>
                        <Badge 
                          variant="outline" 
                          className={getMuscleGroupColor(data.totalSets)}
                        >
                          <status.icon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      {goal && (
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getMuscleGroupColor(data.totalSets)}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ml-2 mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 ml-6 space-y-2">
                    {data.workoutDetails.length > 0 ? (
                      data.workoutDetails.map((workout, idx) => (
                        <div key={idx} className="p-2 bg-muted/30 rounded-sm">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-medium">{workout.workoutName}</p>
                            <p className="text-xs text-muted-foreground">{workout.date}</p>
                          </div>
                          <div className="space-y-1">
                            {workout.exercises.map((exercise, exerciseIdx) => (
                              <div key={exerciseIdx} className="flex justify-between items-center">
                                <p className="text-xs text-muted-foreground truncate">{exercise.name}</p>
                                <p className="text-xs font-medium">{exercise.completedSets} sets</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No workouts this week</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
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