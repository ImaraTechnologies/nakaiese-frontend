import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/services/bookingService"; 


export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => createBooking(formData),
        
        onSuccess: (data) => {
            // 1. Success Notification
            // toast.success("Booking confirmed successfully!");
            console.log("Booking Success:", data);

            // 2. Invalidate relevant queries to refresh UI data
            // Example: If you have a list of bookings, refresh it now.
            queryClient.invalidateQueries({ queryKey: ['bookings'] }); 
            
            // Optional: If you need to refresh user profile or credits
            // queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        
        onError: (error) => {
            // 1. Extract error message safely
            // Axios stores the response data in error.response.data
            const serverMessage = error.response?.data?.message || "Something went wrong.";
            const validationErrors = error.response?.data?.errors; // If Django sends field errors

            console.error("Booking Failed:", serverMessage, validationErrors);
            
            // toast.error(serverMessage);
        },
    });
};