// Time-based exercises that should be measured by duration instead of weight
export const TIME_BASED_EXERCISES = [
  'Plank',
  'Side Plank',
  'Wall Sit',
  'Wall Balls',
  'Dead Bug',
  'Bear Crawl',
  'Mountain Climbers',
  'High Knees',
  'Butt Kicks',
  'Jumping Jacks',
  'Jump Rope',
];

// Distance-based exercises (time + distance)
export const DISTANCE_BASED_EXERCISES = [
  'Running',
  'Run',
  'Treadmill',
  'Rowing',
  'Ski Erg',
  'Skipping',
  'Jump Rope',
  'Indoor Bike',
  'Stationary Bike',
  'Assault Bike',
  'Air Bike',
  'Bike',
];

// Weight + distance + time exercises
export const WEIGHT_DISTANCE_TIME_EXERCISES = [
  'Sled Push',
  'Sled Pull',
  'Weighted Carry',
  'Farmer\'s Walk',
  'Farmer Walk',
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

export const getExerciseType = (exerciseName: string): 'weight' | 'time' | 'reps' | 'distance' | 'weight_distance_time' => {
  const normalizedName = exerciseName.trim();
  
  if (DISTANCE_BASED_EXERCISES.some(ex => normalizedName.toLowerCase().includes(ex.toLowerCase()))) {
    return 'distance';
  }
  
  if (WEIGHT_DISTANCE_TIME_EXERCISES.some(ex => normalizedName.toLowerCase().includes(ex.toLowerCase()))) {
    return 'weight_distance_time';
  }
  
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

export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)}km`;
  }
  return `${meters}m`;
};

export const parseDistanceInput = (input: string): number => {
  const cleanInput = input.toLowerCase().replace(/[^\d.]/g, '');
  const num = parseFloat(cleanInput);
  if (isNaN(num)) return 0;
  
  // If the original input contained 'km', convert to meters
  if (input.toLowerCase().includes('km')) {
    return num * 1000;
  }
  
  return num; // assume meters
};
