
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Swords, Shield, Flame, Clock, Target } from 'lucide-react';

interface WorkoutLevel {
  difficulty: 'easy' | 'medium' | 'hard';
  icon: React.ReactNode;
  label: string;
  duration: string;
  exercises: string[];
  rest: string;
}

interface HeroCallWorkout {
  name: string;
  description: string;
  motivation: string;
  levels: WorkoutLevel[];
}

const workoutTemplates: HeroCallWorkout[] = [
  {
    name: "Fenrir's Fury",
    description: "Channel the raw power of the great wolf. This trial tests your explosive strength and primal endurance.",
    motivation: "The wolf sleeps until hunger awakens it. Today, you are both hunter and prey.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Pup\'s Path',
        duration: '10-15 min',
        exercises: [
          '3 rounds:',
          '• 8 Push-ups (knee variation allowed)',
          '• 10 Bodyweight squats',
          '• 15 sec plank hold',
          '• 5 Burpees (step back variation)',
          '• 30 sec rest between rounds'
        ],
        rest: '1 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Wolf\'s Hunt',
        duration: '15-20 min',
        exercises: [
          '4 rounds:',
          '• 12 Push-ups',
          '• 15 Jump squats',
          '• 30 sec plank hold',
          '• 8 Burpees',
          '• 10 Mountain climbers (each leg)',
          '• 45 sec rest between rounds'
        ],
        rest: '45 sec between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Alpha\'s Dominion',
        duration: '20-30 min',
        exercises: [
          '5 rounds:',
          '• 15 Push-ups (diamond variation)',
          '• 20 Jump squats',
          '• 45 sec plank hold',
          '• 12 Burpees',
          '• 20 Mountain climbers (each leg)',
          '• 10 Pike push-ups',
          '• 30 sec rest between rounds'
        ],
        rest: '30 sec between rounds'
      }
    ]
  },
  {
    name: "Thor's Thunder",
    description: "Forge your body like Mjölnir in the fires of Nidavellir. Power meets endurance in this hammering trial.",
    motivation: "Every strike of the hammer shapes the blade. Today, you are both hammer and steel.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Apprentice Smith',
        duration: '12-15 min',
        exercises: [
          '3 rounds:',
          '• 6 Push-ups',
          '• 12 Air squats',
          '• 8 Lunges (each leg)',
          '• 20 sec wall sit',
          '• 10 Jumping jacks',
          '• 1 min rest between rounds'
        ],
        rest: '1 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Thunder Striker',
        duration: '18-22 min',
        exercises: [
          '4 rounds:',
          '• 10 Push-ups',
          '• 15 Jump squats',
          '• 12 Reverse lunges (each leg)',
          '• 30 sec wall sit',
          '• 15 Burpees',
          '• 20 High knees',
          '• 45 sec rest between rounds'
        ],
        rest: '45 sec between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Mjölnir\'s Might',
        duration: '25-30 min',
        exercises: [
          '5 rounds:',
          '• 15 Push-ups',
          '• 20 Jump squats',
          '• 15 Bulgarian split squats (each leg)',
          '• 45 sec wall sit',
          '• 15 Burpees',
          '• 30 High knees',
          '• 10 Pike push-ups',
          '• 30 sec rest between rounds'
        ],
        rest: '30 sec between rounds'
      }
    ]
  },
  {
    name: "Odin's Wisdom",
    description: "Like the All-Father's pursuit of knowledge, this trial demands patience, control, and unwavering focus.",
    motivation: "Wisdom comes not from comfort, but from embracing the storm. Seek strength in stillness.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Seeker\'s Path',
        duration: '10-12 min',
        exercises: [
          '3 rounds:',
          '• 5 Slow push-ups (3 sec down)',
          '• 10 Controlled squats (3 sec down)',
          '• 30 sec plank',
          '• 8 Slow mountain climbers',
          '• 15 sec dead hang (or hang from bar)',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Raven\'s Flight',
        duration: '16-20 min',
        exercises: [
          '4 rounds:',
          '• 8 Slow push-ups (3 sec down)',
          '• 12 Controlled squats (3 sec down)',
          '• 45 sec plank',
          '• 12 Slow mountain climbers',
          '• 20 sec dead hang',
          '• 6 Slow burpees',
          '• 60 sec rest between rounds'
        ],
        rest: '60 sec between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'All-Father\'s Trial',
        duration: '22-28 min',
        exercises: [
          '5 rounds:',
          '• 12 Slow push-ups (4 sec down)',
          '• 15 Controlled squats (4 sec down)',
          '• 60 sec plank',
          '• 16 Slow mountain climbers',
          '• 30 sec dead hang',
          '• 8 Slow burpees',
          '• 10 Slow lunges (each leg)',
          '• 45 sec rest between rounds'
        ],
        rest: '45 sec between rounds'
      }
    ]
  },
  {
    name: "Valkyrie's Grace",
    description: "Swift as the battlefield maidens, this trial blends agility with strength. Dance between worlds of power and precision.",
    motivation: "The Valkyries choose the worthy not by size, but by heart. Show them your spirit burns bright.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Shield Maiden',
        duration: '12-15 min',
        exercises: [
          '3 rounds:',
          '• 8 Push-ups',
          '• 10 Jump squats',
          '• 6 Reverse lunges (each leg)',
          '• 15 sec single-leg stand (each leg)',
          '• 10 Arm circles (forward & back)',
          '• 8 Glute bridges',
          '• 1 min rest between rounds'
        ],
        rest: '1 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Battle Dancer',
        duration: '18-22 min',
        exercises: [
          '4 rounds:',
          '• 12 Push-ups',
          '• 15 Jump squats',
          '• 10 Lateral lunges (each side)',
          '• 20 sec single-leg stand (each leg)',
          '• 15 Arm circles (each direction)',
          '• 12 Single-leg glute bridges (each leg)',
          '• 8 Burpees',
          '• 45 sec rest between rounds'
        ],
        rest: '45 sec between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Chooser of the Slain',
        duration: '24-30 min',
        exercises: [
          '5 rounds:',
          '• 15 Push-ups',
          '• 20 Jump squats',
          '• 12 Lateral lunges (each side)',
          '• 30 sec single-leg stand (each leg)',
          '• 20 Arm circles (each direction)',
          '• 15 Single-leg glute bridges (each leg)',
          '• 12 Burpees',
          '• 10 Pike push-ups',
          '• 30 sec rest between rounds'
        ],
        rest: '30 sec between rounds'
      }
    ]
  },
  {
    name: "Jörmungandr's Coil",
    description: "Like the World Serpent that encircles Midgard, this trial tests your core strength and serpentine flow.",
    motivation: "The serpent's power lies not in its size, but in its unbreaking coil. Wrap your will around victory.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Hatchling\'s Writhe',
        duration: '10-14 min',
        exercises: [
          '3 rounds:',
          '• 30 sec plank',
          '• 10 Dead bugs (each side)',
          '• 8 Bird dogs (each side)',
          '• 12 Bicycle crunches (each side)',
          '• 15 sec side plank (each side)',
          '• 10 Glute bridges',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Serpent\'s Flow',
        duration: '16-20 min',
        exercises: [
          '4 rounds:',
          '• 45 sec plank',
          '• 12 Dead bugs (each side)',
          '• 10 Bird dogs (each side)',
          '• 15 Bicycle crunches (each side)',
          '• 20 sec side plank (each side)',
          '• 12 Single-leg glute bridges (each leg)',
          '• 8 Push-ups',
          '• 60 sec rest between rounds'
        ],
        rest: '60 sec between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'World Serpent\'s Grasp',
        duration: '22-28 min',
        exercises: [
          '5 rounds:',
          '• 60 sec plank',
          '• 15 Dead bugs (each side)',
          '• 12 Bird dogs (each side)',
          '• 20 Bicycle crunches (each side)',
          '• 30 sec side plank (each side)',
          '• 15 Single-leg glute bridges (each leg)',
          '• 12 Push-ups',
          '• 10 Mountain climbers (each leg)',
          '• 45 sec rest between rounds'
        ],
        rest: '45 sec between rounds'
      }
    ]
  }
];

const getDailyWorkout = (): HeroCallWorkout => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return workoutTemplates[dayOfYear % workoutTemplates.length];
};

export const HeroCall = () => {
  const [currentWorkout, setCurrentWorkout] = useState<HeroCallWorkout>(getDailyWorkout());
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('medium');

  useEffect(() => {
    // Update workout at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      setCurrentWorkout(getDailyWorkout());
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const getCurrentLevel = () => currentWorkout.levels.find(level => level.difficulty === selectedLevel);

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Swords className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Hero's Call
          </CardTitle>
          <Swords className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{currentWorkout.name}</h3>
          <p className="text-sm text-muted-foreground italic">
            "{currentWorkout.motivation}"
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm leading-relaxed">{currentWorkout.description}</p>
        </div>

        <Tabs value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as 'easy' | 'medium' | 'hard')} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="easy" className="flex items-center gap-2">
              <Swords className="h-4 w-4" />
              🪓 Easy
            </TabsTrigger>
            <TabsTrigger value="medium" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              ⚔️ Medium
            </TabsTrigger>
            <TabsTrigger value="hard" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              🔥 Hard
            </TabsTrigger>
          </TabsList>

          {currentWorkout.levels.map((level) => (
            <TabsContent key={level.difficulty} value={level.difficulty} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {level.icon}
                  <Badge variant="outline" className="font-medium">
                    {level.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {level.duration}
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4 space-y-3">
                {level.exercises.map((exercise, index) => (
                  <div key={index} className={`${exercise.startsWith('•') ? 'ml-4' : exercise.includes('rounds:') ? 'font-semibold text-primary' : ''}`}>
                    {exercise}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <Target className="h-4 w-4" />
                <span><strong>Rest:</strong> {level.rest}</span>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Separator />

        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground font-medium">
            Remember, warrior: <span className="text-primary">Consistency conquers perfection.</span>
          </p>
          <p className="text-xs text-muted-foreground">
            A new Hero's Call awaits you each dawn. Return tomorrow for your next trial.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
