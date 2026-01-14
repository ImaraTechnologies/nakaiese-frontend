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

                    {/* GLOBAL SAVE BUTTON */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS (SECTIONS) ---

const ProfileSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b border-slate-100 pb-8">
            <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden relative">
                    <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                    <Camera className="w-3.5 h-3.5" />
                </div>
            </div>
            <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-1">Update your photo and personal details here. This information will be visible to other admins.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputGroup label="First Name" placeholder="Tahir" defaultValue="Tahir" />
            <InputGroup label="Last Name" placeholder="Admin" defaultValue="Admin" />
            <InputGroup label="Email Address" type="email" placeholder="tahir@nakiese.com" defaultValue="tahir@nakiese.com" />
            <InputGroup label="Phone Number" type="tel" placeholder="+1 234 567 890" />

            <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Bio</label>
                <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Write a short bio..."
                    defaultValue="Senior administrator managing hotel and restaurant operations."
                />
                <p className="text-xs text-slate-400 text-right">0/200 characters</p>
            </div>
        </div>
    </div>
);

const SecuritySettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Password</h3>
            <p className="text-sm text-slate-500 mb-6">Ensure your account is using a long, random password to stay secure.</p>

            <div className="space-y-4 max-w-lg">
                <InputGroup label="Current Password" type="password" placeholder="••••••••" />
                <InputGroup label="New Password" type="password" placeholder="••••••••" />
                <InputGroup label="Confirm New Password" type="password" placeholder="••••••••" />
            </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account.</p>
                </div>
                <ToggleSwitch defaultChecked={true} />
            </div>
        </div>
    </div>
);

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

// --- REUSABLE UI HELPERS ---

const InputGroup = ({ label, type = "text", placeholder, defaultValue }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">{label}</label>
        <input
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
        />
    </div>
);

const ToggleRow = ({ title, desc, checked }) => (
    <div className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0">
        <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">{desc}</p>
        </div>
        <ToggleSwitch defaultChecked={checked} />
    </div>
);

const ToggleSwitch = ({ defaultChecked }) => {
    const [enabled, setEnabled] = useState(defaultChecked);
    return (
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
};