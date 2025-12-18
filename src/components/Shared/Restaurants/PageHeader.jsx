'use client';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';

export default function PageHeader({ t }) {
  return (
    <div className="bg-blue-900 text-white py-12 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('Header.title')}</h1>
        <p className="text-blue-200">{t('Header.subtitle')}</p>

        <div className='mt-8'></div>
        <SearchBar />
      </div>

    </div>
  );
}