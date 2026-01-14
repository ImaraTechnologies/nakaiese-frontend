'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  ShieldAlert, 
  CheckCircle,
  UserPlus,
  Download
} from 'lucide-react';

// --- MOCK DATA ---
const mockGuests = [
  {
    id: "GST-8812",
    name: "Amadou Diallo",
    email: "amadou.d@example.com",
    phone: "+221 77 123 45 67",
    totalSpend: 2450.00,
    bookings: 12,
    lastVisit: "Dec 24, 2024",
    status: "VIP",
    country: "Senegal"
  },
  {
    id: "GST-9921",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 555 019 2834",
    totalSpend: 850.00,
    bookings: 3,
    lastVisit: "Nov 12, 2024",
    status: "Active",
    country: "USA"
  },
  {
    id: "GST-1102",
    name: "Kwame Nkrumah",
    email: "kwame@example.com",
    phone: "+233 20 998 1122",
    totalSpend: 120.00,
    bookings: 1,
    lastVisit: "Jan 05, 2025",
    status: "New",
    country: "Ghana"
  },
  {
    id: "GST-3321",
    name: "John Doe",
    email: "j.doe@example.com",
    phone: "+44 7700 900077",
    totalSpend: 0.00,
    bookings: 0,
    lastVisit: "Never",
    status: "Blocked",
    country: "UK"
  }
];

// --- COMPONENTS ---

const GuestStatusBadge = ({ status }) => {
  const styles = {
    VIP: "bg-purple-100 text-purple-700 border-purple-200",
    Active: "bg-green-50 text-green-700 border-green-200",
    New: "bg-blue-50 text-blue-700 border-blue-200",
    Blocked: "bg-red-50 text-red-700 border-red-200",
  };

  const icons = {
    VIP: Star,
    Active: CheckCircle,
    New: UserPlus,
    Blocked: ShieldAlert
  };

  const Icon = icons[status] || CheckCircle;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

export default function GuestsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredGuests = mockGuests.filter((guest) => {
    const matchesTab = activeTab === 'all' || guest.status.toLowerCase() === activeTab;
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

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
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all active:scale-95">
            <UserPlus className="w-4 h-4" />
            Add Guest
          </button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Guests</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">5,210</span>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">+12%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">VIP Members</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">142</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">Top Tier</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Returning Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">48%</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">High</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avg. Spend</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">$320</span>
            <span className="text-xs font-medium text-slate-500">per stay</span>
          </div>
        </div>
      </div>

      {/* --- MAIN TABLE CARD --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
            {['all', 'vip', 'active', 'blocked'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all flex-1 sm:flex-none
                  ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}
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
                placeholder="Search guests..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* Guest Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                          {guest.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{guest.name}</p>
                          <p className="text-xs text-slate-500">From {guest.country}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-600 text-xs">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {guest.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-xs">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {guest.phone}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <GuestStatusBadge status={guest.status} />
                    </td>

                    {/* Stats: Bookings */}
                    <td className="px-6 py-4 text-right">
                      <p className="font-medium text-slate-900">{guest.bookings}</p>
                      <p className="text-[10px] text-slate-400">Last: {guest.lastVisit}</p>
                    </td>

                    {/* Stats: Money */}
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-900">${guest.totalSpend.toLocaleString()}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-500">
                    <p className="font-medium">No guests found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredGuests.length} guests</span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}