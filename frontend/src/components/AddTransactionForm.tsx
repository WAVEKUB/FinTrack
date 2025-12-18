"use client";

import { useState, useEffect } from "react";
import { ArrowDownIcon, ArrowUpIcon, Loader2 } from "lucide-react";

interface AddTransactionFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

interface Wallet {
    ID: number;
    name: string;
    type: string;
    balance: number;
}

// Temporary hardcoded categories until API is available
const CATEGORIES = [
    { id: 1, name: "Groceries" },
    { id: 2, name: "Transport" },
    { id: 3, name: "Entertainment" },
    { id: 4, name: "Utilities" },
    { id: 5, name: "Salary" },
];

export function AddTransactionForm({ onSuccess, onCancel }: AddTransactionFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [formData, setFormData] = useState({
        type: "expense" as "income" | "expense",
        amount: "",
        category_id: "1",
        date: new Date().toISOString().split('T')[0],
        note: "",
        wallet_id: "",
    });

    useEffect(() => {
        async function fetchWallets() {
            try {
                const response = await fetch("/api/v1/wallets");
                if (response.ok) {
                    const data = await response.json();
                    const fetchedWallets = data.data || [];
                    setWallets(fetchedWallets);
                    if (fetchedWallets.length > 0) {
                        setFormData(prev => ({ ...prev, wallet_id: fetchedWallets[0].ID.toString() }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch wallets:", error);
            }
        }
        fetchWallets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                type: formData.type,
                wallet_id: parseInt(formData.wallet_id),
                note: formData.note,
                category_id: parseInt(formData.category_id),
                // Ensure date is in ISO format if needed, but backend likely accepts YYYY-MM-DD
                // Adjusting to Send proper timestamp if backend expects RFC3339
                date: new Date(formData.date).toISOString(),
            };

            const response = await fetch("/api/v1/transactions/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to create transaction");
            }

            onSuccess();
        } catch (err) {
            console.error(err);
            setError("Failed to create transaction. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "expense" })}
                    className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${formData.type === "expense"
                        ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
                        }`}
                >
                    <ArrowDownIcon className="h-4 w-4" />
                    Expense
                </button>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "income" })}
                    className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${formData.type === "income"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
                        }`}
                >
                    <ArrowUpIcon className="h-4 w-4" />
                    Income
                </button>
            </div>

            {/* Wallet Selection */}
            <div>
                <label htmlFor="wallet" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Wallet
                </label>
                <select
                    id="wallet"
                    required
                    value={formData.wallet_id}
                    onChange={(e) => setFormData({ ...formData, wallet_id: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                >
                    {wallets.length === 0 && <option value="">Loading wallets...</option>}
                    {wallets.map((wallet) => (
                        <option key={wallet.ID} value={wallet.ID}>
                            {wallet.name} ({wallet.type})
                        </option>
                    ))}
                </select>
            </div>

            {/* Amount */}
            <div>
                <label htmlFor="amount" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Amount
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input
                        type="number"
                        id="amount"
                        required
                        min="0.01"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-7 pr-4 text-sm text-zinc-900 placeholder-zinc-500 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                        placeholder="0.00"
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Category
                </label>
                <select
                    id="category"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date */}
            <div>
                <label htmlFor="date" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
            </div>

            {/* Note */}
            <div>
                <label htmlFor="note" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Note
                </label>
                <textarea
                    id="note"
                    rows={3}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                    placeholder="What is this for?"
                />
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Transaction"
                    )}
                </button>
            </div>
        </form>
    );
}
