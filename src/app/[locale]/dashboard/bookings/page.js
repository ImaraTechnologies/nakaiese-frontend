'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download 
} from 'lucide-react';

// --- MOCK DATA ---
const mockBookings = [
  {
    id: "NK-8291",
    property: "Savanna Camp Touba",
    guest: { name: "Amadou Diallo", email: "amadou@example.com", image: null },
    checkIn: "2024-12-24",
    checkOut: "2024-12-26",
    amount: 540.00,
    status: "confirmed",
    type: "Hotel",
    date: "Dec 12, 2024"
  },
  {
    id: "NK-9921",
    property: "La Gondola Restaurant",
    guest: { name: "Sarah Smith", email: "sarah@example.com", image: null },
    checkIn: "2024-12-25",
    time: "19:30",
    amount: 0.00,
    status: "pending",
    type: "Restaurant",
    date: "Dec 14, 2024"
  },
  {
    id: "NK-1102",
    property: "Atlas Hotel Tamale",
    guest: { name: "Kwame Nkrumah", email: "kwame@example.com", image: null },
    checkIn: "2025-01-01",
    checkOut: "2025-01-05",
    amount: 1200.00,
    status: "cancelled",
    type: "Hotel",
    date: "Dec 10, 2024"
  },
  {
    id: "NK-3321",
    property: "Savanna Camp Touba",
    guest: { name: "Fatou Diop", email: "fatou@example.com", image: null },
    checkIn: "2024-12-28",
    checkOut: "2024-12-29",
    amount: 250.00,
    status: "confirmed",
    type: "Hotel",
    date: "Dec 18, 2024"
  }
];

// --- COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const icons = {
    confirmed: CheckCircle,
    pending: Clock,
    cancelled: XCircle,
    completed: CheckCircle
  };

  const Icon = icons[status] || Clock;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      <Icon className="w-3.5 h-3.5" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredBookings = mockBookings.filter((booking) => {
    const matchesStatus = activeTab === 'all' || booking.status === activeTab;
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.property.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", val: "1,240", color: "blue" },
          { label: "Pending", val: "12", color: "yellow" },
          { label: "Confirmed", val: "845", color: "green" },
          { label: "Cancelled", val: "32", color: "red" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className={`text-xs font-bold uppercase tracking-wider text-${stat.color}-600 mb-1`}>{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
            {['all', 'pending', 'confirmed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all
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
                placeholder="Search by ID, Guest, Property..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="p-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-slate-900">{booking.id}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{booking.date}</p>
                    </td>

                    {/* Guest */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {booking.guest.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{booking.guest.name}</p>
                          <p className="text-xs text-slate-500">{booking.guest.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 truncate max-w-[200px]">{booking.property}</p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${booking.type === 'Hotel' ? 'bg-purple-500' : 'bg-orange-500'}`}></span>
                        {booking.type} • {booking.type === 'Hotel' ? `${booking.checkIn} - ${booking.checkOut}` : `${booking.checkIn} at ${booking.time}`}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-900">
                        ${booking.amount.toFixed(2)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-medium text-slate-900">No bookings found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{filteredBookings.length}</span> of <span className="font-medium text-slate-900">{mockBookings.length}</span> results
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-white border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}