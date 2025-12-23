import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Transaction {
    ID: number;
    amount: number;
    date: string;
    note: string;
    category_id: number;
    wallet_id: number;
    type: string;
}

export interface CreateTransactionDTO {
    amount: number;
    date: string;
    note: string;
    category_id: number;
    wallet_id: number;
    type: "income" | "expense";
}

export interface TransactionSummary {
    total_balance: number;
    income: number;
    expense: number;
}

export const useTransactions = () => {
    return useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const { data } = await api.get<{ data: Transaction[] }>("/transactions");
            return data.data;
        },
    });
};

export const useTransactionSummary = () => {
    return useQuery({
        queryKey: ["transaction-summary"],
        queryFn: async () => {
            const { data } = await api.get<TransactionSummary>("/transactions/summary");
            return data;
        },
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTransaction: CreateTransactionDTO) => {
            const { data } = await api.post("/transactions/create", newTransaction);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["transaction-summary"] });
            queryClient.invalidateQueries({ queryKey: ["wallets"] });
        },
    });
};
export const useTransactionsByCategory = (categoryId: string | number | null) => {
    return useQuery({
        queryKey: ["transactions", "category", categoryId],
        queryFn: async () => {
            if (!categoryId) return [];
            const { data } = await api.get<{ data: Transaction[] }>(`/transactions/category/${categoryId}`);
            return data.data;
        },
        enabled: !!categoryId,
    });
};
