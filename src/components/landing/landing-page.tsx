import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ValueProps } from "@/components/landing/value-props";
import { WhatsappAiSection } from "@/components/landing/whatsapp-ai-section";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ModuleListSection } from "@/components/landing/module-list-section";
import { WhyUs } from "@/components/landing/why-us";
import { CtaSection } from "@/components/landing/cta-section";
import { Faq } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";

export function LandingPage() {
  return (
    <div className="min-h-svh bg-slate-950">
      <LandingNavbar />
      <main>
        <Hero />
        <ValueProps />
        <WhatsappAiSection />
        <FeaturesGrid />
        <HowItWorks />
        <ModuleListSection />
        <WhyUs />
        <CtaSection />
        <Faq />
      </main>
      <LandingFooter />
    </div>
  );
}
