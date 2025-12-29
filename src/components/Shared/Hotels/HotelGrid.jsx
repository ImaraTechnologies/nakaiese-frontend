'use client';
import React from 'react';
import { Search } from 'lucide-react';
import HotelCard from './HotelCard';


export default function HotelGrid({ hotels, isLoading, searchParamsString = '', t }) {



  // 1. Initial Loading State (Skeletons)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse border border-gray-100 p-4">
            <div className="h-48 bg-gray-200 rounded-xl mb-4 w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="mt-auto h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (hotels.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No properties found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }

  // 3. Data State
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel.id}
          data={hotel}
          searchParamsString={searchParamsString}
          t={t}
        />))}
    </div>
  );
}