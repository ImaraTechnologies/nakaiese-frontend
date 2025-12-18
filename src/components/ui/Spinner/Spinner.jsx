'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * PRODUCTION GRADE SPINNER
 * * Usage:
 * <Spinner /> (Default: medium, primary color)
 * <Spinner size="sm" variant="white" />
 * <Spinner size="lg" className="my-4" />
 */

export const Spinner = ({ 
  size = 'md', 
  variant = 'primary', 
  className = '',
  ...props 
}) => {

  // --- 1. Size Configurations ---
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  // --- 2. Color Variants ---
  const variants = {
    primary: "text-blue-900", // Matches your brand
    secondary: "text-gray-500",
    white: "text-white",
    yellow: "text-yellow-500", // Matches your CTA/Rating stars
    danger: "text-red-500"
  };

  // --- 3. Compute Classes ---
  const sizeClass = sizes[size] || sizes.md;
  const variantClass = variants[variant] || variants.primary;
  
  // Combine: Base + Animation + Size + Color + Custom Overrides
  const finalClass = `animate-spin ${sizeClass} ${variantClass} ${className}`;

  return (
    <Loader2 
      className={finalClass} 
      aria-label="Loading" 
      {...props} 
    />
  );
};

/**
 * FULL PAGE SPINNER
 * Use this for route transitions or initial data fetching.
 * It centers the spinner vertically and horizontally on the screen.
 */
export const FullPageSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-lg">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="xl" variant="primary" />
        <p className="text-sm font-medium text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;