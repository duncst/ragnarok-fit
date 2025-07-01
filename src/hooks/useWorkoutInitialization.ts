
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Exercise, WorkoutTemplate, Workout } from '@/types';
import { useWorkoutPersistence } from './useWorkoutPersistence';

export const useWorkoutInitialization = () => {
  const location = useLocation();
  const template = location.state?.template as WorkoutTemplate | undefined;
  const workout = location.state?.workout as Workout | undefined;
  const { loadWorkout } = useWorkoutPersistence();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['Bodyweight']);
  const [focusArea, setFocusArea] = useState('Full Body');
  const [restDuration, setRestDuration] = useState(90);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    if (template) {
      setWorkoutName(template.name);
      const exercisesFromTemplate: Exercise[] = template.exercises.map((templateEx, exIndex) => ({
        id: `ex-${Date.now()}-${exIndex}`,
        name: templateEx.name,
        type: templateEx.type,
        sets: Array.from({ length: templateEx.sets }, (_, setIndex) => ({
          id: `set-${Date.now()}-${exIndex}-${setIndex}`,
          reps: templateEx.suggestedReps || 8,
          weight: 20,
          completed: false,
          duration: ['time', 'distance', 'weight_distance_time'].includes(templateEx.type || '') ? 60 : undefined,
          distance: ['distance', 'weight_distance_time'].includes(templateEx.type || '') ? 1000 : undefined,
        })),
      }));
      setExercises(exercisesFromTemplate);
    } else if (workout) {
      setWorkoutName(workout.name);
      const exercisesFromWorkout: Exercise[] = workout.exercises.map((workoutEx, exIndex) => ({
          id: `ex-${Date.now()}-${exIndex}`,
          name: workoutEx.name,
          type: workoutEx.type,
          sets: workoutEx.sets.map((set, setIndex) => ({
              id: `set-${Date.now()}-${exIndex}-${setIndex}`,
              reps: set.reps,
              weight: set.weight,
              completed: false,
              duration: set.duration,
              distance: set.distance,
          })),
      }));
      setExercises(exercisesFromWorkout);
    } else {
      // Try to load persisted workout
      const persistedWorkout = loadWorkout();
      if (persistedWorkout) {
        setWorkoutName(persistedWorkout.workoutName);
        setExercises(persistedWorkout.exercises);
        setSelectedEquipment(persistedWorkout.selectedEquipment);
        setFocusArea(persistedWorkout.focusArea);
        setRestDuration(persistedWorkout.restDuration);
      }
    }
    
    setIsInitialized(true);
  }, [template, workout, loadWorkout, isInitialized]);

  return {
    exercises,
    setExercises,
    workoutName,
    setWorkoutName,
    selectedEquipment,
    setSelectedEquipment,
    focusArea,
    setFocusArea,
    restDuration,
    setRestDuration,
    isInitialized,
  };
};
