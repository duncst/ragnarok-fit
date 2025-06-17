
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { Exercise, WorkoutSet, WorkoutTemplate, Workout } from '@/types';
import { useOneRepMax } from './useOneRepMax';
import { useWorkoutPersistence } from './useWorkoutPersistence';

export const useWorkoutState = () => {
  const location = useLocation();
  const template = location.state?.template as WorkoutTemplate | undefined;
  const workout = location.state?.workout as Workout | undefined;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['Bodyweight']);
  const [focusArea, setFocusArea] = useState('Full Body');
  const [restDuration, setRestDuration] = useState(90);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date>(new Date());

  const { checkAndSave1RM } = useOneRepMax();
  const { saveWorkoutSession, loadWorkoutSession, clearWorkoutSession } = useWorkoutPersistence();

  // Load persisted workout session on mount
  useEffect(() => {
    const savedSession = loadWorkoutSession();
    if (savedSession && !template && !workout) {
      setWorkoutName(savedSession.name);
      setExercises(savedSession.exercises);
      setWorkoutStartTime(savedSession.startTime);
      setRestDuration(savedSession.restDuration);
      return;
    }

    if (template) {
      setWorkoutName(template.name);
      const exercisesFromTemplate: Exercise[] = template.exercises.map((templateEx, exIndex) => ({
        id: `ex-${Date.now()}-${exIndex}`,
        name: templateEx.name,
        sets: Array.from({ length: templateEx.sets }, (_, setIndex) => ({
          id: `set-${Date.now()}-${exIndex}-${setIndex}`,
          reps: 8,
          weight: 20,
          completed: false,
        })),
      }));
      setExercises(exercisesFromTemplate);
    } else if (workout) {
      setWorkoutName(workout.name);
      const exercisesFromWorkout: Exercise[] = workout.exercises.map((workoutEx, exIndex) => ({
          id: `ex-${Date.now()}-${exIndex}`,
          name: workoutEx.name,
          sets: workoutEx.sets.map((set, setIndex) => ({
              id: `set-${Date.now()}-${exIndex}-${setIndex}`,
              reps: set.reps,
              weight: set.weight,
              completed: false,
          })),
      }));
      setExercises(exercisesFromWorkout);
    }
  }, [template, workout, loadWorkoutSession]);

  // Save workout session whenever state changes
  useEffect(() => {
    if (exercises.length > 0 && workoutName) {
      const session = {
        id: `workout-${Date.now()}`,
        name: workoutName,
        exercises,
        startTime: workoutStartTime,
        restDuration,
      };
      saveWorkoutSession(session);
    }
  }, [exercises, workoutName, workoutStartTime, restDuration, saveWorkoutSession]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: '',
      sets: [{ id: `set-${Date.now()}`, reps: 8, weight: 20, completed: false }],
    };
    setExercises((prev) => [...prev, newExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  const updateExerciseName = (exerciseId: string, name: string) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, name } : ex))
    );
  };

  const addSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1] || { reps: 8, weight: 20 };
          const newSet: WorkoutSet = {
            id: `set-${Date.now()}`,
            reps: lastSet.reps,
            weight: lastSet.weight,
            completed: false,
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'reps' | 'weight',
    value: number
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
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
      })
    );
  };

  const handleToggleSet = useCallback((
    exerciseId: string,
    setId: string,
    onToggleCallback?: (isCompleted: boolean) => void
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id === setId) {
                const isCompleted = !set.completed;
                onToggleCallback?.(isCompleted);
                const updatedSet = { ...set, completed: isCompleted };
                if (updatedSet.completed) {
                  checkAndSave1RM(ex, updatedSet);
                }
                return updatedSet;
              }
              return set;
            }),
          };
        }
        return ex;
      })
    );
  }, [checkAndSave1RM]);

  const clearSession = useCallback(() => {
    clearWorkoutSession();
  }, [clearWorkoutSession]);
  
  return {
    workoutName,
    setWorkoutName,
    exercises,
    setExercises,
    addExercise,
    removeExercise,
    updateExerciseName,
    addSet,
    updateSet,
    handleToggleSet,
    selectedEquipment,
    setSelectedEquipment,
    focusArea,
    setFocusArea,
    restDuration,
    setRestDuration,
    workoutStartTime,
    clearSession,
  };
};
