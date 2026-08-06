import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useWorkoutState } from '@/hooks/useWorkoutState';
import { useWorkoutPersistence } from '@/hooks/useWorkoutPersistence';
import { useSaveWorkout } from '@/hooks/useSaveWorkout';
import { useSaveAsTemplate } from '@/hooks/useSaveAsTemplate';
import { useRestTimer } from '@/hooks/useRestTimer';
import { useActiveWorkout } from '@/contexts/ActiveWorkoutContext';
import { SimpleWorkoutExecution } from '@/components/workout/SimpleWorkoutExecution';
import { ForTimeWorkoutMode } from '@/components/workout/ForTimeWorkoutMode';
import { ValhallaWorkoutMode } from '@/components/workout/ValhallaWorkoutMode';
import { ValhallaScoreDialog } from '@/components/workout/ValhallaScoreDialog';
import { ForgeCelebration } from '@/components/forge/ForgeCelebration';
import { RestTimerToast } from '@/components/workout/RestTimerToast';
import { toast } from 'sonner';
import type { Exercise } from '@/types';

const RitualWorkoutPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const templateName = location.state?.templateName || 'Ritual';

  // Load template data - either from database or from location state for Valhalla
  const valhallaTemplate = location.state?.template;
  const isValhalla = location.state?.isValhalla || templateId?.startsWith('valhalla-');

  // Identifies this specific workout session so an in-progress draft can be
  // told apart from a stale/unrelated one and safely resumed after the page
  // reloads mid-workout (backgrounding, a brief sign-out, etc.) instead of
  // being silently overwritten by a fresh, empty copy of the template.
  const sessionId = templateId ? `${isValhalla ? 'valhalla' : 'ritual'}-${templateId}` : undefined;

  const [showValhallaScoreDialog, setShowValhallaScoreDialog] = useState(false);
  const [currentValhallaWorkout, setCurrentValhallaWorkout] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{workoutName: string, duration: string} | null>(null);

  const {
    isActive: isWorkoutActive,
    formattedDuration,
    totalDuration,
    startWorkout,
    pauseWorkout,
    resetTimer,
  } = useWorkoutTimer();

  const {
    exercises,
    setExercises,
    addExercise,
    removeExercise,
    moveExercise,
    addSet,
    removeSet,
    updateSet,
    handleToggleSet,
    restDuration,
    setRestDuration,
    clearPersistedWorkout,
  } = useWorkoutState(sessionId);

  const { loadWorkout } = useWorkoutPersistence();
  const { saveWorkoutMutation, finishWorkout } = useSaveWorkout();
  const { saveAsTemplate, saveAsTemplateMutation } = useSaveAsTemplate();
  const { setActiveWorkout } = useActiveWorkout();
  
  const { 
    showRestTimer, 
    restTimerDuration, 
    isPaused,
    handleSetCompletion, 
    handleTogglePause,
    handleDismissRestTimer 
  } = useRestTimer(restDuration, false);

  const { data: dbTemplate, isLoading, error } = useQuery({
    queryKey: ['workout-template', templateId],
    queryFn: async () => {
      if (!templateId) throw new Error('No template ID provided');
      
      const { data, error } = await supabase
        .from('workout_templates')
        .select(`
          *,
          workout_template_exercises (
            exercise_name,
            sets,
            order
          )
        `)
        .eq('id', templateId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!templateId && !isValhalla
  });

  const template = isValhalla ? valhallaTemplate : dbTemplate;

  // Initialize workout from template — but first check whether there's
  // already an in-progress draft for this exact session (e.g. the page
  // reloaded mid-workout) and resume that instead of silently overwriting it
  // with a fresh, empty copy of the template.
  useEffect(() => {
    if (!template) return;

    let cancelled = false;

    (async () => {
      const persisted = sessionId ? await loadWorkout() : null;
      if (cancelled) return;

      if (persisted && persisted.sessionId === sessionId && persisted.exercises?.length > 0) {
        // Resume the in-progress workout as-is; don't touch the persisted copy.
        setExercises(persisted.exercises);
        if (persisted.restDuration) setRestDuration(persisted.restDuration);
      } else {
        // No matching draft — clear any stale/unrelated one and start fresh.
        clearPersistedWorkout();

        let templateExercises: Exercise[];

        if (isValhalla && template.exercises) {
          // Handle Valhalla template with exercises array
          templateExercises = template.exercises.map((ex: any, index: number) => ({
            id: `${Date.now()}_${index}`,
            name: ex.name,
            sets: Array.from({ length: ex.sets }, (_, setIndex) => ({
              id: `${Date.now()}_${index}_set${setIndex}`,
              reps: ex.suggestedReps || 0,
              weight: 0,
              completed: false,
              duration: 0,
              distance: 0,
            }))
          }));
        } else if (template.workout_template_exercises) {
          // Handle regular database template
          templateExercises = template.workout_template_exercises
            .sort((a, b) => a.order - b.order)
            .map((templateEx, index) => ({
              id: `${Date.now()}_${index}`,
              name: templateEx.exercise_name,
              sets: Array.from({ length: templateEx.sets }, (_, setIndex) => ({
                id: `${Date.now()}_${index}_set${setIndex}`,
                reps: 0,
                weight: 0,
                completed: false,
                duration: 0,
                distance: 0,
              }))
            }));
        } else {
          return;
        }

        setExercises(templateExercises);
      }

      if (cancelled) return;

      // Register active workout
      setActiveWorkout({
        id: templateId || 'ritual',
        name: templateName,
        type: isValhalla ? 'valhalla' : 'ritual',
        startTime: new Date(),
        returnPath: location.pathname,
        templateId,
      });

      // Only auto-start for non-Valhalla workouts
      if (!isWorkoutActive && !isValhalla) {
        startWorkout();
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template?.id, isValhalla]);

  const isValhallaWorkout = (name: string) => {
    return !!name.match(/^(THOR|FENRIR|HEL|NJORD|ODIN)$/i);
  };

  const isForTimeWorkout = (workoutName: string) => {
    // THOR, FENRIR, NJORD, and ODIN are FOR TIME workouts
    return !!workoutName.match(/^(THOR|FENRIR|NJORD|ODIN)$/i);
  };

  const handleValhallaScorePrompt = (workoutName: string, duration: number) => {
    setCurrentValhallaWorkout(workoutName);
    setWorkoutDuration(duration);
    setShowValhallaScoreDialog(true);
  };

  const handleCloseValhallaDialog = () => {
    setShowValhallaScoreDialog(false);
    setCurrentValhallaWorkout('');
    setWorkoutDuration(0);
    navigate('/workout/new');
  };

  const handleValhallaComplete = (rounds: number, notes?: string) => {
    const workoutDurationInMinutes = Math.round(totalDuration / 60000);
    handleValhallaScorePrompt(templateName, workoutDurationInMinutes);
  };

  const handleForTimeComplete = (completionTimeMinutes: number, notes?: string) => {
    handleValhallaScorePrompt(templateName, completionTimeMinutes);
  };

  const handleValhallaExit = () => {
    pauseWorkout();
    resetTimer();
    navigate('/workout/new');
  };

  const handleFinishWorkout = (forgeMessage?: string, shouldSaveAsTemplate?: boolean, newTemplateName?: string) => {
    const totalTime = Math.floor(totalDuration / 1000);
    const formattedTime = `${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}`;
    
    finishWorkout({ 
      exercises, 
      name: templateName || 'Ritual',
      forgeMessage,
      onValhallaScorePrompt: (name) => handleValhallaScorePrompt(name, totalTime),
      onCelebration: (workoutName, duration) => {
        setCelebrationData({ workoutName, duration: formattedTime });
        setShowCelebration(true);
      }
    });
    
    // Save as template if requested
    if (shouldSaveAsTemplate && newTemplateName) {
      saveAsTemplate({ exercises, name: newTemplateName });
    }
    
    pauseWorkout();
    resetTimer();
    setActiveWorkout(null);
    clearPersistedWorkout();
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    setCelebrationData(null);
    navigate('/history');
  };

  const handleCancelWorkout = () => {
    pauseWorkout();
    resetTimer();
    setActiveWorkout(null);
    clearPersistedWorkout();
    toast.success('Ritual cancelled');
    navigate('/workout/new');
  };

  const handleAddExerciseByName = (exerciseName: string) => {
    const newExerciseId = Date.now().toString();
    const newExercise = {
      id: newExerciseId,
      name: exerciseName,
      sets: [{
        id: Date.now().toString() + '_set1',
        reps: 0,
        weight: 0,
        completed: false,
        duration: 0,
        distance: 0,
      }],
    };
    
    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
  };

  const handleToggleSetWithRest = (exerciseId: string, setId: string) => {
    handleToggleSet(exerciseId, setId, handleSetCompletion);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">Loading your ritual...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">Ritual not found</p>
          <button 
            onClick={() => navigate('/workout/new')}
            className="text-primary hover:underline"
          >
            Return to rituals
          </button>
        </div>
      </div>
    );
  }

  // Prepare Valhalla workout data if needed
  const valhallaExercises = isValhalla && template?.exercises ? 
    template.exercises.map((ex: any) => ({
      name: ex.name,
      reps: ex.suggestedReps || 0
    })) : [];

  // Determine default duration for Valhalla workouts (20 minutes = 1200 seconds)
  const valhallaDuration = 1200;

  return (
    <>
      {isValhalla ? (
        isForTimeWorkout(templateName) ? (
          <ForTimeWorkoutMode
            workoutName={templateName}
            workoutSubtitle={template?.theme || template?.description || "Complete as fast as possible"}
            exercises={valhallaExercises}
            onComplete={handleForTimeComplete}
            onExit={handleValhallaExit}
          />
        ) : (
          <ValhallaWorkoutMode
            workoutName={templateName}
            workoutSubtitle={template?.theme || template?.description || "Face the trials of the gods"}
            exercises={valhallaExercises}
            duration={valhallaDuration}
            onComplete={handleValhallaComplete}
            onExit={handleValhallaExit}
          />
        )
      ) : (
        <SimpleWorkoutExecution
          workoutName={templateName}
          exercises={exercises}
          onAddExercise={handleAddExerciseByName}
          onRemoveExercise={removeExercise}
          onMoveExercise={moveExercise}
          onAddSet={addSet}
          onRemoveSet={removeSet}
          onUpdateSet={updateSet}
          onToggleSet={handleToggleSetWithRest}
          onStartWorkout={startWorkout}
          onFinishWorkout={handleFinishWorkout}
          isFinishLoading={saveWorkoutMutation.isPending}
          onCancelWorkout={handleCancelWorkout}
          workoutTimer={formattedDuration}
          isStarted={isWorkoutActive}
          restDuration={restDuration}
          onRestDurationChange={setRestDuration}
          showRestTimer={showRestTimer}
          restTimerDuration={restTimerDuration}
          isPaused={isPaused}
          onTogglePause={handleTogglePause}
          onDismissRestTimer={handleDismissRestTimer}
        />
      )}

      <ValhallaScoreDialog
        isOpen={showValhallaScoreDialog}
        onClose={handleCloseValhallaDialog}
        workoutName={currentValhallaWorkout}
        workoutDuration={workoutDuration}
      />

      {celebrationData && (
        <ForgeCelebration
          isOpen={showCelebration}
          onClose={handleCloseCelebration}
          activityName={celebrationData.workoutName}
          activityDuration={celebrationData.duration}
          onShareWithClan={(shouldShare) => {
            // Clan sharing is already handled when the workout is saved
            // This callback can be used for future enhancements
          }}
        />
      )}
    </>
  );
};

export default RitualWorkoutPage;