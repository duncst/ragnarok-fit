export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  exercises: Exercise[];
  notes?: string;
}

export interface ExerciseDef {
  name: string;
  bodyPart: string;
  equipment: string;
  targetMuscles: string[];
  description: string;
}

export interface Run {
  id: string;
  distance: number; // in km
  duration: number; // in seconds
  runType: string;
  date: Date;
  notes?: string;
}
