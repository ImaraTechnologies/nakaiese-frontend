import React from 'react';
import { useDashboardBookingStats } from '@/hooks/useDashboard';

const BookingStats = () => {
    const { data, isLoading, isError } = useDashboardBookingStats();

    // 1. Loading State (Skeleton UI)
    // Matches the layout of the real cards so the page doesn't jump
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse">
                        <div className="h-3 w-20 bg-slate-200 rounded mb-3"></div>
                        <div className="h-8 w-12 bg-slate-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    // 2. Error State
    // Shows dashes instead of crashing, allowing the rest of the dashboard to load
    if (isError || !data) {
        return (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                Failed to load booking statistics.
            </div>
        );
    }

    // 3. Data Mapping
    // We map the API keys to your UI labels and colors
    const statsConfig = [
        { 
            label: "Total Bookings", 
            value: data.total_bookings, 
            color: "blue" 
        },
        { 
            label: "Pending", 
            value: data.pending_bookings, 
            color: "yellow" 
        },
        { 
            label: "Confirmed", 
            value: data.confirmed_bookings, 
            color: "green" 
        },
        { 
            label: "Cancelled", 
            value: data.cancelled_bookings, 
            color: "red" 
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsConfig.map((stat) => (
                <div key={stat.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    {/* Label with dynamic color class */}
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 text-${stat.color}-600`}>
                        {stat.label}
                    </p>
                    
                    {/* Value with number formatting (e.g. 1,240) */}
                    <p className="text-2xl font-bold text-slate-900">
                        {stat.value?.toLocaleString() || 0}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default BookingStats;