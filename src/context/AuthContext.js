"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutAllUser, logoutUser, registerUser } from "@/services/authService";



const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser }) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    // 1. Initialize State
    const [user, setUser] = useState(initialUser);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    // =================================================================
    // LOGIN
    // =================================================================
    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            // A. Force Next.js to re-run the RootLayout (verifying the new cookie)
            router.refresh(); 

            if (data?.user) {
                setUser(data.user);
            }
            
            // B. Then navigate
            router.push("/");
        },
        onError: (error) => {
            console.error("Login Failed:", error);
        }
    });

    // =================================================================
    // REGISTER
    // =================================================================
    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {

            if (data?.user) {
                setUser(data.user);
            }
            // If registration auto-logs in (sets cookies), we need to refresh
            router.refresh();
            router.push("/");
        },
        onError: (error) => {
            console.error("Registration Failed:", error);
        }
    });

    // =================================================================
    // LOGOUT
    // =================================================================
    const logoutMutation = useMutation({
        mutationFn: async () => {
            return await logoutUser();
        },
        onSuccess: () => {
            // 1. Clear Client Cache
            queryClient.clear();
            
            // 2. Optimistic Update (Instant feedback)
            setUser(null); 
            
            // 3. Refresh Server Component to ensure cookies are gone server-side too
            router.refresh();
        },
        onError: (err) => {
            console.error("Logout failed, forcing client logout", err);
            setUser(null);
        }
    });

    // =================================================================
    // LOGOUT SESSIONS
    // =================================================================
    const logoutALLMutation = useMutation({
        mutationFn: async () => {
            return await logoutAllUser();
        },
        onSuccess: () => {
            // 1. Clear Client Cache
            queryClient.clear();
            
            // 2. Optimistic Update (Instant feedback)
            setUser(null); 
            
            // 3. Refresh Server Component to ensure cookies are gone server-side too
            router.refresh();
        },
        onError: (err) => {
            console.error("Logout failed, forcing client logout", err);
            setUser(null);
        }
    });

    

    const isLoading = loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending;

    return (
        <AuthContext.Provider
            value={{
                user, // <--- NOW EXPOSED TO NAVBAR
                isLoading,
                login: loginMutation.mutateAsync,
                register: registerMutation.mutateAsync,
                logout: logoutMutation.mutateAsync,
                logoutAll: logoutALLMutation.mutateAsync,
                loginError: loginMutation.error,
                registerError: registerMutation.error
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);