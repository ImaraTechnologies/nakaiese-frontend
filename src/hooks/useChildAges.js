import { useState, useCallback } from "react";

export const useChildAges = () => {
  const [childAges, setChildAges] = useState([]);

  // Handle manual increment/decrement clicks
  const handleAgeCountUpdate = useCallback((operation) => {
    setChildAges((prev) => {
      if (operation === 'inc') {
        // Add a new child with default age 1
        return [...prev, 1];
      } else if (operation === 'dec') {
        // Remove the last child
        // If length is 1 and we decrement, it naturally becomes []
        return prev.slice(0, -1);
      }
      return prev;
    });
  }, []);

  // Handle changing a specific child's age via dropdown
  const updateSpecificAge = useCallback((index, newAge) => {
    setChildAges((prev) => {
      const newAges = [...prev];
      newAges[index] = parseInt(newAge, 10);
      return newAges;
    });
  }, []);

  // Force reset (useful if you clear all filters)
  const resetAges = useCallback(() => {
    setChildAges([]);
  }, []);

  return {
    childAges,
    handleAgeCountUpdate,
    updateSpecificAge,
    resetAges
  };
};