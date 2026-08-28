import { CtaSection } from "@/components/landing/CtaSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { TrustSection } from "@/components/landing/TrustSection";

export default function LandingPage() {
  return (
    <div className="bg-mist text-ink">
      <LandingNav />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <FeaturesSection />
        <TrustSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
