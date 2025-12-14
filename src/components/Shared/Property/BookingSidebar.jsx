'use client';
import React from 'react';
import { Calendar, Clock, Users, Info } from 'lucide-react';
import { useFormatter } from 'next-intl';

const BookingSidebar = ({ property, isHotel, t }) => {
  const format = useFormatter();

  // Price Logic: Lowest room price OR Reservation Fee
  const displayPrice = isHotel 
    ? Math.min(...(property.room_types?.map(r => Number(r.price_per_night)) || [0]))
    : Number(property.reservation_fee || 0);

  const priceLabel = isHotel ? t('priceStart') : t('resFee');
  const unitLabel = isHotel ? t('perNight') : t('perPerson');

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-6">
        
        {/* Header Price */}
        <div className="mb-6">
          <span className="text-slate-400 text-sm">{priceLabel}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {displayPrice === 0 
                ? <span className="text-green-600">{t('free')}</span>
                : format.number(displayPrice, { style: 'currency', currency: 'USD' })
              }
            </span>
            {displayPrice > 0 && <span className="text-slate-500 text-sm">{unitLabel}</span>}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">{isHotel ? t('checkIn') : t('date')}</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input type="date" className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">{isHotel ? t('checkOut') : t('time')}</label>
                <div className="relative">
                  {isHotel ? <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" /> : <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />}
                  {isHotel ? (
                     <input type="date" className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
                  ) : (
                     <select className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none appearance-none bg-white">
                       <option>19:00</option>
                       <option>20:00</option>
                     </select>
                  )}
                </div>
             </div>
          </div>

          <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-400">{isHotel ? t('guests') : t('partySize')}</label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <select className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none appearance-none bg-white">
                  <option>2 {t('adults')}, 0 Children</option>
                  <option>1 Adult</option>
                </select>
              </div>
          </div>

          <button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-yellow-500/30 transition-all">
            {isHotel ? t('checkAvail') : t('reserveTable')}
          </button>
          
          <p className="text-xs text-center text-slate-400 mt-2">
            {isHotel ? t('noCharge') : t('instantConf')}
          </p>
        </div>
      </div>

      {/* Help Box */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-start gap-4">
        <div className="p-3 bg-white/10 rounded-full">
          <Info className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h4 className="font-bold mb-1">{t('needHelp')}</h4>
          <p className="text-sm text-slate-300 mb-3">{t('callSupport')}</p>
          <a href="#" className="text-yellow-400 font-semibold text-sm hover:underline">+243 906947381</a>
        </div>
      </div>
    </div>
  );
};

export default BookingSidebar;