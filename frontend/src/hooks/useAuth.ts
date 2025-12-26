import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

export interface LoginCredentials {
    Email: string;
    Password: string;
}

export interface RegisterCredentials {
    Name: string;
    Email: string;
    Password: string;
}

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const { data } = await api.post("/auth/signin", credentials);
            return data;
        },
        onSuccess: (data) => {
            if (data.token) {
                Cookies.set("Authorization", data.token, { expires: 1, path: "/" });
                // Also set localStorage for compatibility if needed, though cookie is primary now
                localStorage.setItem("token", data.token);
            }
            // Invalidate all queries to force refetch with new auth token
            queryClient.invalidateQueries();
            toast.success("Logged in successfully");
            router.push("/");
            router.refresh(); // Refresh to update server components
        },
    });
};

export const useRegister = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: RegisterCredentials) => {
            const { data } = await api.post("/auth/signup", credentials);
            return data;
        },
        onSuccess: () => {
            toast.success("Account created! Please sign in.");
            router.push("/auth/signin");
        },
    });
};

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            // Optional: Call backend logout endpoint if it exists
            return true;
        },
        onSuccess: () => {
            Cookies.remove("Authorization", { path: "/" });
            localStorage.removeItem("token");
            queryClient.clear(); // Clear all React Query cache
            toast.success("Logged out successfully");
            router.push("/auth/signin");
            router.refresh();
        },
    });
};
