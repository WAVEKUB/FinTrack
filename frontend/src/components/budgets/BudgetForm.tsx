"use client";

import { useState } from "react";
import { Budget, BudgetInput } from "@/services/budgetService";
import { useCategories } from "@/hooks/useCategories";
import { useWallets } from "@/hooks/useWallets";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { Plus } from "lucide-react";

interface BudgetFormProps {
    initialData?: Budget;
    onSubmit: (data: BudgetInput) => Promise<void>;
    onCancel: () => void;
}

export function BudgetForm({ initialData, onSubmit, onCancel }: BudgetFormProps) {
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
    const { data: wallets = [], isLoading: isLoadingWallets } = useWallets();
    const [isLoading, setIsLoading] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Form state
    const [name, setName] = useState(initialData?.name || "");
    const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
    const [period, setPeriod] = useState(initialData?.period || "MONTHLY");
    const [startDate, setStartDate] = useState(
        initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(
        initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] :
            new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    );
    const [categoryId, setCategoryId] = useState<number | "">(initialData?.category_id || "");
    const [walletId, setWalletId] = useState<number | "">(initialData?.wallet_id || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !amount || !startDate || !endDate || !categoryId) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsLoading(true);
            await onSubmit({
                name,
                amount: parseFloat(amount),
                period,
                start_date: new Date(startDate).toISOString(),
                end_date: new Date(endDate).toISOString(),
                category_id: Number(categoryId),
                wallet_id: walletId ? Number(walletId) : null,
            });
            toast.success(initialData ? "Budget updated successfully" : "Budget created successfully");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Budget Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    placeholder="e.g. Groceries"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Period</label>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    >
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="ONE_TIME">One Time</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Category</label>
                <div className="flex gap-2">
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        required
                        disabled={isLoadingCategories}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.ID} value={cat.ID}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                        title="Add New Category"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Wallet Scope</label>
                <select
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value ? Number(e.target.value) : "")}
                    className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    disabled={isLoadingWallets}
                >
                    <option value="">All Wallets</option>
                    {wallets.map((wallet) => (
                        <option key={wallet.ID} value={wallet.ID}>
                            {wallet.name} ({wallet.type})
                        </option>
                    ))}
                </select>
            </div>

            <Modal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                title="Create New Category"
            >
                <CategoryForm
                    onSuccess={() => setIsCategoryModalOpen(false)}
                    onCancel={() => setIsCategoryModalOpen(false)}
                />
            </Modal>

            <div className="flex justify-end gap-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {initialData ? "Update Budget" : "Create Budget"}
                </button>
            </div>
        </form>
    );
}
