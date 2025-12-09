'use client'

import {
    UserPlus,
    ShieldCheck,
    Wallet,
    SlidersHorizontal,
} from 'lucide-react'

// ✅ IMPORT 1: Use the navigation tools from your i18n configuration
// This ensures 'Link' automatically adds /en or /fr for you.
// This also provides a 'usePathname' that (usually) strips the locale for easier comparison.
import { Link, usePathname } from '@/i18n/routing'; 

import Navbar from '@/components/Layout/Navbar/Navbar';
import Footer from '@/components/Layout/Footer/Footer';

const tabs = [
    { name: 'Personal Details', icon: UserPlus, url: "/profile" },
    { name: 'Security', icon: ShieldCheck, url: "/profile/security" },
    { name: 'Payment Details', icon: Wallet, url: "/profile/payment-method" },
    { name: 'Preferences', icon: SlidersHorizontal, url: "/profile/preferences" },
]

export default function SettingsLayout({ children }) {
    // ✅ IMPORT 2: Get the current path to determine active state
    const pathname = usePathname(); 

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white px-4 py-10 sm:px-8 md:px-12 lg:px-20">
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Sidebar */}
                    <aside className="w-full lg:w-1/4">
                        <div className="rounded-2xl bg-gray-100 p-2 divide-y divide-gray-300">
                            {tabs.map(({ name, icon: Icon, url }) => {
                                // Check if this tab is active
                                // We check if the pathname matches exactly OR if it starts with the URL (for sub-pages)
                                // Note: We handle the root "/profile" carefully so it doesn't match everything.
                                const isActive = url === '/profile' 
                                    ? pathname === url 
                                    : pathname.startsWith(url);

                                return (
                                    <Link
                                        key={name}
                                        href={url}
                                        className={`flex items-center w-full gap-4 p-4 rounded-xl text-left transition 
                                            ${isActive 
                                                ? 'bg-white font-semibold shadow text-black' 
                                                : 'hover:bg-white text-gray-600'
                                            }`}
                                    >
                                        <div className={`rounded-full p-2 transition ${isActive ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-base">{name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>

            <Footer />
        </>
    )
}