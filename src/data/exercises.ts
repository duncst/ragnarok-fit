
import type { ExerciseDef } from '@/types';

export const exercises: ExerciseDef[] = [
  {
    name: "Bench Press",
    bodyPart: "Chest",
    equipment: "Barbell",
    targetMuscles: ["Pectorals", "Triceps", "Shoulders"],
    description: "Lie on a flat bench, holding a barbell with a grip slightly wider than shoulder-width. Lower the bar to your chest, then press it back up to the starting position.",
  },
  {
    name: "Squat",
    bodyPart: "Legs",
    equipment: "Barbell",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    description: "Stand with the barbell on your upper back, feet shoulder-width apart. Lower your hips as if sitting in a chair, keeping your chest up and back straight. Return to the start.",
  },
  {
    name: "Deadlift",
    bodyPart: "Back",
    equipment: "Barbell",
    targetMuscles: ["Hamstrings", "Glutes", "Lower Back", "Lats"],
    description: "Stand with mid-foot under the barbell. Bend over and grab the bar with a shoulder-width grip. Lift the bar by extending your hips and knees, keeping your back straight.",
  },
  {
    name: "Overhead Press",
    bodyPart: "Shoulders",
    equipment: "Barbell",
    targetMuscles: ["Deltoids", "Triceps", "Trapezius"],
    description: "Stand with the barbell at your shoulders. Press the bar overhead until your arms are fully extended. Lower with control to the starting position.",
  },
  {
    name: "Barbell Row",
    bodyPart: "Back",
    equipment: "Barbell",
    targetMuscles: ["Lats", "Rhomboids", "Biceps", "Trapezius"],
    description: "Bend at your hips and knees and grab a barbell with an overhand grip. Pull the bar towards your upper waist, squeezing your back muscles. Lower the bar under control.",
  },
  {
    name: "Pull-ups",
    bodyPart: "Back",
    equipment: "Pull-up Bar",
    targetMuscles: ["Lats", "Biceps", "Rhomboids"],
    description: "Hang from a pull-up bar with an overhand grip. Pull your body up until your chin is over the bar. Lower your body back to the starting position with control.",
  },
  {
    name: "Dips",
    bodyPart: "Chest",
    equipment: "Dip Station",
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    description: "Grip parallel bars and lift your body. Lower your body by bending your elbows until your shoulders are below your elbows. Push back up to the start.",
  },
  {
    name: "Leg Press",
    bodyPart: "Legs",
    equipment: "Leg Press Machine",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    description: "Sit on the machine with your feet on the platform. Push the platform away from you by extending your knees. Control the return to the starting position.",
  },
  {
    name: "Bicep Curls",
    bodyPart: "Arms",
    equipment: "Dumbbells",
    targetMuscles: ["Biceps"],
    description: "Stand or sit holding a dumbbell in each hand at your sides. Curl the weights up to shoulder level, keeping your elbows stationary. Lower the dumbbells with control.",
  },
];
