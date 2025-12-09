import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "@/services/profileServices";
import { useAuth } from "@/context/AuthContext"; // ✅ Import your Auth Context

export const useProfile = () => {
    const queryClient = useQueryClient();
    
    // ✅ 1. Get User/Auth status to control the query
    const { user } = useAuth();
    const isAuthenticated = !!user;

    const { 
        data: profile, 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
        
        // ✅ 2. PREVENT REDIRECTION LOOP
        // Only run this query if the user is logged in.
        // This stops the API from firing 401s while the auth state is still loading.
        enabled: isAuthenticated, 

        staleTime: 1000 * 60 * 5, 
        retry: 1, 
    });

    const updateProfileMutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (updatedData) => {
            queryClient.setQueryData(['userProfile'], updatedData);
        },
        onError: (err) => {
            console.error("Profile Update Failed:", err);
        }
    });

    return {
        profile,
        // ✅ 3. Fix Loading State
        // If query is disabled, isLoading is false, but 'fetchStatus' might be idle.
        // We ensure we show loading if we are fetching OR if we are waiting for auth.
        isLoading: isLoading && isAuthenticated, 
        isError: !!error,
        error,
        updateProfile: updateProfileMutation.mutateAsync, 
        isUpdating: updateProfileMutation.isPending,
        refetch
    };
};