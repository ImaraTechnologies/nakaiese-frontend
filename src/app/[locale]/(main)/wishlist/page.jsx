'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl'; 
import PropertyShowcaseCard from '@/components/Shared/PropertyShowcaseCard/PropertyShowcaseCard';
import Container from '@/components/Shared/Container/Container';

// --- MOCK WISHLIST DATA ---
const initialWishlist = [
  {
    id: 1,
    title: "Zanzibar Serena Hotel",
    property_type: "HL",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800",
    rating: 4.8,
    review_count: 124,
    min_price: "250",
    location: { city: "Stone Town", country: "Tanzania" }
  },
  {
    id: 5,
    title: "The Rock Restaurant",
    property_type: "RT",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800",
    rating: 4.7,
    review_count: 850,
    min_price: "45",
    location: { city: "Michamvi Pingwe", country: "Tanzania" }
  },
  {
    id: 3,
    title: "Blue Bay Resort",
    property_type: "HL",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800",
    rating: 4.5,
    review_count: 88,
    min_price: "150",
    location: { city: "Zanzibar", country: "Tanzania" }
  }
];

export default function WishlistPage() {
  const t = useTranslations('WishlistPage');


  const [items, setItems] = useState(initialWishlist);

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 shadow-sm py-12">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" /> 
                {t('Header.title')}
              </h1>
              <p className="text-gray-500 mt-2">
                {t('Header.subtitle', { count: items.length })}
              </p>
            </div>
            
            {/* Optional Actions */}
            {items.length > 0 && (
              <button 
                onClick={() => setItems([])} 
                className="text-sm text-gray-400 hover:text-red-600 transition-colors font-medium"
              >
                {t('Header.clear_all')}
              </button>
            )}
          </div>
        </Container>
      </div>

      {/* --- CONTENT --- */}
      <Container>
        <div className="py-12 px-4">
          
          {items.length === 0 ? (
            
            // --- EMPTY STATE ---
            <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('EmptyState.title')}</h2>
              <p className="text-gray-500 max-w-md mb-8">
                {t('EmptyState.message')}
              </p>
              <Link 
                href="/" 
                className="px-8 py-3 bg-blue-900 text-white font-bold rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-all flex items-center gap-2"
              >
                {t('EmptyState.button')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          ) : (

            // --- GRID STATE ---
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="relative group/card">
                  {/* Reuse the Professional Card */}
                  <PropertyShowcaseCard data={item} />
                  
                  {/* Remove Button Overlay */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(item.id);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50 transition-colors"
                    title={t('Actions.remove_tooltip')}
                  >
                     <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>

          )}
        </div>
      </Container>
    </div>
  );
}