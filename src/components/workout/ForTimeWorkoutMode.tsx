import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Play, Square, Flame, Trophy } from 'lucide-react';

interface ForTimeWorkoutModeProps {
  workoutName: string;
  workoutSubtitle: string;
  exercises: Array<{
    name: string;
    reps: number;
  }>;
  onComplete: (completionTimeMinutes: number, notes?: string) => void;
  onExit: () => void;
}

export const ForTimeWorkoutMode: React.FC<ForTimeWorkoutModeProps> = ({
  workoutName,
  workoutSubtitle,
  exercises,
  onComplete,
  onExit
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [notes, setNotes] = useState('');

  // Timer effect - counts UP
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Countdown effect
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null;
    
    if (showCountdown && countdownValue > 0) {
      countdownInterval = setTimeout(() => {
        if (countdownValue === 1) {
          setShowCountdown(false);
          setIsActive(true);
          setHasStarted(true);
        } else {
          setCountdownValue(countdownValue - 1);
        }
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearTimeout(countdownInterval);
    };
  }, [showCountdown, countdownValue]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBegin = () => {
    setShowCountdown(true);
    setCountdownValue(3);
  };

  const handleFinish = () => {
    setIsActive(false);
    setShowCompleteScreen(true);
  };

  const handleComplete = () => {
    const completionTimeMinutes = Math.round((timeElapsed / 60) * 100) / 100; // Round to 2 decimal places
    onComplete(completionTimeMinutes, notes);
  };

  // Countdown splash screen
  if (showCountdown) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-orange-500 mb-8 font-medium">Ready thyself...</div>
          <div className="text-9xl font-bold text-white mb-8">
            {countdownValue}
          </div>
          <div className="text-xl text-slate-300">Begin the Trial!</div>
        </div>
      </div>
    );
  }

  // Completion screen
  if (showCompleteScreen) {
    const completionTimeMinutes = Math.round((timeElapsed / 60) * 100) / 100;
    
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <div className="text-center py-8 px-4 border-b border-border">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-4">
            <Trophy className="h-5 w-5 text-orange-500" />
            <span className="text-orange-500 font-medium">{workoutName}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Trial Complete</h1>
          <p className="text-muted-foreground">{workoutSubtitle}</p>
        </div>

        {/* Summary */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">{formatTime(timeElapsed)}</div>
              <div className="text-lg text-muted-foreground">Completion Time</div>
              <div className="text-sm text-muted-foreground mt-1">({completionTimeMinutes} minutes)</div>
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
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="text-center py-4 px-4 flex-shrink-0">
        <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 px-4 py-2 rounded-full mb-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-orange-500 font-bold text-lg">{workoutName}</span>
        </div>
        <div className="text-sm text-slate-400">FOR TIME • Complete as Fast as Possible</div>
      </div>

      {/* Timer Section - Fixed Height */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg mx-4 mb-4 p-6 flex-shrink-0">
        {/* Main Timer - counts UP */}
        <div className="text-6xl font-bold text-center mb-4 text-orange-500">
          {formatTime(timeElapsed)}
        </div>

        {/* Control Button */}
        {!hasStarted ? (
          <Button
            onClick={handleBegin}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 text-lg rounded-lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Begin
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 text-lg rounded-lg"
          >
            <Square className="h-5 w-5 mr-2" />
            Finish
          </Button>
        )}
      </div>

      {/* Exercise List - Scrollable but contained */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg mx-4 mb-4 flex-1 min-h-0">
        <div className="p-4 h-full flex flex-col">
          <h3 className="text-xl font-bold text-center text-white mb-4 flex-shrink-0">Complete For Time</h3>
          
          <div className="space-y-3 overflow-y-auto flex-1">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 flex-shrink-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-500 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-lg text-white">{exercise.name}</span>
                  </div>
                  <span className="text-xl font-bold text-orange-500">
                    {exercise.reps}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};