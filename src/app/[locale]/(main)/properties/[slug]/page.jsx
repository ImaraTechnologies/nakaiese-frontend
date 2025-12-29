'use client';

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { useProperty } from '@/hooks/useProperties';
import { MapPin, Share2, Check, Info } from 'lucide-react';

// Modular Components
import PropertyGallery from '@/components/Shared/Property/PropertyGallery';
import BookingSidebar from '@/components/Shared/Property/BookingSidebar';
import RoomList from '@/components/Shared/Property/RoomList';
import SeatingOptions from '@/components/Shared/Property/SeatingOptions';
import WishButton from '@/components/Shared/WishButton/WishButton';
import { FullPageSpinner } from '@/components/ui/Spinner/Spinner';
import PropertyFAQ from '@/components/Shared/Property/PropertyFAQ';

export default function PropertyDetailsPage() {
  const params = useParams();
  const t = useTranslations('Property');
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  // 1. Fetch Property Data
  const { data: property, isLoading, error } = useProperty(params.slug);

  // 2. State for Filtered Results ONLY
  // We do NOT store the default items in state. We only store updates.
  const [filteredItems, setFilteredItems] = useState(null);

  const isHotel = property?.property_type === 'HL';

  // 3. Derived State (The Fix)
  // If we have filtered items, use them. Otherwise, fall back to the Property's default lists.
  // This runs instantly during render, so no useEffect is needed.
  const defaultItems = property ? (isHotel ? property.room_types : property.tables) : [];
  const displayedItems = filteredItems || defaultItems;
  
  // Calculate filter status based on whether filteredItems exists
  const isFiltered = filteredItems !== null;

  // 4. Handler: Receive Available Rooms from BookingWidget
  const handleAvailabilityUpdate = useCallback((availableData) => {
    if (!availableData) return;

    // Depending on your API response structure, extract the array
    const items = Array.isArray(availableData) 
        ? availableData 
        : (availableData.rooms || availableData.tables || []);

    // Update the override state
    setFilteredItems(items);

    // UX: Scroll to the list
    const listSection = document.getElementById('inventory-list');
    if (listSection) {
      listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // --- Render ---

  if (isLoading) return <FullPageSpinner />;
  if (error || !property) return <div className="h-screen flex items-center justify-center text-red-500">Property not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600 pb-20">

      {/* Gallery */}
      <PropertyGallery images={property.images} t={t} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">

        {/* LEFT COLUMN: Main Content */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{property.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-slate-500">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                  <span>{property.location?.street}, {property.location?.city}, {property.location?.country}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                  <Share2 className="w-5 h-5 text-slate-600" />
                </button>
                <WishButton item={property} customClass="relative" />
              </div>
            </div>

            {/* Rating Bar */}
            <div className="flex items-center gap-6 border-y border-slate-200 py-4">
              <div className="flex items-center gap-1.5">
                <div className="bg-yellow-500 text-white font-bold px-2 py-0.5 rounded text-sm">{property.rating}</div>
                <span className="font-medium text-slate-900">{t('excellent')}</span>
                <span className="text-sm text-slate-400">({property.review_count} {t('reviews')})</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-900">{t('typeLabel')}:</span>
                <span>{isHotel ? t('hotel') : t('restaurant')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{isHotel ? t('aboutStay') : t('aboutPlace')}</h2>
            <p className="leading-relaxed text-lg text-slate-600 mb-8">{property.description}</p>
            
            <h3 className="font-semibold text-slate-900 mb-4">{t('amenities')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
              {property.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-600">
                  <div className="p-1 rounded bg-yellow-100 text-yellow-600">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* DYNAMIC ROOM/TABLE LIST */}
          <section id="inventory-list" className="pt-8 border-t border-slate-200 scroll-mt-28">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-slate-900">
                 {isHotel ? t('availableRooms') : t('availableTables')}
               </h2>
               
               {/* Show Filter Status Badge */}
               {isFiltered && (
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium animate-in fade-in">
                   <Info className="w-4 h-4" />
                   {t('showingFilteredResults', { count: displayedItems.length })}
                 </span>
               )}
            </div>

            {isHotel ? (
              <RoomList rooms={displayedItems} t={t} isFiltered={isFiltered} />
            ) : (
              <SeatingOptions tables={displayedItems} t={t} isFiltered={isFiltered} />
            )}
          </section>

          <PropertyFAQ property={property} t={t} />

          {/* Reviews */}
          <section className="pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('guestReviews')}</h2>
            <div className="bg-blue-50/50 p-8 rounded-2xl text-center border border-blue-100">
              <h3 className="text-lg font-medium text-slate-900">{t('rated')} {property.rating}/5</h3>
              <p className="text-slate-500 mb-4">{t('basedOn')} {property.review_count} {t('realTravelers')}.</p>
              <button className="px-6 py-2 bg-white border border-slate-300 rounded-full font-medium hover:bg-slate-50 text-slate-700">
                {t('readAll')}
              </button>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Booking Sidebar */}
        <div className="relative">
          <BookingSidebar 
            property={property} 
            isHotel={isHotel} 
            t={t} 
            searchParamsString={searchParamsString}
            onAvailabilityFound={handleAvailabilityUpdate}
          />
        </div>

      </div>
    </div>
  );
}