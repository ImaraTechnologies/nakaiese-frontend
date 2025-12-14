'use client';
import React from 'react';
import { MapPin, Share2, Heart, Star } from 'lucide-react';

const PropertyHeader = ({ title, address, rating, reviewCount, type, t }) => {
  
  // Robust address formatting
  const fullAddress = [address?.street, address?.city, address?.country].filter(Boolean).join(', ');

  return (
    <div className="space-y-4">
      {/* Title & Actions Row */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-slate-500">
            <MapPin className="w-4 h-4 text-yellow-500 shrink-0" />
            <span className="text-sm md:text-base">{fullAddress}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            className="p-2 rounded-full bg-white border border-slate-200 hover:text-red-500 transition-colors"
            aria-label="Save to favorites"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Meta Data Row (Rating | Type) */}
      <div className="flex items-center gap-6 border-y border-slate-200 py-4">
        <div className="flex items-center gap-1.5">
          <div className="bg-yellow-500 text-white font-bold px-2 py-0.5 rounded text-sm">
            {rating || "New"}
          </div>
          <span className="font-medium text-slate-900">{t('excellent')}</span>
          <span className="text-sm text-slate-400">
            ({reviewCount} {t('reviews')})
          </span>
        </div>
        
        <div className="h-4 w-px bg-slate-200" />
        
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-900">{t('typeLabel')}:</span>
          <span className="capitalize">{type === 'HL' ? t('hotel') : t('restaurant')}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;