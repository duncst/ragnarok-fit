import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Square, MapPin, Wind } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useActiveWorkout } from "@/contexts/ActiveWorkoutContext";

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
];

const RunPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [runType, setRunType] = useState(runTypes[0]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveWorkout } = useActiveWorkout();

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
      // For now, stopping the run resets it. We can add a summary page later.
      setTime(0);
      setIsRunning(false);
      setStartTime(null);
      setActiveWorkout(null);
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
          {!isRunning && (
            <Button asChild variant="link" className="p-0 h-auto text-base">
              <Link to="/run">Or, log a completed trial</Link>
            </Button>
          )}
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
        <Button variant="outline" size="lg" className="w-full h-14 text-xl" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default RunPage;
