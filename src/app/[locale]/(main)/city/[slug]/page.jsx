'use client';

import React, { use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, Star, Globe, Info, Thermometer, 
  Languages, Coins, ChevronRight, AlertCircle 
} from 'lucide-react';

// Hooks & Components
import { useCityById } from '@/hooks/useCities';
import PropertyCard from '@/components/Shared/Card/Card'; // Adjust path as needed

// --- 1. DATA NORMALIZATION LAYER ---
// This ensures your UI never crashes even if the API sends null/missing fields
const normalizeCityData = (apiData, locale) => {
  if (!apiData) return null;

  const isFr = locale === 'fr';

  return {
    id: apiData.id,
    name: apiData.name || "Unknown City",
    country: { 
      name: apiData.country || "Unknown Country", 
      // If backend doesn't send code, fallback safely
      code: "N/A" 
    },
    // Safe Image Handling (Backend URL vs Absolute URL)
    featured_image: apiData.featured_image 
      ? (apiData.featured_image.startsWith('http') 
          ? apiData.featured_image 
          : `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL || ''}${apiData.featured_image}`)
      : "/placeholder-city.jpg",
    
    // Stats (Use real length if available, else 0)
    stats: { 
      properties: apiData.properties?.length || 0, 
      rating: 4.8, // Hardcoded if backend doesn't provide aggregate rating
      visitors: "12k+" // Marketing placeholder
    },
    
    // HTML Description (Sanitized in production usually, strictly mapped here)
    description: apiData.description || (isFr ? "Aucune description disponible." : "No description available."),
    
    // Placeholders for data not yet in your API
    weather: { temp: 30, condition: isFr ? "Ensoleillé" : "Sunny" },
    currency: "USD",
    language: isFr ? "Français" : "English",
    
    // The properties array for the grid
    properties: Array.isArray(apiData.properties) ? apiData.properties : []
  };
};

// --- 2. SUB-COMPONENTS ---

const CityHeader = ({ city }) => (
  <div className="relative h-[60vh] min-h-[450px] w-full bg-slate-900 overflow-hidden">
    <Image
      src={city.featured_image}
      alt={city.name}
      fill
      className="object-cover opacity-90"
      priority
      // Fix for localhost development
      unoptimized={process.env.NODE_ENV === 'development'}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
    
    <div className="absolute inset-0 flex flex-col justify-end pb-12 sm:pb-16 px-4 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-blue-200/90 font-medium tracking-wide uppercase text-xs mb-3 animate-fade-in-up">
        <Globe className="w-3.5 h-3.5" />
        <span>{city.country.name}</span>
        <ChevronRight className="w-3 h-3 text-white/40" />
        <span className="text-white">{city.name}</span>
      </div>
      
      {/* Title */}
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-fade-in-up delay-100">
        {city.name}
      </h1>

      {/* Stats Badges */}
      <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white/90">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">{city.stats.properties} Properties</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white/90">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{city.stats.rating}</span>
        </div>
      </div>
    </div>
  </div>
);

const FactCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:border-blue-100 hover:bg-blue-50/30">
    <div className="w-10 h-10 rounded-full bg-white shadow-sm text-blue-600 flex items-center justify-center shrink-0 border border-slate-100">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

const SkeletonPage = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="h-[60vh] bg-slate-200 w-full animate-pulse" />
    <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-64 bg-white rounded-2xl w-full animate-pulse" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="h-72 bg-white rounded-2xl animate-pulse" />
          <div className="h-72 bg-white rounded-2xl animate-pulse" />
        </div>
      </div>
      <div className="hidden lg:block h-96 bg-white rounded-2xl animate-pulse" />
    </div>
  </div>
);

const ErrorState = ({ message }) => (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Could not load city</h2>
        <p className="text-slate-500">{message}</p>
        <Link href="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Go Home
        </Link>
    </div>
);

// --- 3. MAIN PAGE COMPONENT ---

export default function CityDetailPage({ params }) {
  // 1. Unwrap params (Next.js 15)
  // Assuming the route is [slug], but we treat it as an ID or Slug depending on API
  const { slug, locale = 'en' } = use(params);

  // 2. Fetch Data using React Query Hook
  // We pass 'slug' (which might be the UUID if your URL is /city/uuid-123)
  const { data: apiData, isLoading, isError, error } = useCityById(slug);

  // 3. Optimize Data Processing
  // useMemo prevents re-calculating the object on every render
  const city = useMemo(() => normalizeCityData(apiData, locale), [apiData, locale]);

  // 4. Loading & Error States
  if (isLoading) return <SkeletonPage />;
  if (isError) return <ErrorState message={error?.message || "Something went wrong"} />;
  if (!city) return <ErrorState message="City not found" />;

  // Translations Map (Simple version)
  const t = {
    about: locale === 'fr' ? "À propos de" : "About",
    places: locale === 'fr' ? "Séjours Populaires" : "Popular Stays",
    view_all: locale === 'fr' ? "Tout voir" : "View All",
    facts: locale === 'fr' ? "Guide Ville" : "City Guide",
    language: locale === 'fr' ? "Langue" : "Language",
    currency: locale === 'fr' ? "Devise" : "Currency",
    weather: locale === 'fr' ? "Météo" : "Weather",
    map: locale === 'fr' ? "Voir la carte" : "View on Map",
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      <CityHeader city={city} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* About Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 md:p-10 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{t.about} {city.name}</h2>
              </div>
              <div 
                className="prose prose-slate prose-headings:font-bold prose-p:text-slate-600 prose-li:text-slate-600 max-w-none"
                dangerouslySetInnerHTML={{ __html: city.description }} 
              />
            </div>

            {/* Properties Grid */}
            <div id="stays">
              <div className="flex items-end justify-between mb-6 px-1">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{t.places} {city.name}</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {city.stats.properties} properties available
                  </p>
                </div>
              </div>

              {city.properties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {city.properties.map((prop) => (
                      <div key={prop.id} className="h-[400px]">
                         {/* INTEGRATION: Using the Reusable PropertyCard */}
                         <PropertyCard data={prop} />
                      </div>
                    ))}
                  </div>
              ) : (
                  <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                      <p className="text-slate-500">No properties found in this city yet.</p>
                  </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6 sticky top-24 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {t.facts}
              </h3>
              
              <div className="space-y-3">
                <FactCard icon={Languages} label={t.language} value={city.language} />
                <FactCard icon={Coins} label={t.currency} value={city.currency} />
                <FactCard icon={Thermometer} label={t.weather} value={`${city.weather.temp}°C • ${city.weather.condition}`} />
              </div>

              {/* Map Widget */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden group cursor-pointer border border-slate-200">
                  <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-blue-900/5 group-hover:bg-blue-900/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white/90 backdrop-blur text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 group-hover:scale-105 transition-all">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {t.map}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}