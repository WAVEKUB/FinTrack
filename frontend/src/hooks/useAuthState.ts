"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

/**
 * Hook to check if the user is authenticated.
 * Checks both cookie and localStorage for the token.
 * Re-checks auth state when window regains focus or storage changes.
 */
export const useAuthState = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const checkAuth = useCallback(() => {
        // Check both cookie and localStorage (login saves to both)
        const cookieToken = Cookies.get("Authorization");
        const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const hasToken = !!(cookieToken || localToken);
        setIsAuthenticated(hasToken);
    }, []);

    useEffect(() => {
        // Initial check
        checkAuth();

        // Listen for storage changes (login/logout in other tabs)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "token" || e.key === null) {
                checkAuth();
            }
        };

        // Re-check when window gains focus (user might have logged in another tab)
        const handleFocus = () => {
            checkAuth();
        };

        // Re-check when visibility changes (tab becomes visible)
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                checkAuth();
            }
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [checkAuth]);

    return { isAuthenticated, checkAuth };
};
