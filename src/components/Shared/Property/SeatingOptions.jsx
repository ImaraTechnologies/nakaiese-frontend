'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Armchair, Sun, Wind, Star, Utensils, 
  Users, ArrowRight, ChevronDown, Clock 
} from 'lucide-react';

// --- UTILS ---
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Time formatter to make "19:00" -> "7:00 PM"
const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return '';
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minute} ${ampm}`;
};

const LOCATION_CONFIG = {
  'MH': { icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50' },
  'WN': { icon: Sun,      color: 'text-sky-600',    bg: 'bg-sky-50' },
  'BT': { icon: Armchair, color: 'text-purple-600', bg: 'bg-purple-50' },
  'PT': { icon: Wind,     color: 'text-emerald-600',bg: 'bg-emerald-50' },
  'RT': { icon: Star,     color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'BR': { icon: Armchair, color: 'text-rose-600',   bg: 'bg-rose-50' }
};

const SeatingOptions = ({ tables, t, propertyId, searchParamsString }) => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);

  const seatingGroups = useMemo(() => {
    if (!tables) return {};
    return tables.reduce((acc, table) => {
      const type = table.location_type;
      if (!acc[type]) acc[type] = { count: 0, capacities: [], tables: [] };
      acc[type].count += 1;
      acc[type].capacities.push(table.capacity);
      acc[type].tables.push(table); 
      return acc;
    }, {});
  }, [tables]);

  const handleBook = (tableId, timeSlot, count) => {
    const params = new URLSearchParams(searchParamsString);
    const checkInDate = params.get('checkin') || new Date().toISOString().split('T')[0];
    
    const query = new URLSearchParams({
      p_id: propertyId,
      item_id: tableId,
      p_t: 'table',
      guests: count,
      checkin: checkInDate,
      time: timeSlot,
    });
    router.push(`/booking/?${query.toString()}`);
  };

  if (!tables || tables.length === 0) return null;

  return (
    <section className="w-full py-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {t('seating_preference') || "Select Seating Area"}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {t('seating_sub') || "Choose where you'd like to sit"}
        </p>
      </div>
      
      {/* STACKED LIST LAYOUT */}
      <div className="flex flex-col space-y-3">
        {Object.entries(seatingGroups).map(([code, data]) => (
          <SeatingRow
            key={code}
            code={code}
            data={data}
            t={t}
            isSelected={selectedType === code}
            onSelect={() => setSelectedType(selectedType === code ? null : code)}
            onBook={handleBook}
          />
        ))}
      </div>
    </section>
  );
};

const SeatingRow = ({ 
  code, data, t, isSelected, onSelect, onBook 
}) => {
  const config = LOCATION_CONFIG[code] || LOCATION_CONFIG['MH'];
  const Icon = config.icon;
  const maxCapacity = Math.max(...data.capacities);
  
  // Local State
  const [guestCount, setGuestCount] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Translations
  const label = t(`seating_${code}_label`) || code;
  const desc = t(`seating_${code}_desc`) || "Standard seating";

  // Logic
  const availableSlots = useMemo(() => {
    const timeMap = new Map();
    const validTables = data.tables.filter(tbl => tbl.capacity >= guestCount);
    validTables.forEach(table => {
      (table.slots || []).forEach(slot => {
        if (slot.is_available && !timeMap.has(slot.start)) {
          timeMap.set(slot.start, table.id);
        }
      });
    });
    return Array.from(timeMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [data.tables, guestCount]);

  return (
    <div 
      className={cn(
        "group relative w-full border rounded-xl overflow-hidden transition-all duration-300",
        isSelected 
          ? "border-blue-600 bg-white ring-1 ring-blue-600/20 shadow-lg" 
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      )}
    >
      {/* --- CLICKABLE HEADER ROW --- */}
      <button 
        onClick={onSelect}
        className="w-full flex items-center justify-between p-4 text-left outline-none"
      >
        <div className="flex items-center gap-4">
          {/* Icon Box */}
          <div className={cn(
            "w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
            isSelected ? config.bg + " " + config.color : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
          )}>
            <Icon className="w-6 h-6" />
          </div>

          {/* Text Info */}
          <div>
            <h4 className={cn("font-bold text-base", isSelected ? 'text-blue-700' : 'text-slate-900')}>
              {label}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-sm text-slate-500">{desc}</span>
               <span className="text-slate-300">•</span>
               <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                 <Users className="w-3 h-3" /> Max {maxCapacity}
               </span>
            </div>
          </div>
        </div>

        {/* Chevron */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300",
          isSelected ? "bg-blue-50 text-blue-600 rotate-180" : "text-slate-400"
        )}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {/* --- EXPANDABLE CONTENT --- */}
      <div 
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          isSelected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 border-t border-dashed border-slate-100 bg-slate-50/50">
            
            {/* Control Row: Guests & Slots */}
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              
              {/* 1. Guest Selector */}
              <div className="w-full md:w-1/3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  {t('guests') || "Party Size"}
                </label>
                <div className="relative">
                  <select 
                    value={guestCount}
                    onChange={(e) => {
                      setGuestCount(Number(e.target.value));
                      setSelectedSlot(null);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none cursor-pointer"
                  >
                    {[...Array(maxCapacity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? (t('person') || 'Person') : (t('people') || 'People')}
                      </option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 2. Time Slots */}
              <div className="w-full md:w-2/3">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                   {t('available_times') || "Select Time"}
                 </label>
                 
                 {availableSlots.length > 0 ? (
                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                     {availableSlots.map(([timeStr, tableId]) => {
                       const formattedTime = formatTimeDisplay(timeStr);
                       const isActive = selectedSlot?.time === timeStr;
                       
                       return (
                         <button
                           key={timeStr}
                           onClick={() => setSelectedSlot({ time: timeStr, tableId })}
                           className={cn(
                             "px-2 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 text-center",
                             isActive
                               ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]"
                               : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                           )}
                         >
                           {formattedTime}
                         </button>
                       );
                     })}
                   </div>
                 ) : (
                   <div className="p-4 w-full bg-white border border-slate-200 border-dashed rounded-lg text-center">
                     <Clock className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                     <p className="text-xs text-slate-500">No tables for {guestCount} guests.</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Bottom: Book Button */}
            <div className="mt-6 flex justify-end">
              <button
                disabled={!selectedSlot}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if(selectedSlot) onBook(selectedSlot.tableId, selectedSlot.time, guestCount); 
                }}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm",
                  selectedSlot 
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                {t('confirm_selection') || "Confirm Reservation"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatingOptions;