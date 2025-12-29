'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Calendar, Clock, Users, ChevronDown, Minus, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useAvailability } from '@/hooks/useAvailability';

// --- Utility: Get Default Dates ---
const getDefaults = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    checkIn: today.toISOString().split('T')[0],
    checkOut: tomorrow.toISOString().split('T')[0],
    time: '19:00',
  };
};

// --- Sub-Component: Guest Counter ---
const GuestCounter = ({ label, value, onUpdate, min = 0 }) => (
  <div className="flex justify-between items-center mb-3 last:mb-0">
    <span className="font-semibold text-slate-700 text-sm">{label}</span>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onUpdate('dec');
        }}
        disabled={value <= min}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-200 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label={`Decrease ${label}`}
      >
        <Minus size={14} />
      </button>
      
      <span className="w-4 text-center text-sm font-bold text-slate-900 tabular-nums">
        {value}
      </span>
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onUpdate('inc');
        }}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label={`Increase ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
);

GuestCounter.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  min: PropTypes.number,
};

// --- Main Component: Booking Widget ---
const BookingWidget = ({
  isHotel = true,
  searchParamsString = '',
  t,
  property,
  onAvailabilityFound,
}) => {
  // --- 1. Parse URL Params ---
  const initialValues = useMemo(() => {
    const params = new URLSearchParams(searchParamsString);
    const defaults = getDefaults();

    // Check strict lowercase 'checkin' vs camelCase 'checkIn'
    const urlCheckIn = params.get('checkin') || params.get('checkIn');
    const urlCheckOut = params.get('checkout') || params.get('checkOut');

    return {
      dates: {
        checkIn: urlCheckIn || defaults.checkIn,
        checkOut: urlCheckOut || defaults.checkOut,
        time: params.get('time') || defaults.time,
      },
      guests: {
        adults: parseInt(params.get('adults') || '2', 10),
        children: parseInt(params.get('children') || '0', 10),
        rooms: parseInt(params.get('rooms') || '1', 10),
        people: parseInt(params.get('people') || '2', 10),
      },
    };
  }, [searchParamsString]);

  // --- 2. Initialize Hooks ---
  const {
    checkAvailability,
    loading,
    error,
    availableItems,
  } = useAvailability(property?.id, property?.property_type);

  // --- 3. Local State ---
  const [openGuests, setOpenGuests] = useState(false);
  const guestsRef = useRef(null);

  // Initialize state from parsed URL values
  const [dates, setDates] = useState(initialValues.dates);
  const [guests, setGuests] = useState(initialValues.guests);

  // --- 4. Effects ---

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setOpenGuests(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notify Parent on Data Found
  useEffect(() => {
    if (availableItems && onAvailabilityFound) {
      onAvailabilityFound(availableItems);
    }
  }, [availableItems, onAvailabilityFound]);

  // Auto-Search on Mount / Param Change
  useEffect(() => {
    if (!property?.id) return;

    const filters = {
      checkIn: initialValues.dates.checkIn,
      guests: initialValues.guests,
    };

    if (isHotel) {
      filters.checkOut = initialValues.dates.checkOut;
    } else {
      filters.time = initialValues.dates.time;
    }

    checkAvailability(filters);
  }, [
    initialValues,
    property?.id,
    isHotel,
    checkAvailability,
  ]);

  // --- 5. Handlers ---
  const handleSearch = useCallback(() => {
    const filters = {
      checkIn: dates.checkIn,
      guests: guests,
    };

    if (isHotel) {
      filters.checkOut = dates.checkOut;
    } else {
      filters.time = dates.time;
    }

    checkAvailability(filters);
  }, [dates, guests, isHotel, checkAvailability]);

  const handleGuestChange = useCallback((type, operation) => {
    setGuests((prev) => {
      const newValue = operation === 'inc' ? prev[type] + 1 : prev[type] - 1;
      const minValue = type === 'children' ? 0 : 1;
      
      if (newValue < minValue) return prev;
      return { ...prev, [type]: newValue };
    });
  }, []);

  const handleDateChange = (field, value) => {
    setDates((prev) => ({ ...prev, [field]: value }));
  };

  const getGuestLabel = useCallback(() => {
    if (isHotel) {
      const parts = [t('adults', { count: guests.adults })];
      if (guests.children > 0) parts.push(t('children', { count: guests.children }));
      if (guests.rooms > 1) parts.push(t('rooms', { count: guests.rooms }));
      return parts.join(', ');
    }
    return t('people', { count: guests.people });
  }, [isHotel, guests, t]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 w-full max-w-md sticky top-24 transition-all duration-200">
      
      {/* Title */}
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-xl font-extrabold text-slate-900">
          {isHotel ? t('check_availability_box_title') : t('reserve_table_box_title')}
        </h3>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        
        {/* Date / Time Inputs */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Check-In */}
          <div className="space-y-1">
            <label htmlFor="check-in-date" className="text-[10px] font-bold uppercase text-slate-400 tracking-wide block">
              {isHotel ? t('check_in') : t('date')}
            </label>
            <div className="relative group">
              <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
              <input
                id="check-in-date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={dates.checkIn}
                onChange={(e) => handleDateChange('checkIn', e.target.value)}
                className="w-full pl-10 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium transition-all hover:bg-slate-100"
              />
            </div>
          </div>

          {/* Check-Out / Time */}
          <div className="space-y-1">
            <label htmlFor="check-out-input" className="text-[10px] font-bold uppercase text-slate-400 tracking-wide block">
              {isHotel ? t('check_out') : t('time')}
            </label>
            <div className="relative group">
              {isHotel ? (
                <>
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                  <input
                    id="check-out-input"
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
                    id="check-out-input"
                    value={dates.time}
                    onChange={(e) => handleDateChange('time', e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-slate-700 font-medium cursor-pointer hover:bg-slate-100 transition-all"
                  >
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
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wide block mb-1">
            {isHotel ? t('guests') : t('party_size')}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenGuests(!openGuests)}
              className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${openGuests ? 'border-blue-500 ring-1 ring-blue-500 bg-white' : 'border-slate-200 hover:bg-slate-100'} rounded-lg text-sm cursor-pointer flex items-center justify-between transition-all select-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-haspopup="true"
              aria-expanded={openGuests}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Users className="w-4 h-4 text-slate-400 shrink-0 absolute left-3" />
                <span className="text-slate-700 font-medium truncate ml-1">
                  {getGuestLabel()}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openGuests ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {openGuests && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white p-4 shadow-xl rounded-xl z-50 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                {isHotel ? (
                  <>
                    <GuestCounter
                      label={t('adults_label')}
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
                    <div className="my-3 border-t border-slate-100" />
                    <GuestCounter
                      label={t('rooms_label')}
                      value={guests.rooms}
                      onUpdate={(op) => handleGuestChange('rooms', op)}
                      min={1}
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
                  type="button"
                  className="w-full mt-4 py-2.5 text-sm bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-900"
                  onClick={() => setOpenGuests(false)}
                >
                  {t('done')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="w-full mt-2 bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold py-3.5 rounded-lg shadow-sm transition-all active:scale-[0.98] text-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#006ce4]"
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
          {!loading && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
          <p className="text-xs text-slate-500 font-medium">
            {isHotel ? t('no_charge_message') : t('instant_confirmation')}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- PropTypes Validation ---
BookingWidget.propTypes = {
  isHotel: PropTypes.bool,
  searchParamsString: PropTypes.string,
  t: PropTypes.func.isRequired,
  property: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    property_type: PropTypes.string,
  }),
  onAvailabilityFound: PropTypes.func,
};

export default BookingWidget;