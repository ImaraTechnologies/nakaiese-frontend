'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl'; // 1. Import i18n hook
import {
  CheckCircle2, Copy, ArrowRight, UserPlus,
  ShieldCheck, Calendar, MapPin, Loader2
} from 'lucide-react';

import useBookingStore from '@/store/useBookingStore';
import { useAuth } from '@/context/AuthContext';

export default function BookingSuccessPage({ params }) {
  // 2. Unwrap params (Next.js 15+)
  const { id } = use(params);
  
  // 3. Init Hooks
  const t = useTranslations('BookingSuccess'); // Namespace for translations
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { getBooking } = useBookingStore();

  const email = searchParams.get('e') || '';

  // 4. Derived State (Fixes the cascading render bug)
  // We do NOT need useState/useEffect for this. It is calculated on every render.
  const isAuthenticated = !authLoading && !!user;

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 5. Data Fetching
  useEffect(() => {
    let isMounted = true;

    const fetchBooking = async () => {
      try {
        // Attempt to get from store
        const storedBooking = getBooking(id);

        if (storedBooking) {
            // Simulate network delay if needed, or remove setTimeout for instant load
            if (isMounted) {
              setBooking({
                reference: storedBooking.reference || id,
                property_type: storedBooking.type || 'room', // default to room
                checkin: storedBooking.dates?.start,
                checkout: storedBooking.dates?.end,
                arrivalTime: storedBooking.dates?.arrival_time,
                email: email
              });
              setIsLoading(false);
            }
        } else {
            // fallback: If store is empty (user refreshed), you might want to fetch from API here
            // const apiData = await fetch(`/api/bookings/${id}`).then(res => res.json());
            console.warn("Booking not found in local store (User likely refreshed)");
            setIsLoading(false); 
        }

      } catch (error) {
        console.error("Failed to load booking", error);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBooking();

    return () => { isMounted = false; };
  }, [id, getBooking, email]);

  const copyToClipboard = () => {
    if (booking?.reference) {
      navigator.clipboard.writeText(booking.reference);
      // toast.success(t('copy_success'));
    }
  };

  // --- RENDER LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-slate-300" />
        <p className="text-sm font-medium">{t('loading')}</p>
      </div>
    );
  }

  // --- RENDER NOT FOUND ---
  if (!booking) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
            <h1 className="text-xl font-bold text-slate-900">{t('not_found_title')}</h1>
            <p className="text-slate-500 mt-2">{t('not_found_desc')}</p>
            <Link href="/" className="mt-4 text-blue-600 hover:underline">{t('return_home')}</Link>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg space-y-6">

        {/* --- 1. SUCCESS HEADER --- */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm ring-8 ring-green-50">
              <CheckCircle2 className="w-10 h-10" strokeWidth={3} />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('booking_confirmed')}
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
               {/* Handles "We've sent details to..." with dynamic email */}
               {t.rich('sent_details', {
                  email: (chunks) => <span className="font-medium text-slate-700">{booking.email}</span>
               })}
            </p>
          </div>
        </div>

        {/* --- 2. TICKET CARD --- */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-slide-up">

          {/* Reference Banner */}
          <div className="bg-slate-900 p-6 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                {t('booking_reference')}
            </p>
            <div
              onClick={copyToClipboard}
              className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 transition-colors px-6 py-3 rounded-xl cursor-pointer group"
              title={t('click_to_copy')}
            >
              <span className="text-3xl font-mono font-bold text-white tracking-widest">
                {booking.reference}
              </span>
              <Copy className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </div>

          {/* Mini Details */}
          <div className="p-6 grid grid-cols-2 gap-4 border-b border-slate-100 border-dashed">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">{t('check_in')}</p>
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <MapPin className="w-4 h-4 text-slate-400" />
                {booking.checkin || t('na')}
              </div>
            </div>

            {booking.property_type === 'room' && (
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">{t('check_out')}</p>
                <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {booking.checkout || t('na')}
                </div>
              </div>
            )}
            
            {booking.property_type === 'table' && (
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">{t('arrival_time')}</p>
                <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {booking.arrivalTime || t('na')}
                </div>
              </div>
            )}
          </div>

          {/* --- 3. GUEST UPSELL (Conditional) --- */}
          {/* Using derived state 'isAuthenticated' here */}
          {!isAuthenticated && (
            <div className="p-6 bg-blue-50/50">
              <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50"></div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{t('upsell_title')}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {t('upsell_desc')}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Link
                        href={`/register?redirect=/booking/${booking.reference}`}
                        className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                      >
                        {t('create_account')}
                      </Link>
                      <Link
                        href="/login"
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2 py-2"
                      >
                        {t('login')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- 4. ACTION BUTTONS --- */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/dashboard/bookings/${booking.reference}`}
            className="w-full bg-slate-900 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.99] flex items-center justify-center gap-2 group"
          >
            {t('check_status')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/"
            className="w-full bg-white border border-slate-200 text-slate-600 font-semibold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center"
          >
            {t('return_home')}
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            {t('secure_msg')}
          </p>
        </div>

      </div>
    </div>
  );
}