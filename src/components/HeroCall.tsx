import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Swords, Shield, Flame, Clock, Target, Calendar, CalendarCheck } from 'lucide-react';

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
        rest: '90 sec between rounds'
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
        rest: '75 sec between rounds'
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
        rest: '90 sec between rounds'
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
        rest: '75 sec between rounds'
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
        rest: '60 sec between rounds'
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
        rest: '2 min between rounds'
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
        rest: '90 sec between rounds'
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
        rest: '75 sec between rounds'
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
        rest: '90 sec between rounds'
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
        rest: '75 sec between rounds'
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
        rest: '60 sec between rounds'
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
        rest: '90 sec between rounds'
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
        rest: '75 sec between rounds'
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
        rest: '60 sec between rounds'
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
        rest: '2 min between rounds'
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
        rest: '90 sec between rounds'
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
        rest: '75 sec between rounds'
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
        rest: '90 sec between rounds'
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
        rest: '75 sec between rounds'
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
        rest: '60 sec between rounds'
      }
    ]
  }
];

const getDailyWorkout = (): HeroCallWorkout => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return workoutTemplates[dayOfYear % workoutTemplates.length];
};

// Simple streak tracking - in a real app this would come from a database
const getStreakData = () => {
  const stored = localStorage.getItem('heroCallStreak');
  if (stored) {
    const data = JSON.parse(stored);
    const today = new Date().toDateString();
    const lastCompleted = new Date(data.lastCompleted).toDateString();
    
    // Reset if more than 2 days have passed
    if (new Date().getTime() - new Date(data.lastCompleted).getTime() > 2 * 24 * 60 * 60 * 1000) {
      return { currentStreak: 0, weeklyCount: 0, lastCompleted: null };
    }
    
    return data;
  }
  return { currentStreak: 0, weeklyCount: 0, lastCompleted: null };
};

const updateStreak = () => {
  const today = new Date();
  const streakData = getStreakData();
  const todayString = today.toDateString();
  
  // Don't update if already completed today
  if (streakData.lastCompleted && new Date(streakData.lastCompleted).toDateString() === todayString) {
    return streakData;
  }
  
  // Calculate days in current week (Monday to Sunday)
  const startOfWeek = new Date(today);
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Reset weekly count if it's a new week
  const lastCompletedDate = streakData.lastCompleted ? new Date(streakData.lastCompleted) : null;
  let weeklyCount = streakData.weeklyCount;
  
  if (!lastCompletedDate || lastCompletedDate < startOfWeek) {
    weeklyCount = 0;
  }
  
  const newData = {
    currentStreak: streakData.currentStreak + 1,
    weeklyCount: weeklyCount + 1,
    lastCompleted: today.toISOString()
  };
  
  localStorage.setItem('heroCallStreak', JSON.stringify(newData));
  return newData;
};

export const HeroCall = () => {
  const [currentWorkout, setCurrentWorkout] = useState<HeroCallWorkout>(getDailyWorkout());
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [streakData, setStreakData] = useState(getStreakData());
  
  const isCompletedToday = () => {
    if (!streakData.lastCompleted) return false;
    const today = new Date().toDateString();
    const lastCompleted = new Date(streakData.lastCompleted).toDateString();
    return today === lastCompleted;
  };

  const handleMarkComplete = () => {
    const newStreakData = updateStreak();
    setStreakData(newStreakData);
  };

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

  const completedToday = isCompletedToday();
  const progressPercentage = Math.min((streakData.weeklyCount / 5) * 100, 100);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="hero-call">
        <AccordionTrigger className="text-left">
          <div className="flex items-center justify-between w-full pr-2">
            <div className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">Daily Hero's Call:</span>
              <span className="font-semibold">{currentWorkout.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={completedToday ? "default" : "outline"} className="flex items-center gap-1">
                {completedToday ? <CalendarCheck className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                {streakData.weeklyCount}/5 this week
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card className="border-0 shadow-none">
            <CardContent className="space-y-4 p-0">
              {/* Streak Counter */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Weekly Progress</p>
                    <p className="text-xs text-muted-foreground">Complete 5 days out of 7 to forge your week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{streakData.weeklyCount}/5</p>
                    <p className="text-xs text-muted-foreground">days this week</p>
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                {!completedToday && (
                  <Button 
                    onClick={handleMarkComplete}
                    size="sm" 
                    className="w-full"
                  >
                    Mark Today's Challenge Complete
                  </Button>
                )}
                
                {completedToday && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                    <CalendarCheck className="h-4 w-4" />
                    Today's challenge completed! 🔥
                  </div>
                )}
              </div>

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
                  A new Daily Hero's Call awaits you each dawn. Forge your strength, one day at a time.
                </p>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
