'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Armchair, Sun, Wind, Star, Utensils, 
  Users, ArrowRight, ChevronDown, Clock 
} from 'lucide-react';

// --- UTILS ---
const cn = (...classes) => classes.filter(Boolean).join(' ');

const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return '';
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minute} ${ampm}`;
};

// Configuration for visual distinctiveness of zones
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

  // 1. Group raw tables by their 'location_type'
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
    // Preserve existing params and add booking details
    const params = new URLSearchParams(searchParamsString);
    const checkInDate = params.get('checkin') || new Date().toISOString().split('T')[0];
    
    const query = new URLSearchParams({
      ...Object.fromEntries(params.entries()), // keep existing
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
          {t?.('seating_preference') || "Select Seating Area"}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {t?.('seating_sub') || "Choose where you'd like to sit"}
        </p>
      </div>
      
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
  
  // Calculate max capacity for this entire zone (e.g. max table size in Window area)
  const maxCapacity = Math.max(...data.capacities);
  
  // Local State
  const [guestCount, setGuestCount] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null); // { time: string, tableId: string }

  // Safe translations
  const label = t?.(`seating_${code}_label`) || code;
  const desc = t?.(`seating_${code}_desc`) || "Standard seating area";

  // --- CORE ALGORITHM: AGGREGATION & BEST FIT ---
  const availableSlots = useMemo(() => {
    const slotsMap = new Map(); // Key: TimeString, Value: [TableID, TableID...]

    // 1. FILTER: Only tables that fit the party
    // 2. SORT: Ascending Capacity. This ensures the [0] index is the "Best Fit" (smallest valid table).
    const validTables = data.tables
      .filter(tbl => tbl.capacity >= guestCount)
      .sort((a, b) => a.capacity - b.capacity);

    // 3. AGGREGATE
    validTables.forEach(table => {
      if (!table.slots) return;
      
      table.slots.forEach(slot => {
        if (slot.is_available) {
          if (!slotsMap.has(slot.start)) {
            slotsMap.set(slot.start, []);
          }
          // Push table ID. Because we sorted 'validTables' above, 
          // small tables get pushed first, large tables later.
          slotsMap.get(slot.start).push(table.id);
        }
      });
    });

    // 4. SORT TIMES CHRONOLOGICALLY
    return Array.from(slotsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  }, [data.tables, guestCount]);
  // ----------------------------------------------

  return (
    <div 
      className={cn(
        "group relative w-full border rounded-xl overflow-hidden transition-all duration-300",
        isSelected 
          ? "border-blue-600 bg-white ring-1 ring-blue-600/20 shadow-lg" 
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      )}
    >
      {/* --- CLICKABLE HEADER --- */}
      <button 
        onClick={onSelect}
        className="w-full flex items-center justify-between p-4 text-left outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
            isSelected ? config.bg + " " + config.color : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
          )}>
            <Icon className="w-6 h-6" />
          </div>

          <div>
            <h4 className={cn("font-bold text-base", isSelected ? 'text-blue-700' : 'text-slate-900')}>
              {label}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-sm text-slate-500">{desc}</span>
               <span className="text-slate-300">•</span>
               {/* Inventory Badge */}
               <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                 {data.tables.length} {data.tables.length === 1 ? 'Table' : 'Tables'}
               </span>
            </div>
          </div>
        </div>

        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300",
          isSelected ? "bg-blue-50 text-blue-600 rotate-180" : "text-slate-400"
        )}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {/* --- EXPANDABLE BODY --- */}
      <div 
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          isSelected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 border-t border-dashed border-slate-100 bg-slate-50/50">
            
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              
              {/* 1. GUESTS SELECTOR */}
              <div className="w-full md:w-1/3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  {t?.('guests') || "Party Size"}
                </label>
                <div className="relative">
                  <select 
                    value={guestCount}
                    onChange={(e) => {
                      setGuestCount(Number(e.target.value));
                      setSelectedSlot(null); // Reset selection on change
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none cursor-pointer"
                  >
                    {[...Array(maxCapacity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? (t?.('person') || 'Person') : (t?.('people') || 'People')}
                      </option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 2. TIME SLOTS GRID */}
              <div className="w-full md:w-2/3">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                   {t?.('available_times') || "Select Time"}
                 </label>
                 
                 {availableSlots.length > 0 ? (
                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                     {availableSlots.map(([timeStr, tableIds]) => {
                       const formattedTime = formatTimeDisplay(timeStr);
                       const isActive = selectedSlot?.time === timeStr;
                       const countAvailable = tableIds.length;
                       
                       return (
                         <button
                           key={timeStr}
                           onClick={() => {
                               // Auto-assign the first table ID (Best Fit)
                               setSelectedSlot({ time: timeStr, tableId: tableIds[0] }) 
                           }}
                           className={cn(
                             "relative px-2 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 text-center flex flex-col items-center justify-center gap-0.5",
                             isActive
                               ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]"
                               : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                           )}
                         >
                           <span>{formattedTime}</span>
                           {/* Availability Indicator */}
                           {countAvailable > 1 && (
                                <span className={cn(
                                    "text-[10px] font-normal",
                                    isActive ? "text-blue-100" : "text-emerald-600"
                                )}>
                                    {countAvailable} left
                                </span>
                           )}
                         </button>
                       );
                     })}
                   </div>
                 ) : (
                   <div className="p-4 w-full bg-white border border-slate-200 border-dashed rounded-lg text-center flex flex-col items-center justify-center min-h-[100px]">
                     <Clock className="w-5 h-5 text-slate-300 mb-2" />
                     <p className="text-xs text-slate-500 font-medium">No tables available</p>
                     <p className="text-[10px] text-slate-400">Try a smaller party size</p>
                   </div>
                 )}
              </div>
            </div>

            {/* 3. CONFIRM BUTTON */}
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
                {t?.('confirm_selection') || "Confirm Reservation"}
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