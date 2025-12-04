"use client";

import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaMinus, FaPlus } from "react-icons/fa";
import { format } from "date-fns";
// import "./datepicker-custom.css"; 

const POPULAR_LOCATIONS = [
  { city: "Lahore", country: "Pakistan" },
  { city: "Karachi", country: "Pakistan" },
  { city: "Islamabad", country: "Pakistan" },
];

const SearchBar = () => {
  // --- State ---
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
    pets: false,
  });

  const [openLocation, setOpenLocation] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);

  const locationRef = useRef(null);
  const dateRef = useRef(null);
  const guestsRef = useRef(null);

  // --- Click Outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) setOpenLocation(false);
      if (dateRef.current && !dateRef.current.contains(event.target)) setOpenDate(false);
      if (guestsRef.current && !guestsRef.current.contains(event.target)) setOpenGuests(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Handlers ---
  const updateGuests = (type, operation) => {
    setGuests((prev) => {
      const newValue = operation === "inc" ? prev[type] + 1 : prev[type] - 1;
      if (type === "adults" && newValue < 1) return prev;
      if (type === "rooms" && newValue < 1) return prev;
      if (type === "children" && newValue < 0) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const togglePets = () => setGuests(prev => ({ ...prev, pets: !prev.pets }));

  return (
    <div className="w-full max-w-[1140px] mx-auto z-50 relative font-sans text-gray-800">
      {/* Yellow Background Container */}
      <div className="bg-[#febb02] p-1 rounded-md shadow-lg">
        {/* Grid Layout: Increased height from [52px] to [64px] */}
        <div className="grid grid-cols-12 lg:flex lg:flex-row gap-1 lg:h-[64px]">
          
          {/* --- 1. DESTINATION --- */}
          <div className="col-span-12 relative flex-1 h-[64px] lg:h-full bg-white rounded" ref={locationRef}>
            <div 
              // Increased padding (px-4)
              className={`flex items-center gap-3 px-4 h-full hover:bg-gray-50 rounded cursor-pointer transition ${openLocation ? 'bg-gray-100' : ''}`}
              onClick={() => setOpenLocation(true)}
            >
              {/* Increased icon size to text-xl */}
              <FaMapMarkerAlt className="text-gray-500 text-xl shrink-0" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                // Increased font size to text-base
                className="w-full bg-transparent focus:outline-none text-gray-800 font-medium placeholder:text-gray-500 text-base truncate"
              />
            </div>
             {openLocation && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-xl rounded-lg overflow-hidden z-30 border border-gray-200">
                <div className="p-4 bg-gray-50 border-b text-sm font-bold text-gray-500 uppercase tracking-wider">Popular Destinations</div>
                {POPULAR_LOCATIONS.map((loc) => (
                  <div key={loc.city} className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 border-b last:border-0"
                    onClick={() => { setDestination(loc.city); setOpenLocation(false); setOpenDate(true); }}>
                     <FaMapMarkerAlt className="text-gray-400 text-lg" />
                     <div><div className="font-semibold text-gray-800 text-base">{loc.city}</div><div className="text-sm text-gray-500">{loc.country}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- 2. DATE PICKER --- */}
          <div className="col-span-12 lg:flex-1 relative h-[64px] lg:h-full z-20 bg-white rounded" ref={dateRef}>
            <div 
              // Increased padding (px-4)
              className="flex items-center gap-3 px-4 h-full hover:bg-gray-50 rounded cursor-pointer transition"
              onClick={() => setOpenDate(!openDate)}
            >
              {/* Increased icon size to text-xl */}
              <FaCalendarAlt className="text-gray-500 text-xl shrink-0" />
              <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-start w-full gap-1">
                 
                 {/* Mobile View */}
                 {/* <div className="flex flex-col w-1/2 lg:w-auto">
                    <span className="text-xs text-gray-500 font-bold lg:hidden uppercase tracking-wider">Check-in</span>
                    <span className="text-base font-medium text-gray-800 truncate">
                      {startDate ? format(startDate, "MMM d") : "Add Date"}
                    </span>
                 </div> */}
                 
                 {/* <div className="block lg:hidden w-[1px] h-10 bg-gray-200"></div>

                 <div className="flex flex-col w-1/2 lg:w-auto pl-2 lg:pl-0">
                    <span className="text-xs text-gray-500 font-bold lg:hidden uppercase tracking-wider">Check-out</span>
                     <span className="text-base font-medium text-gray-800 truncate">
                      {endDate ? format(endDate, "MMM d") : "Add Date"}
                    </span>
                 </div>
                 
                     */}
                 {/* Desktop View - Increased font size to text-base */}
                 <span className="text-base font-medium text-gray-800 truncate w-full">
                   {startDate ? `${format(startDate, "MMM d")} — ${endDate ? format(endDate, "MMM d") : "Check-out"}` : "Check-in — Check-out"}
                 </span>
              </div>
            </div>

            {openDate && (
               <div className="absolute top-full left-0 lg:left-[-50px] mt-2 shadow-2xl rounded-xl border border-gray-200 overflow-hidden bg-white p-4 custom-datepicker-wrapper w-[300px] sm:w-[600px] z-50">
                 <DatePicker
                    selected={startDate}
                    onChange={(update) => setDateRange(update)}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    monthsShown={2}
                    minDate={new Date()}
                 />
               </div>
            )}
          </div>

          {/* --- 3. GUESTS & PETS --- */}
          <div className="col-span-12 lg:flex-1 relative h-[64px] lg:h-full bg-white rounded" ref={guestsRef}>
            <div 
              // Increased padding (px-4)
              className="flex items-center gap-3 px-4 h-full hover:bg-gray-50 rounded cursor-pointer transition"
              onClick={() => setOpenGuests(!openGuests)}
            >
              {/* Increased icon size to text-xl */}
              <FaUser className="text-gray-500 text-xl shrink-0" />
              
              <div className="flex flex-row items-center w-full justify-between lg:justify-start lg:flex-col lg:items-start">
                 {/* Mobile View - Increased font size */}
                 <div className="flex lg:hidden w-full justify-between gap-2 text-base font-medium text-gray-800">
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Adults</span>
                        <span>{guests.adults}</span>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-200"></div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Child</span>
                        <span>{guests.children}</span>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-200"></div>
                     <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Rooms</span>
                        <span>{guests.rooms}</span>
                    </div>
                 </div>

                 {/* Desktop View - Increased font size to text-base */}
                 <span className="hidden lg:block text-base font-medium text-gray-800 truncate">
                   {guests.adults} adults · {guests.children} children · {guests.rooms} room
                 </span>
              </div>
            </div>

            {openGuests && (
              <div className="absolute top-full right-0 mt-2 w-full lg:w-[320px] bg-white shadow-xl rounded-lg p-5 border border-gray-200 z-30">
                {['Adults', 'Children', 'Rooms'].map((label) => {
                    const key = label.toLowerCase();
                    return (
                        <div key={key} className="flex justify-between items-center mb-4">
                            <span className="font-medium text-gray-800 text-base">{label}</span>
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button onClick={() => updateGuests(key, 'dec')} disabled={key === 'adults' && guests.adults <= 1 || key === 'rooms' && guests.rooms <= 1 || key === 'children' && guests.children <= 0}
                                    className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed">
                                    <FaMinus size={14} />
                                </button>
                                <span className="w-10 text-center text-base font-semibold">{guests[key]}</span>
                                <button onClick={() => updateGuests(key, 'inc')} className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-blue-50">
                                    <FaPlus size={14} />
                                </button>
                            </div>
                        </div>
                    )
                })}
                <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800 text-base">Travelling with pets?</span>
                        <div onClick={togglePets} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${guests.pets ? 'bg-blue-600' : 'bg-gray-300'}`}>
                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${guests.pets ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </div>
                </div>
                <button 
                  className="w-full mt-4 py-3 text-blue-600 border border-blue-600 rounded font-semibold hover:bg-blue-50 transition text-base"
                  onClick={() => setOpenGuests(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* 4. SEARCH BUTTON */}
          <div className="col-span-12 lg:w-auto h-[64px] lg:h-full">
            <button className="bg-[#003b95] hover:bg-[#00224f] text-white text-xl font-bold px-8 h-full w-full rounded shadow-sm transition-colors flex items-center justify-center">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;