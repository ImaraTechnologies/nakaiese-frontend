import { useQuery } from "@tanstack/react-query";
import { useLocale } from 'next-intl';
import { getCities } from "@/services/citiesServices";

export const useCities = () => {
    const locale = useLocale();

    return useQuery({
        // The queryKey includes 'locale' so it auto-refetches if the language changes
        queryKey: ['cities', locale], 
        queryFn: () => getCities(locale),
        
        // Production Grade Options:
        staleTime: 1000 * 60 * 60 * 24, // 24 hours. Cities rarely change, so keep them "fresh" for a long time.
        gcTime: 1000 * 60 * 60 * 24, // Keep in garbage collection cache for 24 hours
        refetchOnWindowFocus: false, // Prevent unnecessary refetches when user tabs out/in
        retry: 2, // Retry failed requests twice before throwing error
    });
};