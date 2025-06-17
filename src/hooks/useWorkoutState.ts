
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { Exercise, WorkoutSet, WorkoutTemplate, Workout } from '@/types';
import { useOneRepMax } from './useOneRepMax';
import { getExerciseType } from '@/utils/exerciseTypes';

export const useWorkoutState = (template?: WorkoutTemplate) => {
  const location = useLocation();
  const workout = location.state?.workout as Workout | undefined;

  const [workoutData, setWorkoutData] = useState<{
    id: string;
    name: string;
    startTime: Date;
    endTime?: Date;
    exercises: Exercise[];
    notes?: string;
  }>({
    id: `workout-${Date.now()}`,
    name: template?.name || '',
    startTime: new Date(),
    exercises: [],
    notes: '',
  });

  const { checkAndSave1RM } = useOneRepMax();

  // Initialize workout state from template or workout
  useEffect(() => {
    if (template) {
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
      setWorkoutData(prev => ({
        ...prev,
        name: template.name,
        exercises: exercisesFromTemplate,
      }));
    } else if (workout) {
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
      setWorkoutData(prev => ({
        ...prev,
        name: workout.name,
        exercises: exercisesFromWorkout,
      }));
    }
  }, [template, workout]);

  const addExercise = (exerciseName?: string) => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: exerciseName || '',
      type: exerciseName ? getExerciseType(exerciseName) : undefined,
      sets: [{ id: `set-${Date.now()}`, reps: 8, weight: 20, completed: false }],
    };
    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const addSet = (exerciseId: string) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1] || { reps: 8, weight: 20, duration: 60, distance: 1000 };
          const exerciseType = ex.type || getExerciseType(ex.name);
          const newSet: WorkoutSet = {
            id: `set-${Date.now()}`,
            reps: exerciseType === 'distance' ? 1 : lastSet.reps,
            weight: ['weight', 'weight_distance_time'].includes(exerciseType) ? lastSet.weight : 0,
            completed: false,
            duration: ['time', 'distance', 'weight_distance_time'].includes(exerciseType) ? (lastSet.duration || 60) : undefined,
            distance: ['distance', 'weight_distance_time'].includes(exerciseType) ? (lastSet.distance || 1000) : undefined,
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      }),
    }));
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'reps' | 'weight' | 'duration' | 'distance',
    value: number
  ) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id === setId) {
                return { ...set, [field]: value };
              }
              return set;
            }),
          };
        }
        return ex;
      }),
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.filter(set => set.id !== setId),
          };
        }
        return ex;
      }),
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  };

  const setWorkoutName = (name: string) => {
    setWorkoutData(prev => ({ ...prev, name }));
  };

  const setWorkoutNotes = (notes: string) => {
    setWorkoutData(prev => ({ ...prev, notes }));
  };

  const moveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    setWorkoutData(prev => {
      const exercises = [...prev.exercises];
      const index = exercises.findIndex(ex => ex.id === exerciseId);
      
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= exercises.length) return prev;
      
      [exercises[index], exercises[newIndex]] = [exercises[newIndex], exercises[index]];
      
      return { ...prev, exercises };
    });
  };

  return {
    workout: workoutData,
    addExercise,
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    setWorkoutName,
    setWorkoutNotes,
    moveExercise,
  };
};
