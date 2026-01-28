'use client';

import React, { useMemo } from 'react';
import { TrendingUp, Users, CalendarCheck, DollarSign } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboard';

// Import the new Chart Component
import RevenueChart from '@/components/Shared/Dashboard/RevenueChart'; 

export default function DashboardHome() {
  const { data: rawData, isLoading, error } = useDashboardMetrics();

  // --- Snapshot Stats Logic (Same as before) ---
  const stats = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    const sortedData = [...rawData].sort((a, b) => new Date(a.time_stamp) - new Date(b.time_stamp));
    const current = sortedData[sortedData.length - 1];
    const previous = sortedData.length > 1 ? sortedData[sortedData.length - 2] : null;

    const getTrend = (curr, prev) => (!prev ? 0 : ((curr - prev) / prev) * 100);

    return {
      revenue: { value: parseFloat(current.revenue), trend: getTrend(parseFloat(current.revenue), parseFloat(previous?.revenue)) },
      bookings: { value: current.active_bookings, trend: getTrend(current.active_bookings, previous?.active_bookings) },
      guests: { value: current.total_guests, trend: getTrend(current.total_guests, previous?.total_guests) },
      occupancy: { value: parseFloat(current.occupancy_rate), trend: getTrend(parseFloat(current.occupancy_rate), parseFloat(previous?.occupancy_rate)) },
      lastUpdated: current.time_stamp
    };
  }, [rawData]);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div className="text-red-500">Error loading data</div>;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="text-slate-500 text-sm">Dashboard for {stats?.lastUpdated}</p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Daily Revenue" value={stats?.revenue.value} trend={stats?.revenue.trend} icon={DollarSign} color="blue" isCurrency />
        <StatCard title="Active Bookings" value={stats?.bookings.value} trend={stats?.bookings.trend} icon={CalendarCheck} color="purple" />
        <StatCard title="Total Guests" value={stats?.guests.value} trend={stats?.guests.trend} icon={Users} color="orange" />
        <StatCard title="Occupancy Rate" value={stats?.occupancy.value} trend={stats?.occupancy.trend} icon={TrendingUp} color="green" suffix="%" />
      </div>

      {/* --- CHART SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart (Takes up 2 columns) */}
        <div className="lg:col-span-2">
          {/* Pass the raw data to the chart component */}
          <RevenueChart rawData={rawData} />
        </div>

        {/* Side Panel (Recent Activity or Alerts) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
             {/* Dummy Side Content */}
             <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <div className="w-2 h-2 mt-2 bg-red-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-slate-800">High Cancellation Rate</p>
                  <p className="text-xs text-slate-500">Yesterday cancellations spiked to 14%</p>
                </div>
             </div>
             <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-slate-800">New Milestone</p>
                  <p className="text-xs text-slate-500">Hit $4,000 revenue target today</p>
                </div>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// --- Helper Components (StatCard & Skeleton) ---
// (Keep the StatCard and Skeleton code from the previous response here)
const StatCard = ({ title, value, trend, icon: Icon, color, isCurrency = false, suffix = '' }) => {
    const formattedValue = isCurrency 
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
      : (value || 0).toLocaleString();
    const isPositive = trend >= 0;
    
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}><Icon className="w-5 h-5" /></div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {isPositive ? '+' : ''}{trend?.toFixed(1)}%
          </span>
        </div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{formattedValue}{suffix}</p>
      </div>
    );
};

const DashboardSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 w-1/4 rounded"></div>
        <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}</div>
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-80 bg-slate-200 rounded-xl"></div>
            <div className="h-80 bg-slate-200 rounded-xl"></div>
        </div>
    </div>
);