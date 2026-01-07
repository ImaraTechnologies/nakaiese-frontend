'use client';

import React, { useMemo, useState } from 'react';
import { Filter, ChevronDown, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useProperties } from '@/hooks/useProperties';



import PageHeader from '@/components/Shared/Restaurants/PageHeader';
import FilterSection from '@/components/Shared/Restaurants/FilterSection';
import RestaurantGrid from '@/components/Shared/Restaurants/RestaurantGrid';
import MobileFilterDrawer from '@/components/Shared/MobileFilterDrawer/MobileFilterDrawer';
import { useSearchParams } from 'next/navigation';

export default function RestaurantsPage() {
  const t = useTranslations('RestaurantsPage');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());

    return {
      ...params,
      property_type: 'RT',
    };
  }, [searchParams]);

  const currentSearchString = searchParams.toString();


  // --- DATA FETCHING (Refactored) ---
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useProperties(filters);

  const allRestaurants = data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader t={t} />

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          <aside className="hidden lg:block w-1/4 min-w-[280px]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">{t('Filters.title')}</h3>
                <button className="text-sm text-blue-600 hover:underline font-medium">
                  {t('Filters.reset')}
                </button>
              </div>
              <FilterSection t={t} />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-sm md:text-base">
                {t('Toolbar.found')} <span className="font-bold text-gray-900">{allRestaurants.length}</span> {t('Toolbar.places')}
                {data?.pages[0]?.count && <span> of {data.pages[0].count}</span>}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" /> {t('Toolbar.filters_btn')}
                </button>

                <div className="relative group">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                    {t('Toolbar.sort_by')}: {t('Toolbar.sort_options.top_rated')} <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <RestaurantGrid restaurants={allRestaurants} searchParamsString={currentSearchString}  isLoading={isLoading} t={t} />

            <div className="mt-12 text-center">
              {hasNextPage ? (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors disabled:opacity-70 flex items-center gap-2 mx-auto"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
                      Loading...
                    </>
                  ) : (
                    t('load_more') || "Load More"
                  )}
                </button>
              ) : allRestaurants.length > 0 && (
                <p className="text-gray-400 text-sm mt-8">You&apos;ve reached the end of the list</p>
              )}
            </div>
          </main>
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title={t('Filters.title')}
        footerAction={
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800"
          >
            {t('Filters.show_results')}
          </button>
        }
      >
        <FilterSection t={t} />
      </MobileFilterDrawer>
    </div>
  );
}