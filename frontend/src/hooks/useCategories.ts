import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Category {
    ID: number; // gorm.Model ID is usually ID unless overridden. Let's assume ID.
    name: string;
    type: "INCOME" | "EXPENSE";
    icon?: string;
    color?: string;
}

export const useCategories = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await api.get<{ data: Category[] }>("/categories");
            return data.data;
        },
        enabled,
    });
};
