import localapi from "@/utils/local_api";

/**
 * Fetches properties with the correct locale.
 * @param {Object} filters - Filter object
 * @param {string} locale - Current active locale (e.g., 'fr', 'en')
 */
export const getPropertiesList = async (filters = {}, locale = 'en') => {
    console.log("Fetching properties with locale:", locale);
    try {
        const response = await localapi.get('/properties/lists', { 
            params: filters,
            headers: {
                // CRITICAL: Override browser default with Next.js active locale
                'Accept-Language': locale 
            }
        });
        return response.data.results;
    } catch (error) {
        console.error("API Error fetching properties:", error);
        throw error;
    }
};