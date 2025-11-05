import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Play, Square, MapPin, Wind } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { useActiveWorkout } from "@/contexts/ActiveWorkoutContext";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";
import { useForgedWeekCheck } from "@/contexts/ForgedWeekContext";
import { useBrotherhoodActivities } from "@/hooks/useBrotherhoodActivities";

const runTypes = [
  "Easy Run",
  "Tempo Run", 
  "Interval Training",
  "Long Run",
  "Recovery Run",
  "Fartlek",
  "Hill Training",
  "Race",
  "Bike",
  "Mixed Cardio",
  "Jump Rope",
];

// Activities that only track duration, not distance
const durationOnlyActivities = ["Mixed Cardio", "Jump Rope"];

const RunPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [runType, setRunType] = useState(runTypes[0]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveWorkout } = useActiveWorkout();
  const { checkForNewForgedWeek } = useForgedWeekCheck();
  const { addActivity } = useBrotherhoodActivities();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [dHours, setDHours] = useState<string>("");
  const [dMinutes, setDMinutes] = useState<string>("");
  const [dSeconds, setDSeconds] = useState<string>("");
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleToggleRun = () => {
    if (isRunning) {
      // Stop timer and open save dialog without resetting values
      setIsRunning(false);
      openSaveDialog(true);
    } else {
      const newStartTime = new Date();
      setIsRunning(true);
      setStartTime(newStartTime);
      setActiveWorkout({
        id: 'endurance-run',
        name: runType,
        type: 'ritual',
        startTime: newStartTime,
        returnPath: location.pathname,
      });
    }
  };
  
  const handleCancel = () => {
    if (isRunning) {
      setActiveWorkout(null);
    }
    navigate(-1);
  }

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (h > 0) {
      return `${h}:${pad(m)}:${pad(s)}`;
    }
    return `${m}:${pad(s)}`;
  };

  const getManualDurationSeconds = () => {
    const h = parseInt(dHours || '0', 10);
    const m = parseInt(dMinutes || '0', 10);
    const s = parseInt(dSeconds || '0', 10);
    if ([h, m, s].some((n) => isNaN(n) || n < 0)) return 0;
    if (m > 59 || s > 59) return 0;
    return h * 3600 + m * 60 + s;
  };

  const openSaveDialog = (prefillFromTimer: boolean) => {
    if (prefillFromTimer && time > 0) {
      const h = Math.floor(time / 3600);
      const m = Math.floor((time % 3600) / 60);
      const s = time % 60;
      setDHours(h ? String(h) : "");
      setDMinutes(m ? String(m) : "");
      setDSeconds(s ? String(s) : "");
    } else {
      setDHours("");
      setDMinutes("");
      setDSeconds("");
    }
    setShowSaveDialog(true);
  };

  const handleSaveRun = async () => {
    const isDurationOnly = durationOnlyActivities.includes(runType);
    
    // For distance-based activities, validate distance
    let dist = 0;
    if (!isDurationOnly) {
      dist = parseFloat(distance);
      if (isNaN(dist) || dist <= 0) {
        sonnerToast.error("Enter a valid distance", { description: "Distance must be greater than 0 km." });
        return;
      }
    }

    const manualSeconds = getManualDurationSeconds();
    const durationSeconds = manualSeconds > 0 ? manualSeconds : time;
    if (durationSeconds <= 0) {
      sonnerToast.error("Enter a valid duration", { description: "Use the timer or enter HH:MM:SS." });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('runs').insert({
        distance: dist,
        duration: durationSeconds,
        run_type: runType,
        date: new Date().toISOString(),
        notes: notes || null,
      });
      if (error) throw error;

      await addActivity(
        'endurance',
        `Logged ${runType}`,
        undefined,
        isDurationOnly 
          ? `${formatTime(durationSeconds)}`
          : `${dist.toFixed(2)} km in ${formatTime(durationSeconds)}`
      );

      // Trigger forged day check
      checkForNewForgedWeek();

      sonnerToast.success("Activity saved", { 
        description: isDurationOnly 
          ? formatTime(durationSeconds)
          : `${dist.toFixed(2)} km - ${formatTime(durationSeconds)}` 
      });

      // Reset state
      setTime(0);
      setStartTime(null);
      setActiveWorkout(null);
      setDistance("");
      setNotes("");
      setShowSaveDialog(false);
    } catch (e) {
      sonnerToast.error("Failed to save run", { description: (e as Error).message });
    } finally {
      setIsSaving(false);
    }
  };
  const handleDiscard = () => {
    setShowSaveDialog(false);
    setTime(0);
    setStartTime(null);
    setActiveWorkout(null);
  };
  return (
    <div className="flex flex-col h-full space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <MapPin className="text-primary" /> Endurance Tracker
      </h1>
      
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Wind className="h-6 w-6 text-primary" />
            Create Custom Trial
          </div>
          <p className="text-sm text-muted-foreground">Design your own VO2 max interval session with custom warmup, work, and rest periods</p>
          <div>
            <Button className="mt-2" onClick={() => navigate('/endure/trials')}>
              Begin Trial Setup
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="text-center p-8 space-y-2">
          <p className="text-7xl font-bold tracking-tighter">{formatTime(time)}</p>
          <p className="text-muted-foreground">
            {isRunning ? `Running - ${runType}` : "Ready to start"}
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Distance</p>
          <p className="text-2xl font-bold">0.0<span className="text-sm ml-1">km</span></p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pace</p>
          <p className="text-2xl font-bold">--:--<span className="text-sm ml-1">/km</span></p>
        </div>
      </div>

      <div>
        <label htmlFor="run-type" className="text-sm font-medium text-muted-foreground">Endurance Trial</label>
        <Select value={runType} onValueChange={setRunType} disabled={isRunning}>
          <SelectTrigger id="run-type" className="w-full mt-1">
            <SelectValue placeholder="Select run type" />
          </SelectTrigger>
          <SelectContent>
            {runTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-grow" />

      <div className="space-y-3">
        <Button 
          onClick={handleToggleRun} 
          size="lg" 
          variant={isRunning ? "destructive" : "outline"}
          className="w-full h-14 text-xl"
        >
          {isRunning ? <Square className="mr-2 h-6 w-6" /> : <Play className="mr-2 h-6 w-6" />}
          {isRunning ? "Stop" : "Endure"}
        </Button>
        <Button 
          variant="secondary" 
          size="lg" 
          className="w-full h-14 text-xl" 
          onClick={() => openSaveDialog(false)}
        >
          Quick Log (distance + time)
        </Button>
        <Button variant="outline" size="lg" className="w-full h-14 text-xl" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save activity</DialogTitle>
            <DialogDescription>
              {durationOnlyActivities.includes(runType) 
                ? "Enter duration to log your activity."
                : "Enter details to log your endurance session."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!durationOnlyActivities.includes(runType) && (
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 5.00"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </div>
            )}
            <div className="grid grid-cols-1 gap-2">
              <Label>Duration (HH:MM:SS)</Label>
              <div className="flex items-center gap-2">
                <Input
                  aria-label="hours"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="0"
                  className="w-20"
                  value={dHours}
                  onChange={(e) => setDHours(e.target.value)}
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  aria-label="minutes"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="59"
                  placeholder="00"
                  className="w-20"
                  value={dMinutes}
                  onChange={(e) => setDMinutes(e.target.value)}
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  aria-label="seconds"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="59"
                  placeholder="00"
                  className="w-20"
                  value={dSeconds}
                  onChange={(e) => setDSeconds(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">Leave blank to use timer: {formatTime(time)}</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="How did it feel? Terrain, weather, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Type: {runType}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleDiscard} disabled={isSaving}>Discard</Button>
            <Button 
              onClick={handleSaveRun} 
              disabled={isSaving || (!durationOnlyActivities.includes(runType) && !distance)}
            >
              {isSaving ? "Saving..." : "Save activity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RunPage;
