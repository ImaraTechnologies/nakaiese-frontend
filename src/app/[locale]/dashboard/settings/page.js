'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
    User,
    Lock,
    Bell,
    Globe,
    CreditCard,
    Camera,
    Save,
    Loader2
} from 'lucide-react';
import ToggleRow from '@/components/Shared/Dashboard/ToggleRow';
import SecuritySettings from '@/components/Shared/Dashboard/SecuritySettings';
import ProfileSettings from '@/components/Shared/Dashboard/ProfileSettings';

// --- 1. SETTINGS TABS CONFIGURATION ---
const TABS = [
    { id: 'profile', label: 'My Profile', icon: User, desc: 'Manage your personal details' },
    { id: 'security', label: 'Security', icon: Lock, desc: 'Password and authentication' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Email and push alerts' },
    { id: 'preferences', label: 'Preferences', icon: Globe, desc: 'Language and regional settings' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    // Mock Save Handler
    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            // In production: toast.success('Settings saved successfully');
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* --- PAGE HEADER --- */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* --- LEFT SIDEBAR NAVIGATION --- */}
                <nav className="w-full lg:w-64 flex-shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 min-w-[200px] lg:min-w-0
                  ${isActive
                                        ? 'bg-white shadow-sm border border-slate-200 text-blue-700'
                                        : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm border border-transparent'}
                `}
                            >
                                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-50' : 'bg-slate-100'}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{tab.label}</p>
                                    <p className="text-[10px] text-slate-400 font-medium hidden lg:block">{tab.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </nav>

                {/* --- RIGHT CONTENT AREA --- */}
                <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">

                    {/* CONTENT RENDERER */}
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'security' && <SecuritySettings />}
                    {activeTab === 'notifications' && <NotificationSettings />}
                    {activeTab === 'preferences' && <PreferenceSettings />}

                    

                </div>
            </div>
        </div>
    );
}



const NotificationSettings = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Email Notifications</h3>
            <div className="space-y-4">
                <ToggleRow
                    title="New Booking Alerts"
                    desc="Get notified when a customer makes a reservation."
                    checked={true}
                />
                <ToggleRow
                    title="Cancellation Alerts"
                    desc="Get notified when a booking is cancelled."
                    checked={true}
                />
                <ToggleRow
                    title="Weekly Reports"
                    desc="Receive a weekly summary of your property performance."
                    checked={false}
                />
            </div>
        </div>
    </div>
);

const PreferenceSettings = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Regional Settings</h3>
        <p className="text-sm text-slate-500 mb-6">Set your preferred language and currency for the dashboard.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Language</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                    <option>English</option>
                    <option>French (Français)</option>
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Currency</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>XOF (CFA)</option>
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Timezone</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                    <option>GMT +00:00 (Dakar)</option>
                    <option>GMT +01:00 (London)</option>
                    <option>GMT -05:00 (New York)</option>
                </select>
            </div>
        </div>
    </div>
);



