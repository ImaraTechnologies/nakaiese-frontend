import localapi from "@/utils/local_api";

// Renamed for clarity. 'set' implies state, 'create' implies API action.
export const createBooking = async (payload) => {
    // Axios throws an error automatically for non-2xx responses
    const response = await localapi.post('/booking/create/', payload);
    return response.data;
};