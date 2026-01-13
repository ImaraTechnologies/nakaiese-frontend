"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUser, FaMinus, FaPlus, 
  FaBed, FaUtensils, FaSpinner, FaDog, FaChevronDown 
} from "react-icons/fa";
import { format } from "date-fns";
import { useTranslations } from 'next-intl';
import { useSearchBarLogic } from "@/hooks/useSearchBar"; // Import the logic hook

// --- Helper UI Component ---
const GuestCounter = ({ label, subLabel, value, onUpdate, min = 0 }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex flex-col">
      <span className="font-medium text-gray-800 text-base">{label}</span>
      {subLabel && <span className="text-xs text-gray-500">{subLabel}</span>}
    </div>
    <div className="flex items-center border border-gray-300 rounded-md">
      <button 
        onClick={(e) => { e.stopPropagation(); onUpdate('dec'); }} 
        disabled={value <= min} 
        className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaMinus size={12} />
      </button>
      <span className="w-10 text-center text-base font-semibold">{value}</span>
      <button 
        onClick={(e) => { e.stopPropagation(); onUpdate('inc'); }} 
        className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-blue-50"
      >
        <FaPlus size={12} />
      </button>
    </div>
  </div>
);

const SearchBar = () => {
  const t = useTranslations('SearchBar');
  
  // --- Extract all logic from the hook ---
  const {
    serviceType, setServiceType,
    destination, setDestination,
    dateRange, setDateRange,
    singleDate, setSingleDate,
    guests, handleGuestChange,
    petFriendly, setPetFriendly,
    childAges, updateSpecificAge,
    openLocation, setOpenLocation,
    openDate, setOpenDate,
    openGuests, setOpenGuests,
    isCitiesLoading, filteredCities,
    startDate, endDate,
    locationRef, dateRef, guestsRef,
    handleChildrenUpdate, handleCitySelect, onSearchClick
  } = useSearchBarLogic();

  return (
    <div className={`w-full max-w-[1140px] relative font-sans text-gray-800 `}>

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
      <div className="bg-[#febb02] p-1 rounded-md shadow-lg relative">
        <div className="grid grid-cols-12 lg:flex lg:flex-row gap-1 lg:h-[64px]">

          {/* --- LOCATION --- */}
          <div className="col-span-12 relative flex-1 bg-white rounded" ref={locationRef}>
            <div className={`flex items-center gap-3 px-4 py-4 h-full hover:bg-gray-50 rounded cursor-pointer transition ${openLocation ? 'bg-gray-100' : ''}`} onClick={() => setOpenLocation(true)}>
              <FaMapMarkerAlt className="text-gray-500 text-xl shrink-0" />
              <input 
                type="text" 
                placeholder={t('slogan')} 
                value={destination} 
                onChange={(e) => {
                    setDestination(e.target.value);
                    setOpenLocation(true); 
                }} 
                className="w-full bg-transparent focus:outline-none text-gray-800 font-medium placeholder:text-gray-500 text-base truncate" 
              />
            </div>
            {openLocation && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                {isCitiesLoading ? (
                  <div className="p-4 flex items-center gap-2 text-gray-500"><FaSpinner className="animate-spin" /> {t('loading_cities') || "Loading..."}</div>
                ) : filteredCities.length > 0 ? (
                  <ul>
                    {filteredCities.map((city, index) => (
                      <li key={city.id || index} onClick={() => handleCitySelect(city.name)} className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition border-b border-gray-50 last:border-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="text-gray-700 font-medium">{city.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-gray-500 text-sm">{t('no_cities_found') || "No cities found"}</div>
                )}
              </div>
            )}
          </div>

          {/* --- DATE --- */}
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
                {serviceType === 'hotels' 
                  ? `${guests.adults} Adults · ${guests.children} Children · ${guests.rooms} Rooms` 
                  : `${guests.people} People`}
              </span>
              <FaChevronDown className="ml-auto text-gray-400 text-xs" />
            </div>

            {openGuests && (
              <div className="absolute top-full right-0 mt-2 bg-white p-5 shadow-xl rounded-lg z-50 w-[360px] border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                {serviceType === 'hotels' ? (
                  <>
                    <GuestCounter 
                      label={t('adults')} 
                      value={guests.adults} 
                      onUpdate={(op) => handleGuestChange('adults', op)} 
                      min={1} 
                    />
                    
                    <GuestCounter 
                      label={t('children')} 
                      subLabel="Ages 1 - 17"
                      value={guests.children} 
                      onUpdate={handleChildrenUpdate} 
                      min={0} 
                    />

                    {guests.children > 0 && (
                      <div className="mb-4 pl-1">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Age of children needed</p>
                        <div className="grid grid-cols-2 gap-2">
                          {childAges.map((age, idx) => (
                            <div key={idx} className="relative">
                               <select
                                value={age}
                                onChange={(e) => updateSpecificAge(idx, e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white"
                              >
                                {Array.from({ length: 17 }, (_, i) => (
                                  <option key={i} value={i + 1}>{i + 1} years old</option>
                                ))}
                              </select>
                              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <GuestCounter 
                      label={t('rooms')} 
                      value={guests.rooms} 
                      onUpdate={(op) => handleGuestChange('rooms', op)} 
                      min={1} 
                    />

                    <div className="flex justify-between items-center py-3 border-t border-gray-100 mt-2">
                      <div className="flex items-center gap-2">
                          <FaDog className="text-gray-500" />
                          <span className="font-medium text-gray-800">Pet Friendly</span>
                      </div>
                      <button 
                        onClick={() => setPetFriendly(!petFriendly)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${petFriendly ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${petFriendly ? 'translate-x-5' : ''}`}></div>
                      </button>
                    </div>
                  </>
                ) : (
                  <GuestCounter 
                    label={t('people')} 
                    value={guests.people} 
                    onUpdate={(op) => handleGuestChange('people', op)} 
                    min={1} 
                  />
                )}
                
                <button 
                  className="w-full mt-4 py-3 text-blue-600 border border-blue-600 rounded font-semibold hover:bg-blue-50 transition text-base" 
                  onClick={() => setOpenGuests(false)}
                >
                  {t('done')}
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="col-span-12 lg:w-auto">
            <button onClick={onSearchClick} className="bg-[#003b95] text-white font-bold h-full w-full px-8 py-3 rounded shadow-sm hover:bg-[#00224f] transition">
              {t('search')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;