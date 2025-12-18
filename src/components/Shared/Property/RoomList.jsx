'use client';
import React from 'react';
import { User, Check, BedDouble, Coffee, Ban, CreditCard, Info } from 'lucide-react';
import { useFormatter } from 'next-intl';

export default function RoomList({ rooms, t }) {
  const format = useFormatter();

  if (!rooms || rooms.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('availableRooms')}</h2>
      
      <div className="border border-slate-300 rounded-md overflow-hidden shadow-sm">
        
        {/* --- TABLE HEADER (Desktop) --- */}
        <div className="hidden lg:grid grid-cols-12 bg-[#003b95] text-white text-xs font-bold">
          <div className="col-span-5 p-3 border-r border-white/20">Apartment Type</div>
          <div className="col-span-1 p-3 border-r border-white/20">Sleeps</div>
          <div className="col-span-2 p-3 border-r border-white/20">Price per night</div>
          <div className="col-span-2 p-3 border-r border-white/20">Your choices</div>
          <div className="col-span-2 p-3">Select</div>
        </div>

        {/* --- TABLE BODY --- */}
        <div className="divide-y divide-slate-300 bg-white">
          {rooms.map((room) => (
            <div key={room.id} className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* 1. ROOM DETAILS */}
              <div className="col-span-5 p-4 border-r border-slate-300">
                <h3 className="text-blue-600 font-bold text-base hover:underline cursor-pointer mb-2">
                  {room.title}
                </h3>
                
                {/* Bed Tag */}
                <div className="inline-flex items-center gap-1 text-xs text-slate-700 mb-3 bg-slate-100 px-2 py-1 rounded">
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>{room.bed_type === 'KG' ? '1 King bed' : '1 Queen bed'}</span>
                </div>

                <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                  {room.description}
                </p>

                {/* Amenities List */}
                <div className="space-y-1.5">
                  {room.room_amenities?.slice(0, 8).map((am, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3 h-3 text-green-600 shrink-0 mt-0.5" />
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. SLEEPS (Capacity) */}
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
              <div className="col-span-2 p-4 border-r border-slate-300">
                <div className="text-lg font-bold text-slate-900">
                   {format.number(room.price_per_night, { style: 'currency', currency: 'USD' })}
                </div>
                <div className="text-xs text-slate-500 mt-1">Includes taxes and fees</div>
                <div className="text-[10px] text-slate-400 mt-4">
                   Price for 1 night
                </div>
              </div>

              {/* 4. CHOICES (Mocked based on reference) */}
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
              <div className="col-span-2 p-4 flex flex-col gap-3">
                 <div className="flex items-center gap-2 lg:block">
                   <label className="text-xs font-bold lg:hidden">Select Rooms:</label>
                   <select className="w-full p-2 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                     <option value="0">0</option>
                     <option value="1">1 &nbsp;&nbsp; ({format.number(room.price_per_night, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })})</option>
                     <option value="2">2 &nbsp;&nbsp; ({format.number(room.price_per_night * 2, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })})</option>
                     <option value="3">3 &nbsp;&nbsp; ({format.number(room.price_per_night * 3, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })})</option>
                     <option value="4">4 &nbsp;&nbsp; ({format.number(room.price_per_night * 4, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })})</option>
                     <option value="5">5 &nbsp;&nbsp; ({format.number(room.price_per_night * 5, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })})</option>
                   </select>
                 </div>
                 
                 {/* Blue Reserve Button */}
                 <button className="w-full py-2.5 bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold rounded text-sm transition-colors shadow-sm">
                   I&apos;ll reserve
                 </button>
                 
                 <ul className="list-disc list-inside text-[11px] text-slate-500 pl-1">
                   <li>Instant confirmation</li>
                   <li>No booking fees</li>
                 </ul>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}