'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { CreditCard, User, ShieldCheck, AlertCircle } from 'lucide-react';

// Hooks
import { usePropertyInfo } from '@/hooks/useProperties';

// Sub-components
import BookingSummary from '@/components/Shared/Booking/BookingSummary';
import CustomerForm from '@/components/Shared/Booking/CustomerForm';
import PaymentMethodSelector from '@/components/Shared/Booking/PaymentMethodSelector';
import { FullPageSpinner } from '@/components/ui/Spinner/Spinner';

export default function BookingPage() {
  const t = useTranslations('Booking');
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  // 1. Fetch Real Booking Data
  const { data, isLoading, error } = usePropertyInfo(searchParamsString);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call for booking creation
    console.log("Submitting booking for:", data?.item?.id);
    
    setTimeout(() => {
        setIsSubmitting(false);
        // Handle success/redirect here
    }, 2000);
  };

  // --- Loading & Error States ---
  if (isLoading) return <FullPageSpinner />;
  
  if (error || !data) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Booking Details Not Found</h2>
                {/* FIX: Escaped the apostrophe in "couldn't" */}
                <p className="text-slate-500 mb-6">We couldn&apos;t retrieve the details for this reservation. The link might be expired or invalid.</p>
                <button 
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
  }

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
              <PaymentMethodSelector t={t} data={data.property} />
            </section>

            {/* Submit Button (Mobile Order) */}
            <div className="lg:hidden">
              <SubmitButton isSubmitting={isSubmitting} t={t} total={data.summary.total_price} />
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            
            {/* We pass the API data directly to the summary component */}
            <BookingSummary apiData={data} t={t} searchParams={searchParams} />
            
            {/* Submit Button (Desktop Order) */}
            <div className="hidden lg:block">
              <SubmitButton isSubmitting={isSubmitting} t={t} total={data.summary.total_price} />
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

// Helper Button Component
const SubmitButton = ({ isSubmitting, t, total }) => (
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
      // Optional: Show total in button for clarity
      `${t('complete_booking') || "Complete Booking"}`
    )}
  </button>
);