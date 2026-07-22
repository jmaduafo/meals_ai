import React from "react";
import {
  Target,
  Wallet,
  Camera,
  ShieldCheck,
  ListChecks,
  RefreshCw,
  Truck,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import Paragraph from "@/components/headings/Paragraph";
import OpeningTitle from "./OpeningTitle";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  body: string;
}

function Features() {
  const PLANNING_FEATURES: FeatureItem[] = [
    {
      icon: <Target className="h-5 w-5" strokeWidth={1.5} />,
      title: "Built around your actual goal",
      body: "Tell us if you're losing, maintaining, or gaining weight and we calculate your daily calorie and macro targets from your height, weight, age, and activity level — not a generic 2,000-calorie average.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />,
      title: "Restrictions are non-negotiable",
      body: "Vegetarian, vegan, keto, paleo, gluten-free, dairy-free, nut-free, halal, kosher, low-FODMAP, plus your own allergies and dislikes — every recipe respects them as hard rules, never a suggestion.",
    },
    {
      icon: <Wallet className="h-5 w-5" strokeWidth={1.5} />,
      title: "Priced to your real budget",
      body: "Set a weekly grocery number and household size. Every plan is estimated against real grocery costs and kept under what you set — budget-aware, not just calorie-aware.",
    },
  ];

  const PLAN_FEATURES: FeatureItem[] = [
    {
      icon: <Sparkles className="h-5 w-5" strokeWidth={1.5} />,
      title: "A full 7-day plan in seconds",
      body: "Breakfast, lunch, dinner, and a snack for every day of the week — 28 meals, each with a complete recipe, step-by-step instructions, and exact calories and macros.",
    },
    {
      icon: <RefreshCw className="h-5 w-5" strokeWidth={1.5} />,
      title: "Swap a day without losing the week",
      body: "Not feeling Tuesday's dinner? Regenerate a single day instead of the whole plan, so the rest of your groceries and prep don't go to waste.",
    },
    {
      icon: <Camera className="h-5 w-5" strokeWidth={1.5} />,
      title: "Snap your fridge, get dinner",
      body: "Low on groceries or just don't want to shop? Photograph what's already in your fridge or pantry and get recipes built around it — still filtered through your diet and allergies.",
    },
  ];

  const SHOPPING_FEATURES: FeatureItem[] = [
    {
      icon: <ListChecks className="h-5 w-5" strokeWidth={1.5} />,
      title: "One list, already merged",
      body: "Ingredients across all 28 meals are combined and deduplicated automatically — no more buying three separate bags of spinach because it showed up in three recipes.",
    },
    {
      icon: <Truck className="h-5 w-5" strokeWidth={1.5} />,
      title: "Order it without leaving the app",
      body: "Send your list straight to Instacart or Amazon Fresh with one click and skip retyping every item into a delivery app.",
    },
    {
      icon: <LayoutGrid className="h-5 w-5" strokeWidth={1.5} />,
      title: "One dashboard for the whole week",
      body: "Track today's calorie and macro targets, this week's grocery spend against your budget, and your active plan — all in one place.",
    },
  ];

  return (
    <section id="how-it-works">
      <OpeningTitle
        badgeText="Features"
        title="From your goal to your grocery cart"
        subtitle="Everything you need, nothing you have to think about."
      />
      <div className="flex flex-col gap-10">
        {/* STEP 1 */}
        <div>
          <FeatureHeading num={1} title="Tell us about you" />
          <FeatureRow items={PLANNING_FEATURES} />
        </div>
        {/* STEP 2 */}
        <div>
          <FeatureHeading num={2} title="Get your week" />
          <FeatureRow items={PLAN_FEATURES} />
        </div>
        {/* STEP 3 */}
        <div>
          <FeatureHeading num={3} title="Shop and track" />
          <FeatureRow items={SHOPPING_FEATURES} />
        </div>
      </div>
    </section>
  );
}

export default Features;

function FeatureRow({ items }: { readonly items: FeatureItem[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {items.map((f) => (
        <div key={f.title}>
          <div className="mb-3 flex h-9 w-9 rounded-full items-center justify-center bg-foreground text-background dark:bg-background dark:text-foreground">
            {f.icon}
          </div>
          <div className="flex flex-col gap-2">
            <Paragraph text={f.title} className="font-medium" />
            <Paragraph text={f.body} className="opacity-70" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureHeading({
  num,
  title,
}: {
  readonly num: number;
  readonly title: string;
}) {
  return (
    <div className="uppercase font-medium flex flex-col mb-5">
      <Paragraph className="opacity-70" text={`Step ${num}`} />
      <Paragraph className="" text={title} />
    </div>
  );
}
