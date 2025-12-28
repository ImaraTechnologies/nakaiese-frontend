'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Users, ChevronDown, Minus, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useAvailability } from '@/hooks/useAvailability';

const BookingWidget = ({
  isHotel = true,
  t,
  property, // We need the property object for ID and Type
  onAvailabilityFound // Callback to pass data to parent (e.g., to show RoomList)
}) => {

  // --- 1. Initialize Hook ---
  const { 
    checkAvailability, 
    loading, 
    error, 
    availableItems 
  } = useAvailability(property?.id, property?.property_type);

  // --- 2. State & Refs ---
  const [openGuests, setOpenGuests] = useState(false);
  const guestsRef = useRef(null);

  // FIXED: Moved Date.now() inside the useState initializer to make it pure
  const [dates, setDates] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    return {
      checkIn: today,
      checkOut: tomorrow,
      time: '19:00'
    };
  });

  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
    people: 2
  });

  // --- 3. Effects ---
  
  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setOpenGuests(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Watch for successful data fetch and notify parent
  useEffect(() => {
    if (availableItems) {
      // Pass the results up to the Page component to render the Room List or Table Map
      if (onAvailabilityFound) {
        onAvailabilityFound(availableItems);
      }
    }
  }, [availableItems, onAvailabilityFound]);


  // --- 4. Handlers ---

  const handleSearch = () => {
    // Construct the filter object based on Property Type
    const filters = {
      checkIn: dates.checkIn,
      guests: guests // Pass the whole object, the hook handles the math
    };

    if (isHotel) {
      filters.checkOut = dates.checkOut;
    } else {
      filters.time = dates.time;
    }

    // Trigger the hook
    checkAvailability(filters);
  };

  const handleGuestChange = (type, operation) => {
    setGuests(prev => {
      const newValue = operation === 'inc' ? prev[type] + 1 : prev[type] - 1;
      const minValue = (type === 'children') ? 0 : 1;
      if (newValue < minValue) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const handleDateChange = (field, value) => {
    setDates(prev => ({ ...prev, [field]: value }));
  };

  const getGuestLabel = () => {
    if (isHotel) {
      const parts = [t('adults', { count: guests.adults })];
      if (guests.children > 0) parts.push(t('children', { count: guests.children }));
      if (guests.rooms > 1) parts.push(t('rooms', { count: guests.rooms }));
      return parts.join(', ');
    }
    return t('people', { count: guests.people });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 w-full max-w-md sticky top-24 transition-all duration-200">

      {/* Header */}
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-xl font-extrabold text-slate-900">
          {isHotel ? t('check_availability_box_title') : t('reserve_table_box_title')}
        </h3>
      </div>

      {/* Error Message (Dismissible or Auto-hide logic in Hook) */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Inputs Container */}
      <div className="space-y-4">

        {/* Date/Time Row */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Check-in */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">
              {isHotel ? t('check_in') : t('date')}
            </label>
            <div className="relative group">
              <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={dates.checkIn}
                onChange={(e) => handleDateChange('checkIn', e.target.value)}
                className="w-full pl-10 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium transition-all hover:bg-slate-100" 
              />
            </div>
          </div>

          {/* Check-out / Time */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">
              {isHotel ? t('check_out') : t('time')}
            </label>
            <div className="relative group">
              {isHotel ? (
                <>
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                  <input 
                    type="date" 
                    min={dates.checkIn}
                    value={dates.checkOut}
                    onChange={(e) => handleDateChange('checkOut', e.target.value)}
                    className="w-full pl-10 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium transition-all hover:bg-slate-100" 
                  />
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                  <select 
                    value={dates.time}
                    onChange={(e) => handleDateChange('time', e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-slate-700 font-medium cursor-pointer hover:bg-slate-100 transition-all"
                  >
                    {/* Mock Times - In production, fetch available slots from API if possible */}
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                  </select>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Guests Selector */}
        <div className="space-y-1" ref={guestsRef}>
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">
            {isHotel ? t('guests') : t('party_size')}
          </label>
          <div className="relative">
            {/* Trigger */}
            <div
              onClick={() => setOpenGuests(!openGuests)}
              className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${openGuests ? 'border-blue-500 ring-1 ring-blue-500 bg-white' : 'border-slate-200 hover:bg-slate-100'} rounded-lg text-sm cursor-pointer flex items-center justify-between transition-all select-none`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Users className="w-4 h-4 text-slate-400 shrink-0 absolute left-3" />
                <span className="text-slate-700 font-medium truncate ml-1">{getGuestLabel()}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openGuests ? 'rotate-180' : ''}`} />
            </div>

            {/* Popover */}
            {openGuests && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white p-4 shadow-xl rounded-xl z-50 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                {isHotel ? (
                  <>
                    <GuestCounter label={t('adults_label')} value={guests.adults} onUpdate={(op) => handleGuestChange('adults', op)} min={1} />
                    <GuestCounter label={t('children_label')} value={guests.children} onUpdate={(op) => handleGuestChange('children', op)} min={0} />
                    <div className="my-3 border-t border-slate-100" />
                    <GuestCounter label={t('rooms_label')} value={guests.rooms} onUpdate={(op) => handleGuestChange('rooms', op)} min={1} />
                  </>
                ) : (
                  <GuestCounter label={t('people_label')} value={guests.people} onUpdate={(op) => handleGuestChange('people', op)} min={1} />
                )}
                <button
                  className="w-full mt-4 py-2.5 text-sm bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition shadow-sm"
                  onClick={() => setOpenGuests(false)}
                >
                  {t('done')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="w-full mt-2 bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold py-3.5 rounded-lg shadow-sm transition-all active:scale-[0.98] text-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            isHotel ? t('check_availability') : t('reserve_table')
          )}
        </button>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 mt-2">
            {!loading && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
            <p className="text-xs text-slate-500 font-medium">
            {isHotel ? t('no_charge_message') : t('instant_confirmation')}
            </p>
        </div>
      </div>
    </div>
  );
};

// ... GuestCounter component remains the same ...
const GuestCounter = ({ label, value, onUpdate, min = 0 }) => (
  <div className="flex justify-between items-center mb-3 last:mb-0">
    <span className="font-semibold text-slate-700 text-sm">{label}</span>
    <div className="flex items-center gap-3">
      <button
        onClick={(e) => { e.stopPropagation(); onUpdate('dec'); }}
        disabled={value <= min}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-200 transition-colors bg-white"
        type="button"
      >
        <Minus size={14} />
      </button>
      <span className="w-4 text-center text-sm font-bold text-slate-900">{value}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onUpdate('inc'); }}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white"
        type="button"
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
);

export default BookingWidget;