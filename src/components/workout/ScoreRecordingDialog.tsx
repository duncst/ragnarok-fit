
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ValhallaWorkout {
  id: string;
  name: string;
  godName: string;
  description: string;
  theme: string;
  icon: string;
  format: string;
  scoreInstructions: string;
}

interface ScoreRecordingDialogProps {
  workout: ValhallaWorkout | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScoreRecordingDialog = ({ workout, isOpen, onClose }: ScoreRecordingDialogProps) => {
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const saveScoreMutation = useMutation({
    mutationFn: async ({ workoutId, score, notes }: { workoutId: string, score: number, notes: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('valhalla_scores')
        .insert({
          user_id: user.id,
          workout_id: workoutId,
          score_seconds: score,
          notes: notes || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Score recorded!",
        description: "Your Valhalla score has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['valhalla-scores'] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error saving score",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setMinutes("");
    setSeconds("");
    setNotes("");
    onClose();
  };

  const handleSave = () => {
    if (!workout) return;
    
    const totalSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
    
    if (totalSeconds <= 0) {
      toast({
        title: "Invalid time",
        description: "Please enter a valid time.",
        variant: "destructive",
      });
      return;
    }

    saveScoreMutation.mutate({
      workoutId: workout.id,
      score: totalSeconds,
      notes,
    });
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!workout) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{workout.icon}</span>
            <div>
              <DialogTitle className="text-left">Record Your Score</DialogTitle>
              <p className="text-sm text-muted-foreground">{workout.name}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Scoring Instructions</span>
            </div>
            <p className="text-xs text-muted-foreground">{workout.scoreInstructions}</p>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total Time
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  min="0"
                />
                <Label className="text-xs text-muted-foreground mt-1">Minutes</Label>
              </div>
              <span className="text-lg font-bold">:</span>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="00"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  min="0"
                  max="59"
                />
                <Label className="text-xs text-muted-foreground mt-1">Seconds</Label>
              </div>
            </div>
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

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saveScoreMutation.isPending}
              className="flex-1"
            >
              {saveScoreMutation.isPending ? "Saving..." : "Save Score"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
