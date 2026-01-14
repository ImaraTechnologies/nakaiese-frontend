'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  UtensilsCrossed, 
  MapPin, 
  Star, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Eye
} from 'lucide-react';

// --- MOCK DATA ---
const mockProperties = [
  {
    id: "uuid-1",
    title: "Savanna Camp Touba",
    type: "HL", // Hotel
    location: "Touba, Senegal",
    rating: 4.8,
    reviews: 142,
    status: "active",
    capacity: 24, // Rooms
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "uuid-2",
    title: "La Gondola Italian",
    type: "RT", // Restaurant
    location: "Dakar, Senegal",
    rating: 4.5,
    reviews: 89,
    status: "active",
    capacity: 12, // Tables
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "uuid-3",
    title: "Atlas Hotel Tamale",
    type: "HL",
    location: "Tamale, Ghana",
    rating: 4.2,
    reviews: 56,
    status: "maintenance",
    capacity: 45,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "uuid-4",
    title: "Sunset Rooftop Bar",
    type: "RT",
    location: "Saint-Louis, Senegal",
    rating: 4.9,
    reviews: 210,
    status: "draft",
    capacity: 18,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=150&q=80"
  }
];

// --- HELPER COMPONENTS ---

const TypeBadge = ({ type }) => {
  const isHotel = type === 'HL';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
      isHotel 
        ? 'bg-blue-50 text-blue-700 border-blue-200' 
        : 'bg-orange-50 text-orange-700 border-orange-200'
    }`}>
      {isHotel ? <Building2 className="w-3 h-3" /> : <UtensilsCrossed className="w-3 h-3" />}
      {isHotel ? 'Hotel' : 'Restaurant'}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-700",
    maintenance: "bg-red-100 text-red-700",
    draft: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function PropertiesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredData = mockProperties.filter((item) => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'hotels' && item.type === 'HL') || 
      (activeTab === 'restaurants' && item.type === 'RT');
    
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your hotels, rooms, restaurants, and tables.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Building2 className="w-4 h-4" /></div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Properties</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockProperties.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Building2 className="w-4 h-4" /></div>
            <p className="text-xs font-bold text-slate-500 uppercase">Hotels</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockProperties.filter(p => p.type === 'HL').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><UtensilsCrossed className="w-4 h-4" /></div>
            <p className="text-xs font-bold text-slate-500 uppercase">Restaurants</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockProperties.filter(p => p.type === 'RT').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><Star className="w-4 h-4" /></div>
            <p className="text-xs font-bold text-slate-500 uppercase">Avg Rating</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">4.6</p>
        </div>
      </div>

      {/* --- CONTENT CARD --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          
          {/* Custom Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
            {['all', 'hotels', 'restaurants'].map((tab) => (
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

          {/* Search */}
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search properties..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                <th className="px-6 py-4 font-semibold text-slate-700">Property</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Stats</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Inventory</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* Property Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 relative overflow-hidden shrink-0 border border-slate-200">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs truncate max-w-[150px]">{item.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="px-6 py-4">
                      <TypeBadge type={item.type} />
                    </td>

                    {/* Rating Stats */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-slate-900">{item.rating}</span>
                        <span className="text-slate-400 text-xs">({item.reviews})</span>
                      </div>
                    </td>

                    {/* Inventory (Hybrid Logic) */}
                    <td className="px-6 py-4">
                      <div className="text-slate-700 font-medium">
                        {item.capacity} 
                        <span className="text-slate-500 font-normal ml-1">
                          {item.type === 'HL' ? 'Rooms' : 'Tables'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">No properties found</h3>
                      <p className="text-slate-500 max-w-xs mx-auto mt-1">
                        We could not find any properties matching your search or filter criteria.
                      </p>
                      <button 
                        onClick={() => {setActiveTab('all'); setSearchQuery('');}}
                        className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                      >
                        Clear Filters
                      </button>
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
            Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{filteredData.length}</span> of <span className="font-medium text-slate-900">{mockProperties.length}</span> results
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