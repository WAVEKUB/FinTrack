"use client";

import { useEffect, useState } from "react";
import { Edit2, Plus, Trash2, Wallet as WalletIcon } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { Wallet, WalletInput, walletService } from "@/services/walletService";

const walletTypes = ["CASH", "BANK", "CREDIT"];

function WalletForm({
    initialData,
    onSubmit,
    onCancel,
}: {
    initialData?: Wallet;
    onSubmit: (data: WalletInput) => Promise<void>;
    onCancel: () => void;
}) {
    const [name, setName] = useState(initialData?.name || "");
    const [type, setType] = useState(initialData?.type || "BANK");
    const [balance, setBalance] = useState(initialData?.balance?.toString() || "0");
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!name.trim()) {
            toast.error("Wallet name is required");
            return;
        }

        try {
            setIsSaving(true);
            await onSubmit({
                name: name.trim(),
                type,
                balance: Number(balance) || 0,
            });
            toast.success(initialData ? "Wallet updated" : "Wallet created");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save wallet");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Wallet Name
                </label>
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                    placeholder="Main Bank"
                    required
                />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Type
                    </label>
                    <select
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                    >
                        {walletTypes.map((walletType) => (
                            <option key={walletType} value={walletType}>
                                {walletType}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Balance
                    </label>
                    <input
                        type="number"
                        value={balance}
                        onChange={(event) => setBalance(event.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                        step="0.01"
                    />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Wallet"}
                </button>
            </div>
        </form>
    );
}

export default function WalletsPage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<Wallet | undefined>(undefined);

    const fetchWallets = async () => {
        try {
            setIsLoading(true);
            setWallets(await walletService.getWallets());
        } catch (error) {
            console.error(error);
            toast.error("Failed to load wallets");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const openCreate = () => {
        setEditingWallet(undefined);
        setIsModalOpen(true);
    };

    const openEdit = (wallet: Wallet) => {
        setEditingWallet(wallet);
        setIsModalOpen(true);
    };

    const handleSubmit = async (input: WalletInput) => {
        if (editingWallet) {
            await walletService.updateWallet(editingWallet.ID, input);
        } else {
            await walletService.createWallet(input);
        }
        setIsModalOpen(false);
        setEditingWallet(undefined);
        fetchWallets();
    };

    const handleDelete = async (wallet: Wallet) => {
        if (!confirm(`Delete ${wallet.name}?`)) return;
        try {
            await walletService.deleteWallet(wallet.ID);
            toast.success("Wallet deleted");
            fetchWallets();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete wallet");
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallets</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Manage balances across cash, bank, and credit wallets.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        <Plus className="h-5 w-5" />
                        Add Wallet
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
                    </div>
                ) : wallets.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-400">
                        No wallets found. Create one to start tracking transactions.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {wallets.map((wallet) => (
                            <div
                                key={wallet.ID}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            <WalletIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {wallet.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {wallet.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => openEdit(wallet)}
                                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(wallet)}
                                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-6 text-3xl font-semibold text-gray-900 dark:text-white">
                                    ${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingWallet ? "Edit Wallet" : "Create Wallet"}
                >
                    <WalletForm
                        initialData={editingWallet}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
}
