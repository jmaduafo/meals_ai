import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MealPlanView } from "@/components/dashboard/meal-plan-view";

export default async function MealPlanPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/onboarding");

  const latestPlan = await prisma.mealPlan.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { days: { include: { meals: { include: { recipe: true } } } } },
  });

  return (
    <MealPlanView
      initialPlan={
        latestPlan
          ? JSON.parse(JSON.stringify(latestPlan)) // serialize Dates for the client component
          : null
      }
    />
  );
}
