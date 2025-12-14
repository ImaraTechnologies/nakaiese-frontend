'use client';
import React from 'react';
import { BedDouble, Users } from 'lucide-react';
import { useFormatter } from 'next-intl';

export default function RoomList({ rooms, t }) {
  const format = useFormatter();

  if (!rooms || rooms.length === 0) return null;

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('availableRooms')}</h2>
      <div className="space-y-6">
        {rooms.map((room) => (
          <div key={room.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
            <div className="md:w-64 h-48 md:h-auto bg-slate-200 relative shrink-0">
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <BedDouble className="w-10 h-10" />
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{room.title}</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{room.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                    <Users className="w-3 h-3 mr-2" /> {room.capacity_adults} {t('adults')}
                  </span>
                  {/* Bed Type Badge Logic Here */}
                </div>
              </div>
              <div className="flex items-end justify-between mt-4 md:mt-0">
                <div>
                  <span className="text-sm text-slate-400">{t('startFrom')}</span>
                  <div className="text-2xl font-bold text-slate-900">
                    {format.number(room.price_per_night, { style: 'currency', currency: 'USD' })}
                  </div>
                </div>
                <button className="py-2 px-4 text-sm bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors">
                  {t('selectRoom')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}