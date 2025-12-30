'use client';
import React, { useMemo, useState } from 'react';
import { User, Check, BedDouble, Coffee, SearchX } from 'lucide-react';
import { useFormatter } from 'next-intl';

// --- Utility: Calculate Nights Safely ---
const getNightsCount = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

// --- Sub-Component: Individual Room Row ---
// This isolates the state for each room so one dropdown doesn't affect others.
const RoomRow = ({ room, nights, format }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(0);

  // Calculate base price for the full stay (1 room)
  const pricePerNight = Number(room.price_per_night) || 0;
  const totalPriceForStay = pricePerNight * nights;

  const handleReserve = () => {
    if (selectedQuantity > 0) {
      // TODO: Add your navigation logic here (e.g., router.push('/checkout') or add to cart)
      console.log(`Reserving ${selectedQuantity} unit(s) of ${room.title}`);
      alert(`Reserved ${selectedQuantity} room(s) for ${format.number(totalPriceForStay * selectedQuantity, { style: 'currency', currency: 'USD' })}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 group hover:bg-slate-50 transition-colors">
      
      {/* 1. ROOM DETAILS */}
      <div className="col-span-5 p-4 border-r border-slate-300">
        <h3 className="text-blue-600 font-bold text-base hover:underline cursor-pointer mb-2">
          {room.title}
        </h3>
        <div className="inline-flex items-center gap-1 text-xs text-slate-700 mb-3 bg-slate-100 px-2 py-1 rounded">
          <BedDouble className="w-3.5 h-3.5" />
          <span>{room.bed_type === 'KG' ? '1 King bed' : '1 Queen bed'}</span>
        </div>
        <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
          {room.description}
        </p>
        <div className="space-y-1.5">
          {room.room_amenities?.slice(0, 8).map((am, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
              <Check className="w-3 h-3 text-green-600 shrink-0 mt-0.5" />
              <span>{am}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SLEEPS */}
      <div className="col-span-1 p-4 border-r border-slate-300 flex flex-wrap content-start gap-1 lg:justify-center">
        <span className="lg:hidden text-xs font-bold mr-2">Sleeps:</span>
        {Array.from({ length: room.capacity_adults }).map((_, i) => (
          <User key={i} className="w-4 h-4 text-slate-900 fill-slate-900" />
        ))}
        {room.capacity_children > 0 && (
          <span className="text-[10px] text-slate-500 block w-full text-center mt-1">
            + {room.capacity_children} child
          </span>
        )}
      </div>

      {/* 3. PRICE */}
      <div className="col-span-2 p-4 border-r border-slate-300 flex flex-col justify-between">
        <div>
          <div className="text-lg font-bold text-slate-900">
            {format.number(totalPriceForStay, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">Includes taxes and fees</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            {nights > 1 ? `Price for ${nights} nights` : 'Price for 1 night'}
          </div>
        </div>
      </div>

      {/* 4. CHOICES */}
      <div className="col-span-2 p-4 border-r border-slate-300 text-xs space-y-3">
        <div className="flex gap-2 text-slate-900">
          <Coffee className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold">Breakfast included</span>
        </div>
        <div className="flex gap-2 text-green-700">
          <Check className="w-3.5 h-3.5 font-bold" />
          <span className="font-bold">Free cancellation</span>
        </div>
        <div className="flex gap-2 text-green-700">
          <Check className="w-3.5 h-3.5" />
          <span>No prepayment needed</span>
        </div>
      </div>

      {/* 5. SELECT ACTION */}
      <div className="col-span-2 p-4 flex flex-col gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2 lg:block">
          <label className="text-xs font-bold lg:hidden">Select Rooms:</label>
          <select 
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
            className={`w-full p-2 border rounded text-sm outline-none cursor-pointer transition-all ${
              selectedQuantity > 0 
                ? 'border-blue-500 ring-1 ring-blue-500 bg-white' 
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          >
            <option value="0">0</option>
            {Array.from({ length: Math.min(room.total_inventory, 10) }).map((_, index) => {
              const qty = index + 1;
              const total = totalPriceForStay * qty;
              return (
                <option key={qty} value={qty}>
                  {qty} &nbsp;&nbsp; ({format.number(total, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })})
                </option>
              );
            })}
          </select>
        </div>

        {/* Dynamic Button */}
        {selectedQuantity > 0 ? (
          <button 
            onClick={handleReserve}
            className="w-full py-2.5 bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold rounded text-sm transition-all shadow-sm active:scale-[0.98] animate-in fade-in zoom-in-95 duration-200"
          >
            I&apos;ll reserve
          </button>
        ) : (
          <button 
            disabled
            className="w-full py-2.5 bg-slate-200 text-slate-400 font-bold rounded text-sm cursor-not-allowed border border-slate-200"
          >
            I&apos;ll reserve
          </button>
        )}

        <ul className="list-disc list-inside text-[11px] text-slate-500 pl-1">
          <li>Instant confirmation</li>
          <li>No booking fees</li>
        </ul>
      </div>

    </div>
  );
};

// --- Main Component ---
export default function RoomList({ rooms, t, searchParamsString = '' }) {
  const format = useFormatter();

  const { nights } = useMemo(() => {
    const params = new URLSearchParams(searchParamsString);
    const cIn = params.get('checkin') || params.get('checkIn');
    const cOut = params.get('checkout') || params.get('checkOut');
    return { nights: getNightsCount(cIn, cOut) };
  }, [searchParamsString]);

  if (!rooms || rooms.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-lg border border-gray-200 shadow-sm mt-8">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <SearchX className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noRoomsTitle')}</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">{t('noRoomsMessage')}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
      >
        Reset Search
      </button>
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('availableRooms')}</h2>

      <div className="border border-slate-300 rounded-md overflow-hidden shadow-sm">
        
        {/* HEADER */}
        <div className="hidden lg:grid grid-cols-12 bg-[#003b95] text-white text-xs font-bold">
          <div className="col-span-5 p-3 border-r border-white/20">Apartment Type</div>
          <div className="col-span-1 p-3 border-r border-white/20">Sleeps</div>
          <div className="col-span-2 p-3 border-r border-white/20">
            {nights > 1 ? `Price for ${nights} nights` : 'Price per night'}
          </div>
          <div className="col-span-2 p-3 border-r border-white/20">Your choices</div>
          <div className="col-span-2 p-3">Select apartment</div>
        </div>

        {/* BODY */}
        <div className="divide-y divide-slate-300 bg-white">
          {rooms.map((room) => (
            <RoomRow 
              key={room.id} 
              room={room} 
              nights={nights} 
              format={format} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}