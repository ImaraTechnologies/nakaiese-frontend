import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useLocale } from 'next-intl'; // Import this
import { getPropertiesList } from "@/services/propertyServices";

export const useProperties = (filters) => {
    // 1. Get current locale (e.g., 'fr')
    const locale = useLocale();

    return useQuery({
        // 2. Add locale to queryKey so it refetches when language changes
        queryKey: ['properties', filters, locale], 

        // 3. Pass locale to the fetcher
        queryFn: () => getPropertiesList(filters, locale),

        placeholderData: keepPreviousData, 
        staleTime: 1000 * 60 * 5, 
        retry: 1,
    });
};