'use client';
import React from 'react';
import { Armchair, Sun, Wind, Star } from 'lucide-react'; // Icons for seating types

const SeatingOptions = ({ tables, t }) => {
  if (!tables || tables.length === 0) return null;

  // 1. Helper to Group Tables by Location Type
  // Returns: { 'MH': { count: 5, minCap: 2, maxCap: 4 }, 'RT': { ... } }
  const seatingGroups = tables.reduce((acc, table) => {
    const type = table.location_type; // e.g., 'MH', 'RT'
    if (!acc[type]) {
      acc[type] = { 
        count: 0, 
        capacities: new Set(), 
        hasFee: parseFloat(table.reservation_fee) > 0 
      };
    }
    acc[type].count += 1;
    acc[type].capacities.add(table.capacity);
    return acc;
  }, {});

  // 2. Map Backend Codes to UI Config
  const locationConfig = {
    'MH': { label: 'Main Hall', icon: Armchair, desc: 'Indoor Dining' },
    'WN': { label: 'Window Side', icon: Sun, desc: 'Scenic View' },
    'BT': { label: 'Private Booth', icon: Armchair, desc: 'Cozy & Private' },
    'PT': { label: 'Patio', icon: Wind, desc: 'Outdoor Seating' },
    'RT': { label: 'Rooftop', icon: Star, desc: 'VIP Experience' },
    'BR': { label: 'Bar', icon: Armchair, desc: 'High Stools' }
  };

  return (
    <section className="pt-8 border-t border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {t('seatingOptions') || "Seating Options"}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(seatingGroups).map(([code, data]) => {
          const config = locationConfig[code] || { label: code, icon: Armchair, desc: 'Standard' };
          const Icon = config.icon;
          const capacityRange = Array.from(data.capacities).sort((a, b) => a - b);
          
          return (
            <div key={code} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-blue-900">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{config.label}</h4>
                <p className="text-xs text-slate-500 mb-1">{config.desc}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {data.count} Tables
                  </span>
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Up to {Math.max(...capacityRange)} guests
                  </span>
                  {data.hasFee && (
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                      Fee Applies
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SeatingOptions;