import { useForgeProgress } from './useForgeProgress';

// New forge titles progression with complex requirements
const FORGE_TITLES = [
  { 
    tier: 1, 
    title: "Sparked", 
    description: "The first flicker of will. The ritual begins.",
    requirement: "Complete one Challenge. Any Hero's Call, Endurance, Valhalla Challenge, or Strength Activity."
  },
  { 
    tier: 2, 
    title: "Kindled", 
    description: "The flame grows steady. Routine becomes rhythm.",
    requirement: "1 Forging Week"
  },
  { 
    tier: 3, 
    title: "Forge Adept", 
    description: "Consistency sustained. You are now fire-forged.",
    requirement: "3 Forging Weeks + at least one Hero's Call."
  },
  { 
    tier: 4, 
    title: "Disciple of Flame", 
    description: "The fire now guides you. The path is clear.",
    requirement: "4 Forging Weeks + at least 1 Endurance Activity."
  },
  { 
    tier: 5, 
    title: "Ironbound", 
    description: "No longer wavering. The Forge is your home.",
    requirement: "6 Forging Weeks + 3 different types of Challenge. A Hero's Call, Endurance, and a Strength Activity."
  },
  { 
    tier: 6, 
    title: "Ashwalker", 
    description: "You have endured storms, setbacks, silence—and remained.",
    requirement: "12 Forging Weeks + 1 Valhalla Challenge"
  },
  { 
    tier: 7, 
    title: "Blazeborn", 
    description: "One who walks through fire and emerges stronger. You inspire others.",
    requirement: "26 Forging Weeks"
  },
  { 
    tier: 8, 
    title: "Unbroken", 
    description: "Your fire never dies. You are now a beacon—one who forges others.",
    requirement: "52 Forging Weeks"
  },
];

// Rotating forge quotes
const FORGE_QUOTES = [
  "Discipline is the spark. Action is the forge.",
  "In the crucible of persistence, legends are born.",
  "Every rep is a hammer blow upon the anvil of greatness.",
  "The flames of effort forge the soul of a warrior.",
  "What is forged in struggle cannot be broken by comfort.",
  "True strength is tempered through consistent action.",
];

export const useForgeData = () => {
  const { forgeProgress, isLoading } = useForgeProgress();

  // Get next title info based on current tier
  const getNextTitleInfo = () => {
    const currentTier = forgeProgress.tier;
    const nextTitle = FORGE_TITLES.find(title => title.tier > currentTier);
    
    if (!nextTitle) return null;
    
    return {
      nextTitle: nextTitle.title,
      nextRequirement: nextTitle.requirement,
      currentTitle: forgeProgress.currentTitle
    };
  };

  // Get random quote (changes based on current week for pseudo-rotation)
  const getCurrentQuote = () => {
    const quoteIndex = forgeProgress.currentWeek % FORGE_QUOTES.length;
    return FORGE_QUOTES[quoteIndex];
  };

  const nextTitleInfo = getNextTitleInfo();
  const currentQuote = getCurrentQuote();

  return {
    forgeProgress,
    isLoading,
    nextTitleInfo,
    currentQuote,
    forgeTitles: FORGE_TITLES
  };
};