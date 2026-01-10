'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, Calendar, Users, ArrowRight, Star, Globe, Info, 
  Thermometer, Languages, Coins, ChevronRight 
} from 'lucide-react';

// --- 1. DUMMY DATA GENERATOR ---
const getDummyCity = (locale = 'en') => {
  const isFr = locale === 'fr';

  return {
    id: "uuid-123",
    name: "Touba",
    slug: "touba",
    country: { name: isFr ? "Sénégal" : "Senegal", code: "SN" },
    featured_image: "https://images.unsplash.com/photo-1544237243-7bb2217cb099?q=80&w=1920&auto=format&fit=crop",
    stats: { properties: 142, rating: 4.8, visitors: "12k+" },
    description: isFr ? `
      <p class="mb-4 text-lg leading-relaxed text-slate-600"><strong>Touba</strong> est bien plus qu'une ville ; c'est le cœur spirituel du Sénégal. Fondée en 1887 par Cheikh Ahmadou Bamba, elle est aujourd'hui l'une des villes les plus importantes et les plus visitées d'Afrique de l'Ouest.</p>
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2"><span class="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>Pourquoi visiter ?</h3>
      <ul class="grid gap-3 mb-6">
        <li class="flex gap-3 items-start"><span class="text-blue-500 mt-1">●</span> La Grande Mosquée de Touba, un chef-d'œuvre architectural.</li>
        <li class="flex gap-3 items-start"><span class="text-blue-500 mt-1">●</span> L'atmosphère paisible et spirituelle unique.</li>
        <li class="flex gap-3 items-start"><span class="text-blue-500 mt-1">●</span> Le Grand Magal, un pèlerinage annuel rassemblant des millions de fidèles.</li>
      </ul>
      <p class="text-slate-600 leading-relaxed">Que vous soyez en quête de spiritualité ou de découverte culturelle, Touba offre une expérience inoubliable avec ses marchés vibrants et son hospitalité légendaire.</p>
    ` : `
      <p class="mb-4 text-lg leading-relaxed text-slate-600"><strong>Touba</strong> is more than just a city; it is the spiritual heart of Senegal. Founded in 1887 by Cheikh Ahmadou Bamba, it is today one of the most significant and visited cities in West Africa.</p>
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2"><span class="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>Why Visit?</h3>
      <ul class="grid gap-3 mb-6">
        <li class="flex gap-3 items-start"><span class="text-blue-500 mt-1">●</span> The Great Mosque of Touba, an architectural masterpiece.</li>
        <li class="flex gap-3 items-start"><span class="text-blue-500 mt-1">●</span> The unique peaceful and spiritual atmosphere.</li>
        <li class="flex gap-3 items-start"><span class="text-blue-500 mt-1">●</span> The Grand Magal, an annual pilgrimage gathering millions.</li>
      </ul>
      <p class="text-slate-600 leading-relaxed">Whether you are seeking spirituality or cultural discovery, Touba offers an unforgettable experience with its vibrant markets and legendary hospitality.</p>
    `,
    weather: { temp: 32, condition: isFr ? "Ensoleillé" : "Sunny" },
    currency: "XOF (CFA)",
    language: isFr ? "Wolof, Français" : "Wolof, French"
  };
};

const mockProperties = [
  { id: 1, title: "Savanna Camp Touba", price: 85, rating: 4.8, reviews: 120, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Hotel Al-Maktoum", price: 120, rating: 4.5, reviews: 85, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Résidence Cheikh", price: 60, rating: 4.2, reviews: 45, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" },
];

const translations = {
  en: { about: "About", places: "Popular Stays", view_all: "View All", from: "From", per_night: "/night", facts: "City Guide", currency: "Currency", language: "Language", weather: "Weather", book: "Book", map: "View on Map" },
  fr: { about: "À propos de", places: "Séjours Populaires", view_all: "Tout voir", from: "Dès", per_night: "/nuit", facts: "Guide Ville", currency: "Devise", language: "Langue", weather: "Météo", book: "Réserver", map: "Voir la carte" }
};

// --- 2. COMPONENTS ---

const CityHeader = ({ city }) => (
  <div className="relative h-[60vh] min-h-[450px] w-full bg-slate-900 overflow-hidden">
    <Image
      src={city.featured_image}
      alt={city.name}
      fill
      className="object-cover opacity-90"
      priority
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
          <span className="text-sm font-medium">{city.stats.rating} ({city.stats.visitors})</span>
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

const PropertyCard = ({ prop, t }) => (
  <Link href={`/properties/${prop.id}`} className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300">
    <div className="relative h-56 w-full overflow-hidden">
      <Image 
        src={prop.image} 
        alt={prop.title} 
        fill 
        className="object-cover group-hover:scale-105 transition-transform duration-700" 
      />
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm shadow-sm rounded-full px-2.5 py-1 text-xs font-bold flex items-center gap-1 text-slate-800">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {prop.rating}
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-bold text-lg text-slate-900 mb-1 leading-snug group-hover:text-blue-600 transition-colors">
        {prop.title}
      </h3>
      <p className="text-slate-500 text-xs mb-4">{prop.reviews} {t.reviews || "reviews"}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400 font-medium">{t.from}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900">${prop.price}</span>
            <span className="text-xs text-slate-500">{t.per_night}</span>
          </div>
        </div>
        <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  </Link>
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

// --- 3. MAIN PAGE ---

export default function CityDetailPage({ params }) {
  const locale = params?.locale || 'en';
  const t = translations[locale] || translations.en;
  
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCity = async () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setCity(getDummyCity(locale));
        setLoading(false);
      }, 600);
    };
    fetchCity();
  }, [locale]);

  if (loading) return <SkeletonPage />;
  if (!city) return null;

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
                  <p className="text-slate-500 text-sm mt-1">Highly rated by recent travelers</p>
                </div>
                <Link href={`/search?city=${city.id}`} className="hidden sm:flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
                  {t.view_all} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mockProperties.map((prop) => (
                  <PropertyCard key={prop.id} prop={prop} t={t} />
                ))}
              </div>
              
              <div className="mt-6 sm:hidden">
                <Link href={`/search?city=${city.id}`} className="flex w-full items-center justify-center gap-2 bg-white border border-slate-300 py-3 rounded-xl text-slate-700 font-semibold text-sm">
                  {t.view_all}
                </Link>
              </div>
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