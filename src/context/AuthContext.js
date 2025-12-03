"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { loginUser, logoutUser, registerUser } from "@/services/authService";
import useAuthStore from "@/store/useAuthStore"; // <--- Import Zustand Store

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // We read the user from Zustand, not local state
    const { user, setAuth, logout: performLogout } = useAuthStore();

    // 1. ON MOUNT: Try to get a token silently (Refresh Flow)
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { refreshToken } = useAuthStore.getState();
                // We don't read localStorage. We ask the API "Am I logged in?"
                // The API checks the HttpOnly cookie and returns a new Access Token
                const { data } = await api.post('/auth/refresh/', refreshToken ? { refresh: refreshToken } : {});

                // STORE IN ZUSTAND (Memory)
                setAuth(data.access);
            } catch (error) {
                // If refresh fails, we are effectively logged out
                console.log("Session invalid or expired");
                performLogout(); // Clear Zustand
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [setAuth, performLogout]);

    // 2. LOGIN: Save to Zustand, not LocalStorage
    const login = async (credentials) => {
        try {
            const data = await loginUser(credentials);

            console.log("Login successful", data);

            // Pass ALL 3 arguments now:
            setAuth(data.access, data.refresh);

            // router.push("/dashboard");
        } catch (error) {
            throw error;
        }
    };
    // 3. LOGOUT: Clear Zustand
    const logout = async () => {
        // 1. Retrieve token from Zustand state
        const { refreshToken } = useAuthStore.getState();

        try {
            if (refreshToken) {
                // 2. Send it to backend as required
                await logoutUser(refreshToken);
            }
        } catch (err) {
            console.error("Logout error", err);
        }

        // 3. Clear store
        performClientLogout();
        router.push("/login");
    };

    // Register wrapper
    const register = async (userData) => {
        return await registerUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {/* Wait for the refresh attempt before showing the app */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);