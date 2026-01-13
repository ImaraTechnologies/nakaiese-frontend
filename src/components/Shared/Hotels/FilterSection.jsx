'use client';
import React from 'react';
import {HOTEL_BACKEND_AMENITIES as BACKEND_AMENITIES} from '@/constants/filters';
import { Check, Star } from 'lucide-react';

export default function FilterSection({ t }) {
  return (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">{t('Filters.price_range')}</h4>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 w-1/2">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t('Filters.min')}</span>
            <span className="font-medium text-gray-900 block">$50</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 w-1/2">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t('Filters.max')}</span>
            <span className="font-medium text-gray-900 block">$1500+</span>
          </div>
        </div>
        <input type="range" className="w-full accent-blue-900 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">{t('Filters.amenities')}</h4>
        <div className="space-y-3">
          {BACKEND_AMENITIES.map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-lg -mx-1.5 transition-colors">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  value={item.value} 
                  className="peer w-5 h-5 border-2 border-gray-300 rounded checked:bg-blue-900 checked:border-blue-900 transition-colors appearance-none" 
                />
                <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <span className="text-gray-600 group-hover:text-blue-900 text-sm flex items-center gap-2 font-medium">
                <item.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-900 transition-colors" />
                {item.label} 
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
            <label key={star} className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-lg -mx-1.5 transition-colors">
              <input type="radio" name="stars" className="w-4 h-4 text-blue-900 border-gray-300 focus:ring-blue-900" />
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-auto font-medium group-hover:text-gray-900 transition-colors">
                {star} {t('Filters.stars_label')} & Up
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}