import React from 'react';
import Image from 'next/image';
import { Calendar, Users, Clock, MapPin, Star } from 'lucide-react';
import { useFormatter } from 'next-intl';

export default function BookingSummary({ data, t }) {
  const format = useFormatter();
  const { property, details } = data;
  const isHotel = property.type === 'HL';

  // Calculations
  const totalBase = details.pricePerNight * (isHotel ? details.nights : 1);
  const total = totalBase + details.taxes;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Property Snippet */}
      <div className="relative h-32 w-full">
        <Image 
          src={property.image} 
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <div className="text-white">
            <h3 className="font-bold text-lg leading-tight">{property.title}</h3>
            <div className="flex items-center gap-1 text-xs text-white/90 mt-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Dates & Time Logic */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              {isHotel ? <Calendar className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wide">
                {isHotel ? (t('dates') || "Dates") : (t('reservation_time') || "Time")}
              </p>
              <p className="font-medium text-slate-900 text-sm">
                {isHotel ? (
                  <>
                    {format.dateTime(new Date(details.checkIn), { month: 'short', day: 'numeric' })} 
                    {' - '} 
                    {format.dateTime(new Date(details.checkOut), { month: 'short', day: 'numeric', year: 'numeric' })}
                    <span className="text-slate-500 font-normal ml-1">({details.nights} {t('nights') || "nights"})</span>
                  </>
                ) : (
                  <>
                    {format.dateTime(new Date(details.checkIn), { weekday: 'short', month: 'short', day: 'numeric' })}
                    {' at '}
                    <span className="text-blue-600 font-bold">19:30</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wide">{t('guests') || "Guests"}</p>
              <p className="font-medium text-slate-900 text-sm">
                {details.guests.adults} {t('adults') || "Adults"}
                {details.guests.children > 0 && `, ${details.guests.children} ${t('children') || "Children"}`}
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="pt-6 border-t border-dashed border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-900 text-sm">{t('price_breakdown') || "Price Breakdown"}</h4>
          
          <div className="flex justify-between text-sm text-slate-600">
            <span>
              {isHotel ? details.roomName : (t('table_reservation') || "Table Reservation")} 
              {isHotel && <span className="text-xs text-slate-400 block">x {details.nights} {t('nights') || "nights"}</span>}
            </span>
            <span className="font-medium">{format.number(totalBase, { style: 'currency', currency: 'USD' })}</span>
          </div>
          
          <div className="flex justify-between text-sm text-slate-600">
            <span>{t('taxes_fees') || "Taxes & Fees"}</span>
            <span className="font-medium">{format.number(details.taxes, { style: 'currency', currency: 'USD' })}</span>
          </div>

          <div className="flex justify-between items-end pt-4 border-t border-slate-200">
            <span className="font-bold text-slate-900 text-lg">{t('total') || "Total"}</span>
            <span className="font-extrabold text-slate-900 text-2xl text-blue-600">
              {format.number(total, { style: 'currency', currency: 'USD' })}
            </span>
          </div>
        </div>

      </div>
      
      {/* Bottom Guarantee */}
      <div className="bg-slate-50 p-3 text-center border-t border-slate-200">
        <p className="text-xs text-slate-500">
          {t('free_cancel_msg') || "Free cancellation until 24 hours before check-in"}
        </p>
      </div>
    </div>
  );
}