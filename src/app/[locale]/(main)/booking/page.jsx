'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, User, ShieldCheck } from 'lucide-react';

// Sub-components (defined below)
import BookingSummary from '@/components/Shared/Booking/BookingSummary';
import CustomerForm from '@/components/Shared/Booking/CustomerForm';
import PaymentMethodSelector from '@/components/Shared/Booking/PaymentMethodSelector';

export default function BookingPage() {
  const t = useTranslations('Booking');

  // Mock Data - In a real app, retrieve this from your Context/Zustand store or URL params
  const bookingData = {
    property: {
      title: "Savanna Camp Touba",
      image: "/media/properties/banner_1.jpg",
      rating: 4.8,
      review_count: 443,
      location: "Touba, Senegal",
      type: "HL", // 'HL' for Hotel, 'RT' for Restaurant
    },
    details: {
      checkIn: "2024-12-24",
      checkOut: "2024-12-26",
      guests: { adults: 2, children: 1 },
      roomName: "Safari Suite", // Only for hotels
      nights: 2,
      pricePerNight: 250,
      taxes: 45,
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Submit logic here...
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{t('page_title') || "Confirm Your Booking"}</h1>
          <div className="flex items-center gap-2 text-green-600 mt-2 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('secure_msg') || "Secure booking. Your data is protected."}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Customer Details */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{t('customer_details') || "Your Details"}</h2>
              </div>
              <CustomerForm t={t} />
            </section>

            {/* 2. Payment Method */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{t('payment_method') || "Payment"}</h2>
              </div>
              <PaymentMethodSelector t={t} />
            </section>

            {/* Submit Button (Mobile Order) */}
            <div className="lg:hidden">
              <SubmitButton isSubmitting={isSubmitting} t={t} />
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <BookingSummary data={bookingData} t={t} />
            
            {/* Submit Button (Desktop Order) */}
            <div className="hidden lg:block">
              <SubmitButton isSubmitting={isSubmitting} t={t} />
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

// Simple Helper Button Component
const SubmitButton = ({ isSubmitting, t }) => (
  <button 
    type="submit"
    disabled={isSubmitting}
    className="w-full bg-[#006ce4] hover:bg-[#0057b8] text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
  >
    {isSubmitting ? (
      <>
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <span>Processing...</span>
      </>
    ) : (
      t('complete_booking') || "Complete Booking"
    )}
  </button>
);