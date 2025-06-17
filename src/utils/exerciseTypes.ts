
// Time-based exercises that should be measured by duration instead of weight
export const TIME_BASED_EXERCISES = [
  'Running',
  'Treadmill',
  'Rowing',
  'Ski Erg',
  'Skipping',
  'Jump Rope',
  'Indoor Bike',
  'Stationary Bike',
  'Assault Bike',
  'Air Bike',
  'Plank',
  'Side Plank',
  'Wall Sit',
  'Dead Bug',
  'Bear Crawl',
  'Mountain Climbers',
  'High Knees',
  'Butt Kicks',
  'Jumping Jacks',
];

// Reps-only exercises (no weight, just reps)
export const REPS_ONLY_EXERCISES = [
  'Push-ups',
  'Pull-ups',
  'Chin-ups',
  'Dips',
  'Burpees',
  'Sit-ups',
  'Crunches',
  'Leg Raises',
  'Air Squats',
  'Lunges',
  'Step-ups',
];

export const getExerciseType = (exerciseName: string): 'weight' | 'time' | 'reps' => {
  const normalizedName = exerciseName.trim();
  
  if (TIME_BASED_EXERCISES.some(ex => normalizedName.toLowerCase().includes(ex.toLowerCase()))) {
    return 'time';
  }
  
  if (REPS_ONLY_EXERCISES.some(ex => normalizedName.toLowerCase().includes(ex.toLowerCase()))) {
    return 'reps';
  }
  
  return 'weight';
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const parseDurationInput = (input: string): number => {
  // Handle formats like "2:30", "150", "2.5"
  if (input.includes(':')) {
    const [mins, secs] = input.split(':').map(Number);
    return (mins || 0) * 60 + (secs || 0);
  }
  
  const num = parseFloat(input);
  if (isNaN(num)) return 0;
  
  // If it's a decimal, assume it's minutes
  if (input.includes('.')) {
    return Math.round(num * 60);
  }
  
  // If it's a whole number > 10, assume seconds, otherwise minutes
  return num > 10 ? num : num * 60;
};
