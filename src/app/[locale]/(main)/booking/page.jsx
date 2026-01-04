'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, User, ShieldCheck, AlertCircle } from 'lucide-react';
// import { toast } from 'sonner'; // Recommend installing 'sonner' or 'react-hot-toast' for production

// Hooks
import { usePropertyInfo } from '@/hooks/useProperties';
import { useCreateBooking } from '@/hooks/useBooking';

// Components
import BookingSummary from '@/components/Shared/Booking/BookingSummary';
import CustomerForm from '@/components/Shared/Booking/CustomerForm';
import PaymentMethodSelector from '@/components/Shared/Booking/PaymentMethodSelector';
import { FullPageSpinner } from '@/components/ui/Spinner/Spinner';

export default function BookingPage() {
  const t = useTranslations('Booking');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // --- 1. DATA FETCHING ---
  const { data, isLoading, error } = usePropertyInfo(searchParams.toString());
  const { mutate, isPending } = useCreateBooking();

  // --- 2. STATE MANAGEMENT ---
  const [customerInfo, setCustomerInfo] = useState({
    first_name: '', last_name: '', email: '', 
    phone_number: '', country: '', special_requests: '', 
    is_booking_for_myself: true
  });
  const [paymentMethod, setPaymentMethod] = useState('COA');

  // --- 3. SMART CONTEXT DERIVATION ---
  // Detect Booking Type based on URL params (RT = Restaurant, HT = Hotel)
  const bookingContext = useMemo(() => {
    const type = searchParams.get('p_t') || 'HT'; // Default to Hotel
    const itemId = searchParams.get('item_id');
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');
    const time = searchParams.get('time');
    
    // Normalize Guests: If 'guests' param exists (Restaurant), use it. Else use adults/children.
    const rawGuests = searchParams.get('guests');
    const adults = parseInt(searchParams.get('adults') || (rawGuests ? rawGuests : 1));
    const children = parseInt(searchParams.get('children') || 0);

    return {
      isRestaurant: type === 'RT',
      itemId,
      dates: {
        start: checkin,
        // For Restaurants, End Date is same as Start Date
        end: type === 'RT' ? checkin : checkout, 
      },
      time: type === 'RT' ? time : null, // Hotels don't send arrival_time
      counts: { adults, children }
    };
  }, [searchParams]);

  // --- 4. SUBMISSION LOGIC ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data || !bookingContext.itemId) {
      // toast.error(t('error_missing_data') || "Booking details missing");
      return;
    }

    // --- SMART PAYLOAD CONSTRUCTION ---
    const payload = {
      property: data.property.id,
      status: "PD",
      
      // Date & Time Logic
      start_date: bookingContext.dates.start,
      end_date: bookingContext.dates.end,
      arrival_time: bookingContext.time, // Will be null for Hotels, "HH:MM" for Restaurants
      
      // Guest Logic
      number_of_adults: bookingContext.counts.adults,
      number_of_children: bookingContext.counts.children,
      special_requests: customerInfo.special_requests,

      // Customer Info
      customer_info: {
        first_name: customerInfo.first_name,
        last_name: customerInfo.last_name,
        email: customerInfo.email,
        phone_number: customerInfo.phone_number,
        is_booking_for_myself: customerInfo.is_booking_for_myself
      },

      // Payment
      payment_method: paymentMethod,

      // --- HYBRID ITEM LOGIC ---
      // Dynamically assign 'room_type' OR 'table' based on context
      items: [{
        // If Restaurant -> key is 'table', If Hotel -> key is 'room_type'
        [bookingContext.isRestaurant ? 'table' : 'room_type']: bookingContext.itemId,
        quantity: 1, // Default to 1 for direct bookings
        
        // Optional: If you want to send price from frontend (backend should verify though)
        // price_per_unit: ... 
      }]
    };

    // --- EXECUTE ---
    mutate(payload, {
      onSuccess: (responseData) => {
        // toast.success("Booking Confirmed!");
        router.push(`/booking/success/${responseData.id}`);
      },
      onError: (err) => {
        console.error("Booking Error:", err);
        // Extract backend error message if available
        const msg = err.response?.data?.detail || "Booking failed. Please try again.";
        // toast.error(msg);
      }
    });
  };

  // --- RENDER HELPERS ---
  const handleCustomerChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <FullPageSpinner />;
  
  if (error || !data) {
    return (
      <ErrorState onBack={() => router.back()} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
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
            <SectionWrapper title={t('customer_details') || "Your Details"} icon={User} iconColor="text-blue-600" iconBg="bg-blue-50">
              <CustomerForm 
                t={t} 
                formData={customerInfo} 
                onChange={handleCustomerChange} 
              />
            </SectionWrapper>

            {/* 2. Payment Method */}
            <SectionWrapper title={t('payment_method') || "Payment"} icon={CreditCard} iconColor="text-green-600" iconBg="bg-green-50">
              <PaymentMethodSelector 
                t={t} 
                data={data.property} 
                value={paymentMethod}
                onChange={setPaymentMethod} 
              />
            </SectionWrapper>

            {/* Mobile Submit */}
            <div className="lg:hidden">
              <SubmitButton isSubmitting={isPending} t={t} />
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <BookingSummary 
              apiData={data} 
              t={t} 
              searchParams={searchParams} 
              isRestaurant={bookingContext.isRestaurant} // Pass this to Summary for correct labels
            />
            <div className="hidden lg:block">
              <SubmitButton isSubmitting={isPending} t={t} />
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR CLEANLINESS ---

const SectionWrapper = ({ title, icon: Icon, iconColor, iconBg, children }) => (
  <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    </div>
    {children}
  </section>
);

const ErrorState = ({ onBack }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Booking Details Not Found</h2>
      <p className="text-slate-500 mb-6">We couldn&apos;t retrieve the details for this reservation.</p>
      <button onClick={onBack} className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors">Go Back</button>
    </div>
  </div>
);

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