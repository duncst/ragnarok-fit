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

export type TemplateExercise = ExerciseDef & { sets: number };

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: TemplateExercise[];
  user_id: string;
  is_public: boolean;
  created_at: string;
}

export interface Run {
  id: string;
  distance: number; // in km
  duration: number; // in seconds
  runType: string;
  date: Date;
  notes?: string;
  elevation?: number; // in meters
  avgHr?: number; // in bpm
}

export interface PersonalRecord {
  id: string;
  user_id: string;
  exercise_name: string;
  one_rep_max: number;
  date: string;
  created_at: string;
}
