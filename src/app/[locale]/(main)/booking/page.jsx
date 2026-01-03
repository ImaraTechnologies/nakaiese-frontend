'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, User, ShieldCheck, AlertCircle } from 'lucide-react';

// Hooks
import { usePropertyInfo } from '@/hooks/useProperties';
import { useCreateBooking } from '@/hooks/useBooking'; // The hook we created earlier

// Sub-components
import BookingSummary from '@/components/Shared/Booking/BookingSummary';
import CustomerForm from '@/components/Shared/Booking/CustomerForm';
import PaymentMethodSelector from '@/components/Shared/Booking/PaymentMethodSelector';
import { FullPageSpinner } from '@/components/ui/Spinner/Spinner';

export default function BookingPage() {
  const t = useTranslations('Booking');
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  // 1. Fetch Property Data
  const { data, isLoading, error } = usePropertyInfo(searchParamsString);

  // 2. Setup Mutation Hook
  const { mutate, isPending } = useCreateBooking();

  // 3. Centralized State (Lifting State Up)
  const [customerInfo, setCustomerInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    country: '',
    special_requests: '',
    is_booking_for_myself: true
  });

  const [paymentMethod, setPaymentMethod] = useState('COA'); // Default: Cash on Arrival

  // Handler to update customer info from the child component
  const handleCustomerChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  // 4. Submit Logic
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data) return;

    // --- CONSTRUCT PAYLOAD ---
    // Mapping existing data and form state to Backend Requirement
    const payload = {
      // If you have a logged-in user, you would put their ID here. 
      // If it's a guest, send null or omit if backend allows.
      id: null, 
      
      property: data.property.id,
      status: "PD", // Pending
      
      // Get dates from URL Params (assuming format YYYY-MM-DD)
      start_date: searchParams.get('checkin'),
      end_date: searchParams.get('checkout'),
      
      arrival_time: null, // Null for hotels per instructions
      
      number_of_adults: parseInt(searchParams.get('adults') || 1),
      number_of_children: parseInt(searchParams.get('children') || 0),
      
      special_requests: customerInfo.special_requests,
      
      // Nested Customer Data
      customer_info: {
        first_name: customerInfo.first_name,
        last_name: customerInfo.last_name,
        email: customerInfo.email,
        phone_number: customerInfo.phone_number,
        is_booking_for_myself: customerInfo.is_booking_for_myself
      },
      
      payment_method: paymentMethod,
      
      // Mapping the selected items (Rooms)
      // Assuming 'data.selected_rooms' or similar exists. 
      // If 'data.items' is the structure from your cart/summary:
      items: data.items ? data.items.map(item => ({
        room_type: item.id, // Assuming item.id is the room_type UUID
        table: null,
        quantity: item.quantity || 1
      })) : []
    };

    // --- EXECUTE MUTATION ---
    mutate(payload, {
      onSuccess: (responseData) => {
        // Redirect to success page or show modal
        // router.push(`/booking/success/${responseData.id}`);
        console.log("Success:", responseData);
        alert("Booking Successful!"); // Replace with Toast in production
      },
      onError: (err) => {
        // Error handling is managed by the hook's console log, 
        // but you can show a UI alert here too.
        console.error("Submission error:", err);
        alert("Booking Failed. Please check your details.");
      }
    });
  };

  // --- Loading & Error Views ---
  if (isLoading) return <FullPageSpinner />;
  
  if (error || !data) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Booking Details Not Found</h2>
                <p className="text-slate-500 mb-6">We couldn&apos;t retrieve the details for this reservation.</p>
                <button onClick={() => window.history.back()} className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium">Go Back</button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{t('page_title') || "Confirm Your Booking"}</h1>
          <div className="flex items-center gap-2 text-green-600 mt-2 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('secure_msg') || "Secure booking. Your data is protected."}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Customer Details */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{t('customer_details') || "Your Details"}</h2>
              </div>
              
              {/* Pass state and handler down */}
              <CustomerForm 
                t={t} 
                formData={customerInfo} 
                onChange={handleCustomerChange} 
              />
            </section>

            {/* 2. Payment Method */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{t('payment_method') || "Payment"}</h2>
              </div>
              
              {/* Assuming PaymentSelector accepts value/onChange */}
              <PaymentMethodSelector 
                t={t} 
                data={data.property} 
                value={paymentMethod}
                onChange={setPaymentMethod} 
              />
            </section>

            <div className="lg:hidden">
              <SubmitButton isSubmitting={isPending} t={t} />
            </div>
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <BookingSummary apiData={data} t={t} searchParams={searchParams} />
            <div className="hidden lg:block">
              <SubmitButton isSubmitting={isPending} t={t} />
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

// Helper Button
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
      `${t('complete_booking') || "Complete Booking"}`
    )}
  </button>
);