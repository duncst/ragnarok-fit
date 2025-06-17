
import React, { useState } from 'react';
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
}

export const ValhallaScoreDialog = ({ isOpen, onClose, workoutName }: ValhallaScoreDialogProps) => {
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const saveScoreMutation = useMutation({
    mutationFn: async () => {
      const scoreValue = parseFloat(score);
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
              Score <span className="text-destructive">*</span>
            </Label>
            <Input
              id="score"
              type="number"
              step="0.1"
              min="0"
              placeholder="Enter your score (time in minutes or reps completed)"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              For time-based workouts: enter completion time in minutes. For rep-based workouts: enter total reps completed.
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
