import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, SkipForward, CheckCircle2, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MobilityExercise {
  name: string;
  duration: number; // in seconds
  description: string;
  restAfter?: number; // rest after exercise in seconds
}

const DAILY_MOBILITY_ROUTINES = [
  // Sunday - Full Body Flow
  [
    { name: "Neck Rolls", duration: 30, description: "Gentle neck circles in both directions" },
    { name: "Shoulder Rolls", duration: 30, description: "Roll shoulders backward, then forward" },
    { name: "Arm Circles", duration: 30, description: "Circle arms forward, then backward" },
    { name: "Cat-Cow Stretch", duration: 45, description: "Arch and round your spine" },
    { name: "Hip Circles", duration: 30, description: "Stand and circle hips both ways" },
    { name: "Leg Swings", duration: 30, description: "Dynamic leg swings forward and back" },
    { name: "Downward Dog", duration: 45, description: "Hold downward facing dog pose" },
    { name: "Child's Pose", duration: 60, description: "Rest in child's pose and breathe deeply" }
  ],
  
  // Monday - Lower Body Focus
  [
    { name: "Hip Circles", duration: 30, description: "Warm up the hip joints" },
    { name: "Leg Swings", duration: 30, description: "Front to back, then side to side" },
    { name: "Hip Flexor Stretch", duration: 45, description: "Lunge position, feel the stretch" },
    { name: "Pigeon Pose", duration: 60, description: "Deep hip opener, breathe into it" },
    { name: "Figure 4 Stretch", duration: 45, description: "Hip and glute release" },
    { name: "Hamstring Stretch", duration: 45, description: "Forward fold, reach for toes" },
    { name: "Quad Stretch", duration: 30, description: "Pull heel to glute" },
    { name: "Calf Stretch", duration: 30, description: "Wall stretch, feel the calf lengthen" }
  ],
  
  // Tuesday - Upper Body & Spine
  [
    { name: "Neck Rolls", duration: 30, description: "Release neck tension" },
    { name: "Shoulder Rolls", duration: 30, description: "Loosen shoulder joints" },
    { name: "Chest Stretch", duration: 45, description: "Open the chest, counter desk posture" },
    { name: "Tricep Stretch", duration: 30, description: "Overhead arm stretch" },
    { name: "Cat-Cow Stretch", duration: 45, description: "Mobilize the entire spine" },
    { name: "Spinal Twist", duration: 45, description: "Seated rotation, both sides" },
    { name: "Threading the Needle", duration: 45, description: "Thread arm under body, rotate spine" },
    { name: "Cobra Stretch", duration: 45, description: "Open the front body" }
  ],
  
  // Wednesday - Flow & Balance
  [
    { name: "Arm Circles", duration: 30, description: "Warm up shoulder joints" },
    { name: "Hip Circles", duration: 30, description: "Mobilize hip joints" },
    { name: "Downward Dog", duration: 60, description: "Full body stretch and strength" },
    { name: "Side Stretch", duration: 45, description: "Lateral spine stretch, both sides" },
    { name: "Spinal Twist", duration: 45, description: "Rotate and release" },
    { name: "Hip Flexor Stretch", duration: 45, description: "Open tight hip flexors" },
    { name: "Pigeon Pose", duration: 60, description: "Deep hip release" },
    { name: "Child's Pose", duration: 60, description: "Restore and center" }
  ],
  
  // Thursday - Dynamic Movement
  [
    { name: "Shoulder Rolls", duration: 30, description: "Prepare shoulders for movement" },
    { name: "Arm Circles", duration: 30, description: "Dynamic shoulder mobility" },
    { name: "Leg Swings", duration: 45, description: "Dynamic hip mobility" },
    { name: "Hip Circles", duration: 30, description: "Circle hips with control" },
    { name: "Cat-Cow Stretch", duration: 60, description: "Flow through spinal movement" },
    { name: "Threading the Needle", duration: 45, description: "Dynamic spinal rotation" },
    { name: "Side Stretch", duration: 30, description: "Reach and lengthen" },
    { name: "Downward Dog", duration: 45, description: "Strengthen and stretch" }
  ],
  
  // Friday - Recovery & Release
  [
    { name: "Neck Rolls", duration: 30, description: "Release week's tension" },
    { name: "Chest Stretch", duration: 60, description: "Open tight chest muscles" },
    { name: "Tricep Stretch", duration: 30, description: "Release arm tension" },
    { name: "Figure 4 Stretch", duration: 60, description: "Deep hip and glute release" },
    { name: "Hamstring Stretch", duration: 60, description: "Lengthen tight hamstrings" },
    { name: "Calf Stretch", duration: 45, description: "Release lower leg tension" },
    { name: "Spinal Twist", duration: 60, description: "Wring out the spine" },
    { name: "Child's Pose", duration: 90, description: "Deep restoration and breath" }
  ],
  
  // Saturday - Gentle Flow
  [
    { name: "Shoulder Rolls", duration: 30, description: "Gentle shoulder warm-up" },
    { name: "Hip Circles", duration: 30, description: "Easy hip mobilization" },
    { name: "Cat-Cow Stretch", duration: 45, description: "Gentle spinal wave" },
    { name: "Downward Dog", duration: 45, description: "Lengthen the back body" },
    { name: "Cobra Stretch", duration: 45, description: "Open the front body" },
    { name: "Hip Flexor Stretch", duration: 45, description: "Release hip tightness" },
    { name: "Quad Stretch", duration: 30, description: "Lengthen front thighs" },
    { name: "Child's Pose", duration: 75, description: "Rest and integrate" }
  ]
];

interface MobilityRoutineProps {
  onBack: () => void;
}

export const MobilityRoutine: React.FC<MobilityRoutineProps> = ({ onBack }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<boolean[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Get today's routine
  const today = new Date().getDay();
  const todaysRoutine = DAILY_MOBILITY_ROUTINES[today];
  const currentExercise = todaysRoutine[currentExerciseIndex];

  useEffect(() => {
    setCompletedExercises(new Array(todaysRoutine.length).fill(false));
    if (todaysRoutine[0]) {
      setTimeRemaining(todaysRoutine[0].duration);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      // Exercise completed
      handleExerciseComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, currentExerciseIndex]);

  const handleExerciseComplete = () => {
    setIsActive(false);
    
    // Mark current exercise as completed
    const newCompleted = [...completedExercises];
    newCompleted[currentExerciseIndex] = true;
    setCompletedExercises(newCompleted);

    // Check if all exercises are done
    if (currentExerciseIndex === todaysRoutine.length - 1) {
      setIsCompleted(true);
      handleRoutineComplete();
      return;
    }

    // Move to next exercise
    const nextIndex = currentExerciseIndex + 1;
    setCurrentExerciseIndex(nextIndex);
    setTimeRemaining(todaysRoutine[nextIndex].duration);
    toast.success(`${currentExercise.name} complete! Moving to next exercise.`);
  };

  const handleRoutineComplete = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Record the mobility session as a Brotherhood activity
      await supabase.from('brotherhood_activities').insert({
        user_id: user.id,
        activity_type: 'Mobility',
        activity_description: 'Daily Mobility Routine - Recovery & Ritual',
        notes: `Completed ${todaysRoutine.length} mobility exercises`,
        is_public: false
      });

      toast.success("🍃 Daily Rune Earned! Your body thanks you for this ritual of recovery.", {
        duration: 5000
      });
    } catch (error) {
      console.error('Error recording mobility session:', error);
      toast.success("🍃 Mobility routine complete! Your daily rune has been earned.");
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(!isActive);
  };

  const handleSkip = () => {
    if (currentExerciseIndex < todaysRoutine.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(todaysRoutine[nextIndex].duration);
      setIsActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalExercises = todaysRoutine.length;
  const completedCount = completedExercises.filter(Boolean).length;
  const progressPercentage = (completedCount / totalExercises) * 100;

  const getDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[today];
  };

  if (isCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-3xl font-bold text-primary">Ritual Complete</h2>
            <p className="text-lg text-muted-foreground">
              Your daily rune has been earned through mindful movement and recovery.
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm italic text-muted-foreground">
                "Even the gods must rest before the next battle. Your body is your temple—you have honored it well."
              </p>
            </div>
          </div>
          <Button onClick={onBack} variant="outline">
            Return to Daily Paths
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!hasStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <CardTitle>Recovery & Ritual</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">{getDayName()}'s Mobility Flow</h3>
            <p className="text-muted-foreground">
              A gentle sequence of {totalExercises} movements to restore balance and earn your daily rune.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Today's Sequence:</h4>
            <div className="grid gap-2">
              {todaysRoutine.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{exercise.name}</span>
                  <Badge variant="outline">{formatTime(exercise.duration)}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Ritual Guidelines:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Move with intention and breath</li>
              <li>• Honor your body's limits</li>
              <li>• Focus on the present moment</li>
              <li>• Complete the sequence to earn your rune</li>
            </ul>
          </div>

          <Button onClick={handleStart} className="w-full" size="lg">
            <Play className="h-4 w-4 mr-2" />
            Begin the Ritual
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <CardTitle>{getDayName()}'s Flow</CardTitle>
            </div>
          </div>
          <Badge variant="outline">
            {completedCount} / {totalExercises}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{currentExercise?.name}</h3>
            <p className="text-muted-foreground">{currentExercise?.description}</p>
          </div>

          <div className="bg-primary/10 rounded-full w-32 h-32 mx-auto flex items-center justify-center">
            <span className="text-4xl font-bold text-primary">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={handlePause}
            variant={isActive ? "destructive" : "default"}
            size="lg"
          >
            {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isActive ? 'Pause' : 'Resume'}
          </Button>
          
          {currentExerciseIndex < todaysRoutine.length - 1 && (
            <Button onClick={handleSkip} variant="outline" size="lg">
              <SkipForward className="h-4 w-4 mr-2" />
              Skip
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground italic">
            "Breathe deeply. Move with purpose. Honor the ritual."
          </p>
        </div>
      </CardContent>
    </Card>
  );
};