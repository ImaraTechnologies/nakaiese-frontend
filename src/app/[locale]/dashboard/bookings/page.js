'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  AlertCircle
} from 'lucide-react';
import BookingStats from '@/components/Shared/Dashboard/BookingStats';
import { useDashboardBookings } from '@/hooks/useDashboard';
import StatusBadge from '@/components/Shared/Dashboard/StatusBadge'; // Extracted for cleanliness

// --- CONSTANTS ---
const STATUS_MAP = {
  pending: 'PD',
  confirmed: 'CF',
  cancelled: 'CN',
  completed: 'CP' // Assuming 'CP' exists in your model
};

export default function BookingsPage() {
  // 1. State Management
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 2. Debounce Search (Prevent API spam)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 3. Prepare Query Params
  const queryParams = {
    page,
    page_size: 10,
    search: debouncedSearch || undefined, // Send only if exists
    status: activeTab !== 'all' ? STATUS_MAP[activeTab] : undefined
  };

  // 4. Fetch Data
  const { data, isLoading, isError } = useDashboardBookings(queryParams);
  const bookings = data?.results || [];
  const totalCount = data?.count || 0;
  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous;

  // 5. Pagination Handlers
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset pagination on tab change
  };

  return (
    <div className="space-y-6">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track all your reservations.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* --- STATS SUMMARY --- */}
      <BookingStats />

      {/* --- MAIN CONTENT CARD --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg w-full sm:w-auto overflow-x-auto">
            {['all', 'pending', 'confirmed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`
                  flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all whitespace-nowrap
                  ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search ref, guest, property..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              />
            </div>
            <button className="p-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Reference</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Guest</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Property / Dates</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* LOADING STATE */}
              {isLoading && (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-40"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16 ml-auto"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              )}

              {/* ERROR STATE */}
              {isError && !isLoading && (
                 <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-red-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 opacity-50" />
                      <p>Failed to load bookings. Please try refreshing.</p>
                    </div>
                  </td>
                 </tr>
              )}

              {/* EMPTY STATE */}
              {!isLoading && !isError && bookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-medium text-slate-900">No bookings found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* DATA ROWS */}
              {!isLoading && !isError && bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Reference */}
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium text-slate-900">
                      {booking.booking_reference}
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </td>

                  {/* Guest (Using Flat API Structure) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {(booking.guest_name || '?').charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{booking.guest_name}</p>
                        <p className="text-xs text-slate-500">{booking.guest_email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Property (Using Nested API Structure) */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 truncate max-w-[200px]">
                      {booking.property?.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        booking.property?.property_type === 'HL' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></span>
                      {booking.property?.property_type === 'HL' ? 'Hotel' : 'Restaurant'} • 
                      {booking.property?.property_type === 'HL' 
                        ? ` ${booking.start_date} - ${booking.end_date}` 
                        : ` ${booking.start_date} @ ${booking.arrival_time?.slice(0,5)}`
                      }
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} label={booking.status_display} />
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-slate-900">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(booking.total_price)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">
              {bookings.length > 0 ? (page - 1) * 10 + 1 : 0}
            </span> to <span className="font-medium text-slate-900">
              {Math.min(page * 10, totalCount)}
            </span> of <span className="font-medium text-slate-900">
              {totalCount}
            </span> results
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handlePrev}
              disabled={!hasPrev || isLoading}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={handleNext}
              disabled={!hasNext || isLoading}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}