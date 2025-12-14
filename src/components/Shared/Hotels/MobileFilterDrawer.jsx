'use client';
import React from 'react';
import { X } from 'lucide-react';
import FilterSection from './FilterSection';

export default function MobileFilterDrawer({ isOpen, onClose, t }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">{t('Filters.title')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <FilterSection t={t} />
        
        <div className="mt-8 pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-4">
          <button onClick={onClose} className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800">
            {t('Filters.show_results')}
          </button>
        </div>
      </div>
    </div>
  );
}