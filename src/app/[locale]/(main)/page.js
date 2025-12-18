'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useProperties } from '@/hooks/useProperties';

import PropertyCard from '@/components/Shared/Card/Card'; // Ensure this path matches your file structure
import Carousel from "@/components/Shared/Carousal/Carousal";
import Container from "@/components/Shared/Container/Container";
import Explorer from "@/components/Shared/Explorer/Explorer";
import { Hero } from "@/components/Shared/Hero/Hero";
import SignInBanner from "@/components/Shared/SignInBanner/SignInBanner";
import WhyChooseUs from "@/components/Shared/WhyChooseUs/WhyChooseUs";
import Testimonials from "@/components/Shared/Testimonials/Testimonials";
import Newsletter from "@/components/Shared/Newsletter/Newsletter";
import { FullPageSpinner } from '@/components/ui/Spinner/Spinner';

// Keep destinations static for now (or move to a config file)
const destinationItems = [
  { name: "Zanzibar", image: "/banner.jpg" },
  { name: "Cape Town", image: "/banner.jpg" },
  { name: "Serengeti", image: "/banner.jpg" },
  { name: "Marrakech", image: "/banner.jpg" },
  { name: "Cairo", image: "/banner.jpg" },
];

export default function Home() {

  // 1. Fetch Hotels
  const {
    data: hotelsData,
    isLoading: hotelsLoading,
    isError: hotelsError
  } = useProperties({ page: 1, property_type: 'HL' });

  // 2. Fetch Restaurants
  const {
    data: restaurantsData,
    isLoading: restaurantsLoading,
    isError: restaurantsError
  } = useProperties({ page: 1, property_type: 'RT' });


  // 3. Combined Loading/Error State
  // In a real app, you might want to show skeletons for each section independently
  if (hotelsLoading || restaurantsLoading) {
    return (
      <FullPageSpinner/>
    );
  }

  if (hotelsError || restaurantsError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">Unable to load properties. Please try again later.</div>
      </div>
    );
  }

  return (
    <>
      <Hero />

      <Container>
        <Explorer />
      </Container>

      {/* --- SECTION 1: HOTELS --- */}
      <section className="py-12 bg-gray-50/50">
        <Container>
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 px-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Hotels</h2>
              <p className="text-gray-500 mt-2">Luxurious stays for your perfect getaway.</p>
            </div>

            <Link href="/hotels" className="text-blue-600 font-semibold hover:underline">
              View All Hotels &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {/* SAFEGUARD: API pagination puts data in 'results'. 
               We slice(0, 4) to only show the top 4 on the homepage.
            */}
            {hotelsData?.pages[0]?.results?.slice(0, 4).map((item) => (
              <PropertyCard
                key={item.id}
                data={item} // Pass the raw API object
              />
            ))}

            {/* Fallback if no data */}
            {hotelsData?.pages[0]?.results.length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-10">No hotels found.</p>
            )}
          </div>
        </Container>
      </section>

      {/* --- SECTION 2: RESTAURANTS --- */}
      <section className="py-12 bg-white">
        <Container>
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 px-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Top Rated Dining</h2>
              <p className="text-gray-500 mt-2">Book the best tables in town.</p>
            </div>

            <Link href="/restaurants" className="text-blue-600 font-semibold hover:underline">
              View All Restaurants &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {restaurantsData?.pages[0]?.results.slice(0, 4).map((item) => (
              <PropertyCard
                key={item.id}
                data={item}
              />
            ))}

            {restaurantsData?.pages[0]?.results.length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-10">No restaurants found.</p>
            )}
          </div>
        </Container>
      </section>

      {/* --- SECTION 3: DESTINATIONS (Static) --- */}
      <section className="py-12">
        <Container>
          <div className="px-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Discover Africa</h2>
            <p className="text-gray-500 mt-2">Explore popular destinations across the continent.</p>
          </div>
          <Carousel items={destinationItems} />
        </Container>
      </section>

      <Container>
        <WhyChooseUs />
      </Container>

      <Container>
        <div className="py-8">
          <SignInBanner />
        </div>
      </Container>

      <Container>
        <Testimonials />
      </Container>

      <Container>
        <Newsletter />
      </Container>
    </>
  );
}