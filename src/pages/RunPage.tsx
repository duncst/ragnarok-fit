import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Square } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const RunPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      // Reset when stopping
      setTime(0);
    }
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
      <h1 className="text-3xl font-bold">Start Running</h1>
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-muted-foreground">Time</p>
              <p className="text-4xl font-bold">{formatTime(time)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Distance</p>
              <p className="text-4xl font-bold">0.0 <span className="text-lg">km</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button 
        onClick={handleToggleRun} 
        size="lg" 
        variant={isRunning ? "destructive" : "default"}
        className={cn("w-full h-16 text-2xl", !isRunning && "bg-green-500 hover:bg-green-600 text-primary-foreground")}
      >
        {isRunning ? <Square className="mr-2 h-6 w-6" /> : <Play className="mr-2 h-6 w-6" />}
        {isRunning ? "Stop" : "Start Run"}
      </Button>
    </div>
  );
};

export default RunPage;
