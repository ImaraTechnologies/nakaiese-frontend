'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Filter, 
  ChevronDown, 
  Search,
  X,
  Utensils,
  Clock,
  Leaf,
  Grape,
  ChefHat
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl'; 

// --- MOCK DATA: RESTAURANTS ---
const mockRestaurants = [
  {
    id: 1,
    title: "The Rock Restaurant",
    location: "Michamvi Pingwe, Zanzibar",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800",
    rating: 4.7,
    reviews: 850,
    reservation_fee: 15,
    cuisine: "Seafood",
    dietary: ["Gluten Free", "Halal"],
    status: "Open Now",
    tag: "Iconic View"
  },
  {
    id: 2,
    title: "Carnivore Nairobi",
    location: "Nairobi, Kenya",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800",
    rating: 4.5,
    reviews: 1200,
    reservation_fee: 10,
    cuisine: "African BBQ",
    dietary: ["Meat Lovers"],
    status: "Opens 6 PM",
    tag: "Famous"
  },
  {
    id: 3,
    title: "La Mamounia Garden",
    location: "Marrakech, Morocco",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800",
    rating: 4.9,
    reviews: 450,
    reservation_fee: 25,
    cuisine: "Moroccan",
    dietary: ["Vegan Options", "Halal"],
    status: "Open Now",
    tag: "Fine Dining"
  },
  {
    id: 4,
    title: "Cape Town Fish Market",
    location: "Cape Town, South Africa",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd354ca1?auto=format&fit=crop&w=800",
    rating: 4.3,
    reviews: 310,
    reservation_fee: 5,
    cuisine: "Sushi & Seafood",
    dietary: ["Pescatarian"],
    status: "Open Now",
    tag: null
  },
  {
    id: 5,
    title: "Al Chemist Jazz Bar",
    location: "Kampala, Uganda",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800",
    rating: 4.6,
    reviews: 180,
    reservation_fee: 0,
    cuisine: "Fusion",
    dietary: ["Vegetarian Friendly"],
    status: "Opens 5 PM",
    tag: "Nightlife"
  },
  {
    id: 6,
    title: "Le Grand Bleu",
    location: "Nosy Be, Madagascar",
    image: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&w=800",
    rating: 4.8,
    reviews: 95,
    reservation_fee: 20,
    cuisine: "French / Local",
    dietary: ["Organic"],
    status: "Open Now",
    tag: "Ocean View"
  }
];

export default function RestaurantsPage() {
  const t = useTranslations('RestaurantsPage');


  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* --- PAGE HEADER --- */}
      <div className="bg-blue-900 text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('Header.title')}</h1>
          <p className="text-blue-200">{t('Header.subtitle')}</p>
          
          {/* Quick Search */}
          <div className="mt-8 p-2 bg-white rounded-lg shadow-lg max-w-2xl flex flex-col sm:flex-row gap-2">
            <div className="grow flex items-center px-4 bg-gray-50 rounded-md h-12">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder={t('Header.search_placeholder')} 
                className="bg-transparent w-full outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
            <button className="h-12 px-8 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-md transition-colors">
              {t('Header.search_btn')}
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
                <button className="text-sm text-blue-600 hover:underline font-medium">{t('Filters.reset')}</button>
              </div>
              <RestaurantFilterSection t={t} />
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {t('Toolbar.found')} <span className="font-bold text-gray-900">{mockRestaurants.length}</span> {t('Toolbar.places')}
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
                    {t('Toolbar.sort_by')}: {t('Toolbar.sort_options.top_rated')} <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg hidden group-hover:block z-10 p-1">
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{t('Toolbar.sort_options.fee_low')}</div>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{t('Toolbar.sort_options.fee_high')}</div>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{t('Toolbar.sort_options.popular')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} data={restaurant} t={t} />
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
            <RestaurantFilterSection t={t} />
            <div className="mt-8 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800"
              >
                {t('Filters.apply_btn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: Filter Section (Restaurant Specific) ---
const RestaurantFilterSection = ({ t }) => (
  <div className="space-y-8">
    
    {/* Cuisine Type */}
    <div>
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Utensils className="w-4 h-4 text-blue-900" /> {t('Filters.cuisine')}
      </h4>
      <div className="space-y-2">
        {[
          t('Filters.cuisine_labels.local'), 
          t('Filters.cuisine_labels.seafood'),
          t('Filters.cuisine_labels.italian'),
          t('Filters.cuisine_labels.asian'),
          t('Filters.cuisine_labels.steak'),
          t('Filters.cuisine_labels.veg')
        ].map((cuisine, idx) => (
          <label key={idx} className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900" />
            <span className="text-gray-600 group-hover:text-blue-900 text-sm">{cuisine}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Dietary Preferences */}
    <div>
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Leaf className="w-4 h-4 text-green-600" /> {t('Filters.dietary')}
      </h4>
      <div className="flex flex-wrap gap-2">
        {[
          t('Filters.dietary_labels.halal'),
          t('Filters.dietary_labels.vegan'),
          t('Filters.dietary_labels.gluten_free'),
          t('Filters.dietary_labels.kosher')
        ].map((item, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-900 transition-colors">
            {item}
          </span>
        ))}
      </div>
    </div>

    {/* Atmosphere/Vibe */}
    <div>
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Grape className="w-4 h-4 text-purple-600" /> {t('Filters.vibe')}
      </h4>
      <div className="space-y-2">
        {[
          t('Filters.vibe_labels.rooftop'),
          t('Filters.vibe_labels.ocean'),
          t('Filters.vibe_labels.fine_dining'),
          t('Filters.vibe_labels.live'),
          t('Filters.vibe_labels.casual')
        ].map((vibe, idx) => (
          <label key={idx} className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900" />
            <span className="text-gray-600 group-hover:text-blue-900 text-sm">{vibe}</span>
          </label>
        ))}
      </div>
    </div>

  </div>
);

// --- SUB-COMPONENT: Restaurant Card ---
const RestaurantCard = ({ data, t }) => (
  <Link href={`/restaurants/${data.id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
    
    {/* Image Area */}
    <div className="relative h-48 overflow-hidden">
      <Image 
        src={data.image} 
        alt={data.title}
        width={500}
        height={300}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Cuisine Tag */}
      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
        <ChefHat className="w-3 h-3 text-orange-500" />
        {data.cuisine}
      </span>

      {/* Special Badge */}
      {data.tag && (
        <span className="absolute bottom-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
          {data.tag}
        </span>
      )}

      {/* Like Button */}
      <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    {/* Content Area */}
    <div className="p-5 flex flex-col grow">
      
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-900 transition-colors line-clamp-1">
          {data.title}
        </h3>
        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
          <Star className="w-3 h-3 text-green-600 fill-green-600" />
          <span className="text-xs font-bold text-green-800">{data.rating}</span>
        </div>
      </div>

      <div className="flex items-center text-gray-500 text-sm mb-3">
        <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500 shrink-0" />
        <span className="truncate">{data.location}</span>
      </div>

      {/* Info Row: Time & Dietary */}
      <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-xs text-gray-600 border-t border-b border-gray-50 py-3">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className={data.status === "Open Now" ? "text-green-600 font-medium" : "text-orange-600"}>
            {data.status}
          </span>
        </div>
        {data.dietary.slice(0, 2).map((diet, i) => (
           <div key={i} className="flex items-center gap-1">
             <Leaf className="w-3 h-3 text-green-500" /> {diet}
           </div>
        ))}
      </div>

      {/* Footer: Price & Action */}
      <div className="mt-auto flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{t('Card.res_fee')}</span>
          <div>
            {data.reservation_fee === 0 ? (
                <span className="text-lg font-bold text-green-600">{t('Card.free')}</span>
            ) : (
                <span className="text-xl font-bold text-blue-900">${data.reservation_fee}</span>
            )}
          </div>
        </div>
        <button className="px-5 py-2.5 bg-yellow-400 text-blue-900 text-sm font-bold rounded-lg hover:bg-blue-900 hover:text-white transition-all shadow-sm">
          {t('Card.reserve_btn')}
        </button>
      </div>
    </div>
  </Link>
);