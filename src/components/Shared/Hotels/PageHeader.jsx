'use client';
import React from 'react';
import { MapPin, Search } from 'lucide-react';
import SearchBar from '../SearchBar/SearchBar';

export default function PageHeader({ t }) {
  return (
    <div className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('Header.title')}</h1>
        <p className="text-blue-200">{t('Header.subtitle')}</p>
        <div className='mt-8'></div>
        <SearchBar/>
      </div>
    </div>
  );
}