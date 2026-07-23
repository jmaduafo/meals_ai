import { z } from "zod";

export const dietaryRestrictionEnum = z.enum([
  "VEGETARIAN",
  "VEGAN",
  "PESCATARIAN",
  "KETO",
  "PALEO",
  "GLUTEN_FREE",
  "DAIRY_FREE",
  "NUT_FREE",
  "HALAL",
  "KOSHER",
  "LOW_FODMAP",
]);

export type DietaryRestriction =
  z.infer<typeof dietaryRestrictionEnum>;
  
export const weightGoalEnum = z.enum(["LOSE", "MAINTAIN", "GAIN"]);
export const activityLevelEnum = z.enum([
  "SEDENTARY",
  "LIGHT",
  "MODERATE",
  "ACTIVE",
  "VERY_ACTIVE",
]);

// Drives the onboarding form (RHF + zodResolver) and the POST /api/onboarding body.
export const onboardingSchema = z.object({
  weightGoal: weightGoalEnum,
  currentWeightLbs: z.coerce.number().min(60).max(600).optional(),
  targetWeightLbs: z.coerce.number().min(60).max(600).optional(),
  heightInches: z.coerce.number().min(36).max(96).optional(),
  age: z.coerce.number().int().min(13).max(100).optional(),
  sex: z.enum(["male", "female"]).optional(),
  activityLevel: activityLevelEnum.default("MODERATE"),

  dietaryRestrictions: z.array(dietaryRestrictionEnum).default([]),
  allergies: z.array(z.string()).default([]),
  dislikedIngredients: z.array(z.string()).default([]),

  weeklyBudgetUsd: z.coerce
    .number({ error: "Enter a weekly grocery budget" })
    .min(20, "Budget must be at least $20/week")
    .max(2000),
  householdSize: z.coerce.number().int().min(1).max(12).default(1),
});

export type OnboardingInput = z.input<typeof onboardingSchema>;

// Body for POST /api/meal-plan/generate
export const generateMealPlanSchema = z.object({
  weekOf: z.coerce.date().optional(), // defaults to next Monday server-side
  regenerateDayIndex: z.number().int().min(0).max(6).optional(), // regenerate a single day
});

// Body for POST /api/fridge-scan
export const fridgeScanSchema = z.object({
  imageBase64: z.string().min(1, "Image is required"),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
});

// Shape the model is instructed to return for a generated recipe.
export const aiRecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      unit: z.string(),
      estCostUsd: z.number(),
    })
  ),
  instructions: z.array(z.string()),
  calories: z.number(),
  proteinG: z.number(),
  carbG: z.number(),
  fatG: z.number(),
  prepMinutes: z.number(),
  cookMinutes: z.number(),
  tags: z.array(z.string()),
});

export const aiMealPlanSchema = z.object({
  days: z.array(
    z.object({
      dayIndex: z.number().int().min(0).max(6),
      meals: z.array(aiRecipeSchema),
    })
  ),
});

export const aiFridgeScanSchema = z.object({
  detectedItems: z.array(z.string()),
  suggestedRecipes: z.array(aiRecipeSchema),
});
