import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/walletService";

export interface Wallet {
    ID: number;
    name: string;
    type: string;
    balance: number;
}

export const useWallets = () => {
    return useQuery({
        queryKey: ["wallets"],
        queryFn: walletService.getWallets,
    });
};
