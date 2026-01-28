import { useQuery } from "@tanstack/react-query";
import { getDashboardBookings, getDashboardBookingStats, getDashboardMetrics } from "@/services/dashboardServices";


export const useDashboardMetrics = () => {
    return useQuery({
        queryKey: ['dashboardMetrics'],
        queryFn: async () => getDashboardMetrics(),

        // Production Grade Options:
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        refetchOnWindowFocus: false, // Prevent unnecessary refetches when user tabs out/in
        retry: 2, // Retry failed requests twice before throwing error
    });
};

export const useDashboardBookings = (queryParams) => {
    return useQuery({
        queryKey: ['dashboardBookings', queryParams],   
        queryFn: async () => getDashboardBookings(queryParams),
        // Production Grade Options:
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false, // Prevent unnecessary refetches when user tabs out/in
        retry: 2, // Retry failed requests twice before throwing error
    });
};

export const useDashboardBookingStats = () => {
    return useQuery({
        queryKey: ['dashboardBookingStats'],
        queryFn: async () => getDashboardBookingStats(),
        // Production Grade Options:
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        refetchOnWindowFocus: false, // Prevent unnecessary refetches when user tabs out/in
        retry: 2, // Retry failed requests twice before throwing error
    });
};