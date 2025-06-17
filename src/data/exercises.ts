import type { ExerciseDef } from '@/types';

export const exercises: ExerciseDef[] = [
  // Existing weight-based exercises
  { name: 'Bench Press', bodyPart: 'Chest', equipment: 'Barbell', targetMuscles: ['Pectorals', 'Triceps', 'Anterior Deltoids'], description: 'Lie on bench and press barbell from chest', type: 'weight' },
  { name: 'Squat', bodyPart: 'Legs', equipment: 'Barbell', targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'], description: 'Stand with barbell on shoulders and squat down', type: 'weight' },
  { name: 'Deadlift', bodyPart: 'Back', equipment: 'Barbell', targetMuscles: ['Erector Spinae', 'Glutes', 'Hamstrings'], description: 'Lift barbell from floor to hip level', type: 'weight' },
  { name: 'Overhead Press', bodyPart: 'Shoulders', equipment: 'Barbell', targetMuscles: ['Deltoids', 'Triceps'], description: 'Press barbell overhead from shoulder level', type: 'weight' },
  { name: 'Barbell Row', bodyPart: 'Back', equipment: 'Barbell', targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Middle Trapezius'], description: 'Pull barbell to chest while bent over', type: 'weight' },
  { name: 'Bicep Curls', bodyPart: 'Arms', equipment: 'Dumbbell', targetMuscles: ['Biceps'], description: 'Curl dumbbells up to shoulders', type: 'weight' },
  { name: 'Tricep Extensions', bodyPart: 'Arms', equipment: 'Dumbbell', targetMuscles: ['Triceps'], description: 'Extend dumbbells overhead', type: 'weight' },
  { name: 'Dumbbell Press', bodyPart: 'Chest', equipment: 'Dumbbell', targetMuscles: ['Pectorals', 'Triceps', 'Anterior Deltoids'], description: 'Press dumbbells from chest level', type: 'weight' },
  { name: 'Lateral Raises', bodyPart: 'Shoulders', equipment: 'Dumbbell', targetMuscles: ['Lateral Deltoids'], description: 'Raise dumbbells to the side', type: 'weight' },
  { name: 'Leg Press', bodyPart: 'Legs', equipment: 'Machine', targetMuscles: ['Quadriceps', 'Glutes'], description: 'Press weight with legs on machine', type: 'weight' },
  
  // Core exercises (time-based planks stay here)
  { name: 'Plank', bodyPart: 'Core', equipment: 'Bodyweight', targetMuscles: ['Core', 'Shoulders'], description: 'Hold plank position for time', type: 'time' },
  { name: 'Side Plank', bodyPart: 'Core', equipment: 'Bodyweight', targetMuscles: ['Obliques', 'Core'], description: 'Hold side plank position for time', type: 'time' },
  { name: 'Dead Bug', bodyPart: 'Core', equipment: 'Bodyweight', targetMuscles: ['Core', 'Hip Flexors'], description: 'Alternate arm and leg extensions while lying down', type: 'time' },
  { name: 'Sit-ups', bodyPart: 'Core', equipment: 'Bodyweight', targetMuscles: ['Abdominals'], description: 'Sit up from lying position', type: 'reps' },
  { name: 'Crunches', bodyPart: 'Core', equipment: 'Bodyweight', targetMuscles: ['Abdominals'], description: 'Crunch torso toward knees', type: 'reps' },
  { name: 'Leg Raises', bodyPart: 'Core', equipment: 'Bodyweight', targetMuscles: ['Lower Abdominals'], description: 'Raise legs while lying down', type: 'reps' },

  // Cardio exercises (time-based and distance-based)
  { name: 'Running', bodyPart: 'Cardio', equipment: 'Bodyweight', targetMuscles: ['Legs', 'Cardiovascular'], description: 'Run for time and distance', type: 'distance' },
  { name: 'Run', bodyPart: 'Cardio', equipment: 'Bodyweight', targetMuscles: ['Legs', 'Cardiovascular'], description: 'Run for time and distance', type: 'distance' },
  { name: 'Treadmill', bodyPart: 'Cardio', equipment: 'Treadmill', targetMuscles: ['Legs', 'Cardiovascular'], description: 'Run on treadmill for time and distance', type: 'distance' },
  { name: 'Rowing', bodyPart: 'Cardio', equipment: 'Rowing Machine', targetMuscles: ['Back', 'Legs', 'Arms'], description: 'Row for time and distance', type: 'distance' },
  { name: 'Ski Erg', bodyPart: 'Cardio', equipment: 'Ski Erg', targetMuscles: ['Arms', 'Core', 'Back'], description: 'Ski motion for time and distance', type: 'distance' },
  { name: 'Skipping', bodyPart: 'Cardio', equipment: 'Jump Rope', targetMuscles: ['Calves', 'Shoulders', 'Cardiovascular'], description: 'Jump rope for time and distance', type: 'distance' },
  { name: 'Jump Rope', bodyPart: 'Cardio', equipment: 'Jump Rope', targetMuscles: ['Calves', 'Shoulders', 'Cardiovascular'], description: 'Jump rope for time and distance', type: 'distance' },
  { name: 'Indoor Bike', bodyPart: 'Cardio', equipment: 'Stationary Bike', targetMuscles: ['Legs', 'Cardiovascular'], description: 'Cycle for time and distance', type: 'distance' },
  { name: 'Stationary Bike', bodyPart: 'Cardio', equipment: 'Stationary Bike', targetMuscles: ['Legs', 'Cardiovascular'], description: 'Cycle for time and distance', type: 'distance' },
  { name: 'Assault Bike', bodyPart: 'Cardio', equipment: 'Assault Bike', targetMuscles: ['Legs', 'Arms', 'Cardiovascular'], description: 'Cycle with arm and leg motion', type: 'distance' },
  { name: 'Air Bike', bodyPart: 'Cardio', equipment: 'Air Bike', targetMuscles: ['Legs', 'Arms', 'Cardiovascular'], description: 'Cycle with arm and leg motion', type: 'distance' },
  { name: 'Bike', bodyPart: 'Cardio', equipment: 'Bike', targetMuscles: ['Legs', 'Cardiovascular'], description: 'Cycle for time and distance', type: 'distance' },
  { name: 'Wall Balls', bodyPart: 'Cardio', equipment: 'Medicine Ball', targetMuscles: ['Legs', 'Shoulders', 'Core'], description: 'Squat and throw ball to wall target', type: 'time' },
  { name: 'Mountain Climbers', bodyPart: 'Cardio', equipment: 'Bodyweight', targetMuscles: ['Core', 'Shoulders', 'Legs'], description: 'Alternate bringing knees to chest in plank position', type: 'time' },
  { name: 'High Knees', bodyPart: 'Cardio', equipment: 'Bodyweight', targetMuscles: ['Hip Flexors', 'Calves'], description: 'Run in place with high knees', type: 'time' },
  { name: 'Butt Kicks', bodyPart: 'Cardio', equipment: 'Bodyweight', targetMuscles: ['Hamstrings', 'Calves'], description: 'Run in place kicking heels to glutes', type: 'time' },
  { name: 'Jumping Jacks', bodyPart: 'Cardio', equipment: 'Bodyweight', targetMuscles: ['Legs', 'Shoulders', 'Core'], description: 'Jump while spreading legs and raising arms', type: 'time' },

  // Full Body exercises
  { name: 'Wall Sit', bodyPart: 'Full Body', equipment: 'Bodyweight', targetMuscles: ['Quadriceps', 'Glutes'], description: 'Sit against wall for time', type: 'time' },
  { name: 'Bear Crawl', bodyPart: 'Full Body', equipment: 'Bodyweight', targetMuscles: ['Core', 'Shoulders', 'Legs'], description: 'Crawl forward on hands and feet', type: 'time' },
  { name: 'Burpees', bodyPart: 'Full Body', equipment: 'Bodyweight', targetMuscles: ['Full Body'], description: 'Squat, jump back, push-up, jump forward, jump up', type: 'reps' },
  { name: 'Sled Push', bodyPart: 'Full Body', equipment: 'Sled', targetMuscles: ['Legs', 'Core', 'Shoulders'], description: 'Push weighted sled for distance and time', type: 'weight_distance_time' },
  { name: 'Sled Pull', bodyPart: 'Full Body', equipment: 'Sled', targetMuscles: ['Back', 'Legs', 'Arms'], description: 'Pull weighted sled for distance and time', type: 'weight_distance_time' },
  { name: 'Weighted Carry', bodyPart: 'Full Body', equipment: 'Various', targetMuscles: ['Grip', 'Core', 'Legs'], description: 'Carry weight for distance and time', type: 'weight_distance_time' },
  { name: 'Farmer\'s Walk', bodyPart: 'Full Body', equipment: 'Dumbbells', targetMuscles: ['Grip', 'Core', 'Legs'], description: 'Walk carrying weights for distance and time', type: 'weight_distance_time' },
  { name: 'Farmer Walk', bodyPart: 'Full Body', equipment: 'Dumbbells', targetMuscles: ['Grip', 'Core', 'Legs'], description: 'Walk carrying weights for distance and time', type: 'weight_distance_time' },

  // Reps-only exercises
  { name: 'Push-ups', bodyPart: 'Chest', equipment: 'Bodyweight', targetMuscles: ['Pectorals', 'Triceps', 'Anterior Deltoids'], description: 'Push up from floor', type: 'reps' },
  { name: 'Pull-ups', bodyPart: 'Back', equipment: 'Pull-up Bar', targetMuscles: ['Latissimus Dorsi', 'Biceps'], description: 'Pull body up to bar', type: 'reps' },
  { name: 'Chin-ups', bodyPart: 'Back', equipment: 'Pull-up Bar', targetMuscles: ['Latissimus Dorsi', 'Biceps'], description: 'Pull body up to bar with underhand grip', type: 'reps' },
  { name: 'Dips', bodyPart: 'Arms', equipment: 'Dip Bar', targetMuscles: ['Triceps', 'Chest'], description: 'Lower and raise body on parallel bars', type: 'reps' },
  { name: 'Air Squats', bodyPart: 'Legs', equipment: 'Bodyweight', targetMuscles: ['Quadriceps', 'Glutes'], description: 'Squat without weight', type: 'reps' },
  { name: 'Lunges', bodyPart: 'Legs', equipment: 'Bodyweight', targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'], description: 'Step forward into lunge position', type: 'reps' },
  { name: 'Step-ups', bodyPart: 'Legs', equipment: 'Box', targetMuscles: ['Quadriceps', 'Glutes'], description: 'Step up onto elevated surface', type: 'reps' },
];
