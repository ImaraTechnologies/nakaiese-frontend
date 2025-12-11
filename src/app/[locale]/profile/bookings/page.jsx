'use client'

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image'; // 1. Import Next.js Image
import { 
    Calendar, 
    MapPin, 
    Users, 
    Clock, 
    CheckCircle2, 
    XCircle,
    FileText,
    Utensils, 
    BedDouble 
} from 'lucide-react';
import { Link } from '@/i18n/routing';

// --- MOCK DATA (With Mixed Types) ---
const MOCK_BOOKINGS = [
    {
        id: 'BK-8X29A',
        type: 'HOTEL', 
        property: {
            title: 'Oceanview Resort & Spa',
            location: 'Cape Town, South Africa',
            image: '/images/hotel-1.jpg' // Ensure this path exists in public/ or use external URL
        },
        status: 'CF',
        startDate: '2024-12-24',
        endDate: '2024-12-28',
        guests: 2,
        totalPrice: 1250.00,
        currency: 'USD'
    },
    {
        id: 'BK-REST-01',
        type: 'RESTAURANT', 
        property: {
            title: 'Le Gourmet Paris',
            location: 'Paris, France',
            image: '/images/restaurant-1.jpg'
        },
        status: 'PD',
        startDate: '2024-10-15', 
        arrivalTime: '19:30',   
        guests: 4,
        totalPrice: 0.00, 
        currency: 'EUR'
    },
    {
        id: 'BK-9921B',
        type: 'HOTEL',
        property: {
            title: 'Mountain Retreat Cabin',
            location: 'Aspen, USA',
            image: '/images/cabin.jpg'
        },
        status: 'CP',
        startDate: '2023-01-15',
        endDate: '2023-01-20',
        guests: 4,
        totalPrice: 2400.00,
        currency: 'USD'
    }
];

export default function BookingPage() {
    const t = useTranslations('Booking');
    const [activeTab, setActiveTab] = useState('upcoming');

    const filteredBookings = MOCK_BOOKINGS.filter(booking => {
        if (activeTab === 'upcoming') return ['CF', 'PD', 'CI'].includes(booking.status);
        if (activeTab === 'completed') return ['CP'].includes(booking.status);
        if (activeTab === 'cancelled') return ['CN', 'NS', 'FL'].includes(booking.status);
        return true;
    });

    return (
        <div className='w-full max-w-7xl mx-auto px-4 py-8'>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                <p className="text-gray-500 mt-1">{t('subtitle')}</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-full sm:w-fit mb-8 overflow-x-auto">
                {['upcoming', 'completed', 'cancelled'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap
                            ${activeTab === tab 
                                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }
                        `}
                    >
                        {t(`tabs.${tab}`)}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} t={t} />
                    ))}
                </div>
            ) : (
                <EmptyState activeTab={activeTab} t={t} />
            )}
        </div>
    )
}

// --- Generic Booking Card ---

const BookingCard = ({ booking, t }) => {
    const isHotel = booking.type === 'HOTEL';

    // Helper for Status UI
    const getStatusColor = (status) => {
        switch(status) {
            case 'CF': return 'bg-green-100 text-green-700 border-green-200';
            case 'PD': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'CN': return 'bg-red-100 text-red-700 border-red-200'; 
            case 'CP': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'CF': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'PD': return <Clock className="w-3.5 h-3.5" />;
            case 'CN': return <XCircle className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    return (
        <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            
            {/* Image Header */}
            <div className="relative h-48 w-full bg-gray-200">
                {/* 2. Replaced <img> with <Image /> using 'fill' */}
                <Image 
                    src={booking.property.image} 
                    alt={booking.property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-md ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {t(`status.${booking.status}`)}
                    </span>
                </div>

                {/* Type Icon Badge (Hotel vs Restaurant) */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg shadow-sm text-gray-700 z-10">
                    {isHotel ? <BedDouble className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">{booking.property.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="line-clamp-1">{booking.property.location}</span>
                    </div>
                </div>

                <div className="space-y-3 flex-1">
                    {/* Date/Time Section */}
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-xl">
                        {isHotel ? (
                            // HOTEL LAYOUT: Range (Check-in -> Check-out)
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Calendar className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">{t('labels.check_in')}</span>
                                        <span className="font-semibold text-gray-900">{booking.startDate}</span>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-gray-200" />
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">{t('labels.check_out')}</span>
                                    <span className="font-semibold text-gray-900">{booking.endDate}</span>
                                </div>
                            </>
                        ) : (
                            // RESTAURANT LAYOUT: Single Date + Time
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Calendar className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">{t('labels.reservation_date')}</span>
                                        <span className="font-semibold text-gray-900">{booking.startDate}</span>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-gray-200" />
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">{t('labels.arrival_time')}</span>
                                    <span className="font-semibold text-gray-900">{booking.arrivalTime}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Guests & Price Row */}
                    <div className="flex justify-between items-center text-sm px-1">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{booking.guests} {t('labels.guests')}</span>
                        </div>
                        
                        {/* Only show price if > 0 (Restaurants might be free reservation) */}
                        {booking.totalPrice > 0 ? (
                            <div className="font-bold text-gray-900 text-base">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: booking.currency }).format(booking.totalPrice)}
                            </div>
                        ) : (
                            <div className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-md">
                                Reservation Only
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                    <Link 
                        href={`/bookings/${booking.id}`} 
                        className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition flex items-center justify-center shadow-sm"
                    >
                        {t('actions.view_details')}
                    </Link>
                    {booking.status === 'CP' && booking.totalPrice > 0 && (
                        <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition" title={t('actions.download_invoice')}>
                            <FileText className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ activeTab, t }) => (
    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Calendar className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{t(`empty.${activeTab}`)}</h3>
        <Link 
            href="/search" 
            className="mt-6 inline-flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow-md"
        >
            {t('empty.action')}
        </Link>
    </div>
);