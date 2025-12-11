'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Filter, 
  ChevronDown, 
  Search,
  X,
  Wifi,
  Coffee,
  Waves,
  Car,
  Check
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl'; 

// --- MOCK DATA ---
const mockHotels = [
  {
    id: 1,
    title: "Zanzibar Serena Hotel",
    location: "Stone Town, Tanzania",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800",
    rating: 4.8,
    reviews: 320,
    price: 250,
    amenities: ["Free WiFi", "Ocean View", "Spa"],
    tag: "Best Seller"
  },
  {
    id: 2,
    title: "The Silo Hotel",
    location: "Cape Town, South Africa",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800",
    rating: 4.9,
    reviews: 150,
    price: 550,
    amenities: ["Rooftop Bar", "Pool", "Gym"],
    tag: "Luxury"
  },
  {
    id: 3,
    title: "Giraffe Manor",
    location: "Nairobi, Kenya",
    image: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800",
    rating: 5.0,
    reviews: 890,
    price: 900,
    amenities: ["Wildlife", "Breakfast", "Transfer"],
    tag: "Unique Stay"
  },
  {
    id: 4,
    title: "La Mamounia",
    location: "Marrakech, Morocco",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800",
    rating: 4.7,
    reviews: 410,
    price: 420,
    amenities: ["Gardens", "Hammam", "Tennis"],
    tag: null
  },
  {
    id: 5,
    title: "Four Seasons Cairo",
    location: "Cairo, Egypt",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800",
    rating: 4.6,
    reviews: 215,
    price: 310,
    amenities: ["Nile View", "Pool", "Dining"],
    tag: "Popular"
  },
  {
    id: 6,
    title: "Constance Ephelia",
    location: "Mahé, Seychelles",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800",
    rating: 4.8,
    reviews: 500,
    price: 600,
    amenities: ["Beachfront", "Diving", "Kids Club"],
    tag: "Resort"
  }
];

export default function HotelsPage() {
  const t = useTranslations('HotelsPage');


  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* --- PAGE HEADER --- */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('Header.title')}</h1>
          <p className="text-blue-200">{t('Header.subtitle')}</p>
          
          {/* Quick Search Bar */}
          <div className="mt-8 p-2 bg-white rounded-lg shadow-lg max-w-2xl flex flex-col sm:flex-row gap-2">
            <div className="grow flex items-center px-4 bg-gray-50 rounded-md h-12">
              <MapPin className="text-gray-400 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder={t('Header.search_placeholder')}
                className="bg-transparent w-full outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
            <button className="h-12 px-8 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-md transition-colors flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> {t('Header.search_btn')}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* --- SIDEBAR FILTERS (Desktop) --- */}
          <aside className="hidden lg:block w-1/4 min-w-[280px]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">{t('Filters.title')}</h3>
                <span className="text-sm text-blue-600 cursor-pointer hover:underline">{t('Filters.reset')}</span>
              </div>
              
              <FilterSection t={t} />
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {t('Toolbar.showing')} <span className="font-bold text-gray-900">{mockHotels.length}</span> {t('Toolbar.properties')}
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" /> {t('Toolbar.filters_btn')}
                </button>

                <div className="relative group">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                    {t('Toolbar.sort_by')}: {t('Toolbar.sort_options.recommended')} <ChevronDown className="w-4 h-4" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg hidden group-hover:block z-10 p-1">
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{t('Toolbar.sort_options.price_low')}</div>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{t('Toolbar.sort_options.price_high')}</div>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{t('Toolbar.sort_options.top_rated')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockHotels.map((hotel) => (
                <HotelCard key={hotel.id} data={hotel} t={t} />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors">
                {t('load_more')}
              </button>
            </div>

          </main>
        </div>
      </div>

      {/* --- MOBILE FILTER DRAWER --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">{t('Filters.title')}</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <FilterSection t={t} />
            <div className="mt-8 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800"
              >
                {t('Filters.show_results')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: Filter Section ---
const FilterSection = ({ t }) => (
  <div className="space-y-8">
    
    {/* Price Range */}
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">{t('Filters.price_range')}</h4>
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 w-1/2">
          <span className="text-xs text-gray-500 block">{t('Filters.min')}</span>
          <span className="font-medium">$50</span>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 w-1/2">
          <span className="text-xs text-gray-500 block">{t('Filters.max')}</span>
          <span className="font-medium">$1500+</span>
        </div>
      </div>
      <input type="range" className="w-full accent-blue-900 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
    </div>

    {/* Amenities */}
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">{t('Filters.amenities')}</h4>
      <div className="space-y-3">
        {[
          { icon: Wifi, label: t('Filters.amenity_labels.wifi') },
          { icon: Waves, label: t('Filters.amenity_labels.pool') },
          { icon: Coffee, label: t('Filters.amenity_labels.breakfast') },
          { icon: Car, label: t('Filters.amenity_labels.parking') },
        ].map((item, idx) => (
          <label key={idx} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input type="checkbox" className="peer w-5 h-5 border-2 border-gray-300 rounded checked:bg-blue-900 checked:border-blue-900 transition-colors appearance-none" />
              <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </div>
            <span className="text-gray-600 group-hover:text-blue-900 text-sm flex items-center gap-2">
              <item.icon className="w-4 h-4 text-gray-400" /> {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Star Rating */}
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">{t('Filters.star_rating')}</h4>
      <div className="flex flex-col gap-2">
        {[5, 4, 3].map((star) => (
          <label key={star} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="stars" className="w-4 h-4 text-blue-900 border-gray-300 focus:ring-blue-900" />
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-auto">{star} {t('Filters.stars_label')}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

// --- SUB-COMPONENT: Hotel Card ---
const HotelCard = ({ data, t }) => (
  <Link href={`/hotels/${data.id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
    
    {/* Image Area */}
    <div className="relative h-48 overflow-hidden">
      <Image 
        src={data.image} 
        alt={data.title}
        width={500}
        height={300}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Badges */}
      {data.tag && (
        <span className="absolute top-3 left-3 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {data.tag}
        </span>
      )}
      <button className="absolute top-3 right-3 p-2 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    {/* Content Area */}
    <div className="p-5 flex flex-col grow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-900 transition-colors line-clamp-1">{data.title}</h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
            <span className="truncate max-w-[150px]">{data.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-sm font-bold text-blue-900">{data.rating}</span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1">{data.reviews} {t('Card.reviews')}</span>
        </div>
      </div>

      {/* Amenities Preview */}
      <div className="flex flex-wrap gap-2 mb-4 mt-2">
        {data.amenities.slice(0, 3).map((am, i) => (
          <span key={i} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            {am}
          </span>
        ))}
      </div>

      {/* Price & Action */}
      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 uppercase font-semibold">{t('Card.starts_from')}</span>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-blue-900">${data.price}</span>
            <span className="text-sm text-gray-500 ml-1">{t('Card.per_night')}</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-yellow-400 hover:text-blue-900 transition-colors">
          {t('Card.view_details')}
        </button>
      </div>
    </div>
  </Link>
);