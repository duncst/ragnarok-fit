import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useWorkoutState } from '@/hooks/useWorkoutState';
import { useSaveWorkout } from '@/hooks/useSaveWorkout';
import { useRestTimer } from '@/hooks/useRestTimer';
import { SimpleWorkoutExecution } from '@/components/workout/SimpleWorkoutExecution';
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

  // Load template data
  const { data: template, isLoading } = useQuery({
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
    enabled: !!templateId
  });

  // Initialize workout from template
  useEffect(() => {
    if (template && template.workout_template_exercises && exercises.length === 0) {
      const templateExercises: Exercise[] = template.workout_template_exercises
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

      setExercises(templateExercises);
      
      // Start the workout timer automatically
      if (!isWorkoutActive) {
        startWorkout();
      }
    }
  }, [template?.id, exercises.length, isWorkoutActive]);

  const isValhallaWorkout = (name: string) => {
    return !!name.match(/^(THOR|FENRIR|HEL|NJORD|ODIN)$/i);
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

  return (
    <>
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