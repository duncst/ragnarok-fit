
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

interface ValhallaScoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workoutName: string;
  workoutDuration?: number;
}

export const ValhallaScoreDialog = ({ isOpen, onClose, workoutName, workoutDuration = 0 }: ValhallaScoreDialogProps) => {
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  // Format duration from milliseconds to HH:MM:SS
  const formatDurationToTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Convert HH:MM:SS to minutes for storage
  const timeToMinutes = (timeString: string) => {
    const parts = timeString.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      const seconds = parseInt(parts[2]) || 0;
      return hours * 60 + minutes + seconds / 60;
    }
    return parseFloat(timeString) || 0;
  };

  // Auto-populate score when dialog opens with workout duration
  useEffect(() => {
    if (isOpen && workoutDuration > 0) {
      setScore(formatDurationToTime(workoutDuration));
    }
  }, [isOpen, workoutDuration]);

  const saveScoreMutation = useMutation({
    mutationFn: async () => {
      const scoreValue = timeToMinutes(score);
      if (isNaN(scoreValue) || scoreValue <= 0) {
        throw new Error('Please enter a valid score');
      }

      // Save as a personal record using the existing upsert function
      const { error } = await supabase.rpc('upsert_personal_record', {
        p_exercise_name: `${workoutName} (Valhalla)`,
        p_one_rep_max: scoreValue
      });

      if (error) throw error;
    },
    onSuccess: () => {
      sonnerToast.success('Valhalla score recorded!', {
        description: `Your ${workoutName} score has been saved as a personal record.`
      });
      queryClient.invalidateQueries({ queryKey: ['personal_records'] });
      setScore('');
      setNotes('');
      onClose();
    },
    onError: (error) => {
      sonnerToast.error('Failed to save score', {
        description: (error as Error).message
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveScoreMutation.mutate();
  };

  const handleSkip = () => {
    setScore('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⚔️ Record Your Valhalla Score
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workout-name">Workout</Label>
            <Input
              id="workout-name"
              value={`${workoutName} (Valhalla)`}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="score">
              Time <span className="text-destructive">*</span>
            </Label>
            <Input
              id="score"
              type="text"
              placeholder="HH:MM:SS or minutes"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter completion time in HH:MM:SS format or as decimal minutes (e.g., 12.5 for 12 minutes 30 seconds).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did it feel? Any modifications?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={saveScoreMutation.isPending}
            >
              Skip
            </Button>
            <Button
              type="submit"
              disabled={saveScoreMutation.isPending || !score.trim()}
            >
              {saveScoreMutation.isPending ? 'Saving...' : 'Record Score'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
