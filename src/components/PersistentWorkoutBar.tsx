import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import { useActiveWorkout } from '@/contexts/ActiveWorkoutContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const PersistentWorkoutBar = () => {
  const { activeWorkout } = useActiveWorkout();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (!activeWorkout) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout]);

  if (!activeWorkout) return null;

  // Don't show the bar if we're already on the workout page
  if (location.pathname === activeWorkout.returnPath) return null;

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const elapsedTime = currentTime - activeWorkout.startTime.getTime();

  const getWorkoutTypeLabel = (type: string) => {
    switch (type) {
      case 'ritual':
        return 'Ritual';
      case 'hero_call':
        return 'Hero\'s Call';
      case 'valhalla':
        return 'Valhalla';
      default:
        return 'Workout';
    }
  };

  const handleReturn = () => {
    navigate(activeWorkout.returnPath);
  };

  return (
    <div className="sticky bottom-[4.5rem] z-40 mx-4 mb-2">
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm truncate">{activeWorkout.name}</span>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {getWorkoutTypeLabel(activeWorkout.type)}
                </Badge>
              </div>
              <div className="text-lg font-bold font-mono">
                {formatDuration(elapsedTime)}
              </div>
            </div>
          </div>
          <Button 
            onClick={handleReturn}
            size="sm"
            className="ml-3 shrink-0"
          >
            Return
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};