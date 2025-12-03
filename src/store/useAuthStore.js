import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            // user: null,
            accessToken: null,
            refreshToken: null, // <--- Added this field
            isAuthenticated: false,

            // Action to set data after login/refresh
            setAuth: ( accessToken, refreshToken) => set({
                // user,
                accessToken,
                refreshToken, // <--- Store it here
                isAuthenticated: true
            }),

            // Action to clear data (Logout)
            logout: () => set({
                // user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used


            partialize: (state) => ({ refreshToken: state.refreshToken, }),
        }
    )
);

export default useAuthStore;