import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/services/bookingService"; // Adjust path as needed
import useBookingStore from "@/store/useBookingStore";

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    
    // Get the addBooking action from our store
    const { addBooking } = useBookingStore();

    return useMutation({
        mutationFn: (formData) => createBooking(formData),

        onSuccess: (data) => {
            // 1. Save Safe Data to Store
            // If the user books the same room for a different date, 
            // the server returns a NEW unique 'id', so addBooking will treat it as a new entry.
            if (data?.id) {
                addBooking(data);
            }

            // 2. Invalidate queries to refresh UI (e.g. Booking History list)
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            
            // Optional: Invalidate availability if you are showing a calendar
            // queryClient.invalidateQueries({ queryKey: ['room-availability'] });
        },

        onError: (error) => {
            // Robust Error Handling for Django/DRF responses
            const serverMessage = error.response?.data?.message || "Something went wrong.";
            const validationErrors = error.response?.data?.errors; 

            console.error("Booking Failed:", serverMessage, validationErrors);

            // You can trigger your Toast notification here
            // toast.error(serverMessage);
        },
    });
};