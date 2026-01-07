import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSearchForm } from "@/hooks/useSearchForm";
import { useCities } from "@/hooks/useCities";
import { useChildAges } from "@/hooks/useChildAges";

export const useSearchBarLogic = () => {
  const pathname = usePathname();
  const router = useRouter();

  // --- 1. Global Form State ---
  const {
    serviceType, setServiceType, destination, setDestination,
    dateRange, setDateRange, singleDate, setSingleDate,
    guests, handleGuestChange
  } = useSearchForm();

  // --- 2. Local UI State ---
  const [petFriendly, setPetFriendly] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);

  // --- 3. Refs ---
  const locationRef = useRef(null);
  const dateRef = useRef(null);
  const guestsRef = useRef(null);

  // --- 4. Child Ages Logic ---
  const { 
    childAges, 
    handleAgeCountUpdate, 
    updateSpecificAge 
  } = useChildAges();

  const [startDate, endDate] = dateRange;

  // --- 5. Data Fetching (Cities) ---
  const { data: citiesList, isLoading: isCitiesLoading } = useCities();

  // --- Logic: Sync Children Count with Age Array ---
  const handleChildrenUpdate = useCallback((op) => {
    handleGuestChange('children', op);
    handleAgeCountUpdate(op);
  }, [handleGuestChange, handleAgeCountUpdate]);

  // --- Logic: Filter Cities ---
  const filteredCities = useMemo(() => {
    if (!citiesList) return [];
    if (!destination) return citiesList; 
    return citiesList.filter((city) => 
      city.name.toLowerCase().includes(destination.toLowerCase())
    );
  }, [citiesList, destination]);

  const handleCitySelect = useCallback((cityName) => {
    setDestination(cityName);
    setOpenLocation(false);
  }, [setDestination]);

  // --- Logic: Auto-Select Service based on URL ---
  useEffect(() => {
    if (pathname && pathname.includes('restaurant')) {
      setServiceType('restaurants');
    }
  }, [pathname, setServiceType]);

  // --- Logic: Click Outside to Close Dropdowns ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) setOpenLocation(false);
      if (dateRef.current && !dateRef.current.contains(event.target)) setOpenDate(false);
      if (guestsRef.current && !guestsRef.current.contains(event.target)) setOpenGuests(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Logic: Execute Search (URL Construction) ---
  const onSearchClick = useCallback(() => {
    const params = new URLSearchParams();

    // Location
    if (destination) params.set("city", destination);

    // Dates
    if (serviceType === 'hotels') {
      if (startDate) params.set("checkin", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.set("checkout", format(endDate, "yyyy-MM-dd"));
    } else {
      if (singleDate) params.set("checkin", format(singleDate, "yyyy-MM-dd"));
    }

    // Guests & Extras
    if (serviceType === 'hotels') {
      params.set("adults", guests.adults);
      params.set("children", guests.children);
      params.set("rooms", guests.rooms);
      params.set("pets", petFriendly);
      if (childAges.length > 0) {
        params.set("child_ages", childAges.join(','));
      }
    } else {
      params.set("people", guests.people);
    }

    // Navigation
    const currentLocale = pathname.split('/')[1] || 'en'; 
    router.push(`/${currentLocale}/${serviceType}?${params.toString()}`);
  }, [destination, serviceType, startDate, endDate, singleDate, guests, petFriendly, childAges, pathname, router]);

  return {
    // State
    serviceType, setServiceType,
    destination, setDestination,
    dateRange, setDateRange,
    singleDate, setSingleDate,
    guests, handleGuestChange,
    petFriendly, setPetFriendly,
    childAges, updateSpecificAge,
    
    // UI State
    openLocation, setOpenLocation,
    openDate, setOpenDate,
    openGuests, setOpenGuests,
    isCitiesLoading,
    filteredCities,
    startDate, endDate,

    // Refs
    locationRef, dateRef, guestsRef,

    // Handlers
    handleChildrenUpdate,
    handleCitySelect,
    onSearchClick
  };
};