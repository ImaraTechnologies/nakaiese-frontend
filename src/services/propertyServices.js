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