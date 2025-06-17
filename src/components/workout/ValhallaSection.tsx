
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Zap, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { WorkoutTemplate, TemplateExercise } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ValhallaWorkout {
  id: string;
  name: string;
  godName: string;
  description: string;
  theme: string;
  icon: string;
  exercises: TemplateExercise[];
  format: string;
}

const valhallaWorkouts: ValhallaWorkout[] = [
  {
    id: "thor",
    name: "THOR",
    godName: "God of Thunder",
    description: "explosive and strength-focused",
    theme: "Like Mjölnir, short, heavy, and hammering.",
    icon: "🔥",
    format: "3 rounds",
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

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-orange-800">
          ⚔️ Valhalla
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">Norse Gods Collection</Badge>
        </CardTitle>
        <p className="text-orange-700">Epic workouts named after the Norse Gods. Enter Valhalla and prove your worth.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {valhallaWorkouts.map((workout) => (
            <Card key={workout.id} className="border border-orange-200 hover:border-orange-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{workout.icon}</span>
                      <span className="text-orange-800">{workout.name}</span>
                    </CardTitle>
                    <p className="text-sm font-medium text-orange-600">{workout.godName}</p>
                    <p className="text-sm text-muted-foreground">{workout.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStartWorkout(workout)}
                    className="text-orange-600 hover:text-orange-800 hover:bg-orange-100"
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-sm">
                    <Badge variant="outline" className="border-orange-300 text-orange-700">
                      {workout.format}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="truncate">{exercise.name}</span>
                        <span className="text-muted-foreground ml-2 shrink-0">
                          {exercise.suggestedReps}{exercise.type === 'time' ? ' min' : exercise.type === 'distance' ? 'm' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-orange-100">
                    <p className="text-xs italic text-orange-600">{workout.theme}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
