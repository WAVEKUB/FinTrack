import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Wallet {
    ID: number;
    name: string;
    type: string;
    balance: number;
}

export const useWallets = () => {
    return useQuery({
        queryKey: ["wallets"],
        queryFn: async () => {
            const { data } = await api.get<{ data: Wallet[] }>("/wallets");
            return data.data;
        },
    });
};
