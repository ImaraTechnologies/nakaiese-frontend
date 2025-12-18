import localapi from "@/utils/local_api";

export const getCities = async () => {
    try{
        const response = await localapi.get('locations/list/cities ');
        return response.data;
    }
    catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
    }
};