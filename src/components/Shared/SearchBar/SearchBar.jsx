"use client";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Keep this import
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaMinus, FaPlus, FaBed, FaUtensils } from "react-icons/fa";
import { format } from "date-fns";
import { useTranslations } from 'next-intl';
import { useSearchForm } from "@/hooks/useSearchForm";

const GuestCounter = ({ label, value, onUpdate, min = 0 }) => (
  <div className="flex justify-between items-center mb-4">
    <span className="font-medium text-gray-800 text-base">{label}</span>
    <div className="flex items-center border border-gray-300 rounded-md">
      <button onClick={() => onUpdate('dec')} disabled={value <= min} className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed">
        <FaMinus size={14} />
      </button>
      <span className="w-10 text-center text-base font-semibold">{value}</span>
      <button onClick={() => onUpdate('inc')} className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-blue-50">
        <FaPlus size={14} />
      </button>
    </div>
  </div>
);

const SearchBar = () => {
  const t = useTranslations('SearchBar');

  const {
    serviceType, setServiceType, destination, setDestination,
    dateRange, setDateRange, singleDate, setSingleDate,
    guests, handleGuestChange, handleSearch
  } = useSearchForm();

  // UI State
  const [openLocation, setOpenLocation] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);
  const locationRef = useRef(null);
  const dateRef = useRef(null);
  const guestsRef = useRef(null);

  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) setOpenLocation(false);
      if (dateRef.current && !dateRef.current.contains(event.target)) setOpenDate(false);
      if (guestsRef.current && !guestsRef.current.contains(event.target)) setOpenGuests(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // FIX 2: Added z-50 here to ensure the whole bar sits on top of other content
    <div className="w-full max-w-[1140px] mx-auto relative font-sans text-gray-800 z-50">

      {/* --- TABS --- */}
      <div className="flex gap-2 mb-2 ml-1">
        <button onClick={() => setServiceType('hotels')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${serviceType === 'hotels' ? 'bg-[#febb02] text-black shadow-md' : 'bg-white/80 text-gray-700 hover:bg-white backdrop-blur-md'}`}>
          <FaBed /> {t('hotels')}
        </button>
        <button onClick={() => setServiceType('restaurants')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${serviceType === 'restaurants' ? 'bg-[#febb02] text-black shadow-md' : 'bg-white/80 text-gray-700 hover:bg-white backdrop-blur-md'}`}>
          <FaUtensils /> {t('restaurants')}
        </button>
      </div>

      {/* --- SEARCH CONTAINER --- */}
      <div className="bg-[#febb02] p-1 rounded-md shadow-lg relative z-50">
        <div className="grid grid-cols-12 lg:flex lg:flex-row gap-1 lg:h-[64px]">

          {/* Location */}
          <div className="col-span-12 relative flex-1 bg-white rounded" ref={locationRef}>
            <div className={`flex items-center gap-3 px-4 py-4 h-full hover:bg-gray-50 rounded cursor-pointer transition ${openLocation ? 'bg-gray-100' : ''}`} onClick={() => setOpenLocation(true)}>
              <FaMapMarkerAlt className="text-gray-500 text-xl shrink-0" />
              <input type="text" placeholder={t('slogan')} value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-800 font-medium placeholder:text-gray-500 text-base truncate" />
            </div>
            {/* Dropdown would go here */}
          </div>

          {/* --- DATE INPUT --- */}
          <div className="col-span-12 lg:flex-1 relative bg-white rounded" ref={dateRef}>
            <div onClick={() => setOpenDate(!openDate)} className="flex items-center gap-3 px-4 h-full hover:bg-gray-50 rounded cursor-pointer transition relative z-10">
              <FaCalendarAlt className="text-gray-500 text-xl shrink-0" />
              <div className="flex flex-col justify-center items-start w-full py-4">
                <span className="text-base font-medium text-gray-800 truncate w-full">
                  {serviceType === 'hotels' ? (startDate ? `${format(startDate, "MMM d")} - ${endDate ? format(endDate, "MMM d") : t('checkout')}` : t('add_dates')) : (singleDate ? format(singleDate, "PPP") : t('select_date'))}
                </span>
              </div>
            </div>

            {openDate && (
              // FIX 3: Added z-50 and removed "overflow-hidden" from this wrapper so shadow shows
              <div className="absolute top-full left-0 mt-3 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 z-50 w-full sm:w-auto">
                <DatePicker
                  selected={serviceType === 'hotels' ? startDate : singleDate}
                  onChange={(update) => serviceType === 'hotels' ? setDateRange(update) : setSingleDate(update)}
                  startDate={serviceType === 'hotels' ? startDate : undefined}
                  endDate={serviceType === 'hotels' ? endDate : undefined}
                  selectsRange={serviceType === 'hotels'}
                  inline
                  monthsShown={2}
                  minDate={new Date()}
                />
              </div>
            )}
          </div>

          {/* --- GUESTS INPUT --- */}
          <div className="col-span-12 lg:flex-1 relative bg-white rounded" ref={guestsRef}>
            <div onClick={() => setOpenGuests(!openGuests)} className="flex items-center gap-3 px-4 py-4 h-full hover:bg-gray-50 rounded cursor-pointer transition relative z-10">
              <FaUser className="text-gray-500 text-xl shrink-0" />
              <span className="text-base font-medium text-gray-800 truncate">
                {serviceType === 'hotels' ? `${guests.adults} Adults · ${guests.rooms} Rooms` : `${guests.people} People`}
              </span>
            </div>

            {openGuests && (
              <div className="absolute top-full right-0 mt-2 bg-white p-5 shadow-xl rounded-lg z-50 w-[320px] border border-gray-200">
                {serviceType === 'hotels' ? (
                  <>
                    <GuestCounter label={t('adults')} value={guests.adults} onUpdate={(op) => handleGuestChange('adults', op)} min={1} />
                    <GuestCounter label={t('children')} value={guests.children} onUpdate={(op) => handleGuestChange('children', op)} min={0} />
                    <GuestCounter label={t('rooms')} value={guests.rooms} onUpdate={(op) => handleGuestChange('rooms', op)} min={1} />
                  </>
                ) : (
                  <GuestCounter label={t('people')} value={guests.people} onUpdate={(op) => handleGuestChange('people', op)} min={1} />
                )}
                <button className="w-full mt-4 py-3 text-blue-600 border border-blue-600 rounded font-semibold hover:bg-blue-50 transition text-base" onClick={() => setOpenGuests(false)}>
                  {t('done')}
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
         <div className="col-span-12 lg:w-auto">
            <button onClick={handleSearch} className="bg-[#003b95] text-white font-bold h-full w-full px-8 py-3 rounded shadow-sm hover:bg-[#00224f] transition">
              {t('search')}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SearchBar;