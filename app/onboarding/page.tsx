import OnboardingForm  from "@/components/pages/onboarding/OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-paper py-16">
      <div className="container-app max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-sage-600">Step 1 of 1</p>
        <h1 className="mt-2 font-display text-3xl">Let's set the table</h1>
        <p className="mt-2 text-ink/70">
          A few details so every recipe we generate actually fits your goal, diet, and budget.
        </p>
        <div className="mt-10">
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
