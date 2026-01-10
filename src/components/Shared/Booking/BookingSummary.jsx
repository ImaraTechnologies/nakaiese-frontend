import React from 'react';
import Image from 'next/image';
import { Calendar, Users, Clock, MapPin, Tag } from 'lucide-react';
import { useFormatter } from 'next-intl';

export default function BookingSummary({ apiData, t, searchParams }) {
  const format = useFormatter();

  // 1. Destructure API Data safely
  if (!apiData) return null;
  const { property, item, summary } = apiData;

  // 2. Determine Type
  const isHotel = property.property_type === 'HL';

  // 3. Robust Image URL Logic
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-property.jpg';

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const baseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'http://127.0.0.1:8000';
    return `${baseUrl}${imagePath}`;
  };

  const imageUrl = getImageUrl(property.image);

  // 4. Parse Dates
  const checkInDate = searchParams.get('checkin') ? new Date(searchParams.get('checkin')) : null;
  const checkOutDate = searchParams.get('checkout') ? new Date(searchParams.get('checkout')) : null;
  const timeSlotRaw = searchParams.get('time') || summary.time;

  console.log('Raw Time Slot:', timeSlotRaw);

  // --- FIX: Time Formatter Helper ---
  const formatTimeSlot = (timeStr) => {
    if (!timeStr) return '';

    // Create a date object for today with the specific time
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    // USE format.dateTime() instead of format.time()
    return format.dateTime(date, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true // Forces 12-hour format (e.g., 7:30 PM)
    });
  };

  const formattedTime = formatTimeSlot(timeSlotRaw);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ">

      {/* --- Property Header Image --- */}
      <div className="relative h-36 w-full bg-slate-100">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          // FIX: Disable server-side optimization for localhost images
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
          <div className="text-white w-full">
            <h3 className="font-bold text-lg leading-tight mb-1">{property.title}</h3>
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate max-w-[250px]">
                {property.city_name}, {property.country_name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* --- Selected Item Info --- */}
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${isHotel ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
              {isHotel ? <Tag className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-0.5">
                {isHotel ? (t('selected_room') || "Selected Room") : (t('selected_table') || "Selected Table")}
              </p>
              <h4 className="text-base font-bold text-slate-900 leading-tight">
                {isHotel
                  ? item.title
                  : `${item.location_label || 'Table'} (${item.table_number})`
                }
              </h4>
              {isHotel && item.bed_type && (
                <p className="text-xs text-slate-500 mt-1">
                  {item.capacity_adults} Adults • {item.bed_type} Bed
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- Date & Guests --- */}
        <div className="space-y-4">

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-100">
              {isHotel ? <Calendar className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">
                {isHotel ? (t('dates') || "Dates") : (t('reservation_time') || "Time")}
              </p>
              <p className="font-medium text-slate-900 text-sm mt-0.5">
                {isHotel ? (
                  <>
                    {checkInDate ? format.dateTime(checkInDate, { month: 'short', day: 'numeric' }) : '--'}
                    {' → '}
                    {checkOutDate ? format.dateTime(checkOutDate, { month: 'short', day: 'numeric', year: 'numeric' }) : '--'}
                    <span className="block text-xs text-slate-500 font-normal mt-0.5">
                      {summary.nights} {t('nights') || "Night(s)"}
                    </span>
                  </>
                ) : (
                  <>
                    {checkInDate ? format.dateTime(checkInDate, { weekday: 'short', month: 'long', day: 'numeric' }) : 'Today'}
                    {' @ '}
                    <span className="text-blue-600 font-bold">
                      {formattedTime || timeSlot}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-100">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">
                {t('guests') || "Guests"}
              </p>
              <p className="font-medium text-slate-900 text-sm mt-0.5">
                {summary.guests || summary.quantity} {t('people') || "People"}
                {isHotel && ` (${summary.quantity} Room${summary.quantity > 1 ? 's' : ''})`}
              </p>
            </div>
          </div>
        </div>

        {/* --- Price Breakdown --- */}
        <div className="pt-6 border-t border-dashed border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-900 text-sm mb-3">{t('price_breakdown') || "Price Breakdown"}</h4>

          {isHotel ? (
            <div className="flex justify-between text-sm text-slate-600">
              <div className="flex flex-col">
                <span className="font-medium text-slate-700">{summary.breakdown?.title || item.title}</span>
                <span className="text-xs text-slate-400">
                  {summary.breakdown?.quantity || summary.quantity} room(s) x {summary.breakdown?.nights || summary.nights} night(s)
                </span>
              </div>
              <span className="font-medium">
                {format.number(parseFloat(summary.breakdown?.total || summary.total_price), { style: 'currency', currency: 'USD' })}
              </span>
            </div>
          ) : (
            summary.breakdown && Array.isArray(summary.breakdown) && summary.breakdown.map((line, idx) => (
              <div key={idx} className="flex justify-between text-sm text-slate-600">
                <span>{line}</span>
                {idx === 0 && (
                  <span className="font-medium">
                    {format.number(summary.total_price, { style: 'currency', currency: 'USD' })}
                  </span>
                )}
              </div>
            ))
          )}

          <div className="flex justify-between text-sm text-slate-500 pt-2">
            <span>{t('taxes_fees') || "Taxes & Fees"}</span>
            <span className="font-medium">{format.number(0, { style: 'currency', currency: 'USD' })}</span>
          </div>

          <div className="flex justify-between items-end pt-4 border-t border-slate-200 mt-2">
            <span className="font-bold text-slate-900 text-lg">{t('total') || "Total"}</span>
            <span className="font-extrabold text-slate-900 text-2xl tracking-tight text-blue-600">
              {format.number(summary.total_price, { style: 'currency', currency: 'USD' })}
            </span>
          </div>
        </div>

      </div>

      <div className="bg-slate-50 p-4 text-center border-t border-slate-200">
        <p className="text-xs text-slate-500 font-medium">
          {t('free_cancel_msg') || "Free cancellation until 24 hours before."}
        </p>
      </div>
    </div>
  );
}