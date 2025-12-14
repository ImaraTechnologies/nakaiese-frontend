'use client';
import React from 'react';
import { Utensils, Leaf, Grape } from 'lucide-react';

export default function FilterSection({ t }) {
  return (
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
}