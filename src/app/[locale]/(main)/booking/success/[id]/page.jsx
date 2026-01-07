'use client';

import React, { useEffect, useState, use } from 'react'; // 1. Import 'use'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2, Copy, ArrowRight, UserPlus,
  ShieldCheck, Calendar, MapPin, Loader2
} from 'lucide-react';
import useBookingStore from '@/store/useBookingStore';



export default function BookingSuccessPage({ params }) {
  // 2. Unwrap the params Promise using React.use()
  const { id } = use(params);

  const searchParams = useSearchParams();

  const { getBooking } = useBookingStore();

  const email = searchParams.get('e') || '';
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated Data Fetch
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // MOCK DATA for demonstration
        const booking = getBooking(id);
        setTimeout(() => {
          setBooking({
            reference: booking.reference, // 3. Use 'id' directly
            property_type: booking.type,
            checkin: booking.dates.start,
            checkout: booking.dates.end,
            arrivalTime: booking.dates.arrival_time,

            is_guest: true,
            email: email || ""
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to load booking", error);
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]); // 4. Update dependency array to use 'id'

  const copyToClipboard = () => {
    if (booking?.reference) {
      navigator.clipboard.writeText(booking.reference);
      // toast.success("Reference copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-slate-300" />
        <p className="text-sm font-medium">Finalizing your booking...</p>
      </div>
    );
  }

  if (!booking) return null;

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
              Booking Confirmed!
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              We&apos;ve sent the details to <span className="font-medium text-slate-700">{booking.email}</span>
            </p>
          </div>
        </div>

        {/* --- 2. TICKET CARD --- */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-slide-up">

          {/* Reference Banner */}
          <div className="bg-slate-900 p-6 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Booking Reference</p>
            <div
              onClick={copyToClipboard}
              className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 transition-colors px-6 py-3 rounded-xl cursor-pointer group"
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
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">Check In</p>
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <MapPin className="w-4 h-4 text-slate-400" />
                {booking.checkin}
              </div>
            </div>
            {booking.property_type === 'room' && (
              <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">Check Out</p>
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <Calendar className="w-4 h-4 text-slate-400" />
                {booking.checkout}
              </div>
            </div>
            )
              }
            {booking.property_type === 'table' && (
              <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">Arival Time</p>
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <Calendar className="w-4 h-4 text-slate-400" />
                {booking.arrivalTime}
              </div>
            </div>
            )
              }
            
          </div>

          {/* --- 3. GUEST UPSELL (Conditional) --- */}
          {booking.is_guest && (
            <div className="p-6 bg-blue-50/50">
              <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50"></div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Don&apos;t lose this booking</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Create an account now to save this reservation to your history, modify dates, and get faster checkouts.
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Link
                        href={`/register?redirect=/booking/${booking.reference}`}
                        className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                      >
                        Create Account
                      </Link>
                      <Link
                        href="/login"
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2 py-2"
                      >
                        Log In
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
            Check Booking Status
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/"
            className="w-full bg-white border border-slate-200 text-slate-600 font-semibold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center"
          >
            Return Home
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            Secure booking processed by Nakiese
          </p>
        </div>

      </div>
    </div>
  );
}