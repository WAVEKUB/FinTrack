"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

/**
 * Hook to check if the user is authenticated.
 * Checks both cookie and localStorage for the token.
 */
export const useAuthState = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            // Check both cookie and localStorage (login saves to both)
            const cookieToken = Cookies.get("Authorization");
            const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const hasToken = !!(cookieToken || localToken);
            setIsAuthenticated(hasToken);
        };

        // Initial check
        checkAuth();

        // Listen for storage changes (login/logout in other tabs)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "token") {
                checkAuth();
            }
        };

        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    return { isAuthenticated };
};
