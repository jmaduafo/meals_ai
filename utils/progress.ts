import { prisma } from "@/lib/prisma";
import { GroceryItem, MacroProgress, BudgetProgress, WeightProgress } from "@/types/type";

// ---------- Types ----------

function clampPct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

// ---------- Calories / macros ----------

/**
 * Today's calorie/macro progress: sums the recipes of meals marked `eaten`
 * on the MealPlanDay matching `date`, compared against UserProfile targets.
 * Falls back to zeroed targets if the user hasn't set them yet (rather than
 * throwing), so a dashboard can always render something.
 */
export async function getDailyMacroProgress(
  userId: string,
  date: Date = new Date(),
): Promise<MacroProgress | null> {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) return null;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const day = await prisma.mealPlanDay.findFirst({
    where: {
      date: { gte: startOfDay, lt: endOfDay },
      mealPlan: { userId },
    },
    include: { meals: { where: { eaten: true }, include: { recipe: true } } },
    
  });

  const actual = (day?.meals ?? []).reduce(
    (sum, meal) => ({
      calories: sum.calories + meal.recipe.calories * meal.servings,
      proteinG: sum.proteinG + meal.recipe.proteinG * meal.servings,
      carbG: sum.carbG + meal.recipe.carbG * meal.servings,
      fatG: sum.fatG + meal.recipe.fatG * meal.servings,
    }),
    { calories: 0, proteinG: 0, carbG: 0, fatG: 0 },
  );

  const targets = {
    calories: profile.dailyCalorieTarget ?? 0,
    proteinG: profile.proteinTargetG ?? 0,
    carbG: profile.carbTargetG ?? 0,
    fatG: profile.fatTargetG ?? 0,
  };

  const build = (key: keyof typeof targets) => ({
    target: targets[key],
    actual: Math.round(actual[key]),
    remaining: Math.max(0, Math.round(targets[key] - actual[key])),
    pct: targets[key] > 0 ? clampPct((actual[key] / targets[key]) * 100) : 0,
  });

  return {
    calories: build("calories"),
    proteinG: build("proteinG"),
    carbG: build("carbG"),
    fatG: build("fatG"),
  };
}

// ---------- Budget ----------

/**
 * Budget progress against the user's most recent meal plan: sums
 * estCostUsd for items marked `checked` (bought) on the grocery list.
 */
export async function getBudgetProgress(
  userId: string,
): Promise<BudgetProgress | null> {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) return null;

  const latestPlan = await prisma.mealPlan.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { groceryList: true },
  });

  const items =
    (latestPlan?.groceryList?.items as GroceryItem[] | undefined) ?? [];
  const spentUsd =
    Math.round(
      items.filter((i) => i.checked).reduce((sum, i) => sum + i.estCostUsd, 0) *
        100,
    ) / 100;

  const budgetUsd = profile.weeklyBudgetUsd;

  return {
    budgetUsd,
    spentUsd,
    remainingUsd: Math.round((budgetUsd - spentUsd) * 100) / 100,
    pct: budgetUsd > 0 ? clampPct((spentUsd / budgetUsd) * 100) : 0,
  };
}

// ---------- Weight ----------

/**
 * Weight progress from the WeightLog history. "Start" is the earliest log
 * (or the onboarding-time currentWeightLbs if no logs exist yet), "current"
 * is the most recent log, and pct is how far from start to target the
 * current weight is — handles both loss and gain goals via Math.abs.
 */
export async function getWeightProgress(
  userId: string,
): Promise<WeightProgress | null> {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) return null;

  const logs = await prisma.weightLog.findMany({
    where: { userId },
    orderBy: { loggedAt: "asc" },
  });

  const startWeightLbs = logs[0]?.weightLbs ?? profile.currentWeightLbs ?? null;
  const currentWeightLbs =
    logs[logs.length - 1]?.weightLbs ?? profile.currentWeightLbs ?? null;
  const targetWeightLbs = profile.targetWeightLbs ?? null;

  let pct: number | null = null;
  let remainingLbs: number | null = null;

  if (
    startWeightLbs !== null &&
    currentWeightLbs !== null &&
    targetWeightLbs !== null
  ) {
    const totalDelta = Math.abs(targetWeightLbs - startWeightLbs);
    const progressDelta = Math.abs(currentWeightLbs - startWeightLbs);
    pct = totalDelta > 0 ? clampPct((progressDelta / totalDelta) * 100) : 100;
    remainingLbs =
      Math.round(Math.abs(targetWeightLbs - currentWeightLbs) * 10) / 10;
  }

  return {
    startWeightLbs,
    currentWeightLbs,
    targetWeightLbs,
    remainingLbs,
    pct,
    history: logs.map((l: any) => ({
      weightLbs: l.weightLbs,
      loggedAt: l.loggedAt,
    })),
  };
}
