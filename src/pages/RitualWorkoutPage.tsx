import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useWorkoutState } from '@/hooks/useWorkoutState';
import { useSaveWorkout } from '@/hooks/useSaveWorkout';
import { useRestTimer } from '@/hooks/useRestTimer';
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
    updateSet,
    handleToggleSet,
    restDuration,
    setRestDuration,
  } = useWorkoutState();

  const { saveWorkoutMutation, finishWorkout } = useSaveWorkout();
  
  const { 
    showRestTimer, 
    restTimerDuration, 
    isPaused,
    handleSetCompletion, 
    handleTogglePause,
    handleDismissRestTimer 
  } = useRestTimer(restDuration, false);

  // Load template data - either from database or from location state for Valhalla
  const valhallaTemplate = location.state?.template;
  const isValhalla = location.state?.isValhalla || templateId?.startsWith('valhalla-');
  
  const { data: dbTemplate, isLoading } = useQuery({
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

  // Initialize workout from template
  useEffect(() => {
    if (template && exercises.length === 0) {
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
      
      // Only auto-start for non-Valhalla workouts
      if (!isWorkoutActive && !isValhalla) {
        startWorkout();
      }
    }
  }, [template?.id, exercises.length, isWorkoutActive, isValhalla]);

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

  const handleFinishWorkout = () => {
    const totalTime = Math.floor(totalDuration / 1000);
    const formattedTime = `${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}`;
    
    finishWorkout({ 
      exercises, 
      name: templateName,
      onValhallaScorePrompt: (name) => handleValhallaScorePrompt(name, totalTime),
      onCelebration: (workoutName, duration) => {
        setCelebrationData({ workoutName, duration: formattedTime });
        setShowCelebration(true);
      }
    });
    
    pauseWorkout();
    resetTimer();
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    setCelebrationData(null);
    navigate('/history');
  };

  const handleCancelWorkout = () => {
    pauseWorkout();
    resetTimer();
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
          onUpdateSet={updateSet}
          onToggleSet={handleToggleSetWithRest}
          onStartWorkout={startWorkout}
          onFinishWorkout={handleFinishWorkout}
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
          workoutName={celebrationData.workoutName}
          workoutDuration={celebrationData.duration}
        />
      )}
    </>
  );
};

export default RitualWorkoutPage;