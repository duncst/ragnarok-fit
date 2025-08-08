import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Pause, Play, SkipForward, CheckCircle2 } from "lucide-react";
import { useActiveWorkout } from "@/contexts/ActiveWorkoutContext";
import { useAuth } from "@/contexts/AuthContext";
import { useForgedWeekCheck } from "@/contexts/ForgedWeekContext";
import { supabase } from "@/integrations/supabase/client";
import { useBrotherhoodActivities } from "@/hooks/useBrotherhoodActivities";
import { toast as sonnerToast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SessionState {
  session: {
    name: string;
    warmupMin: number;
    intervalMin: number;
    restMin: number;
    intervals: number;
  };
}

type PhaseType = "warmup" | "work" | "rest" | "complete";

const formatMMSS = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const EnduranceSessionPage: React.FC = () => {
  const { state } = useLocation() as { state?: SessionState };
  const navigate = useNavigate();
  const { setActiveWorkout } = useActiveWorkout();
  const { user } = useAuth();
  const { checkForNewForgedWeek } = useForgedWeekCheck();
  const { addActivity } = useBrotherhoodActivities();
  const queryClient = useQueryClient();

  const config = state?.session;

  useEffect(() => {
    if (!config) {
      navigate("/endure/trials", { replace: true });
    }
  }, [config, navigate]);

  const plan = useMemo(() => {
    if (!config) return [] as { type: PhaseType; duration: number; label: string }[];
    const seq: { type: PhaseType; duration: number; label: string }[] = [];
    if (config.warmupMin > 0) seq.push({ type: "warmup", duration: Math.round(config.warmupMin * 60), label: "Prepare for Battle" });
    for (let i = 0; i < config.intervals; i++) {
      seq.push({ type: "work", duration: Math.round(config.intervalMin * 60), label: `Trial ${i + 1}` });
      if (i < config.intervals - 1 && config.restMin > 0) seq.push({ type: "rest", duration: Math.round(config.restMin * 60), label: `Recovery` });
    }
    return seq;
  }, [config]);

  // Timer state
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(() => (plan[0]?.duration ?? 0));
  const [running, setRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Start persistent workout on first start
  const ensureActiveWorkout = () => {
    const startTime = sessionStartTime || new Date();
    if (!sessionStartTime) {
      setSessionStartTime(startTime);
    }
    setActiveWorkout({
      id: "endurance-session",
      name: config?.name || "Valhalla Trial",
      type: "ritual",
      startTime,
      returnPath: "/endure/session",
    });
  };

  // Save endurance trial mutation
  const saveTrialMutation = useMutation({
    mutationFn: async () => {
      if (!user || !config || !sessionStartTime) {
        throw new Error("Missing required data to save trial");
      }

      const totalDurationSeconds = plan.reduce((sum, phase) => sum + phase.duration, 0);
      const endTime = new Date();

      // Save to runs table
      const { error: runError } = await supabase.from('runs').insert({
        distance: 0, // Endurance trials are time-based, not distance-based
        duration: totalDurationSeconds,
        run_type: config.name,
        date: endTime.toISOString(),
        notes: `Endurance Trial: ${config.intervals} intervals of ${config.intervalMin}min with ${config.restMin}min rest`
      });

      if (runError) throw runError;

      return { totalDurationSeconds, endTime };
    },
    onSuccess: async ({ totalDurationSeconds }) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['runs', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['home-page-data', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['forge-progress', user?.id] });

      // Add to brotherhood activities
      const durationMinutes = Math.round(totalDurationSeconds / 60);
      await addActivity(
        'endurance',
        `Completed ${config?.name} - ${durationMinutes} minutes of structured interval training`,
        undefined,
        `${config?.intervals} intervals completed`
      );

      // Check for forged week celebration
      checkForNewForgedWeek();

      sonnerToast.success("Trial completed!", { 
        description: `Your ${config?.name} has been logged successfully.` 
      });
    },
    onError: (error) => {
      sonnerToast.error("Failed to save trial", { 
        description: (error as Error).message 
      });
    }
  });

  useEffect(() => {
    if (!running) return;
    ensureActiveWorkout();
    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          // move to next phase
          setIdx((i) => {
            const next = i + 1;
            if (next >= plan.length) {
              // complete
              setRunning(false);
              return i; // keep index
            }
            return next;
          });
          return plan[idx + 1]?.duration ?? 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, plan, idx]);

  // Reset remaining when index changes (if not handled in tick)
  useEffect(() => {
    setRemaining(plan[idx]?.duration ?? 0);
  }, [idx, plan]);

  const nextLabel = plan[idx + 1] ? `${plan[idx + 1].type === "work" ? "Next: Trial" : plan[idx + 1].type === "rest" ? "Next: Recovery" : "Next"} ${plan[idx + 1].type === "work" ? `(${formatMMSS(plan[idx + 1].duration)})` : ""}` : "";

  const isComplete = idx >= plan.length;

  const onToggle = () => setRunning((p) => !p);
  const onSkip = () => setIdx((i) => Math.min(i + 1, plan.length));
  const onFinish = async () => {
    setRunning(false);
    setActiveWorkout(null);
    
    // Save the trial to database
    if (config) {
      saveTrialMutation.mutate();
    }
    
    navigate("/run", { replace: true });
  };

  if (!config) return null;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Wind className="text-primary" />
          {config.name}
        </div>
        <div className="text-sm text-muted-foreground">Total Time</div>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6 text-center space-y-4">
          <div className="text-sm text-muted-foreground capitalize">{plan[idx]?.type === "work" ? "Trial" : plan[idx]?.type || ""}</div>
          <div className="text-3xl font-semibold">{plan[idx]?.label || (isComplete ? "Complete" : "")}</div>
          <div className="text-6xl font-bold tabular-nums">{formatMMSS(remaining)}</div>
          <div className="text-xs text-muted-foreground h-5">{nextLabel}</div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Button variant="outline" size="lg" onClick={onToggle} className="w-full">
              {running ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
              {running ? "Pause" : "Begin Trial"}
            </Button>
            <Button variant="secondary" size="lg" onClick={onSkip} disabled={isComplete} className="w-full">
              <SkipForward className="mr-2"/> Skip
            </Button>
            <Button size="lg" onClick={onFinish} disabled={saveTrialMutation.isPending} className="w-full">
              <CheckCircle2 className="mr-2"/> 
              {saveTrialMutation.isPending ? "Saving..." : "Complete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnduranceSessionPage;
