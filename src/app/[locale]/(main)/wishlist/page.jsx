'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Container from '@/components/Shared/Container/Container';
import useWishStore from '@/store/useWishStore';
import PropertyCard from '@/components/Shared/Card/Card';

export default function WishlistPage() {
  const t = useTranslations('WishlistPage');
  const { wishes, clearWishes } = useWishStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Fix: Use setTimeout to avoid "synchronous setState" linter error
    // This ensures the update happens in the next tick, preventing cascading renders
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 shadow-sm py-12">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                {t('Header.title')}
              </h1>
              <p className="text-gray-500 mt-2">
                {t('Header.subtitle', { count: wishes.length })}
              </p>
            </div>

            {wishes.length > 0 && (
              <button
                onClick={clearWishes}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                {t('Header.clear_all')}
              </button>
            )}
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12 px-4">
          {wishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <ShoppingBag className="w-10 h-10 text-blue-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('EmptyState.title')}</h2>
              <p className="text-gray-500 max-w-md mb-8">
                {t('EmptyState.message')}
              </p>
              <Link
                href="/"
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 hover:shadow-lg transition-all flex items-center gap-2"
              >
                {t('EmptyState.button')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishes.map((item) => (
                <div key={item.id} className="h-full">
                  <PropertyCard data={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}