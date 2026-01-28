import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, CheckCheck } from 'lucide-react';

const STATUS_CONFIG = {
  // --- Django Database Codes ---
  'CF': { 
    color: 'green', 
    icon: CheckCircle, 
    defaultLabel: 'Confirmed' 
  },
  'PD': { 
    color: 'yellow', 
    icon: Clock, 
    defaultLabel: 'Pending' 
  },
  'CN': { 
    color: 'red', 
    icon: XCircle, 
    defaultLabel: 'Cancelled' 
  },
  'CP': { 
    color: 'blue', 
    icon: CheckCheck, 
    defaultLabel: 'Completed' 
  },
  'CI': { 
    color: 'purple', 
    icon: CheckCircle, 
    defaultLabel: 'Checked In' 
  },
  'NS': { 
    color: 'gray', 
    icon: AlertCircle, 
    defaultLabel: 'No Show' 
  },

  // --- Fallbacks (Lowercase Strings) ---
  'confirmed': { color: 'green', icon: CheckCircle },
  'pending': { color: 'yellow', icon: Clock },
  'cancelled': { color: 'red', icon: XCircle },
  'completed': { color: 'blue', icon: CheckCheck },
};

// Default fallback if status is unknown
const DEFAULT_CONFIG = { 
  color: 'slate', 
  icon: AlertCircle, 
  defaultLabel: 'Unknown' 
};

export default function StatusBadge({ status, label }) {
  // 1. Get configuration based on status key (or use default)
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[status?.toLowerCase()] || DEFAULT_CONFIG;
  
  const { color, icon: Icon } = config;
  
  // 2. Use the provided label (from API display field) or the hardcoded default
  const displayText = label || config.defaultLabel || status;

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
      bg-${color}-50 text-${color}-700 border-${color}-200
    `}>
      <Icon className="w-3.5 h-3.5" />
      {displayText}
    </span>
  );
}