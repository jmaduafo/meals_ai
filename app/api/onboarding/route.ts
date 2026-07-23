import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/zod/validations";
import { calculateMacroTargets } from "@/utils/nutrition";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const input = parsed.data;

  // Ensure a local User row exists, mirroring the Clerk identity.
  const clerkUser = await currentUser();
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? `${clerkId}@unknown.local`,
      name: clerkUser?.firstName ?? undefined,
    },
  });

  // Compute macro targets server-side when we have enough biometrics;
  // otherwise leave null and let the AI estimate reasonable defaults.
  let macros: ReturnType<typeof calculateMacroTargets> | null = null;
  if (input.currentWeightLbs && input.heightInches && input.age && input.sex) {
    macros = calculateMacroTargets({
      weightLbs: input.currentWeightLbs,
      heightInches: input.heightInches,
      age: input.age,
      sex: input.sex,
      activityLevel: input.activityLevel,
      weightGoal: input.weightGoal,
    });
  }

  const profile = await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {
      weightGoal: input.weightGoal,
      currentWeightLbs: input.currentWeightLbs,
      targetWeightLbs: input.targetWeightLbs,
      heightInches: input.heightInches,
      age: input.age,
      sex: input.sex,
      activityLevel: input.activityLevel,
      dietaryRestrictions: input.dietaryRestrictions,
      allergies: input.allergies,
      dislikedIngredients: input.dislikedIngredients,
      weeklyBudgetUsd: input.weeklyBudgetUsd,
      householdSize: input.householdSize,
      dailyCalorieTarget: macros?.calories,
      proteinTargetG: macros?.proteinG,
      carbTargetG: macros?.carbG,
      fatTargetG: macros?.fatG,
    },
    create: {
      userId: user.id,
      weightGoal: input.weightGoal,
      currentWeightLbs: input.currentWeightLbs,
      targetWeightLbs: input.targetWeightLbs,
      heightInches: input.heightInches,
      age: input.age,
      sex: input.sex,
      activityLevel: input.activityLevel,
      dietaryRestrictions: input.dietaryRestrictions,
      allergies: input.allergies,
      dislikedIngredients: input.dislikedIngredients,
      weeklyBudgetUsd: input.weeklyBudgetUsd,
      householdSize: input.householdSize,
      dailyCalorieTarget: macros?.calories,
      proteinTargetG: macros?.proteinG,
      carbTargetG: macros?.carbG,
      fatTargetG: macros?.fatG,
    },
  });

  return NextResponse.json({ profile }, { status: 200 });
}
