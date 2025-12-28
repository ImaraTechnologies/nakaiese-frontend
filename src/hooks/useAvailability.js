import { useState, useCallback } from 'react';
import { checkAvailability } from '@/services/propertyServices';
import { useLocale } from 'next-intl';

/**
 * useAvailability Hook
 */
export const useAvailability = (propertyId, propertyType) => {
    const locale = useLocale();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null); 
    const [hasChecked, setHasChecked] = useState(false);

    const triggerCheck = useCallback(async (filters) => {
        // 1. Safety Check: Ensure Property ID exists before calling API
        if (!propertyId) {
            console.warn("Availability check skipped: Missing Property ID");
            return;
        }

        setLoading(true);
        setError(null);
        setHasChecked(false);
        setData(null);

        // 2. Client-Side Validation
        const validationError = validateInputs(propertyType, filters);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            // 3. Call Service
            // We pass exactly 2 arguments now: ID and the Options Object
            const result = await checkAvailability(propertyId, {
                checkin: filters.checkIn,
                checkout: filters.checkOut,
                time: filters.time,
                guests: (Number(filters.guests?.adults) || 1) + (Number(filters.guests?.children) || 0),
                rooms: Number(filters.guests?.rooms) || 1,
                locale: locale
            });

            // 4. Handle Success
            setData(result);
            setHasChecked(true);

        } catch (err) {
            console.error("Hook Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [propertyId, propertyType, locale]); // FIXED: Added locale dependency

    const reset = () => {
        setHasChecked(false);
        setData(null);
        setError(null);
    };

    return {
        checkAvailability: triggerCheck,
        availableItems: data,
        loading,
        error,
        hasChecked,
        reset
    };
};

// --- VALIDATION LOGIC ---
function validateInputs(type, filters) {
    if (!filters?.checkIn) return "Please select a start date.";

    if (type === 'HL') { // Hotel Logic
        if (!filters.checkOut) return "Please select a check-out date.";
        const start = new Date(filters.checkIn);
        const end = new Date(filters.checkOut);
        
        if (start >= end) {
            return "Check-out date must be after check-in.";
        }
    } 
    else if (type === 'RT') { // Restaurant Logic
        if (!filters.time) return "Please select an arrival time.";
    }

    return null; 
}

export default useAvailability;