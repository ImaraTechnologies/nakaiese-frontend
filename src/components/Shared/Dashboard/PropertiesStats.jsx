'use client';

import React from 'react';
import { useDashboardPropertyStats } from '@/hooks/useDashboard';
import { Building2, Star, UtensilsCrossed, AlertCircle } from 'lucide-react';

const PropertiesStats = () => {
    const { data, isLoading, isError } = useDashboardPropertyStats();

    // 1. Loading State (Skeleton UI)
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                            <div className="h-3 w-20 bg-slate-100 rounded"></div>
                        </div>
                        <div className="h-8 w-12 bg-slate-100 rounded mt-2"></div>
                    </div>
                ))}
            </div>
        );
    }

    // 2. Error State
    if (isError) {
        return (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Failed to load property statistics.</span>
            </div>
        );
    }

    // 3. Configuration Array (Maps Data to UI)
    // We use explicit Tailwind classes to ensure they are preserved by the compiler.
    const statsConfig = [
        {
            label: "Total Properties",
            value: data?.total_properties || 0,
            icon: Building2,
            iconClass: "bg-slate-100 text-slate-600"
        },
        {
            label: "Hotels",
            value: data?.total_hotels || 0,
            icon: Building2,
            iconClass: "bg-blue-50 text-blue-600"
        },
        {
            label: "Restaurants",
            value: data?.total_restaurants || 0,
            icon: UtensilsCrossed,
            iconClass: "bg-orange-50 text-orange-600"
        },
        {
            label: "Avg Rating",
            // Safely format rating to 1 decimal place (e.g. 4.0, 4.5)
            value: (data?.average_rating || 0).toFixed(1),
            icon: Star,
            iconClass: "bg-yellow-50 text-yellow-600"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsConfig.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${stat.iconClass}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                {stat.label}
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {stat.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default PropertiesStats;