'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarDays, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  ChevronDown 
} from 'lucide-react';

const NAVIGATION = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarDays },
  { name: 'Properties', href: '/dashboard/properties', icon: Building2 },
  { name: 'Guests', href: '/dashboard/guests', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* --- MOBILE BACKDROP --- */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              N
            </div>
            Nakiese
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="ml-auto lg:hidden text-slate-500 hover:text-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="mb-4 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
          
          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}

          {/* Bottom Actions */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Search Bar (Hidden on small mobile) */}
            <div className="hidden sm:flex items-center relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Profile Dropdown Trigger */}
            <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-full transition-colors pr-3 border border-transparent hover:border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                TA
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-900 leading-none">Tahir Admin</p>
                <p className="text-xs text-slate-500 mt-0.5">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}