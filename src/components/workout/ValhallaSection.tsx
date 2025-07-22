
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TemplateExercise } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useValhallaProgress } from "@/hooks/useValhallaProgress";

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
    format: "For time",
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
    format: "3 rounds for time",
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
    format: "3 rounds for time",
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
    format: "For time",
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
  const { progress, isLoading } = useValhallaProgress();

  const handleStartWorkout = (valhallaWorkout: ValhallaWorkout) => {
    const template = {
      id: valhallaWorkout.id,
      name: valhallaWorkout.name,
      exercises: valhallaWorkout.exercises,
      user_id: "valhalla",
      is_public: true,
      created_at: new Date().toISOString(),
    };
    
    navigate(`/ritual/valhalla-${valhallaWorkout.id}/workout`, { 
      state: { 
        template,
        templateName: valhallaWorkout.name,
        isValhalla: true,
        selectedTier: 'Warrior' // Default tier
      } 
    });
  };

  const getWorkoutDuration = (workout: ValhallaWorkout) => {
    if (workout.format.includes("for time")) {
      // Estimate based on exercise difficulty
      const exerciseCount = workout.exercises.reduce((sum, ex) => sum + (ex.suggestedReps || 0), 0);
      return exerciseCount > 200 ? "20min" : exerciseCount > 150 ? "15min" : "10min";
    }
    if (workout.format.includes("3 rounds")) return "15min";
    if (workout.format.includes("2 rounds")) return "20min";
    return "15min";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-orange-500/10">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚔️</span>
          </div>
          <CardTitle className="text-3xl font-bold text-primary mb-2">Enter Valhalla</CardTitle>
          <p className="text-muted-foreground text-lg">
            Face the trials of the gods. Pure flow, raw endurance, no distractions.
          </p>
        </CardContent>
      </Card>

      {/* Workout Cards */}
      <div className="space-y-4">
        {valhallaWorkouts.map((workout) => (
          <Card key={workout.id} className="border-primary/30 bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl font-bold text-white">{workout.name}</h2>
                    <Badge 
                      variant="secondary" 
                      className={
                        workout.format.toLowerCase().includes("for time") 
                          ? "bg-orange-500/20 text-orange-400 border-orange-500/30 px-3 py-1" 
                          : "bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1"
                      }
                    >
                      {workout.format.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-lg mb-4">{workout.description}</p>
                  
                  <div className="flex items-center gap-6 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{getWorkoutDuration(workout)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{workout.exercises.length} movements</span>
                    </div>
                  </div>
                </div>

                {/* Exercise List */}
                <div className="space-y-4">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white text-lg">{exercise.name}</span>
                      <span className="text-orange-400 text-2xl font-bold">
                        {exercise.suggestedReps}
                        {exercise.type === 'time' ? ' min' : exercise.type === 'distance' ? 'm' : ''}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Enter Button */}
                <Button 
                  onClick={() => handleStartWorkout(workout)}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 text-lg rounded-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Enter the Trial
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
