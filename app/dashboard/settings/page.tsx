import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpgradeButton } from "@/components/dashboard/upgrade-button";
import { Badge } from "@/components/ui/badge";
import { PRICING } from "@/lib/constants";

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { subscription: true },
  });
  if (!user) redirect("/onboarding");

  const isActive =
    user.subscription?.status === "ACTIVE" || user.subscription?.status === "TRIALING";

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-display text-3xl">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink/70">Status</span>
            <Badge variant={isActive ? "default" : "outline"}>
              {user.subscription?.status ?? "NONE"}
            </Badge>
          </div>
          {!isActive && (
            <>
              <p className="text-sm text-ink/70">
                MealWise Plus — {PRICING.monthly.amountUsd}/month for unlimited weekly plans,
                grocery lists, and fridge scans.
              </p>
              <UpgradeButton />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
