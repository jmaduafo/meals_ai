"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { onboardingSchema, type OnboardingInput, DietaryRestriction } from "@/zod/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RESTRICTIONS: { value: DietaryRestriction; label: string }[] = [
  { value: "VEGETARIAN", label: "Vegetarian" },
  { value: "VEGAN", label: "Vegan" },
  { value: "PESCATARIAN", label: "Pescatarian" },
  { value: "KETO", label: "Keto" },
  { value: "PALEO", label: "Paleo" },
  { value: "GLUTEN_FREE", label: "Gluten-free" },
  { value: "DAIRY_FREE", label: "Dairy-free" },
  { value: "NUT_FREE", label: "Nut-free" },
  { value: "HALAL", label: "Halal" },
  { value: "KOSHER", label: "Kosher" },
  { value: "LOW_FODMAP", label: "Low FODMAP" },
];

export default function OnboardingForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      weightGoal: "MAINTAIN",
      activityLevel: "MODERATE",
      dietaryRestrictions: [],
      allergies: [],
      dislikedIngredients: [],
      householdSize: 1,
    },
  });

  const selectedRestrictions = watch("dietaryRestrictions");

  function toggleRestriction(value: DietaryRestriction) {
    const current = selectedRestrictions ?? [];
    setValue(
      "dietaryRestrictions",
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      { shouldValidate: true }
    );
  }

  async function onSubmit(data: OnboardingInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Profile saved — building your first plan…");
      router.push("/dashboard/meal-plan?generate=true");
    } catch (err) {
      toast.error("Couldn't save your profile. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Weight goal */}
      <section className="space-y-3">
        <Label>What's your goal?</Label>
        <Controller
          control={control}
          name="weightGoal"
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-3">
              {(["LOSE", "MAINTAIN", "GAIN"] as const).map((goal) => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => field.onChange(goal)}
                  className={`rounded-md border px-4 py-3 text-sm font-medium capitalize transition ${
                    field.value === goal
                      ? "border-forest-700 bg-forest-100 text-forest-700"
                      : "border-border bg-white hover:bg-sage-200/40"
                  }`}
                >
                  {goal === "LOSE" ? "Lose weight" : goal === "GAIN" ? "Gain weight" : "Maintain"}
                </button>
              ))}
            </div>
          )}
        />
      </section>

      {/* Biometrics for macro calculation */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Current weight (lb)" error={errors.currentWeightLbs?.message}>
          <Input type="number" {...register("currentWeightLbs")} placeholder="165" />
        </Field>
        <Field label="Height (in)" error={errors.heightInches?.message}>
          <Input type="number" {...register("heightInches")} placeholder="68" />
        </Field>
        <Field label="Age" error={errors.age?.message}>
          <Input type="number" {...register("age")} placeholder="29" />
        </Field>
        <Field label="Sex (for calorie calc)">
          <Controller
            control={control}
            name="sex"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </section>

      {/* Dietary restrictions */}
      <section className="space-y-3">
        <Label>Dietary restrictions (optional)</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {RESTRICTIONS.map((r) => (
            <label
              key={r.value}
              className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm"
            >
              <Checkbox
                checked={selectedRestrictions?.includes(r.value)}
                onCheckedChange={() => toggleRestriction(r.value)}
              />
              {r.label}
            </label>
          ))}
        </div>
      </section>

      {/* Allergies / dislikes */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Allergies (comma-separated)">
          <Input
            placeholder="peanuts, shellfish"
            onChange={(e) =>
              setValue(
                "allergies",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </Field>
        <Field label="Ingredients you dislike">
          <Input
            placeholder="cilantro, mushrooms"
            onChange={(e) =>
              setValue(
                "dislikedIngredients",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </Field>
      </section>

      {/* Budget */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Weekly grocery budget (USD)" error={errors.weeklyBudgetUsd?.message} required>
          <Input type="number" {...register("weeklyBudgetUsd")} placeholder="120" />
        </Field>
        <Field label="Household size">
          <Input type="number" {...register("householdSize")} placeholder="1" />
        </Field>
      </section>

      <Button type="submit" size="lg"  disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Saving…" : "Build my meal plan"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label} {required && <span className="text-tomato-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-tomato-500">{error}</p>}
    </div>
  );
}
