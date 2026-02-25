import localapi from "@/utils/local_api";

/**
 * Fetches properties with the correct locale.
 * @param {Object} filters - Filter object
 * @param {string} locale - Current active locale (e.g., 'fr', 'en')
 */
export const getPropertiesList = async (filters = {}, locale = 'en') => {
    try {
        const response = await localapi.get('/properties/lists', {
            params: filters,
            headers: {
                'Accept-Language': locale
            }
        });
        return response.data;
    } catch (error) {
        console.error("API Error fetching properties:", error);
        throw error;
    }
};

export const getPropertyById = async (id, locale = 'en') => {
    if (!id) throw new Error("Property ID is required");

    try {
        // 1. Use 'await' (Critical fix: axios returns a Promise)
        // 2. Use 'params' object for cleaner query string handling (?id=...)
        const response = await localapi.get('/properties/retrieve', {
            params: { id: id },
            headers: {
                'Accept-Language': locale
            }
        });

        // 3. Return the data directly (Axios automatically parses JSON)
        return response.data;

    } catch (error) {
        console.error("Service Error:", error);

        // 4. robust error handling for Axios structure
        const message = error.response?.data?.error || error.message || "Failed to fetch property";
        throw new Error(message);
    }
};

export async function checkAvailability(propertyId, {
    checkin,
    checkout,
    time,
    guests,
    rooms,
    locale = 'en' // Default locale handled here
} = {}) {

    try {
        const params = new URLSearchParams();

        // --- Common Params ---
        params.append('id', propertyId);
        params.append('guests', guests || 1);

        if (checkin) params.append('checkin', checkin);

        // --- Conditional Params (Hybrid Logic) ---
        if (checkout) params.append('checkout', checkout);
        if (time) params.append('time', time);
        if (rooms) params.append('rooms', rooms);

        console.log("Availability Check Params:", params.toString());

        // 1. Call Next.js Proxy Route (Recommended)
        // Ensure this matches the route you created in src/app/api/check-availability/route.js
        const response = await localapi.get(`/properties/search/?${params.toString()}`, {
            headers: {
                'Accept-Language': locale
            }
        });

        return response.data;

    } catch (error) {
        console.error("Availability Check Error:", error);
        const message = error.response?.data?.error || error.message || "Availability check failed";
        throw new Error(message);
    }
}

export const getPropertyInfo = async (locale, searchParamsString) => {
    try {
        // We pass the searchParamsString directly to the URL
        const response = await localapi.get(`/properties/info/?${searchParamsString}`, {
            headers: {
                'Accept-Language': locale
            }
        });
        return response.data;
    } catch (error) {
        console.error("API Error fetching property info:", error);
        throw error;
    }
};


export const propertyService = {
    createProperty: async (data) => {
        const response = await localapi.post('/properties', data);
        return response.data;
    },
    // If you want to save drafts as they type
    saveDraft: async (data) => {
        const response = await localapi.post('/properties/draft', data);
        return response.data;
    }
};