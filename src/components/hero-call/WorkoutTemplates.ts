import React from 'react';
import { Swords, Shield, Flame } from 'lucide-react';

export interface WorkoutLevel {
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  label: string;
  duration: string;
  exercises: string[];
  rest: string;
}

export interface HeroCallWorkout {
  name: string;
  description: string;
  motivation: string;
  levels: WorkoutLevel[];
}

export const workoutTemplates: HeroCallWorkout[] = [
  {
    name: "Fenrir's Fury",
    description: "Channel the raw power of the great wolf. This trial tests your explosive strength and primal endurance.",
    motivation: "The wolf sleeps until hunger awakens it. Today, you are both hunter and prey.",
    levels: [
      {
        difficulty: 'easy',
        icon: 'Swords',
        label: 'Pup\'s Path',
        duration: '8-12 min',
        exercises: [
          '2 rounds:',
          '• 5 Push-ups (knee variation allowed)',
          '• 8 Bodyweight squats',
          '• 10 sec plank hold',
          '• 3 Burpees (step back variation)',
          '• 1 min rest between rounds'
        ],
        rest: '1 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Wolf\'s Hunt',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'Alpha\'s Dominion',
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
        icon: 'Swords',
        label: 'Apprentice Smith',
        duration: '8-12 min',
        exercises: [
          '2 rounds:',
          '• 4 Push-ups (knee variation allowed)',
          '• 8 Air squats',
          '• 5 Lunges (each leg)',
          '• 15 sec wall sit',
          '• 8 Jumping jacks',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Thunder Striker',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'Mjölnir\'s Might',
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
        icon: 'Swords',
        label: 'Seeker\'s Path',
        duration: '8-10 min',
        exercises: [
          '2 rounds:',
          '• 3 Slow push-ups (knee variation allowed)',
          '• 6 Controlled squats',
          '• 20 sec plank',
          '• 5 Slow mountain climbers',
          '• 10 sec dead hang (or hang from bar)',
          '• 2 min rest between rounds'
        ],
        rest: '2 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Raven\'s Flight',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'All-Father\'s Trial',
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
        icon: 'Swords',
        label: 'Shield Maiden',
        duration: '8-12 min',
        exercises: [
          '2 rounds:',
          '• 5 Push-ups (knee variation allowed)',
          '• 6 Jump squats',
          '• 4 Reverse lunges (each leg)',
          '• 10 sec single-leg stand (each leg)',
          '• 8 Arm circles (forward & back)',
          '• 6 Glute bridges',
          '• 90 sec rest between rounds'
        ],
        rest: '90 sec between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Battle Dancer',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'Chooser of the Slain',
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
        icon: 'Swords',
        label: 'Hatchling\'s Writhe',
        duration: '8-10 min',
        exercises: [
          '2 rounds:',
          '• 20 sec plank',
          '• 6 Dead bugs (each side)',
          '• 5 Bird dogs (each side)',
          '• 8 Bicycle crunches (each side)',
          '• 10 sec side plank (each side)',
          '• 6 Glute bridges',
          '• 2 min rest between rounds'
        ],
        rest: '2 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Serpent\'s Flow',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'World Serpent\'s Grasp',
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
        icon: 'Swords',
        label: 'Gate Keeper',
        duration: '8-10 min',
        exercises: [
          '2 rounds:',
          '• 20 sec wall sit',
          '• 5 Push-ups (knee variation allowed)',
          '• 30 sec plank hold',
          '• 6 Squats',
          '• 10 sec single-arm hold (each arm)',
          '• 2 min rest between rounds'
        ],
        rest: '2 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Bridge Guardian',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'All-Seeing Sentinel',
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
        icon: 'Swords',
        label: 'Royal Maiden',
        duration: '8-12 min',
        exercises: [
          '2 rounds:',
          '• 4 Slow push-ups (knee variation allowed)',
          '• 10 Bodyweight squats',
          '• 5 Reverse lunges (each leg)',
          '• 20 sec plank',
          '• 8 Glute bridges',
          '• 2 min rest between rounds'
        ],
        rest: '2 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Throne Protector',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'Queen\'s Command',
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
        icon: 'Swords',
        label: 'Clever Apprentice',
        duration: '8-12 min',
        exercises: [
          '2 rounds (mix up the order each round):',
          '• 5 Push-ups (knee variation allowed)',
          '• 8 Jump squats',
          '• 3 Burpees (step back variation)',
          '• 15 High knees',
          '• 20 sec plank',
          '• 6 Lunges (alternating)',
          '• 2 min rest between rounds'
        ],
        rest: '2 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Shapeshifter',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'Trickster\'s Gambit',
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
        icon: 'Swords',
        label: 'Dawn\'s First Ray',
        duration: '8-12 min',
        exercises: [
          '2 rounds:',
          '• 3 Perfect push-ups (knee variation allowed)',
          '• 8 Slow squats',
          '• 5 Controlled lunges (each leg)',
          '• 30 sec perfect plank',
          '• 6 Slow glute bridges',
          '• 2 min rest between rounds'
        ],
        rest: '2 min rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Midday Radiance',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'Eternal Brilliance',
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
        icon: 'Swords',
        label: 'Fair Judgment',
        duration: '8-12 min',
        exercises: [
          '2 rounds:',
          '• 4 Push-ups (knee variation allowed)',
          '• 6 Assisted single-leg squats (each leg)',
          '• 6 Single-leg glute bridges (each leg)',
          '• 10 sec single-leg stand (each leg)',
          '• 15 sec side plank (each side)',
          '• 2 min rest between rounds'
        ],
        rest: '2 min rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Scales of War',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'One-Handed Warrior',
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
        icon: 'Swords',
        label: 'Seidr Apprentice',
        duration: '8-12 min',
        exercises: [
          '2 rounds:',
          '• 5 Push-ups (knee variation allowed)',
          '• 8 Sumo squats',
          '• 6 Lateral lunges (each side)',
          '• 3 Burpees (step back variation)',
          '• 10 Glute bridges',
          '• 20 sec warrior III hold (each leg)',
          '• 2 min rest between rounds'
        ],
        rest: '2 min rest between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Battle Maiden',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'Goddess of War',
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
        icon: 'Swords',
        label: 'Silent Stalker',
        duration: '8-12 min',
        exercises: [
          '2 rounds:',
          '• 4 Slow push-ups (knee variation allowed)',
          '• 8 Silent squats',
          '• 5 Quiet lunges (each leg)',
          '• 30 sec plank (focus on breathing)',
          '• 6 Controlled mountain climbers',
          '• 2 min rest between rounds'
        ],
        rest: '2 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Vengeance Seeker',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'Father\'s Avenger',
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
        icon: 'Swords',
        label: 'Border Walker',
        duration: '8-12 min',
        exercises: [
          '2 rounds (alternate fast/slow):',
          '• 4 Fast push-ups (knee variation), then 2 slow push-ups',
          '• 8 Jump squats, then 4 slow squats',
          '• 20 sec fast high knees, then 20 sec slow march',
          '• 3 Fast burpees (step back), then 20 sec plank hold',
          '• 2 min rest between rounds'
        ],
        rest: '2 min between rounds'
      },
      {
        difficulty: 'medium',
        icon: 'Shield',
        label: 'Realm Guardian',
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
        difficulty: 'hard',
        icon: 'Flame',
        label: 'Death\'s Daughter',
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
      }
    ]
  }
];
