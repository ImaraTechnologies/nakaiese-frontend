'use client'

import { useState, useRef, useEffect } from 'react';
import {
    UserPlus,
    ShieldCheck,
    Wallet,
    SlidersHorizontal,
    ChevronDown,
    ChevronRight
} from 'lucide-react'
import { Link, usePathname } from '@/i18n/routing'; 
import Navbar from '@/components/Layout/Navbar/Navbar';
import Footer from '@/components/Layout/Footer/Footer';
import Container from '@/components/Shared/Container/Container';

const tabs = [
    { name: 'Personal Details', icon: UserPlus, url: "/profile" },
    { name: 'Security', icon: ShieldCheck, url: "/profile/security" },
    { name: 'Payment Details', icon: Wallet, url: "/profile/payment-method" },
    { name: 'Preferences', icon: SlidersHorizontal, url: "/profile/preferences" },
]

export default function SettingsLayout({ children }) {
    const pathname = usePathname(); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);

    // Close mobile menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Find active tab name for the mobile header
    const activeTab = tabs.find(t => 
        t.url === '/profile' ? pathname === t.url : pathname.startsWith(t.url)
    ) || tabs[0];

    const ActiveIcon = activeTab.icon;

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50/50">
                <Container className={'py-8 sm:py-12 lg:py-20'}>
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* ========================================================
                            NAVIGATION
                        ======================================================== */}
                        <aside className="w-full lg:w-72 shrink-0 space-y-4">
                            
                            {/* 1. MOBILE: ELEGANT DROPDOWN */}
                            <div className="lg:hidden relative z-20" ref={mobileMenuRef}>
                                <button 
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3.5 rounded-xl shadow-sm hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                            <ActiveIcon className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-gray-900">{activeTab.name}</span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isMobileMenuOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="py-2">
                                            {tabs.map((tab) => {
                                                const isActive = tab.url === activeTab.url;
                                                return (
                                                    <Link 
                                                        key={tab.name} 
                                                        href={tab.url}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`
                                                            flex items-center justify-between px-4 py-3 text-sm transition-colors
                                                            ${isActive 
                                                                ? 'bg-blue-50 text-blue-700 font-medium' 
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <tab.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                                            {tab.name}
                                                        </div>
                                                        {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. DESKTOP: SIDEBAR CARD */}
                            <nav className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm p-2" aria-label="Sidebar">
                                <div className="space-y-1">
                                    {tabs.map(({ name, icon: Icon, url }) => {
                                        const isActive = url === '/profile' 
                                            ? pathname === url 
                                            : pathname.startsWith(url);

                                        return (
                                            <Link
                                                key={name}
                                                href={url}
                                                className={`
                                                    group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                                                    ${isActive 
                                                        ? 'bg-blue-50 text-blue-700' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }
                                                `}
                                            >
                                                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                                <span>{name}</span>
                                                
                                                {/* Active Indicator Line */}
                                                {isActive && (
                                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </nav>

                        </aside>

                        {/* ========================================================
                            MAIN CONTENT
                        ======================================================== */}
                        <main className="flex-1 min-w-0">
                             {/* Added animation to content for smoother feel */}
                            <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
                                {children}
                            </div>
                        </main>

                    </div>
                </Container>
            </div>
            <Footer />
        </>
    )
}