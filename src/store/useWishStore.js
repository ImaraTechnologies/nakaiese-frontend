import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useWishStore = create(
  persist(
    (set, get) => ({
      wishes: [],

      // Action to add a wish (with duplicate check)
      addWish: (wish) => {
        const { wishes } = get();
        // Check if item already exists in wishlist
        const exists = wishes.find((item) => item.id === wish.id);

        if (exists) {
          return; // Item exists, do nothing
        }

        set({ wishes: [...wishes, wish] });
      },

      // Action to remove a wish by id
      removeWish: (wishId) =>
        set((state) => ({
          wishes: state.wishes.filter((wish) => wish.id !== wishId),
        })),

      // Optional: Action to clear all wishes (useful for 'Remove All' button)
      clearWishes: () => set({ wishes: [] }),
    }),
    {
      name: 'wish-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

export default useWishStore;