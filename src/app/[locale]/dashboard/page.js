import React from 'react';
import { TrendingUp, Users, CalendarCheck, DollarSign } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back, here is what happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200">
            + New Booking
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="$45,231" trend="+20.1%" icon={DollarSign} color="blue" />
        <StatCard title="Active Bookings" value="122" trend="+12.5%" icon={CalendarCheck} color="purple" />
        <StatCard title="Total Guests" value="5,210" trend="+4.3%" icon={Users} color="orange" />
        <StatCard title="Occupancy Rate" value="84%" trend="-2.1%" icon={TrendingUp} color="green" />
      </div>

      {/* Content Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex items-center justify-center text-slate-400">
          Chart Area Placeholder
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex items-center justify-center text-slate-400">
          Recent Activity Placeholder
        </div>
      </div>

    </div>
  );
}

// Simple Stat Card Helper
const StatCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        {trend}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);