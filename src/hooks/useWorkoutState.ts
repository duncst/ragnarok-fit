
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { Exercise, WorkoutSet, WorkoutTemplate, Workout } from '@/types';
import { useOneRepMax } from './useOneRepMax';
import { useWorkoutPersistence } from './useWorkoutPersistence';

export const useWorkoutState = () => {
  const location = useLocation();
  const template = location.state?.template as WorkoutTemplate | undefined;
  const workout = location.state?.workout as Workout | undefined;
  const { loadWorkout, saveWorkout, clearWorkout } = useWorkoutPersistence();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['Bodyweight']);
  const [focusArea, setFocusArea] = useState('Full Body');
  const [restDuration, setRestDuration] = useState(90);
  const [isInitialized, setIsInitialized] = useState(false);

  const { checkAndSave1RM } = useOneRepMax();

  // Initialize workout state from template, workout, or persisted data
  useEffect(() => {
    if (isInitialized) return;

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

  // Auto-save workout state when it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    // Only persist if there's meaningful workout data
    if (exercises.length > 0 || workoutName.trim() !== '') {
      saveWorkout({
        workoutName,
        exercises,
        selectedEquipment,
        focusArea,
        restDuration,
      });
    }
  }, [exercises, workoutName, selectedEquipment, focusArea, restDuration, isInitialized, saveWorkout]);

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

  const clearPersistedWorkout = () => {
    clearWorkout();
  };
  
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
    clearPersistedWorkout,
  };
};
