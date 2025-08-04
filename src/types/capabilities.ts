
export interface CapabilityTier {
  tier: number;
  title: string;
  requirement: string;
  completed: boolean;
}

export interface CapabilityPath {
  name: string;
  icon: string;
  subtitle: string;
  tiers: CapabilityTier[];
  color: string;
  bgColor: string;
}

export const CAPABILITY_PATHS: CapabilityPath[] = [
  {
    name: 'ENDURANCE',
    icon: '💨',
    subtitle: 'The Path of the Ironwolf',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    tiers: [
      { tier: 1, title: 'Walker', requirement: 'Walk 3km without stopping', completed: false },
      { tier: 2, title: 'Scout', requirement: 'Walk 5km under 1 hour', completed: false },
      { tier: 3, title: 'Jogger', requirement: 'Jog 1km', completed: false },
      { tier: 4, title: 'Trail Treader', requirement: 'Run 15 minutes', completed: false },
      { tier: 5, title: 'Road Warden', requirement: 'Run 30 minutes', completed: false },
      { tier: 6, title: 'Path Forger', requirement: 'Run 5km', completed: false },
      { tier: 7, title: 'Wanderer', requirement: '5km ruck (15kg+)', completed: false },
      { tier: 8, title: 'Runner', requirement: 'Run 1km under 6:00', completed: false },
      { tier: 9, title: 'Longstrider', requirement: 'Run 1 hour', completed: false },
      { tier: 10, title: 'Lawkeeper\'s Trial', requirement: 'NYPD Police Test: 2.4km in ~14:21', completed: false },
      { tier: 11, title: 'Ironwolf', requirement: 'Run 10km', completed: false },
      { tier: 12, title: 'Ranger', requirement: 'Run 5km under 30:00', completed: false },
      { tier: 13, title: 'Shield Test', requirement: '🇬🇧 Army Basic: 2.4km in ~12:45', completed: false },
      { tier: 14, title: 'March of Valor', requirement: '🇺🇸 Marine PFT (Good): 4.8km in under 28:00', completed: false },
      { tier: 15, title: 'Raider', requirement: 'Run 10km under 50:00', completed: false },
      { tier: 16, title: 'Fury of Fenrir', requirement: 'Navy Seal PFT: 2.4km in under 10:30', completed: false },
      { tier: 17, title: 'Wind Brother', requirement: 'Run 15km', completed: false },
      { tier: 18, title: 'Odin\'s Measure', requirement: '🇺🇸 Marine PFT (Excellent): 4.8km in under 21:00', completed: false },
      { tier: 19, title: 'Horizon Chaser', requirement: 'Run 21.1km (Half-Marathon)', completed: false },
      { tier: 20, title: 'Skollbrok', requirement: 'Complete a marathon', completed: false },
    ]
  },
  {
    name: 'STRENGTH',
    icon: '🏋️',
    subtitle: 'The Way of the Einherjar',
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    tiers: [
      { tier: 1, title: 'Fledgling', requirement: '20 squats', completed: false },
      { tier: 2, title: 'Camp Shield', requirement: '1-minute plank (New Zealand Police)', completed: false },
      { tier: 3, title: 'Skirmisher', requirement: '10 push-ups', completed: false },
      { tier: 4, title: 'Raider', requirement: '20 full-depth lunges (knee-to-ground)', completed: false },
      { tier: 5, title: 'Holdfast', requirement: 'Dead Hang 1:00', completed: false },
      { tier: 6, title: 'Weight-bearer', requirement: '30m Farmer\'s Carry (2×16kg)', completed: false },
      { tier: 7, title: 'NYPD Academy Standard', requirement: '30 push-ups (1 minute) (standard male entry benchmark) + Plank ~2 min pass', completed: false },
      { tier: 8, title: 'Stronghand', requirement: 'Dead Hang 2:00', completed: false },
      { tier: 9, title: 'Guardian', requirement: '5 pull-ups', completed: false },
      { tier: 10, title: 'U.S. Marine PFT', requirement: 'Pull-ups: 5 reps, Plank: 1:30, 4.8km run: 28:00', completed: false },
      { tier: 11, title: 'Warrior 🇬🇧 Army Press-Up Test', requirement: '44 push-ups in 2 minutes (British Army standard for age <35) + 3 pull-ups (U.S. Marines Minimum req)', completed: false },
      { tier: 12, title: 'Warlord', requirement: 'Carry 50kg sandbag for 20m + U.S. Navy max points: Plank 4 min', completed: false },
      { tier: 13, title: 'Vanquisher', requirement: '20 push-ups + 10 pull-ups (same session)', completed: false },
      { tier: 14, title: 'Champion', requirement: 'Turkish get-up 24kg ×3 per side', completed: false },
      { tier: 15, title: 'Gatecrusher', requirement: 'Bodyweight farmers walk 1:00', completed: false },
      { tier: 16, title: 'Navy Seal PFT', requirement: '100 push-ups in 2 minutes, 100 sit-ups in 2 minutes, 10 strict pull-ups', completed: false },
      { tier: 17, title: 'Chosen of Odin', requirement: 'Carry 100kg over 20m', completed: false },
      { tier: 18, title: 'Einherjar', requirement: 'Ragnarök Trial: Deadlift 2× bodyweight + 20 pull-ups + 5 Turkish get-ups @24kg in one session (rest as needed)', completed: false },
    ]
  },
  {
    name: 'MOBILITY',
    icon: '🧘',
    subtitle: 'The Flow of the Panther',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    tiers: [
      { tier: 1, title: 'Initiate', requirement: 'Touch toes from standing, knees locked', completed: false },
      { tier: 2, title: 'Deep Dweller', requirement: 'Deep squat hold, 2 minutes (heels down, upright chest)', completed: false },
      { tier: 3, title: 'Low Strider', requirement: 'Active hip flexor lunge (rear glute engaged) 30s/side', completed: false },
      { tier: 4, title: 'Side Stalker', requirement: '10 full-range Cossack squats (heel down, hip below knee)', completed: false },
      { tier: 5, title: 'Panther Walker', requirement: '5 reps: deep squat → standing → back down, slow and controlled, no hands', completed: false },
      { tier: 6, title: 'Balance Bearer', requirement: 'Pistol squat to a box (knee at 90°) x5 per leg', completed: false },
      { tier: 7, title: 'Spine Weaver', requirement: 'Jefferson curl with 8kg weight x8 reps (controlled descent and rise)', completed: false },
      { tier: 8, title: 'Gate Opener', requirement: '10 controlled hip CARs (Controlled Articular Rotations) per side', completed: false },
      { tier: 9, title: 'Crow Brother', requirement: 'Crow pose 30s hold, then slow controlled landing to deep squat', completed: false },
      { tier: 10, title: 'Panther', requirement: 'Full pistol squat (below parallel) both legs, no bounce', completed: false },
      { tier: 11, title: 'Bridge Bearer', requirement: 'Full back bridge (hands and feet on ground, arms locked) 15s', completed: false },
      { tier: 12, title: 'Beast Unleashed', requirement: 'Tripod-to-lunge-to-stand flow x5/side (smooth and balanced)', completed: false },
      { tier: 13, title: 'Wind-Walker', requirement: 'Pancake stretch, chest flat on floor (knees locked, active feet)', completed: false },
      { tier: 14, title: 'Cloud Strider', requirement: 'Stand → deep squat → back roll → stand again x5 reps', completed: false },
      { tier: 15, title: 'Serpent Sage', requirement: 'Full overhead squat (arms straight, weightless or dowel) x5 reps with perfect form', completed: false },
    ]
  },
  {
    name: 'RESILIENCE',
    icon: '❄️',
    subtitle: 'The Path of the Unbroken',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
    tiers: [
      { tier: 1, title: 'Weakling', requirement: 'Cold shower (10s)', completed: false },
      { tier: 2, title: 'Novice Endurer', requirement: 'Cold shower (30s)', completed: false },
      { tier: 3, title: 'Tolerant', requirement: 'Plunge feet in cold water 2 mins', completed: false },
      { tier: 4, title: 'Resister', requirement: 'Wall sit 1 min', completed: false },
      { tier: 5, title: 'Seeker of Suffering', requirement: 'Workout outdoors in rain/snow', completed: false },
      { tier: 6, title: 'Stoic', requirement: 'Cold shower daily for 7 days', completed: false },
      { tier: 7, title: 'Ascetic', requirement: 'Fast for 16h', completed: false },
      { tier: 8, title: 'War-Hardened', requirement: 'Ice bath 3 minutes', completed: false },
      { tier: 9, title: 'Wind Brother', requirement: 'Run in high wind or storm', completed: false },
      { tier: 10, title: 'Ruck Fiend', requirement: '10km ruck (15kg+)', completed: false },
      { tier: 11, title: 'Fireless One', requirement: 'Train with no pre-workout/coffee', completed: false },
      { tier: 12, title: 'Chillforged', requirement: 'Ice bath 10 minutes', completed: false },
      { tier: 13, title: 'The Quiet Flame', requirement: 'Meditate in cold for 5 minutes', completed: false },
      { tier: 14, title: 'Ironhide', requirement: 'Shirtless cold exposure + pushups', completed: false },
      { tier: 15, title: 'The Unbroken', requirement: 'Survive Ragnarök Week (daily cold + workout)', completed: false },
    ]
  },
  {
    name: 'DISCIPLINE',
    icon: '⏳',
    subtitle: 'The Discipline of Tyr',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    tiers: [
      { tier: 1, title: 'Wanderer', requirement: 'Log 3 workouts in 1 week', completed: false },
      { tier: 2, title: 'Disciple', requirement: 'Workout 3x/week for 2 weeks', completed: false },
      { tier: 3, title: 'Ritualist', requirement: '5-day morning wake-up streak (before 7am)', completed: false },
      { tier: 4, title: 'Monk', requirement: 'No phone before 8am for 3 days', completed: false },
      { tier: 5, title: 'Time Keeper', requirement: 'Log workouts at the same time 5x', completed: false },
      { tier: 6, title: 'Storm Scribe', requirement: 'Journal 3 days in a row', completed: false },
      { tier: 7, title: 'Rune Reader', requirement: 'Read 10 minutes/day for a week', completed: false },
      { tier: 8, title: 'Tracker', requirement: 'Hit protein target 5 days in a row', completed: false },
      { tier: 9, title: 'Clean Fueler', requirement: 'No sugar for 3 days', completed: false },
      { tier: 10, title: 'Fire Watcher', requirement: '30-day check-in streak', completed: false },
      { tier: 11, title: 'Chain-Breaker', requirement: '7-day streak with 0 breaks', completed: false },
      { tier: 12, title: 'Forge-Bound', requirement: 'Workout 6am for 10 days in a row', completed: false },
      { tier: 13, title: 'Focused One', requirement: 'No distractions during workout 5x', completed: false },
      { tier: 14, title: 'Time-Bender', requirement: '60-day habit streak', completed: false },
      { tier: 15, title: 'Tyr\'s Chosen', requirement: '100 days of workout logging (not consecutive)', completed: false },
    ]
  },
  {
    name: 'URBAN SURVIVAL',
    icon: '🛡️',
    subtitle: 'The Shield of the Citizen',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    tiers: [
      { tier: 1, title: 'Streetwise', requirement: 'Identify the nearest hospital, police station, and emergency exit in a public space', completed: false },
      { tier: 2, title: 'Map Master', requirement: 'Navigate across your city using only a paper map or offline map', completed: false },
      { tier: 3, title: 'Transit Tactician', requirement: 'Use public transport in a new city without assistance', completed: false },
      { tier: 4, title: 'Light Bringer', requirement: 'Change a household lightbulb and fuse', completed: false },
      { tier: 5, title: 'Fixsmith', requirement: 'Fix a leaking tap or toilet valve', completed: false },
      { tier: 6, title: 'Signal Keeper', requirement: 'Set up a WiFi router or troubleshoot basic home network issues', completed: false },
      { tier: 7, title: 'Locksmith', requirement: 'Pick a basic padlock with a hairpin or tension tool (legally & safely)', completed: false },
      { tier: 8, title: 'Food Forager', requirement: 'Buy and prepare a full meal for under €5', completed: false },
      { tier: 9, title: 'Power Prepper', requirement: 'Assemble a blackout kit: flashlight, radio, charger, water, and food', completed: false },
      { tier: 10, title: 'First Responder', requirement: 'Know how to perform CPR and use an AED', completed: false },
      { tier: 11, title: 'Tool Adept', requirement: 'Safely use a drill and screwdriver to mount something or fix furniture', completed: false },
      { tier: 12, title: 'Budgeteer', requirement: 'Track and categorize all personal spending for 30 days', completed: false },
      { tier: 13, title: 'Civic Sentinel', requirement: 'Know your local emergency numbers and procedures', completed: false },
      { tier: 14, title: 'Voice of Reason', requirement: 'De-escalate a tense public interaction without aggression', completed: false },
      { tier: 15, title: 'Urban Ranger', requirement: 'Navigate 3km across your city without a phone or asking for directions', completed: false },
    ]
  },
  {
    name: 'SURVIVAL SKILLS',
    icon: '🪢',
    subtitle: 'The Way of the Pathfinder',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    tiers: [
      { tier: 1, title: 'Rope Wielder', requirement: 'Tie a shoelace using the bunny ears method', completed: false },
      { tier: 2, title: 'Knot Novice', requirement: 'Tie a square knot (reef knot)', completed: false },
      { tier: 3, title: 'Latch Master', requirement: 'Tie a bowline knot', completed: false },
      { tier: 4, title: 'Shelter Seeker', requirement: 'Set up a basic tarp shelter with rope', completed: false },
      { tier: 5, title: 'Fireborn', requirement: 'Start a fire with matches or lighter', completed: false },
      { tier: 6, title: 'Ember Whisperer', requirement: 'Start a fire with flint & steel', completed: false },
      { tier: 7, title: 'Navigator', requirement: 'Use a compass to find cardinal directions', completed: false },
      { tier: 8, title: 'Water Finder', requirement: 'Identify 3 safe water sources in the wild', completed: false },
      { tier: 9, title: 'Signal Caller', requirement: 'Learn 3 distress signals (SOS, whistle, mirror)', completed: false },
      { tier: 10, title: 'Forager', requirement: 'Identify 3 edible wild plants (region-based)', completed: false },
      { tier: 11, title: 'Rope Wrangler', requirement: 'Tie 5 different knots from memory', completed: false },
      { tier: 12, title: 'Field Medic', requirement: 'Demonstrate basic first aid (e.g., bandage, sling)', completed: false },
      { tier: 13, title: 'Fire-forged', requirement: 'Start a fire in wet conditions', completed: false },
      { tier: 14, title: 'Shelter Master', requirement: 'Build a shelter using only natural materials', completed: false },
      { tier: 15, title: 'Pathfinder', requirement: 'Complete a 24-hour solo survival challenge (or simulation)', completed: false },
    ]
  }
];
