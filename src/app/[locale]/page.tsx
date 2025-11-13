
"use client";
import HeroSection from "@/components/Home/Hero-section";
import ServicesSection from "@/components/Home/Services-section";
import HowItWorksSection from "@/components/Home/HowItWorks-section";
import CTASection from "@/components/Home/CTA-section";
import MapSection from "@/components/Home/Map-section";
import InspirationSection from "@/components/Home/Inspiration-section";
// RecentOfferCard requiere una prop `offer` con datos; se comenta temporalmente
// para evitar añadir lógica o mocks en este archivo de alto impacto.
import FooterSection from "@/components/Footer";


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <MapSection />
          <InspirationSection />
          {/* <RecentOfferCard /> */}
        </div>
      </section>

      <ServicesSection />
      <HowItWorksSection />
      
      <CTASection />
      <FooterSection />
    </div>
  );
}
