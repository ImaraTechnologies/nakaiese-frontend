import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Helper: Formats data to save SPACE and protect PRIVACY.
// We remove 'customer_info' so PII (names, phone) is never in localStorage.
const formatBookingForStorage = (data) => {
  const item = data.items?.[0] || {};

  // Determine if it is a Room or Table booking based on the item structure
  let type = 'mixed';
  if (item.room_type) type = 'room';
  else if (item.table) type = 'table';

  return {
    id: data.id,
    reference: data.booking_reference, // Useful for showing "Booking #NK-..."
    type: type, // 'room' | 'table'
    dates: {
      start: data.start_date,
      end: data.end_date,
      arrival_time: data.arrival_time,
    },
  };
};

const useBookingStore = create(
  persist(
    (set) => ({
      // We use an ARRAY to allow multiple bookings (different dates/rooms)
      bookings: [],

      // Action: Add a new booking or update it if it already exists
      addBooking: (serverData) => set((state) => {
        const safeBooking = formatBookingForStorage(serverData);

        // Check if this booking ID already exists
        const existingIndex = state.bookings.findIndex((b) => b.id === safeBooking.id);

        if (existingIndex !== -1) {
          // UPDATE: If ID exists, replace the old data with new data
          const updatedBookings = [...state.bookings];
          updatedBookings[existingIndex] = safeBooking;
          return { bookings: updatedBookings };
        }

        // INSERT: Add new booking to the TOP of the list
        return { bookings: [safeBooking, ...state.bookings] };
      }),

      // Action: Remove a specific booking by ID
      removeBooking: (bookingId) => set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== bookingId)
      })),

      // Action: Clear all (e.g., on Logout)
      clearBookings: () => set({ bookings: [] }),
    }),
    {
      name: 'booking-storage', // The key inside localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBookingStore;