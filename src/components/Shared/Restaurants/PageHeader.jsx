'use client';
import React from 'react';
import { Search } from 'lucide-react';

export default function PageHeader({ t }) {
  return (
    <div className="bg-blue-900 text-white py-12 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>

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
  );
}