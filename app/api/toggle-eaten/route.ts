import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  mealId: z.string(),
  eaten: z.boolean(),
});

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten }, { status: 400 });
  }

  // Scope the update to the requesting user's own meal plans so one user
  // can't toggle another user's meal by guessing an id.
  const meal = await prisma.meal.findFirst({
    where: {
      id: parsed.data.mealId,
      mealPlanDay: { mealPlan: { user: { clerkId } } },
    },
  });
  if (!meal) return NextResponse.json({ error: "Meal not found" }, { status: 404 });

  const updated = await prisma.meal.update({
    where: { id: meal.id },
    data: {
      eaten: parsed.data.eaten,
      eatenAt: parsed.data.eaten ? new Date() : null,
    },
  });

  return NextResponse.json({ meal: updated });
}
