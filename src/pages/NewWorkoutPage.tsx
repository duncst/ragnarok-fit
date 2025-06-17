
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Timer, Save } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ExerciseCard } from "@/components/workout/ExerciseCard";
import { WorkoutActions } from "@/components/workout/WorkoutActions";
import { WorkoutHeader } from "@/components/workout/WorkoutHeader";
import { useWorkoutState } from "@/hooks/useWorkoutState";
import { useWorkoutPersistence } from "@/hooks/useWorkoutPersistence";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";
import { useSaveWorkout } from "@/hooks/useSaveWorkout";
import { useSaveAsTemplate } from "@/hooks/useSaveAsTemplate";
import type { WorkoutTemplate } from "@/types";
import { RestTimerSettings } from "@/components/workout/RestTimerSettings";
import { RestTimerToast } from "@/components/workout/RestTimerToast";
import { ExerciseSelector } from "@/components/ExerciseSelector";
import { WorkoutCookMode } from "@/components/workout/WorkoutCookMode";
import { ScoreRecordingDialog } from "@/components/workout/ScoreRecordingDialog";
import { useValhallaScoreDialog } from "@/hooks/useValhallaScoreDialog";

const valhallaWorkouts = [
  {
    id: "thor",
    name: "THOR",
    godName: "God of Thunder",
    description: "explosive and strength-focused",
    theme: "Like Mjölnir, short, heavy, and hammering.",
    icon: "⚡",
    format: "3 rounds",
    scoreInstructions: "Record your total time to complete all 3 rounds. Faster time = better score.",
  },
  {
    id: "fenrir",
    name: "FENRIR",
    godName: "The beast unleashed",
    description: "raw power and endurance",
    theme: "Designed to wear you down—then break you loose.",
    icon: "🐺",
    format: "For time",
    scoreInstructions: "Record your total time to complete all exercises. Target: Under 15 minutes for elite performance.",
  },
  {
    id: "hel",
    name: "HEL",
    godName: "Queen of the underworld",
    description: "cold and relentless",
    theme: "Unforgiving and creeping—no flash, all grind.",
    icon: "🧊",
    format: "2 rounds",
    scoreInstructions: "Record your total time to complete both rounds. Consistency between rounds shows true grit.",
  },
  {
    id: "njord",
    name: "NJORD",
    godName: "God of the sea",
    description: "flow and mobility",
    theme: "Graceful pacing with strong undertow—stamina and control.",
    icon: "🌊",
    format: "3 rounds",
    scoreInstructions: "Record your total time to complete all 3 rounds. Focus on smooth transitions between exercises.",
  },
  {
    id: "odin",
    name: "ODIN",
    godName: "The Allfather",
    description: "balance, wisdom, pain",
    theme: "Discipline through repetition. The wise suffer willingly.",
    icon: "🧠",
    format: "For time (or 2 rounds of 25)",
    scoreInstructions: "Record your total time to complete all 50 reps of each exercise. Sub-20 minutes is worthy of Valhalla.",
  }
];

const NewWorkoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state?.template as WorkoutTemplate | undefined;
  const isValhallaWorkout = template && valhallaWorkouts.some(vw => vw.id === template.id);
  const valhallaWorkoutData = isValhallaWorkout ? valhallaWorkouts.find(vw => vw.id === template?.id) : null;

  const [isCookMode, setIsCookMode] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [restTime, setRestTime] = useState(90);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(90);

  const { scoreDialogWorkout, hideScoreDialog } = useValhallaScoreDialog();

  const {
    workout,
    addExercise,
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    setWorkoutName,
    setWorkoutNotes,
    moveExercise,
  } = useWorkoutState(template);

  useWorkoutPersistence(workout);
  const { elapsedTime, startTime, endTime, isRunning, startTimer, stopTimer } = useWorkoutTimer();
  const { saveWorkout, isSaving } = useSaveWorkout();
  const { saveAsTemplate, isSavingTemplate } = useSaveAsTemplate();

  const handleFinishWorkout = async () => {
    const success = await saveWorkout(workout, startTime, endTime);
    if (success) {
      if (isValhallaWorkout && valhallaWorkoutData) {
        // Navigate to templates page with the completed Valhalla workout data
        navigate("/templates", { 
          state: { completedValhallaWorkout: valhallaWorkoutData },
          replace: true 
        });
      } else {
        navigate("/history");
      }
    }
  };

  const handleCookModeToggle = () => {
    setIsCookMode(!isCookMode);
    if (!isCookMode && !isRunning) {
      startTimer();
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRestTimer = () => {
    setIsRestTimerActive(true);
    setRestTimeRemaining(restTime);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/templates">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">
              {template ? template.name : "New Workout"}
            </h1>
            {isValhallaWorkout && valhallaWorkoutData && (
              <span className="text-2xl" title={valhallaWorkoutData.godName}>
                {valhallaWorkoutData.icon}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCookModeToggle}
              className="flex items-center gap-2"
            >
              <Timer className="h-4 w-4" />
              {isCookMode ? "Exit Cook Mode" : "Cook Mode"}
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </div>

        {isCookMode ? (
          <WorkoutCookMode
            workout={workout}
            updateSet={updateSet}
            addSet={addSet}
            onFinish={handleFinishWorkout}
            isSaving={isSaving}
            elapsedTime={elapsedTime}
            restTime={restTime}
            onStartRestTimer={handleStartRestTimer}
          />
        ) : (
          <>
            <WorkoutHeader
              workout={workout}
              onNameChange={setWorkoutName}
              onNotesChange={setWorkoutNotes}
              startTime={startTime}
              endTime={endTime}
              isRunning={isRunning}
              onStart={startTimer}
              onStop={stopTimer}
              elapsedTime={elapsedTime}
            />

            <RestTimerSettings restTime={restTime} onRestTimeChange={setRestTime} />

            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  exerciseIndex={index}
                  onAddSet={addSet}
                  onUpdateSet={updateSet}
                  onRemoveSet={removeSet}
                  onRemoveExercise={removeExercise}
                  onMoveExercise={moveExercise}
                  onStartRestTimer={handleStartRestTimer}
                  canMoveUp={index > 0}
                  canMoveDown={index < workout.exercises.length - 1}
                />
              ))}

              <Card>
                <CardContent className="p-6">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowExerciseSelector(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exercise
                  </Button>
                </CardContent>
              </Card>
            </div>

            <WorkoutActions
              onFinish={handleFinishWorkout}
              onSaveAsTemplate={() => saveAsTemplate(workout)}
              isSaving={isSaving}
              isSavingTemplate={isSavingTemplate}
              hasExercises={workout.exercises.length > 0}
            />
          </>
        )}

        <ExerciseSelector
          open={showExerciseSelector}
          onOpenChange={setShowExerciseSelector}
          onExerciseSelect={addExercise}
        />

        <RestTimerToast
          isActive={isRestTimerActive}
          timeRemaining={restTimeRemaining}
          onTimeRemainingChange={setRestTimeRemaining}
          onComplete={() => setIsRestTimerActive(false)}
        />
      </div>

      <ScoreRecordingDialog
        workout={scoreDialogWorkout}
        isOpen={!!scoreDialogWorkout}
        onClose={hideScoreDialog}
      />
    </>
  );
};

export default NewWorkoutPage;
