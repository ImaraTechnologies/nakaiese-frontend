'use client'

import { useProfile } from "@/hooks/useProfile";
import EditableRow from '@/components/Shared/Profile/EditableRow';
import { PROFILE_FIELDS } from '@/validations/profileConfig';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const t = useTranslations('Profile');

  const getValue = (key) => {
    if (!profile) return '';
    return profile[key];
  };

  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {t('title')}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-2xl">
            {t('subtitle')}
        </p>
      </div>

      {/* CARD CONTAINER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          // Responsive Skeleton
          <div className="p-4 sm:p-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 sm:w-1/4"></div>
                <div className="h-8 bg-gray-50 rounded w-full sm:w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          // Content List
          <div className="divide-y divide-gray-100">
            {PROFILE_FIELDS.map((field) => (
              <EditableRow 
                key={field.key}
                field={field}
                currentValue={getValue(field.key)}
                onSave={updateProfile}
                isGlobalUpdating={isUpdating}
                t={t} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}