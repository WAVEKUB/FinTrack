import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Category {
    ID: number;
    name: string;
    type: "income" | "expense";
}

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await api.get<{ data: Category[] }>("/categories/");
            return data.data;
        },
    });
};
