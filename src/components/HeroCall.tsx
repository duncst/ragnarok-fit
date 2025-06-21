
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  },
  {
    name: "Heimdall's Watch",
    description: "Stand guard like the guardian of Bifrost. This trial tests your endurance and unwavering determination.",
    motivation: "The watchman never sleeps, for vigilance is the price of victory. Hold your ground, warrior.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Gate Keeper',
        duration: '10-12 min',
        exercises: [
          '3 rounds:',
          '• 30 sec wall sit',
          '• 8 Push-ups',
          '• 45 sec plank hold',
          '• 10 Squats',
          '• 15 sec single-arm hold (each arm)',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Bridge Guardian',
        duration: '16-18 min',
        exercises: [
          '4 rounds:',
          '• 45 sec wall sit',
          '• 12 Push-ups',
          '• 60 sec plank hold',
          '• 15 Squats',
          '• 20 sec single-arm hold (each arm)',
          '• 8 Burpees',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'All-Seeing Sentinel',
        duration: '22-26 min',
        exercises: [
          '5 rounds:',
          '• 60 sec wall sit',
          '• 15 Push-ups',
          '• 75 sec plank hold',
          '• 20 Squats',
          '• 30 sec single-arm hold (each arm)',
          '• 12 Burpees',
          '• 10 Pike push-ups',
          '• 60 sec rest between rounds'
        ],
        rest: '60 sec between rounds'
      }
    ]
  },
  {
    name: "Frigg's Endurance",
    description: "Channel the queen of Asgard's steady resolve. This trial builds lasting strength through consistent effort.",
    motivation: "The queen's power lies not in flash, but in foundations that never crumble. Build yours today.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Royal Maiden',
        duration: '12-14 min',
        exercises: [
          '3 rounds:',
          '• 6 Slow push-ups (4 sec each)',
          '• 15 Bodyweight squats',
          '• 8 Reverse lunges (each leg)',
          '• 30 sec plank',
          '• 12 Glute bridges',
          '• 2 min rest between rounds'
        ],
        rest: '2 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Throne Protector',
        duration: '18-20 min',
        exercises: [
          '4 rounds:',
          '• 10 Push-ups',
          '• 20 Bodyweight squats',
          '• 12 Reverse lunges (each leg)',
          '• 45 sec plank',
          '• 15 Glute bridges',
          '• 10 Tricep dips',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec rest between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Queen\'s Command',
        duration: '24-28 min',
        exercises: [
          '5 rounds:',
          '• 15 Push-ups',
          '• 25 Bodyweight squats',
          '• 15 Reverse lunges (each leg)',
          '• 60 sec plank',
          '• 20 Single-leg glute bridges (each leg)',
          '• 15 Tricep dips',
          '• 8 Burpees',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec rest between rounds'
      }
    ]
  },
  {
    name: "Loki's Mischief",
    description: "Unpredictable and challenging, this trial keeps you guessing. Adapt like the trickster god himself.",
    motivation: "Chaos breeds strength in those brave enough to dance with uncertainty. Embrace the madness.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Clever Apprentice',
        duration: '10-14 min',
        exercises: [
          '3 rounds (mix up the order each round):',
          '• 8 Push-ups',
          '• 12 Jump squats',
          '• 6 Burpees',
          '• 20 High knees',
          '• 30 sec plank',
          '• 10 Lunges (alternating)',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Shapeshifter',
        duration: '16-22 min',
        exercises: [
          '4 rounds (randomize exercise order):',
          '• 12 Push-ups',
          '• 15 Jump squats',
          '• 8 Burpees',
          '• 30 High knees',
          '• 45 sec plank',
          '• 14 Lunges (alternating)',
          '• 10 Mountain climbers (each leg)',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec rest between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Trickster\'s Gambit',
        duration: '20-30 min',
        exercises: [
          '5 rounds (change order every round):',
          '• 15 Push-ups',
          '• 20 Jump squats',
          '• 12 Burpees',
          '• 40 High knees',
          '• 60 sec plank',
          '• 18 Lunges (alternating)',
          '• 15 Mountain climbers (each leg)',
          '• 10 Pike push-ups',
          '• 60 sec rest between rounds'
        ],
        rest: '60 sec rest between rounds'
      }
    ]
  },
  {
    name: "Balder's Light",
    description: "Pure and radiant like the god of light, this trial emphasizes perfect form and controlled movement.",
    motivation: "True strength shines brightest when forged with intention. Let your form be flawless as sunlight.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Dawn\'s First Ray',
        duration: '12-15 min',
        exercises: [
          '3 rounds:',
          '• 5 Perfect push-ups (5 sec down, 2 sec up)',
          '• 12 Slow squats (3 sec down)',
          '• 8 Controlled lunges (each leg)',
          '• 45 sec perfect plank',
          '• 10 Slow glute bridges',
          '• 2 min rest between rounds'
        ],
        rest: '2 min rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Midday Radiance',
        duration: '18-22 min',
        exercises: [
          '4 rounds:',
          '• 8 Perfect push-ups (4 sec down, 2 sec up)',
          '• 15 Slow squats (3 sec down)',
          '• 10 Controlled lunges (each leg)',
          '• 60 sec perfect plank',
          '• 12 Slow single-leg glute bridges (each leg)',
          '• 6 Slow burpees',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec rest between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Eternal Brilliance',
        duration: '24-30 min',
        exercises: [
          '5 rounds:',
          '• 12 Perfect push-ups (4 sec down, 2 sec up)',
          '• 20 Slow squats (4 sec down)',
          '• 12 Controlled lunges (each leg)',
          '• 75 sec perfect plank',
          '• 15 Slow single-leg glute bridges (each leg)',
          '• 8 Slow burpees',
          '• 10 Controlled pike push-ups',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec rest between rounds'
      }
    ]
  },
  {
    name: "Tyr's Justice",
    description: "Balanced and fair like the one-handed god of war, this trial demands equal effort from both sides of your body.",
    motivation: "Justice demands balance. Train both sides equally, for strength built on imbalance crumbles.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Fair Judgment',
        duration: '10-14 min',
        exercises: [
          '3 rounds:',
          '• 6 Single-arm push-ups (each arm, modified on knees)',
          '• 8 Single-leg squats (each leg, assisted)',
          '• 10 Single-leg glute bridges (each leg)',
          '• 15 sec single-leg stand (each leg)',
          '• 20 sec side plank (each side)',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Scales of War',
        duration: '16-20 min',
        exercises: [
          '4 rounds:',
          '• 4 Single-arm push-ups (each arm)',
          '• 6 Pistol squats (each leg, assisted)',
          '• 12 Single-leg glute bridges (each leg)',
          '• 20 sec single-leg stand (each leg)',
          '• 30 sec side plank (each side)',
          '• 8 Single-leg burpees (4 each leg)',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec rest between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'One-Handed Warrior',
        duration: '22-28 min',
        exercises: [
          '5 rounds:',
          '• 6 Single-arm push-ups (each arm)',
          '• 8 Pistol squats (each leg)',
          '• 15 Single-leg glute bridges (each leg)',
          '• 30 sec single-leg stand (each leg)',
          '• 45 sec side plank (each side)',
          '• 10 Single-leg burpees (5 each leg)',
          '• 6 Single-arm pike push-ups (each arm)',
          '• 60 sec rest between rounds'
        ],
        rest: '60 sec rest between rounds'
      }
    ]
  },
  {
    name: "Freya's Fury",
    description: "Channel the goddess of love and war's fierce passion. This trial combines grace with devastating power.",
    motivation: "Love and war dance as one in the warrior's heart. Fight with passion, move with purpose.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Seidr Apprentice',
        duration: '12-15 min',
        exercises: [
          '3 rounds:',
          '• 8 Push-ups',
          '• 12 Sumo squats',
          '• 10 Lateral lunges (each side)',
          '• 6 Burpees',
          '• 15 Glute bridges',
          '• 30 sec warrior III hold (each leg)',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Battle Maiden',
        duration: '18-22 min',
        exercises: [
          '4 rounds:',
          '• 12 Push-ups',
          '• 15 Jump sumo squats',
          '• 12 Lateral lunges (each side)',
          '• 8 Burpees',
          '• 18 Single-leg glute bridges (each leg)',
          '• 30 sec warrior III hold (each leg)',
          '• 10 Pike push-ups',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec rest between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Goddess of War',
        duration: '24-30 min',
        exercises: [
          '5 rounds:',
          '• 15 Push-ups',
          '• 20 Jump sumo squats',
          '• 15 Lateral lunges (each side)',
          '• 12 Burpees',
          '• 20 Single-leg glute bridges (each leg)',
          '• 45 sec warrior III hold (each leg)',
          '• 15 Pike push-ups',
          '• 20 Mountain climbers (each leg)',
          '• 60 sec rest between rounds'
        ],
        rest: '60 sec rest between rounds'
      }
    ]
  },
  {
    name: "Vidar's Vengeance",
    description: "Silent and relentless like the god who avenges his father, this trial tests your ability to endure and overcome.",
    motivation: "Silence speaks louder than thunder when backed by unwavering will. Let your actions roar.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Silent Stalker',
        duration: '10-14 min',
        exercises: [
          '3 rounds:',
          '• 6 Slow push-ups (no sound)',
          '• 12 Silent squats',
          '• 8 Quiet lunges (each leg)',
          '• 45 sec plank (focus on breathing)',
          '• 10 Controlled mountain climbers',
          '• 2 min rest between rounds'
        ],
        rest: '2 min rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Vengeance Seeker',
        duration: '16-20 min',
        exercises: [
          '4 rounds:',
          '• 10 Silent push-ups',
          '• 15 Controlled squats',
          '• 10 Quiet lunges (each leg)',
          '• 60 sec focused plank',
          '• 15 Controlled mountain climbers (each leg)',
          '• 6 Silent burpees',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec rest between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Father\'s Avenger',
        duration: '22-28 min',
        exercises: [
          '5 rounds:',
          '• 15 Silent push-ups',
          '• 20 Controlled squats',
          '• 12 Quiet lunges (each leg)',
          '• 75 sec focused plank',
          '• 20 Controlled mountain climbers (each leg)',
          '• 10 Silent burpees',
          '• 12 Controlled pike push-ups',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec rest between rounds'
      }
    ]
  },
  {
    name: "Hel's Domain",
    description: "Half-light, half-shadow, this trial embraces the duality of existence. Balance opposing forces within yourself.",
    motivation: "From death comes life, from weakness comes strength. Embrace both sides of your nature.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Border Walker',
        duration: '12-15 min',
        exercises: [
          '3 rounds (alternate fast/slow):',
          '• 8 Fast push-ups, then 4 slow push-ups',
          '• 12 Jump squats, then 6 slow squats',
          '• 30 sec fast high knees, then 30 sec slow march',
          '• 6 Fast burpees, then 30 sec plank hold',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Realm Guardian',
        duration: '18-22 min',
        exercises: [
          '4 rounds (alternate intensity):',
          '• 10 Fast push-ups, then 5 slow push-ups',
          '• 15 Jump squats, then 8 slow squats',
          '• 45 sec fast high knees, then 45 sec slow march',
          '• 8 Fast burpees, then 45 sec plank hold',
          '• 20 Fast mountain climbers, then 10 slow ones',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec rest between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Death\'s Daughter',
        duration: '24-30 min',
        exercises: [
          '5 rounds (contrast training):',
          '• 12 Fast push-ups, then 6 slow push-ups',
          '• 20 Jump squats, then 10 slow squats',
          '• 60 sec fast high knees, then 60 sec slow march',
          '• 10 Fast burpees, then 60 sec plank hold',
          '• 30 Fast mountain climbers, then 15 slow ones',
          '• 10 Fast pike push-ups, then 5 slow ones',
          '• 60 sec rest between rounds'
        ],
        rest: '60 sec rest between rounds'
      }
    ]
  },
  {
    name: "Skadi's Hunt",
    description: "Like the giantess of winter and the hunt, this trial demands precision, patience, and predatory focus.",
    motivation: "The hunter moves with purpose through any terrain. Track your prey with unwavering focus.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Winter Tracker',
        duration: '10-14 min',
        exercises: [
          '3 rounds:',
          '• 8 Bear crawls forward/backward',
          '• 10 Crab walks (each direction)',
          '• 6 Lizard walks (each side)',
          '• 12 Squats with pause at bottom',
          '• 30 sec hunter\'s pose (single-leg balance)',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Mountain Stalker',
        duration: '16-20 min',
        exercises: [
          '4 rounds:',
          '• 12 Bear crawls forward/backward',
          '• 15 Crab walks (each direction)',
          '• 8 Lizard walks (each side)',
          '• 15 Jump squats with pause',
          '• 45 sec hunter\'s pose (each leg)',
          '• 8 Burpees with tuck jump',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec rest between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Apex Predator',
        duration: '22-28 min',
        exercises: [
          '5 rounds:',
          '• 15 Bear crawls forward/backward',
          '• 20 Crab walks (each direction)',
          '• 10 Lizard walks (each side)',
          '• 20 Jump squats with pause',
          '• 60 sec hunter\'s pose (each leg)',
          '• 12 Burpees with tuck jump',
          '• 10 Pike walks',
          '• 60 sec rest between rounds'
        ],
        rest: '60 sec rest between rounds'
      }
    ]
  },
  {
    name: "Njord's Gale",
    description: "Harness the power of wind and sea like the Vanir god. This trial flows like water, strikes like storm.",
    motivation: "The wind bends but never breaks, the sea yields but always returns. Be fluid, be relentless.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Gentle Breeze',
        duration: '12-15 min',
        exercises: [
          '3 rounds (flowing movements):',
          '• 8 Push-ups with wave motion',
          '• 12 Squats with arm sweeps',
          '• 10 Flowing lunges (each leg)',
          '• 30 sec plank with hip sways',
          '• 15 Windmill touches (each side)',
          '• 8 Fluid burpees',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Rising Storm',
        duration: '18-22 min',
        exercises: [
          '4 rounds (dynamic flow):',
          '• 12 Push-ups with wave motion',
          '• 15 Jump squats with arm sweeps',
          '• 12 Flowing lunges (each leg)',
          '• 45 sec plank with hip sways',
          '• 20 Windmill touches (each side)',
          '• 10 Fluid burpees',
          '• 15 Pike push-ups with flow',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec rest between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Tempest Lord',
        duration: '24-30 min',
        exercises: [
          '5 rounds (storm sequence):',
          '• 15 Push-ups with wave motion',
          '• 20 Jump squats with arm sweeps',
          '• 15 Flowing lunges (each leg)',
          '• 60 sec plank with hip sways',
          '• 25 Windmill touches (each side)',
          '• 12 Fluid burpees',
          '• 18 Pike push-ups with flow',
          '• 20 Mountain climbers with rhythm',
          '• 60 sec rest between rounds'
        ],
        rest: '60 sec rest between rounds'
      }
    ]
  },
  {
    name: "Sigyn's Devotion",
    description: "Loyal and steadfast like Loki's faithful wife, this trial tests your commitment to finishing what you start.",
    motivation: "True strength is measured not in moments of glory, but in quiet persistence through hardship.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Faithful Companion',
        duration: '15-18 min',
        exercises: [
          '1 long round (no breaks until complete):',
          '• 50 Total push-ups (break into sets as needed)',
          '• 75 Total squats',
          '• 100 Total high knees (50 each leg)',
          '• 2 min total plank hold (break as needed)',
          '• 25 Total burpees',
          'Complete all exercises at your own pace - the goal is completion, not speed'
        ],
        rest: 'Complete all without stopping'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Loyal Guardian',
        duration: '20-25 min',
        exercises: [
          '1 long round (no breaks until complete):',
          '• 75 Total push-ups',
          '• 100 Total squats',
          '• 150 Total high knees (75 each leg)',
          '• 3 min total plank hold',
          '• 40 Total burpees',
          '• 50 Total lunges (25 each leg)',
          'Complete all exercises - take micro-breaks within exercises if needed'
        ],
        rest: 'Complete all without stopping'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Unwavering Devotion',
        duration: '25-35 min',
        exercises: [
          '1 marathon round (no breaks until complete):',
          '• 100 Total push-ups',
          '• 150 Total squats',
          '• 200 Total high knees (100 each leg)',
          '• 4 min total plank hold',
          '• 60 Total burpees',
          '• 80 Total lunges (40 each leg)',
          '• 50 Total pike push-ups',
          'Complete at your own pace - this is about endurance and mental strength'
        ],
        rest: 'Complete all without stopping'
      }
    ]
  },
  {
    name: "Surtr's Flame",
    description: "Burn bright like the fire giant who will ignite Ragnarök. This trial is intense, consuming, transformative.",
    motivation: "From the ashes of who you were, rises who you're meant to become. Burn away your limits.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Spark of Fire',
        duration: '8-12 min',
        exercises: [
          'EMOM (Every Minute on the Minute) for 8-12 minutes:',
          'Even minutes: 8 Burpees + 12 Jump squats',
          'Odd minutes: 10 Push-ups + 15 High knees (each leg)',
          'Rest remainder of each minute',
          'Start with 8 minutes, add 1 minute each time you complete it'
        ],
        rest: 'Built into the EMOM format'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Rising Inferno',
        duration: '12-16 min',
        exercises: [
          'EMOM for 12-16 minutes:',
          'Minute 1: 12 Burpees',
          'Minute 2: 15 Jump squats + 10 Push-ups',
          'Minute 3: 20 High knees (each leg) + 8 Pike push-ups',
          'Minute 4: 45 sec plank hold + 10 Jump squats',
          'Repeat cycle. Rest remainder of each minute'
        ],
        rest: 'Built into the EMOM format'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'World\'s End',
        duration: '16-20 min',
        exercises: [
          'EMOM for 16-20 minutes:',
          'Minute 1: 15 Burpees',
          'Minute 2: 20 Jump squats + 12 Push-ups',
          'Minute 3: 30 High knees (each leg) + 10 Pike push-ups',
          'Minute 4: 60 sec plank + 15 Jump squats',
          'Minute 5: 20 Mountain climbers (each leg) + 8 Burpees',
          'Repeat cycle. Rest remainder of each minute'
        ],
        rest: 'Built into the EMOM format'
      }
    ]
  },
  {
    name: "Eir's Healing",
    description: "Like the goddess of healing, this trial focuses on restoration, mobility, and building resilience from within.",
    motivation: "True warriors know when to fight and when to heal. Today, we restore to prepare for tomorrow's battles.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Gentle Restoration',
        duration: '15-20 min',
        exercises: [
          '3 rounds (slow and controlled):',
          '• 5 Perfect push-ups (8 sec total)',
          '• 10 Deep squats (hold bottom for 3 sec)',
          '• 8 Slow lunges with twist (each leg)',
          '• 45 sec child\'s pose to plank flow',
          '• 30 sec deep breathing in warrior pose',
          '• 10 Cat-cow stretches',
          '• 2 min rest with stretching between rounds'
        ],
        rest: '2 min active rest with stretching'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Mindful Warrior',
        duration: '20-25 min',
        exercises: [
          '4 rounds (focus on form and breath):',
          '• 8 Perfect push-ups with pause',
          '• 12 Deep squats (3 sec hold at bottom)',
          '• 10 Slow lunges with twist (each leg)',
          '• 60 sec child\'s pose to plank flow',
          '• 45 sec deep breathing in warrior III (each leg)',
          '• 15 Cat-cow stretches',
          '• 6 Slow burpees with pause at each position',
          '• 90 sec active rest between rounds'
        ],
        rest: '90 sec active rest with mobility'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Master Healer',
        duration: '25-30 min',
        exercises: [
          '5 rounds (slow strength with mobility):',
          '• 10 Perfect push-ups with 2-sec pause',
          '• 15 Deep squats (5 sec hold at bottom)',
          '• 12 Slow lunges with twist (each leg)',
          '• 75 sec child\'s pose to plank flow',
          '• 60 sec deep breathing in warrior III (each leg)',
          '• 20 Cat-cow stretches',
          '• 8 Slow burpees with pause at each position',
          '• 10 Slow pike push-ups with hold',
          '• 75 sec active rest between rounds'
        ],
        rest: '75 sec active rest with deep stretching'
      }
    ]
  },
  {
    name: "Mimir's Wisdom",
    description: "Like the wise head by the well, this trial challenges your mind-muscle connection and thoughtful movement.",
    motivation: "The wisest warriors think before they act. Each movement teaches, each breath brings clarity.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Seeker of Knowledge',
        duration: '12-16 min',
        exercises: [
          '3 rounds (count and focus):',
          '• 8 Push-ups (count down from 8 to 1)',
          '• 12 Squats (count up from 1 to 12)',
          '• 6 Burpees (count in different language if possible)',
          '• 30 sec plank (count breaths, not time)',
          '• 10 Lunges (count only right leg, then left)',
          '• 2 min rest (reflect on which exercise felt hardest)'
        ],
        rest: '2 min mindful rest'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Well Guardian',
        duration: '18-24 min',
        exercises: [
          '4 rounds (pattern recognition):',
          '• Push-ups: 5, 7, 9, 11 (increasing by 2)',
          '• Squats: 20, 17, 14, 11 (decreasing by 3)',
          '• Burpees: 4, 6, 8, 10 (increasing by 2)',
          '• Plank: 30, 45, 60, 75 sec (increasing by 15)',
          '• Mountain climbers: 8, 12, 16, 20 each leg',
          '• 90 sec rest (predict next round\'s numbers)'
        ],
        rest: '90 sec analytical rest'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Fountain of Wisdom',
        duration: '24-30 min',
        exercises: [
          '5 rounds (complex patterns):',
          '• Round 1: Fibonacci sequence (1,1,2,3,5 of each exercise)',
          '• Round 2: Doubling (2,4,8,16 reps, but cap at 16)',
          '• Round 3: Prime numbers (2,3,5,7,11 reps)',
          '• Round 4: Perfect squares (1,4,9,16 reps)',
          '• Round 5: Your choice (create your own pattern)',
          'Exercises: Push-ups, Squats, Burpees, Lunges (each leg), Pike push-ups',
          '• 2 min rest between rounds (plan next pattern)'
        ],
        rest: '2 min strategic rest'
      }
    ]
  },
  {
    name: "Ran's Net",
    description: "Like the sea goddess who captures souls in her net, this trial entangles you in continuous movement.",
    motivation: "The net that seems to trap you also teaches you to flow. Find freedom in continuous motion.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Caught in Waves',
        duration: '10-15 min',
        exercises: [
          'Continuous circuit (3 rounds, no rest between exercises):',
          '• 30 sec push-ups',
          '• 30 sec squats',
          '• 30 sec high knees',
          '• 30 sec plank',
          '• 30 sec lunges (alternating)',
          '• 30 sec rest',
          'Repeat circuit 3 times total'
        ],
        rest: '30 sec between exercises only'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Deeper Waters',
        duration: '16-20 min',
        exercises: [
          'Continuous circuit (4 rounds, no rest between exercises):',
          '• 45 sec push-ups',
          '• 45 sec jump squats',
          '• 45 sec high knees',
          '• 45 sec plank',
          '• 45 sec lunges (alternating)',
          '• 45 sec burpees',
          '• 45 sec mountain climbers',
          '• 45 sec rest',
          'Repeat circuit 4 times total'
        ],
        rest: '45 sec between rounds only'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Drowned in Effort',
        duration: '20-25 min',
        exercises: [
          'Continuous circuit (5 rounds, no rest between exercises):',
          '• 60 sec push-ups',
          '• 60 sec jump squats',
          '• 60 sec high knees',
          '• 60 sec plank',
          '• 60 sec lunges (alternating)',
          '• 60 sec burpees',
          '• 60 sec mountain climbers',
          '• 60 sec pike push-ups',
          '• 60 sec rest',
          'Repeat circuit 5 times total'
        ],
        rest: '60 sec between rounds only'
      }
    ]
  },
  {
    name: "Hodr's Challenge",
    description: "Like the blind god, this trial asks you to trust your body's wisdom without relying on what you see.",
    motivation: "When sight fails, other senses sharpen. Trust your body to guide you through the darkness.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Eyes Closed',
        duration: '10-14 min',
        exercises: [
          '3 rounds (close eyes for each exercise):',
          '• 8 Push-ups (eyes closed, focus on form)',
          '• 12 Squats (eyes closed, feel the movement)',
          '• 6 Burpees (eyes closed, move slowly)',
          '• 30 sec plank (eyes closed, breathe deeply)',
          '• 10 Lunges (eyes closed, each leg)',
          '• 90 sec rest (eyes open to reset)'
        ],
        rest: '90 sec with eyes open'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Inner Sight',
        duration: '16-20 min',
        exercises: [
          '4 rounds (eyes closed for all exercises):',
          '• 10 Push-ups (slow and controlled)',
          '• 15 Squats (pause at bottom)',
          '• 8 Burpees (very deliberate)',
          '• 45 sec plank (count breaths)',
          '• 12 Lunges (each leg, balance focus)',
          '• 10 Mountain climbers (each leg, controlled)',
          '• 75 sec rest (eyes open)'
        ],
        rest: '75 sec with sight restored'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Blind Warrior',
        duration: '22-28 min',
        exercises: [
          '5 rounds (entire round eyes closed):',
          '• 12 Push-ups',
          '• 18 Squats',
          '• 10 Burpees',
          '• 60 sec plank',
          '• 15 Lunges (each leg)',
          '• 15 Mountain climbers (each leg)',
          '• 8 Pike push-ups',
          '• 60 sec rest (still eyes closed - only open between rounds)'
        ],
        rest: '60 sec between rounds with eyes open'
      }
    ]
  },
  {
    name: "Ullr's Precision",
    description: "Master archer and skier of the gods, this trial demands perfect form and unwavering accuracy in every movement.",
    motivation: "The arrow that flies true was crafted with patience and released with purpose. Be precise in all things.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Steady Aim',
        duration: '14-18 min',
        exercises: [
          '3 rounds (perfect form focus):',
          '• 5 Perfect push-ups (10 sec each: 5 down, 2 pause, 3 up)',
          '• 8 Archer squats (4 each leg, slow and controlled)',
          '• 6 Single-leg balance (30 sec each leg)',
          '• 30 sec perfect plank (no movement)',
          '• 8 Precision lunges (4 each leg, pause and balance)',
          '• 10 Slow shoulder blade squeezes',
          '• 2 min rest (practice balance poses)'
        ],
        rest: '2 min form-focused rest'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Master Marksman',
        duration: '20-25 min',
        exercises: [
          '4 rounds (precision under pressure):',
          '• 8 Perfect push-ups (8 sec each)',
          '• 10 Archer squats (5 each leg)',
          '• 8 Single-leg balance with eyes closed (30 sec each)',
          '• 45 sec perfect plank',
          '• 10 Precision lunges with rotation (5 each leg)',
          '• 12 Slow shoulder blade squeezes',
          '• 6 Controlled burpees (pause at each position)',
          '• 90 sec rest (archery pose holds)'
        ],
        rest: '90 sec precision rest'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Divine Archer',
        duration: '25-32 min',
        exercises: [
          '5 rounds (perfect precision):',
          '• 10 Perfect push-ups (10 sec each)',
          '• 12 Archer squats (6 each leg with pause)',
          '• 10 Single-leg balance with eyes closed (45 sec each)',
          '• 60 sec perfect plank',
          '• 12 Precision lunges with rotation (6 each leg)',
          '• 15 Slow shoulder blade squeezes',
          '• 8 Controlled burpees (2-sec pause at each position)',
          '• 10 Single-leg pike push-ups (5 each leg)',
          '• 75 sec rest (advanced balance challenges)'
        ],
        rest: '75 sec precision recovery'
      }
    ]
  },
  {
    name: "Vali's Retribution",
    description: "Born for vengeance and growing to full strength in a single day, this trial is about explosive growth and relentless pursuit.",
    motivation: "Some are born for a purpose so clear it drives them beyond mortal limits. Find your purpose, embrace your power.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Swift Growth',
        duration: '10-15 min',
        exercises: [
          'Ladder workout (increasing reps each round):',
          'Round 1: 2 reps of each',
          'Round 2: 4 reps of each',
          'Round 3: 6 reps of each',
          'Round 4: 8 reps of each',
          'Exercises: Push-ups, Squats, Burpees, Lunges (each leg)',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Rapid Vengeance',
        duration: '16-22 min',
        exercises: [
          'Ascending ladder:',
          'Round 1: 3 reps of each',
          'Round 2: 6 reps of each',
          'Round 3: 9 reps of each',
          'Round 4: 12 reps of each',
          'Round 5: 15 reps of each',
          'Exercises: Push-ups, Jump squats, Burpees, Lunges (each leg), Pike push-ups',
          '• 75 sec rest between rounds'
        ],
        rest: '75 sec between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'God of Vengeance',
        duration: '20-30 min',
        exercises: [
          'Pyramid of power (up then down):',
          'Round 1: 5 reps of each',
          'Round 2: 10 reps of each',
          'Round 3: 15 reps of each',
          'Round 4: 20 reps of each',
          'Round 5: 15 reps of each',
          'Round 6: 10 reps of each',
          'Round 7: 5 reps of each',
          'Exercises: Push-ups, Jump squats, Burpees, Lunges (each leg), Pike push-ups, Mountain climbers (each leg)',
          '• 60 sec rest between rounds'
        ],
        rest: '60 sec between rounds'
      }
    ]
  },
  {
    name: "Forseti's Justice",
    description: "God of justice and peace, this trial balances opposing forces and seeks perfect equilibrium in all things.",
    motivation: "True justice lies not in dominance, but in perfect balance. Find the equilibrium in your strength.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Peaceful Warrior',
        duration: '12-16 min',
        exercises: [
          '3 rounds (balance-focused):',
          '• 6 Push-ups + 6 Pike push-ups (upper balance)',
          '• 10 Squats + 10 Single-leg calf raises (each leg)',
          '• 8 Forward lunges + 8 Reverse lunges (each leg)',
          '• 30 sec Plank + 30 sec Side plank (each side)',
          '• 15 sec Tree pose (each leg)',
          '• 90 sec rest (practice standing meditation)'
        ],
        rest: '90 sec meditative rest'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Judge of Deeds',
        duration: '18-24 min',
        exercises: [
          '4 rounds (perfect symmetry):',
          '• 8 Push-ups + 8 Pike push-ups',
          '• 12 Jump squats + 12 Single-leg squats (6 each)',
          '• 10 Forward lunges + 10 Reverse lunges (each leg)',
          '• 45 sec Plank + 30 sec Side plank (each side)',
          '• 20 sec Tree pose + 20 sec Warrior III (each leg)',
          '• 6 Burpees + 6 Slow controlled burpees',
          '• 75 sec rest (balance challenge)'
        ],
        rest: '75 sec balanced rest'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Perfect Equilibrium',
        duration: '24-30 min',
        exercises: [
          '5 rounds (ultimate balance):',
          '• 10 Push-ups + 10 Pike push-ups',
          '• 15 Jump squats + 15 Single-leg squats (split evenly)',
          '• 12 Forward lunges + 12 Reverse lunges (each leg)',
          '• 60 sec Plank + 45 sec Side plank (each side)',
          '• 30 sec Tree pose + 30 sec Warrior III (each leg)',
          '• 8 Fast burpees + 8 Slow controlled burpees',
          '• 15 Mountain climbers fast + 15 mountain climbers slow (each leg)',
          '• 60 sec rest (advanced balance poses)'
        ],
        rest: '60 sec equilibrium rest'
      }
    ]
  },
  {
    name: "Grid's Strength",
    description: "Sif's servant who possessed strength that could crush mountains, this trial is about raw, uncompromising power.",
    motivation: "Some strength is subtle, some is thunderous. Today, let your power shake the very foundations.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Mountain Mover',
        duration: '10-14 min',
        exercises: [
          '3 rounds (power focus):',
          '• 8 Explosive push-ups (push up fast)',
          '• 12 Jump squats (maximum height)',
          '• 6 Power burpees (explosive movements)',
          '• 10 Clap push-ups (or attempt them)',
          '• 15 Tuck jumps',
          '• 8 Broad jumps',
          '• 2 min rest (power recovery)'
        ],
        rest: '2 min power recovery'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Rock Crusher',
        duration: '16-20 min',
        exercises: [
          '4 rounds (explosive power):',
          '• 10 Explosive push-ups',
          '• 15 Maximum jump squats',
          '• 8 Power burpees with tuck jump',
          '• 12 Clap push-ups (modify if needed)',
          '• 20 Tuck jumps',
          '• 10 Broad jumps',
          '• 15 Power lunges (jump switch)',
          '• 90 sec rest (active recovery)'
        ],
        rest: '90 sec active recovery'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Foundation Shaker',
        duration: '20-26 min',
        exercises: [
          '5 rounds (maximum power output):',
          '• 12 Explosive push-ups',
          '• 18 Maximum jump squats',
          '• 10 Power burpees with double tuck jump',
          '• 15 Clap push-ups',
          '• 25 Tuck jumps',
          '• 12 Broad jumps',
          '• 18 Power lunges (jump switch)',
          '• 20 Explosive mountain climbers (each leg)',
          '• 75 sec rest (power recovery)'
        ],
        rest: '75 sec power recovery'
      }
    ]
  },
  {
    name: "Aegir's Depths",
    description: "Plunge into the ocean giant's domain where pressure builds character and depth reveals strength.",
    motivation: "The deeper you dive, the greater the pressure—and the greater the treasure you'll find within yourself.",
    levels: [
      {
        difficulty: 'easy',
        icon: <Swords className="h-4 w-4" />,
        label: 'Surface Swimmer',
        duration: '12-15 min',
        exercises: [
          '3 rounds (building pressure):',
          '• 20 sec Push-ups, 10 sec rest',
          '• 30 sec Squats, 15 sec rest',
          '• 20 sec High knees, 10 sec rest',
          '• 40 sec Plank, 20 sec rest',
          '• 20 sec Burpees, 10 sec rest',
          '• 30 sec Lunges, 15 sec rest',
          '• 2 min rest between rounds (surface for air)'
        ],
        rest: '2 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: <Shield className="h-4 w-4" />,
        label: 'Deep Diver',
        duration: '18-22 min',
        exercises: [
          '4 rounds (increasing pressure):',
          '• 30 sec Push-ups, 10 sec rest',
          '• 45 sec Jump squats, 15 sec rest',
          '• 30 sec High knees, 10 sec rest',
          '• 60 sec Plank, 20 sec rest',
          '• 30 sec Burpees, 10 sec rest',
          '• 45 sec Lunges, 15 sec rest',
          '• 30 sec Mountain climbers, 10 sec rest',
          '• 90 sec rest between rounds (decompress)'
        ],
        rest: '90 sec between rounds'
      },
      {
        difficulty: 'hard',
        icon: <Flame className="h-4 w-4" />,
        label: 'Abyssal Explorer',
        duration: '24-30 min',
        exercises: [
          '5 rounds (crushing depths):',
          '• 45 sec Push-ups, 15 sec rest',
          '• 60 sec Jump squats, 20 sec rest',
          '• 45 sec High knees, 15 sec rest',
          '• 90 sec Plank, 30 sec rest',
          '• 45 sec Burpees, 15 sec rest',
          '• 60 sec Lunges, 20 sec rest',
          '• 45 sec Mountain climbers, 15 sec rest',
          '• 45 sec Pike push-ups, 15 sec rest',
          '• 75 sec rest between rounds (surface briefly)'
        ],
        rest: '75 sec between rounds'
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

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="hero-call">
        <AccordionTrigger className="text-left">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">Hero's Call:</span>
            <span className="font-semibold">{currentWorkout.name}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card className="border-0 shadow-none">
            <CardContent className="space-y-4 p-0">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground italic">
                  "{currentWorkout.motivation}"
                </p>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm leading-relaxed">{currentWorkout.description}</p>
                </div>
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
                  <TabsContent key={level.difficulty} value={level.difficulty} className="space-y-3">
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

                    <div className="bg-card border rounded-lg p-3 space-y-2">
                      {level.exercises.map((exercise, index) => (
                        <div key={index} className={`text-sm ${exercise.startsWith('•') ? 'ml-4' : exercise.includes('rounds:') || exercise.includes('EMOM') || exercise.includes('circuit') ? 'font-semibold text-primary' : ''}`}>
                          {exercise}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
                      <Target className="h-4 w-4" />
                      <span><strong>Rest:</strong> {level.rest}</span>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <Separator />

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Remember, warrior: <span className="text-primary">Consistency conquers perfection.</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  A new Hero's Call awaits you each dawn. Return tomorrow for your next trial.
                </p>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
