'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Use 'react-router-dom' for standard React

const useScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", 
    });
  }, [pathname]);
};

export default useScrollToTop;