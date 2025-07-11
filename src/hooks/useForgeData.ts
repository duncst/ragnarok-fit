import { useForgeProgress } from './useForgeProgress';

// Forge titles progression
const FORGE_TITLES = [
  { minWeeks: 0, title: "Apprentice" },
  { minWeeks: 1, title: "Forge Initiate" },
  { minWeeks: 2, title: "Iron Shaper" },
  { minWeeks: 4, title: "Disciple of Flame" },
  { minWeeks: 6, title: "Steel Forger" },
  { minWeeks: 8, title: "Master Smith" },
  { minWeeks: 10, title: "Forge Master" },
  { minWeeks: 12, title: "Legendary Artisan" },
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

  // Get next title info
  const getNextTitleInfo = () => {
    const currentWeeks = forgeProgress.currentWeek;
    const nextTitle = FORGE_TITLES.find(title => title.minWeeks > currentWeeks);
    
    if (!nextTitle) return null;
    
    const weeksNeeded = nextTitle.minWeeks - currentWeeks;
    return {
      nextTitle: nextTitle.title,
      weeksNeeded,
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
    currentQuote
  };
};