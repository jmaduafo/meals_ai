import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GroceryListView } from "@/components/dashboard/grocery-list-view";
import { Card } from "@/components/ui/card";

export default async function GroceryListPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/onboarding");

  const latestPlan = await prisma.mealPlan.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { groceryList: true },
  });

  if (!latestPlan?.groceryList) {
    return (
      <Card className="p-10 text-center">
        <p className="font-display text-xl">No grocery list yet</p>
        <p className="mt-2 text-sm text-ink/70">
          Generate a meal plan first and we'll build your list from it.
        </p>
      </Card>
    );
  }

  type Item = { name: string; quantity: number; unit: string; estCostUsd: number };

  return (
    <GroceryListView
      items={latestPlan.groceryList.items as Item[]}
      estTotalUsd={latestPlan.groceryList.estTotalUsd}
    />
  );
}
