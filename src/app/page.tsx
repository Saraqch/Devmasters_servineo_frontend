// src/app/page.tsx
'use client';
import HeroSection from '@/components/Home/Hero-section';
import ServicesSection from '@/components/Home/Services-section';
import HowItWorksSection from '@/components/Home/HowItWorks-section';

import CTASection from '@/components/Home/CTA-section';
import MapSection from '@/components/Home/Map-section';
import InspirationSection from '@/components/Home/Inspiration-section';
import RecentOffersSection from '@/components/Home/RecentOffer-secction';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <MapSection />
          <InspirationSection />
          <RecentOffersSection />
        </div>
      </section>

      <ServicesSection />
      <HowItWorksSection />

      <CTASection />
    </div>
  );
}
