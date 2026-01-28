'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Building2,
  UtensilsCrossed,
  MapPin,
  Star,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';
import PropertiesStats from '@/components/Shared/Dashboard/PropertiesStats';
import { useDashboardProperties } from '@/hooks/useDashboard';

// --- HELPER COMPONENTS ---

const TypeBadge = ({ type }) => {
  const isHotel = type === 'HL';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${isHotel
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-orange-50 text-orange-700 border-orange-200'
      }`}>
      {isHotel ? <Building2 className="w-3 h-3" /> : <UtensilsCrossed className="w-3 h-3" />}
      {isHotel ? 'Hotel' : 'Restaurant'}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  // Normalize input to handle uppercase API responses or lowercase UI logic
  const normalizedStatus = (status || 'draft').toLowerCase();
  
  const styles = {
    active: "bg-green-100 text-green-700",
    maintenance: "bg-red-100 text-red-700",
    draft: "bg-slate-100 text-slate-600",
  };
  
  // Fallback to 'draft' style if status is unknown
  const badgeStyle = styles[normalizedStatus] || styles.draft;

  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${badgeStyle}`}>
      {status}
    </span>
  );
};

export default function PropertiesPage() {
  // --- 1. STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'hotels', 'restaurants'
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // --- 2. DEBOUNCE SEARCH ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search change
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- 3. PREPARE QUERY PARAMS ---
  const queryParams = useMemo(() => {
    const params = {
      page,
      page_size: 10,
      search: debouncedSearch || undefined,
    };

    // Map UI Tabs to API Filter codes ('HL', 'RT')
    if (activeTab === 'hotels') params.property_type = 'HL';
    if (activeTab === 'restaurants') params.property_type = 'RT';
    
    return params;
  }, [page, debouncedSearch, activeTab]);

  // --- 4. FETCH DATA ---
  const { data, isLoading, isError } = useDashboardProperties(queryParams);
  
  const properties = data?.results || [];
  const totalCount = data?.count || 0;
  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous;

  // --- 5. HANDLERS ---
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

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
      <PropertiesStats />

      {/* --- CONTENT CARD --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">

          {/* Custom Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg w-full sm:w-auto overflow-x-auto">
            {['all', 'hotels', 'restaurants'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`
                  px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all flex-1 sm:flex-none whitespace-nowrap
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

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]">
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
              
              {/* 1. LOADING STATE SKELETON */}
              {isLoading && (
                 [...Array(5)].map((_, i) => (
                   <tr key={i} className="animate-pulse">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-100 rounded-lg"></div>
                         <div className="space-y-2">
                           <div className="h-4 bg-slate-100 rounded w-32"></div>
                           <div className="h-3 bg-slate-100 rounded w-20"></div>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded w-20"></div></td>
                     <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                     <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                     <td className="px-6 py-4"><div className="h-5 bg-slate-100 rounded w-16"></div></td>
                     <td className="px-6 py-4"></td>
                   </tr>
                 ))
              )}

              {/* 2. ERROR STATE */}
              {isError && !isLoading && (
                 <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-red-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <AlertCircle className="w-8 h-8 opacity-50" />
                       <p>Failed to load properties. Please try again.</p>
                    </div>
                  </td>
                 </tr>
              )}

              {/* 3. EMPTY STATE */}
              {!isLoading && !isError && properties.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">No properties found</h3>
                      <p className="text-slate-500 max-w-xs mx-auto mt-1">
                        We could not find any properties matching your search criteria.
                      </p>
                      <button
                        onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                        className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* 4. REAL DATA ROWS */}
              {!isLoading && !isError && properties.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Property Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 relative overflow-hidden shrink-0 border border-slate-200">
                        <Image 
                          src={`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${item.image_url}` || '/placeholder-property.jpg'} // Ensure you have a placeholder
                          alt={item.title} 
                          fill 
                          className="object-cover" 
                          sizes="48px"
                          unoptimized={true}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs truncate max-w-[150px]">{item.location_display}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="px-6 py-4">
                    <TypeBadge type={item.property_type} />
                  </td>

                  {/* Rating Stats */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-slate-900">{item.rating || 'New'}</span>
                      {item.review_count > 0 && (
                        <span className="text-slate-400 text-xs">({item.review_count})</span>
                      )}
                    </div>
                  </td>

                  {/* Inventory (From Serializer) */}
                  <td className="px-6 py-4">
                    <div className="text-slate-700 font-medium">
                      {item.inventory_count}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status_display} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">
              {properties.length > 0 ? (page - 1) * 10 + 1 : 0}
            </span> to <span className="font-medium text-slate-900">
              {Math.min(page * 10, totalCount)}
            </span> of <span className="font-medium text-slate-900">
              {totalCount}
            </span> results
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!hasPrev || isLoading}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNext || isLoading}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}