import localapi from "@/utils/local_api";

export const getCities = async () => {
    try {
        const response = await localapi.get('locations/dropdown/cities');
        return response.data;
    }
    catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
    }
};
export const getCountries = async () => {
    try {
        const response = await localapi.get('locations/countries/');
        return response.data;
    }
    catch (error) {
        console.error("Error fetching countries:", error);
        throw error;
    }
};
export const getCitiesForVendor = async (countryId) => {
    try {
        // We use the 'country__id' filter defined in your ViewSet
        const params = countryId ? { country__id: countryId } : {};
        const response = await localapi.get('locations/dropdown/cities', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
    }
};

export const getCitiesList = async () => {
    try {
        const response = await localapi.get('locations/list/cities');
        return response.data;
    }
    catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
    }
};

export const getCityById = async (id) => {
    try {
        const response = await localapi.get(`locations/retreive/cities/?id=${id}`);
        return response.data;
    }
    catch (error) {
        console.error(`Error fetching city with id ${id}:`, error);
        throw error;
    }
}

