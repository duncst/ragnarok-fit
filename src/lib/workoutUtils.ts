
export const isHeroCallWorkout = (workoutName: string) => {
  return workoutName.startsWith("Hero's Call:");
};

export const isValhallaWorkout = (workoutName: string) => {
  return /^(THOR|FENRIR|HEL|NJORD|ODIN)$/i.test(workoutName);
};

export const getWorkoutBadge = (workoutName: string) => {
  if (isHeroCallWorkout(workoutName)) {
    return { text: "Hero's Call", variant: "secondary" as const, icon: "⚔️" };
  }
  if (isValhallaWorkout(workoutName)) {
    return { text: "Valhalla", variant: "destructive" as const, icon: "🔥" };
  }
  return null;
};
