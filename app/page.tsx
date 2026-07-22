import LandingContainer from "@/components/containers/LandingContainer";
import Features from "@/components/pages/landing/Features";
import Hero from "@/components/pages/landing/Hero";
import Pricing from "@/components/pages/landing/Pricing";

export default function Home() {
  return (
    <LandingContainer>
      <Hero/>
      <Features/>
      <Pricing/>
    </LandingContainer>
  );
}
