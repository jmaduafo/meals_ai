import type { ActivityLevel, WeightGoal } from "@/app/generated/prisma/client";

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
};

const GOAL_CALORIE_ADJUSTMENT: Record<WeightGoal, number> = {
  LOSE: -500, // ~1 lb/week deficit
  MAINTAIN: 0,
  GAIN: 350, // lean surplus
};

interface MacroInputs {
  weightLbs: number;
  heightInches: number;
  age: number;
  sex: "male" | "female";
  activityLevel: ActivityLevel;
  weightGoal: WeightGoal;
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbG: number;
  fatG: number;
}

/**
 * Mifflin-St Jeor BMR -> TDEE -> goal-adjusted calories -> macro split.
 * Protein is prioritized (weight-based) since it's the macro most tied to
 * satiety and lean mass retention regardless of goal.
 */
export function calculateMacroTargets(input: MacroInputs): MacroTargets {
  const weightKg = input.weightLbs * 0.453592;
  const heightCm = input.heightInches * 2.54;

  const bmr =
    input.sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * input.age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * input.age - 161;

  const tdee = bmr * ACTIVITY_MULTIPLIER[input.activityLevel];
  const calories = Math.round(tdee + GOAL_CALORIE_ADJUSTMENT[input.weightGoal]);

  // Protein: ~1g per lb bodyweight (higher end to support satiety/retention on a deficit)
  const proteinG = Math.round(input.weightLbs * 1.0);
  const proteinCals = proteinG * 4;

  // Fat: 25% of total calories
  const fatCals = calories * 0.25;
  const fatG = Math.round(fatCals / 9);

  // Remainder to carbs
  const carbCals = Math.max(calories - proteinCals - fatCals, 0);
  const carbG = Math.round(carbCals / 4);

  return { calories, proteinG, carbG, fatG };
}
