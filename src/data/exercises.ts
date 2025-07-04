
import type { ExerciseDef } from "@/types";

export const exercises: ExerciseDef[] = [
  // Chest
  { name: "Bench Press", bodyPart: "chest", equipment: "barbell", targetMuscles: ["chest", "triceps", "shoulders"], description: "Lie on bench, press barbell up from chest" },
  { name: "Incline Bench Press", bodyPart: "chest", equipment: "barbell", targetMuscles: ["chest", "triceps", "shoulders"], description: "Bench press on inclined bench" },
  { name: "Dumbbell Bench Press", bodyPart: "chest", equipment: "dumbbells", targetMuscles: ["chest", "triceps", "shoulders"], description: "Bench press with dumbbells" },
  { name: "Push-ups", bodyPart: "chest", equipment: "bodyweight", targetMuscles: ["chest", "triceps", "shoulders"], description: "Standard push-ups" },
  { name: "Incline Push-ups", bodyPart: "chest", equipment: "bodyweight", targetMuscles: ["chest", "triceps", "shoulders"], description: "Push-ups with feet elevated" },
  { name: "Dips", bodyPart: "chest", equipment: "bodyweight", targetMuscles: ["chest", "triceps", "shoulders"], description: "Dips on parallel bars or bench" },
  { name: "Chest Flyes", bodyPart: "chest", equipment: "dumbbells", targetMuscles: ["chest"], description: "Fly movement with dumbbells" },
  { name: "Cable Crossover", bodyPart: "chest", equipment: "cable machine", targetMuscles: ["chest"], description: "Cable fly movement" },
  { name: "Clap Push-ups", bodyPart: "chest", equipment: "bodyweight", targetMuscles: ["chest", "triceps"], description: "Explosive push-ups with clap", type: "reps" },
  { name: "Pike Push-ups", bodyPart: "shoulders", equipment: "bodyweight", targetMuscles: ["shoulders", "triceps"], description: "Pike position push-ups", type: "reps" },

  // Back
  { name: "Pull-ups", bodyPart: "back", equipment: "pull-up bar", targetMuscles: ["lats", "biceps", "rhomboids"], description: "Pull body up to bar" },
  { name: "Chin-ups", bodyPart: "back", equipment: "pull-up bar", targetMuscles: ["lats", "biceps"], description: "Pull-ups with underhand grip" },
  { name: "Lat Pulldown", bodyPart: "back", equipment: "cable machine", targetMuscles: ["lats", "biceps", "rhomboids"], description: "Pull cable bar down to chest" },
  { name: "Barbell Rows", bodyPart: "back", equipment: "barbell", targetMuscles: ["lats", "rhomboids", "traps"], description: "Row barbell to lower chest" },
  { name: "T-Bar Rows", bodyPart: "back", equipment: "T-bar", targetMuscles: ["lats", "rhomboids", "traps"], description: "Row T-bar to chest" },
  { name: "Cable Rows", bodyPart: "back", equipment: "cable machine", targetMuscles: ["lats", "rhomboids", "traps"], description: "Row cable handle to torso" },
  { name: "Dumbbell Rows", bodyPart: "back", equipment: "dumbbells", targetMuscles: ["lats", "rhomboids", "traps"], description: "Row dumbbell to hip" },
  { name: "Deadlifts", bodyPart: "back", equipment: "barbell", targetMuscles: ["erector spinae", "glutes", "hamstrings"], description: "Lift barbell from floor" },

  // Legs
  { name: "Squats", bodyPart: "legs", equipment: "barbell", targetMuscles: ["quadriceps", "glutes", "hamstrings"], description: "Squat down and stand up" },
  { name: "Front Squats", bodyPart: "legs", equipment: "barbell", targetMuscles: ["quadriceps", "glutes", "core"], description: "Squat with barbell in front" },
  { name: "Leg Press", bodyPart: "legs", equipment: "leg press machine", targetMuscles: ["quadriceps", "glutes", "hamstrings"], description: "Press weight with legs" },
  { name: "Lunges", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes", "hamstrings"], description: "Step forward into lunge position" },
  { name: "Bulgarian Split Squats", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes", "hamstrings"], description: "Single leg squat with rear foot elevated" },
  { name: "Calf Raises", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["calves"], description: "Rise up on toes" },
  { name: "Leg Curls", bodyPart: "legs", equipment: "leg curl machine", targetMuscles: ["hamstrings"], description: "Curl legs against resistance" },
  { name: "Leg Extensions", bodyPart: "legs", equipment: "leg extension machine", targetMuscles: ["quadriceps"], description: "Extend legs against resistance" },
  { name: "Air Squats", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Bodyweight squats", type: "reps" },
  { name: "Jump Squats", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Explosive squat jumps", type: "reps" },
  { name: "Jumping Lunges", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Alternating jumping lunges", type: "reps" },
  { name: "Reverse Lunges", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Reverse stepping lunges", type: "reps" },
  { name: "Step-ups", bodyPart: "legs", equipment: "bodyweight", targetMuscles: ["quadriceps", "glutes"], description: "Alternating step-ups", type: "reps" },

  // Shoulders
  { name: "Overhead Press", bodyPart: "shoulders", equipment: "barbell", targetMuscles: ["shoulders", "triceps"], description: "Press barbell overhead" },
  { name: "Dumbbell Shoulder Press", bodyPart: "shoulders", equipment: "dumbbells", targetMuscles: ["shoulders", "triceps"], description: "Press dumbbells overhead" },
  { name: "Lateral Raises", bodyPart: "shoulders", equipment: "dumbbells", targetMuscles: ["shoulders"], description: "Raise dumbbells to sides" },
  { name: "Front Raises", bodyPart: "shoulders", equipment: "dumbbells", targetMuscles: ["shoulders"], description: "Raise dumbbells to front" },
  { name: "Rear Delt Flyes", bodyPart: "shoulders", equipment: "dumbbells", targetMuscles: ["rear delts"], description: "Fly dumbbells behind you" },
  { name: "Arnold Press", bodyPart: "shoulders", equipment: "dumbbells", targetMuscles: ["shoulders"], description: "Rotating shoulder press" },
  { name: "Upright Rows", bodyPart: "shoulders", equipment: "barbell", targetMuscles: ["shoulders", "traps"], description: "Row barbell to chest level" },

  // Arms
  { name: "Bicep Curls", bodyPart: "arms", equipment: "dumbbells", targetMuscles: ["biceps"], description: "Curl dumbbells up" },
  { name: "Hammer Curls", bodyPart: "arms", equipment: "dumbbells", targetMuscles: ["biceps", "forearms"], description: "Curl with neutral grip" },
  { name: "Tricep Dips", bodyPart: "arms", equipment: "bodyweight", targetMuscles: ["triceps"], description: "Dip on bench or bars" },
  { name: "Close-Grip Bench Press", bodyPart: "arms", equipment: "barbell", targetMuscles: ["triceps", "chest"], description: "Bench press with narrow grip" },
  { name: "Tricep Pushdowns", bodyPart: "arms", equipment: "cable machine", targetMuscles: ["triceps"], description: "Push cable down" },
  { name: "Barbell Curls", bodyPart: "arms", equipment: "barbell", targetMuscles: ["biceps"], description: "Curl barbell up" },
  { name: "Skull Crushers", bodyPart: "arms", equipment: "barbell", targetMuscles: ["triceps"], description: "Lower barbell to forehead" },

  // Core
  { name: "Planks", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["core"], description: "Hold plank position" },
  { name: "Crunches", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["abs"], description: "Crunch up from lying position" },
  { name: "Russian Twists", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["obliques"], description: "Twist torso side to side" },
  { name: "Leg Raises", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["lower abs"], description: "Raise legs while lying down" },
  { name: "Mountain Climbers", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["core", "cardio"], description: "Alternate bringing knees to chest", type: "time" },
  { name: "Dead Bug", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["core"], description: "Opposite arm and leg extensions" },
  { name: "Bicycle Crunches", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["abs", "obliques"], description: "Alternate elbow to knee crunches" },
  { name: "Sit-ups", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["abs"], description: "Standard sit-ups", type: "reps" },
  { name: "Flutter Kicks", bodyPart: "core", equipment: "bodyweight", targetMuscles: ["abs", "hip flexors"], description: "Lying flutter kicks", type: "reps" },
  { name: "High Knees", bodyPart: "cardio", equipment: "bodyweight", targetMuscles: ["legs", "core"], description: "High knee marching", type: "reps" },

  // Full Body / Cardio
  { name: "Burpees", bodyPart: "full body", equipment: "bodyweight", targetMuscles: ["full body"], description: "Squat, jump back, push-up, jump forward, jump up" },
  { name: "Thrusters", bodyPart: "full body", equipment: "dumbbells", targetMuscles: ["legs", "shoulders"], description: "Squat to overhead press" },
  { name: "Clean and Press", bodyPart: "full body", equipment: "barbell", targetMuscles: ["full body"], description: "Clean barbell to shoulders then press overhead" },
  { name: "Turkish Get-ups", bodyPart: "full body", equipment: "kettlebell", targetMuscles: ["full body"], description: "Get up from lying to standing with weight overhead" },
  { name: "Bear Crawls", bodyPart: "full body", equipment: "bodyweight", targetMuscles: ["full body"], description: "Crawl on hands and feet" },
  { name: "Burpee Broad Jumps", bodyPart: "full body", equipment: "bodyweight", targetMuscles: ["full body"], description: "Burpee with broad jump", type: "reps" },
  { name: "Jump Rope", bodyPart: "cardio", equipment: "jump rope", targetMuscles: ["calves", "shoulders"], description: "Jump rope for time", type: "time" },
  { name: "Running", bodyPart: "cardio", equipment: "bodyweight", targetMuscles: ["legs"], description: "400m run or 2 min high knees", type: "distance" },

  // Olympic Lifts
  { name: "Snatch", bodyPart: "full body", equipment: "barbell", targetMuscles: ["full body"], description: "Lift barbell from floor to overhead in one motion" },
  { name: "Clean and Jerk", bodyPart: "full body", equipment: "barbell", targetMuscles: ["full body"], description: "Clean to shoulders then jerk overhead" },
  { name: "Power Clean", bodyPart: "full body", equipment: "barbell", targetMuscles: ["full body"], description: "Explosive clean to shoulders" },

  // Functional
  { name: "Farmers Walk", bodyPart: "full body", equipment: "dumbbells", targetMuscles: ["traps", "forearms", "core"], description: "Walk while carrying heavy weights" },
  { name: "Sled Push", bodyPart: "full body", equipment: "sled", targetMuscles: ["legs", "core"], description: "Push weighted sled" },
  { name: "Battle Ropes", bodyPart: "full body", equipment: "battle ropes", targetMuscles: ["shoulders", "core", "cardio"], description: "Wave heavy ropes" },
  { name: "Box Jumps", bodyPart: "legs", equipment: "box", targetMuscles: ["legs", "glutes"], description: "Jump onto box" },
  { name: "Wall Balls", bodyPart: "full body", equipment: "medicine ball", targetMuscles: ["legs", "shoulders"], description: "Squat and throw ball to wall target" },

  // Kettlebell
  { name: "Kettlebell Swings", bodyPart: "full body", equipment: "kettlebell", targetMuscles: ["glutes", "hamstrings", "core"], description: "Swing kettlebell between legs to chest height" },
  { name: "Kettlebell Goblet Squats", bodyPart: "legs", equipment: "kettlebell", targetMuscles: ["quadriceps", "glutes"], description: "Squat while holding kettlebell at chest" },
  { name: "Kettlebell Deadlifts", bodyPart: "back", equipment: "kettlebell", targetMuscles: ["glutes", "hamstrings", "erector spinae"], description: "Deadlift with kettlebell" },
  { name: "Kettlebell Press", bodyPart: "shoulders", equipment: "kettlebell", targetMuscles: ["shoulders", "triceps"], description: "Press kettlebell overhead" },
];
