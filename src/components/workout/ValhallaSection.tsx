
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ChevronDown, Trophy, Clock, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { WorkoutTemplate, TemplateExercise } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { useValhallaProgress } from "@/hooks/useValhallaProgress";
import { RuneDisplay } from "../valhalla/RuneDisplay";

interface ValhallaWorkout {
  id: string;
  name: string;
  godName: string;
  description: string;
  theme: string;
  icon: string;
  exercises: TemplateExercise[];
  format: string;
  tierThresholds: {
    berserker: number;
    warrior: number;
  };
}

const valhallaWorkouts: ValhallaWorkout[] = [
  {
    id: "thor",
    name: "THOR",
    godName: "God of Thunder",
    description: "explosive and strength-focused",
    theme: "Like Mjölnir, short, heavy, and hammering.",
    icon: "⚡",
    format: "3 rounds",
    tierThresholds: { berserker: 8, warrior: 12 },
    exercises: [
      { name: "Jump Squats", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Explosive squat jumps", sets: 3, suggestedReps: 40, type: "reps" },
      { name: "Clap Push-ups", bodyPart: "chest", equipment: "bodyweight", targetMuscles: ["chest", "triceps"], description: "Explosive push-ups with clap", sets: 3, suggestedReps: 30, type: "reps" },
      { name: "Burpee Broad Jumps", bodyPart: "full body", equipment: "bodyweight", targetMuscles: ["full body"], description: "Burpee with broad jump", sets: 3, suggestedReps: 20, type: "reps" },
      { name: "Pull-ups", bodyPart: "back", equipment: "pull-up bar", targetMuscles: ["lats", "biceps"], description: "Standard pull-ups", sets: 3, suggestedReps: 10, type: "reps" },
    ]
  },
  {
    id: "fenrir",
    name: "FENRIR",
    godName: "The beast unleashed",
    description: "raw power and endurance",
    theme: "Designed to wear you down—then break you loose.",
    icon: "🐺",
    format: "For time",
    tierThresholds: { berserker: 15, warrior: 25 },
    exercises: [
      { name: "Mountain Climbers", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["core", "shoulders"], description: "High-intensity mountain climbers", sets: 1, suggestedReps: 100, type: "reps" },
      { name: "Burpees", bodyPart: "full body", equipment: "bodyweight", targetMuscles: ["full body"], description: "Standard burpees", sets: 1, suggestedReps: 50, type: "reps" },
      { name: "Push-ups", bodyPart: "chest", equipment: "bodyweight", targetMuscles: ["chest", "triceps"], description: "Standard push-ups", sets: 1, suggestedReps: 50, type: "reps" },
      { name: "Jumping Lunges", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Alternating jumping lunges", sets: 1, suggestedReps: 100, type: "reps" },
    ]
  },
  {
    id: "hel",
    name: "HEL",
    godName: "Queen of the underworld",
    description: "cold and relentless",
    theme: "Unforgiving and creeping—no flash, all grind.",
    icon: "🧊",
    format: "2 rounds",
    tierThresholds: { berserker: 20, warrior: 30 },
    exercises: [
      { name: "Pike Push-ups", bodyPart: "shoulders", equipment: "bodyweight", targetMuscles: ["shoulders", "triceps"], description: "Pike position push-ups", sets: 2, suggestedReps: 20, type: "reps" },
      { name: "Sit-ups", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["abs"], description: "Standard sit-ups", sets: 2, suggestedReps: 40, type: "reps" },
      { name: "Step-ups", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Alternating step-ups", sets: 2, suggestedReps: 60, type: "reps" },
      { name: "Air Squats", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Bodyweight squats", sets: 2, suggestedReps: 80, type: "reps" },
      { name: "High Knees", bodyPart: "cardio", equipment: "bodyweight", targetMuscles: ["legs", "core"], description: "High knee marching", sets: 2, suggestedReps: 100, type: "reps" },
    ]
  },
  {
    id: "njord",
    name: "NJORD",
    godName: "God of the sea",
    description: "flow and mobility",
    theme: "Graceful pacing with strong undertow—stamina and control.",
    icon: "🌊",
    format: "3 rounds",
    tierThresholds: { berserker: 18, warrior: 28 },
    exercises: [
      { name: "Jump Rope", bodyPart: "cardio", equipment: "jump rope", targetMuscles: ["calves", "shoulders"], description: "Jump rope for time", sets: 3, suggestedReps: 1, type: "time" },
      { name: "Push-ups", bodyPart: "chest", equipment: "bodyweight", targetMuscles: ["chest", "triceps"], description: "Standard push-ups", sets: 3, suggestedReps: 30, type: "reps" },
      { name: "Reverse Lunges", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Reverse stepping lunges", sets: 3, suggestedReps: 40, type: "reps" },
      { name: "Flutter Kicks", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["abs", "hip flexors"], description: "Lying flutter kicks", sets: 3, suggestedReps: 50, type: "reps" },
      { name: "Running", bodyPart: "cardio", equipment: "bodyweight", targetMuscles: ["legs"], description: "400m run or 2 min high knees", sets: 3, suggestedReps: 400, type: "distance" },
    ]
  },
  {
    id: "odin",
    name: "ODIN",
    godName: "The Allfather",
    description: "balance, wisdom, pain",
    theme: "Discipline through repetition. The wise suffer willingly.",
    icon: "🧠",
    format: "For time (or 2 rounds of 25)",
    tierThresholds: { berserker: 12, warrior: 20 },
    exercises: [
      { name: "Push-ups", bodyPart: "chest", equipment: "bodyweight", targetMuscles: ["chest", "triceps"], description: "Standard push-ups", sets: 1, suggestedReps: 50, type: "reps" },
      { name: "Air Squats", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Bodyweight squats", sets: 1, suggestedReps: 50, type: "reps" },
      { name: "Burpees", bodyPart: "full body", equipment: "bodyweight", targetMuscles: ["full body"], description: "Standard burpees", sets: 1, suggestedReps: 50, type: "reps" },
      { name: "Sit-ups", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["abs"], description: "Standard sit-ups", sets: 1, suggestedReps: 50, type: "reps" },
      { name: "Pull-ups", bodyPart: "back", equipment: "pull-up bar", targetMuscles: ["lats", "biceps"], description: "Standard pull-ups", sets: 1, suggestedReps: 50, type: "reps" },
    ]
  }
];

export const ValhallaSection = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(new Set());
  const { progress, isLoading } = useValhallaProgress();

  const handleStartWorkout = (valhallaWorkout: ValhallaWorkout) => {
    const template: WorkoutTemplate = {
      id: valhallaWorkout.id,
      name: valhallaWorkout.name,
      exercises: valhallaWorkout.exercises,
      user_id: "valhalla",
      is_public: true,
      created_at: new Date().toISOString(),
    };
    navigate("/workout/new", { state: { template } });
  };

  const toggleWorkout = (workoutId: string) => {
    setExpandedWorkouts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      return newSet;
    });
  };

  const getUserRune = (challengeName: string) => {
    return progress?.runes?.find(rune => rune.challenge_name === challengeName);
  };

  const getBestTime = (challengeName: string) => {
    return progress?.best_times?.[challengeName];
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/10 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚔️</span>
                <div>
                  <CardTitle className="text-2xl font-bold text-primary">
                    Valhalla
                  </CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mt-1">
                    Tiered Challenges
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isLoading && progress?.runes && progress.runes.length > 0 && (
                  <div className="flex -space-x-1">
                    {progress.runes.slice(0, 3).map((rune, index) => (
                      <RuneDisplay
                        key={rune.challenge_name}
                        runeName={rune.rune_name}
                        tier={rune.highest_tier}
                        challengeName={rune.challenge_name}
                        size="sm"
                        className={`z-${30 - index * 10}`}
                      />
                    ))}
                    {progress.runes.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-muted-foreground/20 flex items-center justify-center text-xs font-bold text-muted-foreground">
                        +{progress.runes.length - 3}
                      </div>
                    )}
                  </div>
                )}
                <ChevronDown className={`h-6 w-6 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            <p className="text-muted-foreground mt-2">Epic tiered challenges named after the Norse Gods. Earn runes and prove your worth.</p>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-3">
            {valhallaWorkouts.map((workout) => {
              const userRune = getUserRune(workout.name);
              const bestTime = getBestTime(workout.name);
              
              return (
                <Collapsible 
                  key={workout.id} 
                  open={expandedWorkouts.has(workout.id)} 
                  onOpenChange={() => toggleWorkout(workout.id)}
                >
                  <Card className="border border-primary/10 hover:border-primary/20 transition-colors">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-muted/5 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{workout.icon}</span>
                            <div>
                              <CardTitle className="text-lg text-primary">{workout.name}</CardTitle>
                              <p className="text-sm font-medium text-muted-foreground">{workout.godName}</p>
                              <p className="text-sm text-muted-foreground italic">{workout.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {userRune && (
                              <RuneDisplay
                                runeName={userRune.rune_name}
                                tier={userRune.highest_tier}
                                challengeName={userRune.challenge_name}
                                size="sm"
                              />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartWorkout(workout);
                              }}
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Play className="h-5 w-5" />
                            </Button>
                            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${expandedWorkouts.has(workout.id) ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm">
                            <Badge variant="outline" className="border-primary/30 text-primary">
                              {workout.format}
                            </Badge>
                            {bestTime && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Best: {bestTime.best_time_minutes}min ({bestTime.best_tier})</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                              <Target className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                              <div className="font-medium">Adept</div>
                              <div className="text-gray-600">{workout.tierThresholds.warrior + 1}+ min</div>
                            </div>
                            <div className="text-center p-2 bg-slate-50 rounded border border-slate-200">
                              <Trophy className="h-4 w-4 mx-auto mb-1 text-slate-600" />
                              <div className="font-medium">Warrior</div>
                              <div className="text-slate-600">{workout.tierThresholds.berserker + 1}-{workout.tierThresholds.warrior} min</div>
                            </div>
                            <div className="text-center p-2 bg-amber-50 rounded border border-amber-200">
                              <Trophy className="h-4 w-4 mx-auto mb-1 text-amber-600" />
                              <div className="font-medium">Berserker</div>
                              <div className="text-amber-600">≤{workout.tierThresholds.berserker} min</div>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            {workout.exercises.map((exercise, index) => (
                              <div key={index} className="flex justify-between text-sm py-1">
                                <span className="truncate">{exercise.name}</span>
                                <span className="text-muted-foreground ml-2 shrink-0">
                                  {exercise.suggestedReps}{exercise.type === 'time' ? ' min' : exercise.type === 'distance' ? 'm' : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="pt-2 border-t border-border">
                            <p className="text-xs italic text-muted-foreground">{workout.theme}</p>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
