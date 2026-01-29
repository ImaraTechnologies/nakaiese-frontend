import React from 'react';
import { useDashboardCustomersStats } from '@/hooks/useDashboard';

const CustomerStats = () => {
  const { data, isLoading, isError } = useDashboardCustomersStats();

  // 1. Loading State (Skeleton UI)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[102px] bg-slate-50 animate-pulse rounded-xl border border-slate-200" />
        ))}
      </div>
    );
  }

  // 2. Error State
  if (isError || !data) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-xl text-red-700 text-sm">
        Unable to load guest statistics. Please try again later.
      </div>
    );
  }

  // 3. Data Normalization
  const stats = [
    {
      label: 'Total Guests',
      value: data.total_guests?.toLocaleString() || '0',
      badge: 'Total',
      badgeColor: 'text-slate-500 bg-slate-100'
    },
    {
      label: 'Returning Rate',
      value: `${(data.returning_rate || 0).toFixed(1)}%`,
      badge: data.returning_rate > 20 ? 'High' : 'Target',
      badgeColor: data.returning_rate > 20 ? 'text-blue-600 bg-blue-50' : 'text-slate-500 bg-slate-100'
    },
    {
      label: 'Avg. Spend',
      value: `$${parseFloat(data.average_spending || 0).toFixed(2)}`,
      badge: 'Per Stay',
      badgeColor: 'text-green-600 bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {stat.label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {stat.value}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase ${stat.badgeColor}`}>
              {stat.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerStats;