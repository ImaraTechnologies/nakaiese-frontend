"use client";

import { createContext, useContext} from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // <--- Import React Query
import { loginUser, logoutUser, registerUser } from "@/services/authService";
import useAuthStore from "@/store/useAuthStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Zustand Store Access
    const { user, setAuth, logout: performClientLogout } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: loginUser, // The service function
        onSuccess: (data) => {
            // 1. Update Zustand (Client State)
            setAuth(data.access, data.refresh);
            
            // 3. Navigate
            router.push("/dashboard"); // Or wherever you want to go
        },
        onError: (error) => {
            console.error("Login Failed:", error);
            // You can handle toasts here or in the UI component
        }
    });

    // =================================================================
    // 2. REGISTER MUTATION
    // =================================================================
    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setAuth(data.access, data.refresh);
            router.push("/dashboard");
        },
        onError: (error) => {
            console.error("Registration Failed:", error);
        }
    });

    // =================================================================
    // 3. LOGOUT MUTATION
    // =================================================================
    const logoutMutation = useMutation({
        mutationFn: async () => {
            const { refreshToken } = useAuthStore.getState();
            if (refreshToken) {
                return await logoutUser(refreshToken);
            }
        },
        onSuccess: () => {
            // Clear Zustand and Queries
            performClientLogout();
            queryClient.clear(); // Clears all cached data (security best practice)
            router.push("/login");
        },
        onError: (err) => {
            console.error("Logout failed on server, forcing client logout", err);
            // Even if server fails, we log out the client
            performClientLogout();
            router.push("/login");
        }
    });

    // =================================================================
    // 4. DERIVED STATE
    // =================================================================
    // Combined loading state for UI spinners
    const isLoading = loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending;

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                // We pass 'isLoading' so the UI knows if ANY auth action is happening
                isLoading, 
                
                // We pass 'mutateAsync' so the UI can use await login(creds)
                login: loginMutation.mutateAsync, 
                register: registerMutation.mutateAsync, 
                logout: logoutMutation.mutateAsync,

                // Optional: Pass full mutation objects if you need specific error states in UI
                loginError: loginMutation.error,
                registerError: registerMutation.error
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);