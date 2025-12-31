'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Armchair, Sun, Wind, Star, Utensils, 
  Check, Users, Clock, ArrowRight 
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const LOCATION_CONFIG = {
  'MH': { label: 'Main Hall', icon: Utensils, desc: 'Classic dining', color: 'text-orange-600', bg: 'bg-orange-50' },
  'WN': { label: 'Window Side', icon: Sun, desc: 'Scenic views', color: 'text-sky-600', bg: 'bg-sky-50' },
  'BT': { label: 'Private Booth', icon: Armchair, desc: 'Quiet & cozy', color: 'text-purple-600', bg: 'bg-purple-50' },
  'PT': { label: 'Patio', icon: Wind, desc: 'Open-air', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'RT': { label: 'Rooftop', icon: Star, desc: 'Skyline view', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'BR': { label: 'Bar', icon: Armchair, desc: 'High stools', color: 'text-rose-600', bg: 'bg-rose-50' }
};

const SeatingOptions = ({ tables, t, propertyId, searchParamsString }) => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTime, setSelectedTime] = useState('19:00');

  const seatingGroups = useMemo(() => {
    if (!tables) return {};
    return tables.reduce((acc, table) => {
      const type = table.location_type;
      if (!acc[type]) acc[type] = { count: 0, capacities: [], ids: [] };
      acc[type].count += 1;
      acc[type].capacities.push(table.capacity);
      acc[type].ids.push(table.id);
      return acc;
    }, {});
  }, [tables]);

  const handleBook = (groupData) => {
    if (!groupData.ids.length) return;
    const params = new URLSearchParams(searchParamsString);
    const checkInDate = params.get('checkin') || new Date().toISOString().split('T')[0];
    
    const query = new URLSearchParams({
      p_id: propertyId,
      item_id: groupData.ids[0],
      p_t: 'table',
      guests: guestCount,
      checkin: checkInDate,
      time: selectedTime,
    });
    router.push(`/booking/?${query.toString()}`);
  };

  if (!tables || tables.length === 0) return null;

  return (
    <section className="w-full py-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Seating Preference</h2>
          <p className="text-sm text-slate-500 mt-1">Select an area to reserve</p>
        </div>
      </div>
      
      {/* FIX: Added 'items-start'. 
         This prevents the non-selected cards from stretching to match the height of the selected one.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {Object.entries(seatingGroups).map(([code, data]) => (
          <SeatingCard
            key={code}
            code={code}
            data={data}
            isSelected={selectedType === code}
            onSelect={() => setSelectedType(selectedType === code ? null : code)}
            guestCount={guestCount}
            setGuestCount={setGuestCount}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            onBook={() => handleBook(data)}
          />
        ))}
      </div>
    </section>
  );
};

const SeatingCard = ({ 
  code, data, isSelected, onSelect, 
  guestCount, setGuestCount, selectedTime, setSelectedTime, onBook 
}) => {
  const config = LOCATION_CONFIG[code] || LOCATION_CONFIG['MH'];
  const Icon = config.icon;
  const maxCapacity = Math.max(...data.capacities);
  const isLimited = data.count < 3; 

  return (
    <div 
      className={cn(
        // FIX: Added 'h-fit' so the card only takes up as much space as it needs
        "relative flex flex-col rounded-xl border transition-all duration-200 bg-white h-fit",
        isSelected 
          ? "border-blue-600 ring-1 ring-blue-600 shadow-lg z-10" 
          : "border-slate-200 hover:border-blue-300 hover:shadow-md"
      )}
    >
      {/* --- TOP SECTION (Always Visible) --- */}
      <button 
        onClick={onSelect}
        className="w-full text-left p-4 flex flex-col outline-none"
      >
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-lg shrink-0", config.bg, config.color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className={cn("font-bold text-base leading-tight", isSelected ? 'text-blue-700' : 'text-slate-900')}>
                {config.label}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{config.desc}</p>
            </div>
          </div>
          
          {/* Checkbox / Circle */}
          <div className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0",
            isSelected ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"
          )}>
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        </div>

        {/* Tags Row */}
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
            <Users className="w-3 h-3 text-slate-400" />
            Max {maxCapacity}
          </span>
          {isLimited && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded">
              LIMITED
            </span>
          )}
        </div>
      </button>

      {/* --- EXPANDED SECTION (Booking Controls) --- */}
      {isSelected && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-1 fade-in duration-200">
          <div className="h-px w-full bg-slate-100 mb-4" /> 
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Time Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Time</label>
              <div className="relative">
                <input 
                  type="time" 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <Clock className="absolute left-2 top-2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Guests Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Guests</label>
              <div className="relative">
                <select 
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full pl-7 pr-4 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
                >
                  {[...Array(maxCapacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <Users className="absolute left-2 top-2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onBook(); }}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            Confirm Selection
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatingOptions;