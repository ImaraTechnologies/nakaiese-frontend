'use client'; 

import useScrollToTop from '@/hooks/useScrollToTop';

export default function ScrollManager() {
  // Call your hook here (valid because this is a Client Component)
  useScrollToTop();
  
  // Render nothing
  return null; 
}