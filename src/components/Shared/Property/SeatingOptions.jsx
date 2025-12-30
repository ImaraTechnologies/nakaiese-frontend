'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Armchair, Sun, Wind, Star, Utensils, CheckCircle2, Users, Clock, ArrowRight } from 'lucide-react';

// --- Configuration ---
const LOCATION_CONFIG = {
  'MH': { label: 'Main Hall', icon: Utensils, desc: 'Classic indoor dining' },
  'WN': { label: 'Window Side', icon: Sun, desc: 'Scenic views & light' },
  'BT': { label: 'Private Booth', icon: Armchair, desc: 'Cozy & private' },
  'PT': { label: 'Patio', icon: Wind, desc: 'Open-air seating' },
  'RT': { label: 'Rooftop', icon: Star, desc: 'Premium skyline views' },
  'BR': { label: 'Bar', icon: Armchair, desc: 'Casual high stools' }
};

const SeatingOptions = ({ tables, t, propertyId, searchParamsString }) => {
  const router = useRouter();
  
  // State for Booking Inputs
  const [selectedType, setSelectedType] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTime, setSelectedTime] = useState('19:00'); // Default 7 PM

  // 1. Memoized Data Processing
  const seatingGroups = useMemo(() => {
    if (!tables) return {};
    return tables.reduce((acc, table) => {
      const type = table.location_type;
      if (!acc[type]) {
        acc[type] = { 
          count: 0, 
          capacities: [], 
          basePrice: parseFloat(table.reservation_fee) || 0,
          ids: [] // Collect all IDs to pick one for booking
        };
      }
      acc[type].count += 1;
      acc[type].capacities.push(table.capacity);
      acc[type].ids.push(table.id);
      return acc;
    }, {});
  }, [tables]);

  // 2. Handle Booking Navigation
  const handleBook = (groupData) => {
    if (!groupData.ids.length) return;

    // Extract Check-in Date from URL or Default to Today
    const params = new URLSearchParams(searchParamsString);
    const checkInDate = params.get('checkin') || params.get('checkIn') || new Date().toISOString().split('T')[0];

    // Pick the first available table ID from this group
    const targetItemId = groupData.ids[0]; 

    // Construct URL Params
    const query = new URLSearchParams({
      p_id: propertyId,
      item_id: targetItemId,
      p_t: 'table', // identifying this as a table booking
      guests: guestCount,
      checkin: checkInDate,
      time: selectedTime,
    });

    // Navigate
    router.push(`/booking/?${query.toString()}`);
  };

  if (!tables || tables.length === 0) return null;

  return (
    <section className="pt-8 border-t border-slate-200 w-full animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {t('seatingOptions') || "Reserve a Table"}
        </h2>
        <p className="text-sm text-slate-500 mt-1">Select your preferred seating area to continue</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(seatingGroups).map(([code, data]) => {
          const config = LOCATION_CONFIG[code] || { label: code, icon: Armchair, desc: 'Standard seating' };
          const Icon = config.icon;
          const maxCapacity = Math.max(...data.capacities);
          const isSelected = selectedType === code;

          return (
            <div
              key={code}
              className={`
                relative flex flex-col rounded-xl border transition-all duration-300 overflow-hidden
                ${isSelected 
                  ? 'border-blue-600 ring-1 ring-blue-600 shadow-lg bg-white scale-[1.02] z-10' 
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              {/* --- CARD CLICK AREA --- */}
              <button 
                onClick={() => setSelectedType(isSelected ? null : code)}
                className="w-full text-left p-5 flex flex-col items-start outline-none"
              >
                {/* Header */}
                <div className="flex w-full justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                        {config.label}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">{config.desc}</p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 animate-in zoom-in" />}
                </div>

                {/* Badges */}
                <div className="mt-2 flex flex-wrap gap-2 w-full">
                  <span className="inline-flex items-center text-[10px] font-semibold bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-200">
                     Up to {maxCapacity} Guests
                  </span>
                  {data.basePrice > 0 ? (
                    <span className="ml-auto text-xs font-bold text-slate-900">+${data.basePrice} Fee</span>
                  ) : (
                    <span className="ml-auto text-[10px] font-medium text-slate-400 uppercase tracking-wide">No Fee</span>
                  )}
                </div>
              </button>

              {/* --- EXPANDABLE BOOKING FORM --- */}
              {isSelected && (
                <div className="bg-slate-50 border-t border-slate-100 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  
                  {/* Inputs Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Time Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Time
                      </label>
                      <input 
                        type="time" 
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    {/* Guests Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <Users className="w-3 h-3" /> Guests
                      </label>
                      <select 
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                      >
                        {[...Array(maxCapacity)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} People</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <button
                    onClick={() => handleBook(data)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                  >
                    Confirm Selection <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SeatingOptions;