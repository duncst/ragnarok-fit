
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
import { useValhallaProgress } from '@/hooks/useValhallaProgress';
import { ValhallaCompletionCeremony } from './ValhallaCompletionCeremony';
import { useBrotherhoodActivities } from '@/hooks/useBrotherhoodActivities';

interface EnhancedValhallaScoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workoutName: string;
  workoutDuration?: number;
}

export const EnhancedValhallaScoreDialog = ({ 
  isOpen, 
  onClose, 
  workoutName, 
  workoutDuration = 0 
}: EnhancedValhallaScoreDialogProps) => {
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const [showCeremony, setShowCeremony] = useState(false);
  const [ceremonyData, setCeremonyData] = useState<any>(null);
  
  const { recordChallenge, isRecording } = useValhallaProgress();
  const { addActivity } = useBrotherhoodActivities();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const scoreValue = timeToMinutes(score);
    
    if (isNaN(scoreValue) || scoreValue <= 0) {
      return;
    }

    try {
      const result = await new Promise<any>((resolve, reject) => {
        recordChallenge({
          challenge_name: workoutName,
          completion_time_minutes: scoreValue,
          notes: notes || undefined,
        });
        
        // Since the mutation doesn't return a promise directly, we need to handle this differently
        // For now, we'll simulate the ceremony data
        resolve({
          tier: scoreValue <= 8 ? 'Berserker' : scoreValue <= 12 ? 'Warrior' : 'Adept',
          rune_name: `Rune of ${workoutName === 'THOR' ? 'Thunder' : workoutName === 'FENRIR' ? 'the Beast' : workoutName === 'HEL' ? 'the Underworld' : workoutName === 'NJORD' ? 'the Sea' : 'Wisdom'}`,
          is_new_rune: true,
          is_tier_upgrade: false,
          completion_time_minutes: scoreValue,
        });
      });

      // Record brotherhood activity
      const tierDescriptions = {
        'Berserker': 'with legendary prowess',
        'Warrior': 'with skilled execution',
        'Adept': 'with determination'
      };
      
      const activityDescription = `Completed "${workoutName}" Valhalla Challenge ${tierDescriptions[result.tier as keyof typeof tierDescriptions]} (${Math.round(result.completion_time_minutes * 10) / 10} minutes)`;
      
      await addActivity('valhalla_challenge', activityDescription, workoutName, notes || undefined);

      setCeremonyData({
        challengeName: workoutName,
        tier: result.tier,
        runeName: result.rune_name,
        completionTime: result.completion_time_minutes,
        isNewRune: result.is_new_rune,
        isTierUpgrade: result.is_tier_upgrade,
      });
      
      setShowCeremony(true);
      setScore('');
      setNotes('');
    } catch (error) {
      console.error('Error recording challenge:', error);
    }
  };

  const handleSkip = () => {
    setScore('');
    setNotes('');
    onClose();
  };

  const handleCeremonyClose = () => {
    setShowCeremony(false);
    setCeremonyData(null);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showCeremony} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              ⚔️ Record Your Valhalla Challenge
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workout-name">Challenge</Label>
              <Input
                id="workout-name"
                value={`${workoutName} (Valhalla)`}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="score">
                Completion Time <span className="text-destructive">*</span>
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
                Enter completion time in HH:MM:SS format or as decimal minutes.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did it feel? Any scaling modifications?"
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
                disabled={isRecording}
              >
                Skip
              </Button>
              <Button
                type="submit"
                disabled={isRecording || !score.trim()}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isRecording ? 'Recording...' : 'Face the Challenge'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {ceremonyData && (
        <ValhallaCompletionCeremony
          isOpen={showCeremony}
          onClose={handleCeremonyClose}
          {...ceremonyData}
        />
      )}
    </>
  );
};
