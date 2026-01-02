'use client';

import React, { useMemo, useState } from 'react';
import { User, Check, BedDouble, Coffee, SearchX, ChevronDown } from 'lucide-react';
import { useFormatter } from 'next-intl';
import { useRouter } from 'next/navigation';

// --- Utility: Centralized Date & Night Calculation ---
// Helper to ensure we always have valid dates for the booking logic
const calculateStayDetails = (searchParamsString) => {
  const params = new URLSearchParams(searchParamsString);
  const checkInParam = params.get('checkin') || params.get('checkIn');
  const checkOutParam = params.get('checkout') || params.get('checkOut');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Validate dates. If invalid or missing, default to Today -> Tomorrow
  const start = checkInParam ? new Date(checkInParam) : today;
  const end = checkOutParam ? new Date(checkOutParam) : tomorrow;

  const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

  // Fallback if parsed dates are invalid
  const safeStart = isValidDate(start) ? start : today;
  const safeEnd = isValidDate(end) && end > safeStart ? end : tomorrow;

  const diffTime = safeEnd.getTime() - safeStart.getTime();
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    nights: Math.max(1, nights),
    checkIn: safeStart.toISOString().split('T')[0], // Format: YYYY-MM-DD
    checkOut: safeEnd.toISOString().split('T')[0],
    hasUserSelectedDates: !!(checkInParam && checkOutParam) // Flag to know if dates were real or defaults
  };
};

// --- Sub-Component: Room Card ---
const RoomCard = ({ room, propertyId, stayDetails, format, router }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(0);

  const pricePerNight = Number(room.price_per_night) || 0;
  const totalPriceForStay = pricePerNight * stayDetails.nights;

  const handleReserve = () => {
    if (selectedQuantity <= 0) return;

    // Use URLSearchParams for safe, encoded query string construction
    const queryParams = new URLSearchParams({
      p_id: propertyId,
      item_id: room.id,
      p_t: 'HL',
      quantity: selectedQuantity.toString(),
      for_n: stayDetails.nights.toString(),
      checkin: stayDetails.checkIn,
      checkout: stayDetails.checkOut,
    });

    router.push(`/booking/?${queryParams.toString()}`);
  };

  return (
    <article className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col md:flex-row">

      {/* LEFT SECTION: Info */}
      <div className="flex-1 p-5 md:p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2 items-start">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase">
              <BedDouble className="w-3.5 h-3.5" />
              {room.bed_type === 'KG' ? 'King Bed' : 'Queen Bed'}
            </span>
            {room.capacity_adults >= 2 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                <User className="w-3 h-3" /> Sleeps {room.capacity_adults}
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
            {room.title}
          </h3>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 md:line-clamp-3">
          {room.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Room Highlights</h4>
          <div className="grid grid-cols-2 sm:grid-cols-auto-fit gap-x-4 gap-y-2">
            {room.room_amenities?.slice(0, 6).map((am, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="truncate">{am}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100">
            <Coffee className="w-3.5 h-3.5" /> Breakfast Included
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100">
            <Check className="w-3.5 h-3.5" /> Free Cancellation
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Action */}
      <div className="w-full md:w-72 bg-slate-50/80 border-t md:border-t-0 md:border-l border-slate-100 p-5 md:p-6 flex flex-col justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900">
              {format.number(totalPriceForStay, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total for {stayDetails.nights} night{stayDetails.nights > 1 ? 's' : ''}</span>
            <span className="text-slate-400">Inc. taxes</span>
          </div>

          {/* Warn user if they are viewing default dates */}
          {!stayDetails.hasUserSelectedDates && (
            <div className="text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded mt-2 border border-orange-100 text-center">
              Showing prices for tonight
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="relative">
            <label className="text-[11px] uppercase tracking-wide font-bold text-slate-500 mb-1.5 block">
              Quantity
            </label>
            <div className="relative">
              <select
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                className={`w-full appearance-none p-3 pl-4 pr-10 border rounded-xl text-sm font-medium outline-none transition-all cursor-pointer ${selectedQuantity > 0
                    ? 'border-blue-500 bg-white ring-2 ring-blue-100 text-slate-900'
                    : 'border-slate-300 bg-white hover:border-slate-400 text-slate-700'
                  }`}
              >
                <option value="0">0 Rooms</option>
                {Array.from({ length: Math.min(room.total_inventory, 10) }).map((_, index) => {
                  const qty = index + 1;
                  const total = totalPriceForStay * qty;
                  return (
                    <option key={qty} value={qty}>
                      {qty} {qty === 1 ? 'Room' : 'Rooms'} ({format.number(total, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={handleReserve}
            disabled={selectedQuantity === 0}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${selectedQuantity > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white translate-y-0 opacity-100 hover:shadow-lg hover:shadow-blue-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
          >
            {selectedQuantity > 0 ? 'Reserve Now' : 'Select Quantity'}
          </button>

          <div className="flex justify-center gap-4 pt-2">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Instant Confirm
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> No Fees
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

// --- Main Component ---
export default function RoomList({ rooms, propertyId, t, searchParamsString = '' }) {
  const format = useFormatter();
  const router = useRouter();

  // 1. Calculate Logic ONCE here
  const stayDetails = useMemo(() => {
    return calculateStayDetails(searchParamsString);
  }, [searchParamsString]);

  if (!rooms || rooms.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 mt-8">
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <SearchX className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{t('noRoomsTitle')}</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">{t('noRoomsMessage')}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all shadow-sm hover:shadow"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <section className="mt-10 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t('availableRooms')}</h2>
          <p className="text-slate-500 mt-1 text-sm">
            Showing {rooms.length} best options for {stayDetails.nights} night{stayDetails.nights > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            propertyId={propertyId}
            stayDetails={stayDetails} // Pass calculated object
            format={format}
            router={router}
          />
        ))}
      </div>
    </section>
  );
}