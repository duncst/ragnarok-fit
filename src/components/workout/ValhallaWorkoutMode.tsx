import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Pause, Play, Flame } from 'lucide-react';

interface ValhallaWorkoutModeProps {
  workoutName: string;
  workoutSubtitle: string;
  exercises: Array<{
    name: string;
    reps: number;
  }>;
  duration: number; // in seconds
  onComplete: (rounds: number, notes?: string) => void;
  onExit: () => void;
}

export const ValhallaWorkoutMode: React.FC<ValhallaWorkoutModeProps> = ({
  workoutName,
  workoutSubtitle,
  exercises,
  duration,
  onComplete,
  onExit
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [notes, setNotes] = useState('');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsActive(false);
            setShowCompleteScreen(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleResume = () => {
    setIsActive(true);
  };

  const handleComplete = () => {
    onComplete(rounds, notes);
  };

  const isLastMinute = timeRemaining <= 60 && timeRemaining > 0;

  if (showCompleteScreen) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <div className="text-center py-8 px-4 border-b border-border">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-4">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-orange-500 font-medium">{workoutName}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You Endure</h1>
          <p className="text-muted-foreground">{workoutSubtitle}</p>
        </div>

        {/* Summary */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">{rounds}</div>
              <div className="text-lg text-muted-foreground">Rounds Completed</div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Optional Notes:
              </label>
              <Textarea
                placeholder="How did it feel? What was challenging?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-muted/20 border-border"
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleComplete}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium"
              >
                <Flame className="h-4 w-4 mr-2" />
                Claim the Flame
              </Button>
              
              <Button
                variant="outline"
                onClick={onExit}
                className="w-full h-12 border-border text-muted-foreground hover:bg-muted/50"
              >
                Return to Forge
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 px-6 py-3 rounded-full mb-6">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-orange-500 font-bold text-xl">{workoutName}</span>
        </div>
        <h2 className="text-xl text-slate-300 mb-4">{workoutSubtitle}</h2>
        <div className="text-slate-400 mb-8">FOR TIME • {formatTime(duration)}</div>
      </div>

      {/* Timer Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg mx-4 mb-6 p-8">
        {/* Main Timer */}
        <div 
          className={`text-8xl font-bold text-center mb-6 transition-colors duration-300 ${
            isLastMinute ? 'text-red-500' : 'text-orange-500'
          }`}
        >
          {formatTime(timeRemaining)}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700 rounded-full mb-8">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              isLastMinute ? 'bg-red-500' : 'bg-orange-500'
            }`}
            style={{ width: `${((duration - timeRemaining) / duration) * 100}%` }}
          />
        </div>

        {/* Control Button */}
        {!hasStarted ? (
          <Button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 text-lg rounded-lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Begin the Trial
          </Button>
        ) : (
          <Button
            onClick={isActive ? handlePause : handleResume}
            variant="outline"
            className="w-full border-orange-500 text-orange-500 hover:bg-orange-500/10 py-4 text-lg font-bold rounded-lg"
          >
            {isActive ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Resume
              </>
            )}
          </Button>
        )}
      </div>

      {/* Exercise List */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg mx-4 mb-6">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-center text-white mb-6">The Trial</h3>
          
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-500 flex items-center justify-center text-lg font-bold">
                      {index + 1}
                    </div>
                    <span className="text-xl text-white">{exercise.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-500">
                    {exercise.reps}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Round Counter */}
      {hasStarted && (
        <div className="px-4 mb-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="text-slate-300 text-lg">Rounds Completed:</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRounds(Math.max(0, rounds - 1))}
                  className="h-10 w-10 p-0 border-orange-500/40 text-orange-500 hover:bg-orange-500/10"
                  disabled={rounds === 0}
                >
                  -
                </Button>
                <span className="text-3xl font-bold text-orange-500 w-16 text-center">
                  {rounds}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRounds(rounds + 1)}
                  className="h-10 w-10 p-0 border-orange-500/40 text-orange-500 hover:bg-orange-500/10"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Minute Fire Mode Indicator */}
      {isLastMinute && hasStarted && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
              🔥 LAST MINUTE FIRE 🔥
            </div>
          </div>
        </div>
      )}
    </div>
  );
};