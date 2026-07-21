import api from "@/lib/axios";

export interface Wallet {
    ID: number;
    name: string;
    type: string;
    balance: number;
    user_id?: number;
}

export interface WalletInput {
    name: string;
    type: string;
    balance: number;
}

export const walletService = {
    getWallets: async (): Promise<Wallet[]> => {
        const response = await api.get("/wallets");
        return response.data.data || [];
    },

    createWallet: async (wallet: WalletInput): Promise<Wallet> => {
        const response = await api.post("/wallets", wallet);
        return response.data.data;
    },

    updateWallet: async (id: number, wallet: WalletInput): Promise<Wallet> => {
        const response = await api.put(`/wallets/${id}`, wallet);
        return response.data.data;
    },

    deleteWallet: async (id: number): Promise<void> => {
        await api.delete(`/wallets/${id}`);
    },
};
