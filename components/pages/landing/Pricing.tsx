import Header5 from "@/components/headings/Header5";
import Header6 from "@/components/headings/Header6";
import Paragraph from "@/components/headings/Paragraph";
import { Circle, CircleCheck } from "lucide-react";
import React from "react";
import OpeningTitle from "./OpeningTitle";
import { Button } from "@/components/ui/button";

interface Plan {
  feature: string;
  isAllowed?: boolean;
}

function Pricing() {
  const FREE_PLAN: Plan[] = [
    {
      feature: "Onboarding (goal, diet, budget)",
      isAllowed: true,
    },
    {
      feature: "1/month meal plan generation",
      isAllowed: true,
    },
    {
      feature: "Grocery list",
      isAllowed: true,
    },
    {
      feature: "3/month fridge scans",
      isAllowed: true,
    },
    {
      feature: "Dashboard overview",
      isAllowed: true,
    },
    {
      feature: "Grocery delivery links",
      isAllowed: true,
    },
    {
      feature: "Macro tracking (actual vs. target)",
    },
    {
      feature: "Weight trend chart",
    },
    {
      feature: "Pantry auto-sync from scans",
    },
  ];

  const PREMIUM_PLAN: Plan[] = [
    {
      feature: "Onboarding (goal, diet, budget)",
      isAllowed: true,
    },
    {
      feature: "Unlimited meal plan generation",
      isAllowed: true,
    },
    {
      feature: "Grocery list",
      isAllowed: true,
    },
    {
      feature: "Unlimited fridge scans",
      isAllowed: true,
    },
    {
      feature: "Dashboard overview",
      isAllowed: true,
    },
    {
      feature: "Grocery delivery links",
      isAllowed: true,
    },
    {
      feature: "Macro tracking (actual vs. target)",
      isAllowed: true,
    },
    {
      feature: "Weight trend chart",
      isAllowed: true,
    },
    {
      feature: "Pantry auto-sync from scans",
      isAllowed: true,
    },
  ];
  return (
    <section className="pb-10" id="pricing">
      <OpeningTitle
        badgeText="Pricing"
        title="Find the plan that fits your lifestyle"
        subtitle="Start free and upgrade whenever you're ready. Get personalized AI meal plans, grocery lists, nutrition insights, and more."
      />
      <div className="w-full lg-[85%] xl:w-[75%] 2xl:w-[60%] mx-auto grid md:grid-cols-2 gap-6" id="pricing">
        <PlanCard planType="free" price={0} item={FREE_PLAN} />
        <PlanCard planType="plus" price={9.99} item={PREMIUM_PLAN} />
      </div>
    </section>
  );
}

export default Pricing;

function PlanCard({
  planType,
  price,
  item,
}: {
  readonly planType: "free" | "plus";
  readonly price: number;
  readonly item: Plan[];
}) {
  return (
    <div className="flex flex-col bg-foreground text-background dark:bg-background dark:text-foreground rounded-2xl">
      <div className="p-5 border-b border-b-background/10 dark:border-b-foreground/10">
        <Header5 className="font-medium capitalize" text={`${planType} plan`} />
      </div>
      <div className="py-5 flex flex-col items-center border-b border-b-background/10 dark:border-b-foreground/10">
        <div className="font-medium flex items-start">
          <Header6 text="$" />
          <p className="text-6xl leading-none">{price}</p>
        </div>
        <Paragraph text="per month" />
      </div>
      <div className="p-5">
        <div className="grid gap-2">
          {item.map((feat) => {
            return (
              <div key={feat.feature} className="flex items-center gap-2">
                {feat.isAllowed ? (
                  <CircleCheck className="size-5" />
                ) : (
                  <Circle className="size-5 opacity-60" />
                )}
                <Paragraph text={feat.feature} />
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <Button variant={"secondary"} className="w-full font-medium text-base h-10">
            Select Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
