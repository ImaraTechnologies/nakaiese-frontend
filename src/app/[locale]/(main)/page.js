'use client';

import React from 'react';
import { Link } from '@/i18n/routing'; 


import PropertyCard from '@/components/Shared/Card/Card';
import Carousel from "@/components/Shared/Carousal/Carousal";
import Container from "@/components/Shared/Container/Container";
import Explorer from "@/components/Shared/Explorer/Explorer";
import { Hero } from "@/components/Shared/Hero/Hero";
import SignInBanner from "@/components/Shared/SignInBanner/SignInBanner";
import WhyChooseUs from "@/components/Shared/WhyChooseUs/WhyChooseUs";
import Testimonials from "@/components/Shared/Testimonials/Testimonials";
import Newsletter from "@/components/Shared/Newsletter/Newsletter";

// --- MOCK DATA: DESTINATIONS ---
const destinationItems = [
  { name: "Zanzibar", image: "https://images.unsplash.com/photo-1539650116455-8efdbcc6c588?auto=format&fit=crop&w=800" },
  { name: "Cape Town", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e27?auto=format&fit=crop&w=800" },
  { name: "Serengeti", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800" },
  { name: "Marrakech", image: "https://images.unsplash.com/photo-1597213253723-6b7470f7d549?auto=format&fit=crop&w=800" },
  { name: "Cairo", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800" },
];

// --- MOCK DATA: PROPERTIES ---
export const mockProperties = [
  // HOTELS
  {
    type: "room",
    data: {
      room_id: 101,
      title: "Royal Serengeti Suite",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800",
      price: "450.00",
      capacity: 2,
      is_booked: false,
      avg_rating: 4.9,
      bed_type: "King Size",
      hotel: { id: 1, name: "Zanzibar Serena Hotel", rating: 4.8, review_count: 124, city: { name: "Stone Town" }, country: "Tanzania" }
    }
  },
  {
    type: "room",
    data: {
      room_id: 204,
      title: "Standard Twin Room",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800",
      price: "85.00",
      capacity: 2,
      is_booked: false,
      avg_rating: 4.2,
      bed_type: "Twin",
      hotel: { id: 2, name: "Safari Lodge Arusha", rating: 4.1, review_count: 45, city: { name: "Arusha" }, country: "Tanzania" }
    }
  },
  {
    type: "room",
    data: {
      room_id: 305,
      title: "Ocean View Villa",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800",
      price: "320.00",
      capacity: 4,
      is_booked: true,
      avg_rating: 4.7,
      bed_type: "Queen",
      hotel: { id: 3, name: "Blue Bay Resort", rating: 4.5, review_count: 88, city: { name: "Zanzibar" }, country: "Tanzania" }
    }
  },
  {
    type: "room",
    data: {
      room_id: 401,
      title: "Penthouse Suite",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800",
      price: "600.00",
      capacity: 2,
      is_booked: false,
      avg_rating: 5.0,
      bed_type: "King",
      hotel: { id: 4, name: "The Grand Cairo", rating: 4.9, review_count: 200, city: { name: "Cairo" }, country: "Egypt" }
    }
  },

  // RESTAURANTS
  {
    type: "table",
    data: {
      table_id: 55,
      table_number: "T-12 (VIP)",
      images: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800",
      reservation_fee: "15.00", 
      capacity: 4,
      is_booked: true,
      avg_rating: 4.6,
      location_type: "Rooftop",
      restaurant: { id: 5, name: "The Rock Restaurant", rating: 4.7, review_count: 850, city: { name: "Michamvi Pingwe" }, country: "Tanzania" }
    }
  },
  {
    type: "table",
    data: {
      table_id: 60,
      table_number: "Patio-5",
      images: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800",
      reservation_fee: "0.00", 
      capacity: 6,
      is_booked: false,
      avg_rating: 4.4,
      location_type: "Patio",
      restaurant: { id: 6, name: "Carnivore Nairobi", rating: 4.5, review_count: 520, city: { name: "Nairobi" }, country: "Kenya" }
    }
  },
  {
    type: "table",
    data: {
      table_id: 72,
      table_number: "Window-2",
      images: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&w=800",
      reservation_fee: "10.00", 
      capacity: 2,
      is_booked: false,
      avg_rating: 4.8,
      location_type: "Window Side",
      restaurant: { id: 7, name: "La Mamounia", rating: 4.9, review_count: 1050, city: { name: "Marrakech" }, country: "Morocco" }
    }
  },
  {
    type: "table",
    data: {
      table_id: 88,
      table_number: "Booth-1",
      images: "https://images.unsplash.com/photo-1551632436-cbf8dd354ca1?auto=format&fit=crop&w=800",
      reservation_fee: "5.00", 
      capacity: 4,
      is_booked: false,
      avg_rating: 4.3,
      location_type: "Private Booth",
      restaurant: { id: 8, name: "Cape Town Fish Market", rating: 4.2, review_count: 310, city: { name: "Cape Town" }, country: "South Africa" }
    }
  },
];

export default function Home() {
  const hotelItems = mockProperties.filter(p => p.type === 'room');
  const restaurantItems = mockProperties.filter(p => p.type === 'table');

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
            
            {/* 2. FIXED: Replaced <a> with <Link> */}
            <Link href="/hotels" className="text-blue-600 font-semibold hover:underline">
              View All Hotels &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {hotelItems.map((item, index) => (
              <PropertyCard 
                key={`hotel-${index}`} 
                type={item.type} 
                data={item.data} 
              />
            ))}
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
            
            {/* 3. FIXED: Replaced <a> with <Link> */}
            <Link href="/restaurants" className="text-blue-600 font-semibold hover:underline">
              View All Restaurants &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {restaurantItems.map((item, index) => (
              <PropertyCard 
                key={`restaurant-${index}`} 
                type={item.type} 
                data={item.data} 
              />
            ))}
          </div>
        </Container>
      </section>

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