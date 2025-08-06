import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Pause, Play, SkipForward, CheckCircle2 } from "lucide-react";
import { useActiveWorkout } from "@/contexts/ActiveWorkoutContext";

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
  const intervalRef = useRef<number | null>(null);
  
  // Start persistent workout on first start
  const ensureActiveWorkout = () => {
    setActiveWorkout({
      id: "endurance-session",
      name: config?.name || "Valhalla Trial",
      type: "ritual",
      startTime: new Date(),
      returnPath: "/endure/session",
    });
  };

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
  const onFinish = () => {
    setRunning(false);
    setActiveWorkout(null);
    navigate("/run", { replace: true });
  };

  if (!config) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Wind className="text-primary" />
          {config.name}
        </div>
        <div className="text-sm text-muted-foreground">Total Time</div>
      </div>

      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <div className="text-sm text-muted-foreground capitalize">{plan[idx]?.type === "work" ? "Trial" : plan[idx]?.type || ""}</div>
          <div className="text-3xl font-semibold">{plan[idx]?.label || (isComplete ? "Complete" : "")}</div>
          <div className="text-6xl font-bold tabular-nums">{formatMMSS(remaining)}</div>
          <div className="text-xs text-muted-foreground h-5">{nextLabel}</div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="lg" onClick={onToggle} className="min-w-32">
              {running ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
              {running ? "Pause" : "Begin Trial"}
            </Button>
            <Button variant="secondary" size="lg" onClick={onSkip} disabled={isComplete}>
              <SkipForward className="mr-2"/> Skip
            </Button>
            <Button size="lg" onClick={onFinish}>
              <CheckCircle2 className="mr-2"/> Finish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnduranceSessionPage;
