'use client'; // Required for Next.js App Router

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Users, ChevronDown, Minus, Plus } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';

const BookingWidget = ({
  isHotel = true,
  // We assume these are passed as translation keys or raw strings. 
  // Ideally, pass the key "price_start" and "unit_night" from parent
  priceLabel = "price_start",
  unitLabel = "unit_night",
  t,
  property,
}) => {

  // --- Internationalization Hooks ---
  // Assuming your JSON structure is nested under "BookingWidget"
  const format = useFormatter();

  // --- State & Refs ---
  const [openGuests, setOpenGuests] = useState(false);
  const guestsRef = useRef(null);

  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
    people: 2
  });

  // --- Logic ---

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setOpenGuests(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGuestChange = (type, operation) => {
    setGuests(prev => {
      const newValue = operation === 'inc' ? prev[type] + 1 : prev[type] - 1;
      const minValue = (type === 'children') ? 0 : 1;

      if (newValue < minValue) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  // --- Dynamic Label Generation with Pluralization ---
  // note: We use {count} so next-intl handles "1 Adult" vs "2 Adults" automatically
  const getGuestLabel = () => {
    if (isHotel) {
      const parts = [t('adults', { count: guests.adults })];

      if (guests.children > 0) {
        parts.push(t('children', { count: guests.children }));
      }
      // Only show room count if > 1 to save space, or always if you prefer
      if (guests.rooms > 1) {
        parts.push(t('rooms', { count: guests.rooms }));
      }
      return parts.join(', ');
    }
    return t('people', { count: guests.people });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 w-full max-w-md">

      {/* 1. Price Header */}
      <div className="mb-6">
        {/* Try to translate the label, fallback to prop if not found */}
        <span className="text-slate-400 text-sm">{t.has(priceLabel) ? t(priceLabel) : priceLabel}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-slate-900">
           {

           }
          </span>
          {/*
          {displayPrice > 0 && (
            <span className="text-slate-500 text-sm">
               Try to translate unit, fallback to prop 
              {t.has(unitLabel) ? t(unitLabel) : unitLabel}
            </span>
          )}
               */}
        </div>
      </div>

      {/* 2. Inputs Container */}
      <div className="space-y-4">

        {/* Date/Time Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400">
              {isHotel ? t('check_in') : t('date')}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
              <input type="date" className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none text-slate-700" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400">
              {isHotel ? t('check_out') : t('time')}
            </label>
            <div className="relative">
              {isHotel ? <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" /> : <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />}
              {isHotel ? (
                <input type="date" className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none text-slate-700" />
              ) : (
                <select className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none appearance-none bg-slate-50 text-slate-700 cursor-pointer">
                  <option>19:00</option>
                  <option>20:00</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* 3. Guests Selector */}
        <div className="space-y-1" ref={guestsRef}>
          <label className="text-xs font-bold uppercase text-slate-400">
            {isHotel ? t('guests') : t('party_size')}
          </label>
          <div className="relative">

            {/* Trigger */}
            <div
              onClick={() => setOpenGuests(!openGuests)}
              className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${openGuests ? 'border-yellow-500 ring-1 ring-yellow-500' : 'border-slate-200'} rounded-lg text-sm cursor-pointer flex items-center justify-between transition-all select-none`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Users className="w-4 h-4 text-slate-400 shrink-0 absolute left-3" />
                <span className="text-slate-700 font-medium truncate ml-1">{getGuestLabel()}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openGuests ? 'rotate-180' : ''}`} />
            </div>

            {/* Popover */}
            {openGuests && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white p-5 shadow-xl rounded-xl z-50 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                {isHotel ? (
                  <>
                    <GuestCounter
                      label={t('adults_label')} // Static label for the counter row
                      value={guests.adults}
                      onUpdate={(op) => handleGuestChange('adults', op)}
                      min={1}
                    />
                    <GuestCounter
                      label={t('children_label')}
                      value={guests.children}
                      onUpdate={(op) => handleGuestChange('children', op)}
                      min={0}
                    />
                    
                  </>
                ) : (
                  <GuestCounter
                    label={t('people_label')}
                    value={guests.people}
                    onUpdate={(op) => handleGuestChange('people', op)}
                    min={1}
                  />
                )}

                <button
                  className="w-full mt-4 py-2.5 text-sm bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
                  onClick={() => setOpenGuests(false)}
                >
                  {t('done')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4. Action Button */}
        <button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-yellow-500/30 transition-all active:scale-[0.98]">
          {isHotel ? t('check_availability') : t('reserve_table')}
        </button>

        <p className="text-xs text-center text-slate-400 mt-2">
          {isHotel ? t('no_charge_message') : t('instant_confirmation')}
        </p>
      </div>
    </div>
  );
};

const GuestCounter = ({ label, value, onUpdate, min = 0 }) => (
  <div className="flex justify-between items-center mb-3 last:mb-0">
    <span className="font-medium text-slate-700 text-sm capitalize">{label}</span>
    <div className="flex items-center gap-3">
      <button
        onClick={(e) => { e.stopPropagation(); onUpdate('dec'); }}
        disabled={value <= min}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-yellow-500 hover:text-yellow-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-200 transition-colors bg-white"
        type="button"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-sm font-semibold text-slate-900">{value}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onUpdate('inc'); }}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-yellow-500 hover:text-yellow-600 transition-colors bg-white"
        type="button"
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
);

export default BookingWidget;