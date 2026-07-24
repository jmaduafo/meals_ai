import Header2 from "@/components/headings/Header2";
import Paragraph from "@/components/headings/Paragraph";
import OnboardingForm from "@/components/pages/onboarding/OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen py-16 max-w-2xl mx-auto">
      <div className="w-full">
        <Paragraph text="Step 1 of 1" className="uppercase" />
        <div className="flex flex-col gap-1 mt-2">
          <Header2 text="Let's set the table" />
          <Paragraph
            text="A few details so every recipe we generate actually fits your goal, diet, and budget."
            className=""
          />
        </div>
        <div className="mt-10">
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
