import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatUsd } from "@/lib/utils";

export default async function DashboardOverviewPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      profile: true,
      mealPlans: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { groceryList: true },
      },
    },
  });

  if (!user?.profile) redirect("/onboarding");

  const { profile } = user;

  const latestPlan = user.mealPlans[0];
  const budgetUsed = latestPlan?.totalCostUsd ?? 0;
  const budgetPct = Math.min(
    100,
    Math.round((budgetUsed / profile.weeklyBudgetUsd) * 100),
  );

  const cardOverview = [
    {
      title: "calories",
      target: profile.dailyCalorieTarget,
      actual: ""
    },
  ]

  return (
    <div className="p-4">
      <div>
        <h1 className="font-display text-3xl">Welcome back</h1>
        <p className="mt-1 text-ink/70">Here's where your week stands.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Daily calorie target</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="num text-3xl">{profile.dailyCalorieTarget ?? "—"}</p>
            <p className="text-xs text-ink/60">
              P {profile.proteinTargetG ?? "—"}g · C{" "}
              {profile.carbTargetG ?? "—"}g · F {profile.fatTargetG ?? "—"}g
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              This week's grocery cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="num text-3xl">{formatUsd(budgetUsed)}</p>
            <p className="text-xs text-ink/60">
              of {formatUsd(profile.weeklyBudgetUsd)} budget ({budgetPct}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              This week's grocery cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="num text-3xl">{formatUsd(budgetUsed)}</p>
            <p className="text-xs text-ink/60">
              of {formatUsd(profile.weeklyBudgetUsd)} budget ({budgetPct}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active plan</CardTitle>
          </CardHeader>
          <CardContent>
            {latestPlan ? (
              <>
                <p className="text-sm text-ink/70">
                  Week of {new Date(latestPlan.weekOf).toLocaleDateString()}
                </p>
                <Link
                  href="/dashboard/meal-plan"
                  className="text-sm font-medium text-forest-700"
                >
                  View plan →
                </Link>
              </>
            ) : (
              <Link href="/dashboard/meal-plan?generate=true">
                <Button size="sm" className="mt-1">
                  Generate your first plan
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-forest-700 text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="font-display text-lg">Out of groceries mid-week?</p>
            <p className="text-sm text-white/80">
              Snap a photo of your fridge and we'll build recipes around what's
              already there.
            </p>
          </div>
          <Link href="/dashboard/fridge-scan">
            <Button>Scan my fridge</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
