'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  UserPlus,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import CustomerStats from '@/components/Shared/Dashboard/CustomerStats';
import { useDashboardCustomers } from '@/hooks/useDashboard';

// --- SUB-COMPONENTS ---

const GuestStatusBadge = ({ bookings }) => {
  // Since the server doesn't provide a 'status' string, 
  // we derive it from business logic (e.g., bookings count)
  const isVIP = bookings > 5;
  const isNew = bookings === 0;

  if (isVIP) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-purple-100 text-purple-700 border-purple-200">
      VIP
    </span>
  );
  if (isNew) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-blue-50 text-blue-700 border-blue-200">
      New
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-green-50 text-green-700 border-green-200">
      Active
    </span>
  );
};

export default function GuestsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 1. Handle Debounced Search to prevent API spam
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); 
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Hook Integration
  const { data, isLoading, isError } = useDashboardCustomers({
    page,
    page_size: 10,
    search: debouncedSearch || undefined,
  });

  const guests = data?.results || [];
  const totalCount = data?.count || 0;
  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous;

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guest Management</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage your customer database.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95">
            <UserPlus className="w-4 h-4" /> Add Guest
          </button>
        </div>
      </div>

      <CustomerStats />

      {/* --- MAIN TABLE CARD --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto relative min-h-[400px]">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Bookings</th>
                <th className="px-6 py-4 text-right">Total Spend</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isError ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-red-500">
                    Error loading guests. Please refresh the page.
                  </td>
                </tr>
              ) : guests.length > 0 ? (
                guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                          {guest.guest_name.charAt(0)}
                        </div>
                        <p className="font-bold text-slate-900">{guest.guest_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600 text-xs">
                          <Mail className="w-3 h-3" /> {guest.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-xs">
                          <Phone className="w-3 h-3" /> {guest.phone_number}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <GuestStatusBadge bookings={guest.total_bookings} />
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      {guest.total_bookings}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ${guest.total_spent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                !isLoading && (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-slate-500">
                      No guests found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <b>{guests.length}</b> of <b>{totalCount}</b> guests
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => p - 1)}
              disabled={!hasPrev || isLoading}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all font-medium"
            >
              <ChevronLeft className="w-3 h-3" /> Previous
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNext || isLoading}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all font-medium"
            >
              Next <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}