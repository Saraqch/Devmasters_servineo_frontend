"use client";
import { JobOffer } from "@/app/lib/mock-data";
import { JobOfferCard } from "../Job-offers/Job-offer-card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mockJobOffers } from "@/app/lib/mock-data";

export default function RecentOffersSection() {
  const [recentOffers, setRecentOffers] = useState<JobOffer[]>([]);

  useEffect(() => {
    // Get the 4 most recent offers
    const sortedOffers = [...mockJobOffers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
    setRecentOffers(sortedOffers);
  }, []);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Ofertas Recientes
            </h2>
            <p className="text-lg text-gray-600">
              Descubre las últimas ofertas publicadas
            </p>
          </div>
          <Link 
            href="/ofertas" 
            className="text-primary hover:underline font-medium"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentOffers.map((offer) => (
            <JobOfferCard 
              key={offer.id} 
              offer={offer} 
              showFixerInfo={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}