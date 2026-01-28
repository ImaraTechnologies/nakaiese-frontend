'use client';

import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps 
} from 'recharts';
import { format, startOfWeek, startOfMonth, startOfYear, parseISO } from 'date-fns';

export default function RevenueChart({ rawData }) {
  const [view, setView] = useState('daily'); // 'daily', 'weekly', 'monthly', 'yearly'

  // --- Aggregation Logic ---
  const chartData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    // 1. Group Data
    const groups = rawData.reduce((acc, curr) => {
      const date = parseISO(curr.time_stamp);
      let key;

      // Define Grouping Keys based on View
      if (view === 'daily') key = format(date, 'MMM dd'); // "Jan 01"
      else if (view === 'weekly') key = format(startOfWeek(date), 'MMM dd'); // "Week of Jan 01"
      else if (view === 'monthly') key = format(startOfMonth(date), 'MMM yyyy'); // "Jan 2026"
      else if (view === 'yearly') key = format(startOfYear(date), 'yyyy'); // "2026"

      if (!acc[key]) {
        acc[key] = { name: key, revenue: 0, bookings: 0 };
      }

      // 2. Aggregate Values
      acc[key].revenue += parseFloat(curr.revenue);
      acc[key].bookings += curr.active_bookings;
      
      return acc;
    }, {});

    // 3. Convert back to Array & Sort
    // Note: This relies on the rawData being chronologically sorted already. 
    // If not, object keys insertion order usually preserves it for simple dates, 
    // but robust production apps might sort the keys here.
    return Object.values(groups);

  }, [rawData, view]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Revenue Analytics</h3>
          <p className="text-sm text-slate-500">Financial performance over time</p>
        </div>
        
        {/* View Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['daily', 'weekly', 'monthly', 'yearly'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                view === v 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* The Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12 }} 
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12 }} 
              tickFormatter={(val) => `$${val / 1000}k`} 
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
            
            <Bar 
              dataKey="revenue" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Custom Tooltip for professional formatting
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl text-xs">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-blue-200">
          Revenue: <span className="text-white font-bold">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};