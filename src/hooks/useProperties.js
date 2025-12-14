import { useQuery, keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from 'next-intl'; // Import this
import { getPropertiesList, getPropertyById } from "@/services/propertyServices";

export const useProperties = (filters) => {
    const locale = useLocale();

    return useInfiniteQuery({
        // Include filters in the key so it resets when filters change
        queryKey: ['properties', filters, locale],
        
        // React Query passes 'pageParam' automatically
        queryFn: ({ pageParam = 1 }) => getPropertiesList({ ...filters, page: pageParam }, locale),
        
        // Determine the next page number based on backend response
        getNextPageParam: (lastPage, allPages) => {
            // If the backend returns a 'next' URL, we assume there is a next page.
            // We calculate the next page number by current pages length + 1
            return lastPage.next ? allPages.length + 1 : undefined;
        },
        
        // Cache settings
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};
export const useProperty = (id) => {
    const locale = useLocale();

    return useQuery({
        // Unique key including ID and Locale ensures refetch on change
        queryKey: ['property', id, locale],

        // Fetcher function
        queryFn: () => getPropertyById(id, locale),

        // Config
        enabled: !!id, // Only run if ID is present
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 1, // Retry once on failure
    });
};