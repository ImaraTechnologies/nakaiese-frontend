'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Armchair, Sun, Wind, Star, Utensils,
  Users, ArrowRight, ChevronDown, Clock
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

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
  'WN': { icon: Sun, color: 'text-sky-600', bg: 'bg-sky-50' },
  'BT': { icon: Armchair, color: 'text-purple-600', bg: 'bg-purple-50' },
  'PT': { icon: Wind, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'RT': { icon: Star, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'BR': { icon: Armchair, color: 'text-rose-600', bg: 'bg-rose-50' }
};

const SeatingOptions = ({ tables, t, propertyId, searchParamsString }) => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);

  // Group tables by location_type
  const seatingGroups = useMemo(() => {
    if (!tables) return {};
    return tables.reduce((acc, table) => {
      const type = table.location_type;
      if (!acc[type]) acc[type] = { count: 0, maxCapacity: 0, tables: [] };

      acc[type].count += 1;
      // Track max capacity for the dropdown range
      if (table.capacity > acc[type].maxCapacity) {
        acc[type].maxCapacity = table.capacity;
      }
      acc[type].tables.push(table);
      return acc;
    }, {});
  }, [tables]);

  const handleBook = (tableId, timeSlot, count) => {
    const params = new URLSearchParams(searchParamsString);
    const checkInDate = params.get('checkin') || new Date().toISOString().split('T')[0];

    const query = new URLSearchParams({
      ...Object.fromEntries(params.entries()),
      p_id: propertyId,
      item_id: tableId, // This is now guaranteed to be an available table ID
      p_t: 'RT',
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

const SeatingRow = ({ code, data, t, isSelected, onSelect, onBook }) => {
  const config = LOCATION_CONFIG[code] || LOCATION_CONFIG['MH'];
  const Icon = config.icon;

  const [guestCount, setGuestCount] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const label = t?.(`seating_${code}_label`) || code;
  const desc = t?.(`seating_${code}_desc`) || "Standard seating area";

  // --- LOGIC FIX START ---
  const availableSlots = useMemo(() => {
    const bestFitTables = [...data.tables]
      .filter(tbl => tbl.capacity >= guestCount)
      .sort((a, b) => {
        // Priority 1: Waste less space (Capacity)
        if (a.capacity !== b.capacity) return a.capacity - b.capacity;
        // Priority 2: Deterministic Order (Table Number)
        return a.table_number.localeCompare(b.table_number);
      });

    // Map: TimeString -> [TableID_1, TableID_2]
    const slotsMap = new Map();

    bestFitTables.forEach(table => {
      if (!table.slots) return;

      table.slots.forEach(slot => {
        // STRICT CHECK: Ensure it is actually available
        // We handle string "true"/"false" just in case API is loose
        const isAvailable = slot.is_available === true || slot.is_available === 'true';

        if (isAvailable) {
          if (!slotsMap.has(slot.start)) {
            slotsMap.set(slot.start, []);
          }
          // Because we sorted 'bestFitTables' above, the first ID pushed 
          // is the absolute best table for this group size.
          slotsMap.get(slot.start).push(table.id);
        }
      });
    });

    // Return sorted time entries
    return Array.from(slotsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  }, [data.tables, guestCount]);
  // --- LOGIC FIX END ---

  return (
    <div className={cn(
      "group relative w-full border rounded-xl overflow-hidden transition-all duration-300",
      isSelected ? "border-blue-600 bg-white ring-1 ring-blue-600/20 shadow-lg" : "border-slate-200 bg-white hover:border-slate-300"
    )}>
      <button onClick={onSelect} className="w-full flex items-center justify-between p-4 text-left outline-none">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 flex items-center justify-center rounded-lg", isSelected ? config.bg + " " + config.color : "bg-slate-100 text-slate-500")}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className={cn("font-bold text-base", isSelected ? 'text-blue-700' : 'text-slate-900')}>{label}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-slate-500">{desc}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {data.tables.length} {data.tables.length === 1 ? 'Table' : 'Tables'}
              </span>
            </div>
          </div>
        </div>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300", isSelected ? "bg-blue-50 text-blue-600 rotate-180" : "text-slate-400")}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-in-out", isSelected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <div className="p-4 pt-0 border-t border-dashed border-slate-100 bg-slate-50/50">
            <div className="flex flex-col md:flex-row gap-6 mt-4">

              {/* GUESTS SELECTOR */}
              <div className="w-full md:w-1/3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t?.('guests') || "Party Size"}</label>
                <div className="relative">
                  <select
                    value={guestCount}
                    onChange={(e) => {
                      setGuestCount(Number(e.target.value));
                      setSelectedSlot(null);
                    }}
                    className="w-full bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    {[...Array(data.maxCapacity || 4)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* TIME SLOTS */}
              <div className="w-full md:w-2/3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t?.('available_times') || "Select Time"}</label>
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
                            // SMART SELECTION: tableIds[0] is guaranteed to be the Best Fit 
                            // and strictly Available because of the sorting/filtering above.
                            setSelectedSlot({ time: timeStr, tableId: tableIds[0] })
                          }}
                          className={cn(
                            "px-2 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 text-center flex flex-col items-center justify-center gap-0.5",
                            isActive ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]" : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                          )}
                        >
                          <span>{formattedTime}</span>
                          {countAvailable > 1 && (
                            <span className={cn("text-[10px] font-normal", isActive ? "text-blue-100" : "text-emerald-600")}>
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
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                disabled={!selectedSlot}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedSlot) onBook(selectedSlot.tableId, selectedSlot.time, guestCount);
                }}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm",
                  selectedSlot ? "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5" : "bg-slate-200 text-slate-400 cursor-not-allowed"
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