"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn"; // Assuming you have a utility for class merging

export function PasswordInput({ label, error, showStrength = false, className, value, ...props }) {
  const [isVisible, setIsVisible] = useState(false);

  // Simple password strength calculation
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(value || "");
  
  const strengthColor = [
    "bg-gray-200",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10",
            error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus-visible:ring-blue-500",
            className
          )}
          value={value}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      
      {showStrength && value?.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex gap-1 h-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-full w-full rounded-full transition-all duration-300",
                  i < strength ? strengthColor[strength] : "bg-gray-200"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 text-right">
            {strength < 2 ? "Weak" : strength < 3 ? "Medium" : "Strong"} password
          </p>
        </div>
      )}
      
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}