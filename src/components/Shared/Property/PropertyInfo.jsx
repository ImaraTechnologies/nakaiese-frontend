'use client';
import React from 'react';
import { Check } from 'lucide-react';

const PropertyInfo = ({ description, amenities, isHotel, t }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {isHotel ? t('aboutStay') : t('aboutPlace')}
      </h2>
      
      {/* Description */}
      <p className="leading-relaxed text-lg text-slate-600 mb-8 whitespace-pre-line">
        {description}
      </p>
      
      {/* Amenities Grid */}
      {amenities && amenities.length > 0 && (
        <>
          <h3 className="font-semibold text-slate-900 mb-4">{t('amenities')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
            {amenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-600">
                <div className="p-1 rounded bg-yellow-100 text-yellow-600 shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm font-medium">{amenity}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default PropertyInfo;