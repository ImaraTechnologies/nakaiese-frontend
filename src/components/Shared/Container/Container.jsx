"use client";

import React from "react";
import clsx from "clsx";

const Container = ({ children, className }) => {
  return (
    <div
      className={clsx(
        // Base styles: Centered, full width, with padding
        "mx-auto w-full px-4 md:px-6",
        
        // RESPONSIVE WIDTHS (Mobile First Strategy)
        
        // Mobile (default): Limits width so it doesn't stretch too thin on landscape phones
        "max-w-[540px]",
        
        // Small Tablets (sm):
        "sm:max-w-[720px]",
        
        // Tablets (md):
        "md:max-w-[960px]",
        
        // Laptops (lg): Increased to 1200px (Wider than previous 1140px)
        "lg:max-w-[1200px]",
        
        // Desktops (xl): Increased to 1440px (Wider than previous 1150px)
        "xl:max-w-[1440px]",
        
        // Large Screens (2xl): New breakpoint for very wide monitors
        "2xl:max-w-[1600px]",
        
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
