'use client';

import React from 'react';

/**
 * A reusable Button component with variants and sizes.
 * No external dependencies (like clsx or tailwind-merge) required for this version, 
 * keeping it lightweight and crash-proof.
 */
export const Button = React.forwardRef(({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children, 
  type = 'button',
  disabled = false,
  ...props 
}, ref) => {

  // 1. Base Styles (Applied to all buttons)
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-white";

  // 2. Variants (Visual styles)
  const variants = {
    default: "bg-blue-900 text-white hover:bg-blue-800 shadow-sm", // Primary Brand Color
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
    link: "text-blue-900 underline-offset-4 hover:underline",
    yellow: "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/30" // For Call to Actions
  };

  // 3. Sizes (Dimensions)
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  // 4. Safe Style Selection
  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.default;

  // 5. Combine Classes
  const combinedClasses = `${baseStyles} ${variantClass} ${sizeClass} ${className}`;

  return (
    <button
      ref={ref}
      type={type}
      className={combinedClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;