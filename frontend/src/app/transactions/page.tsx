"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Transaction, TransactionTable } from "@/components/TransactionTable";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { useDeleteTransaction } from "@/hooks/useTransactions";

interface TransactionAPI {
    ID: number;
    date: string;
    note: string;
    category_id: number;
    wallet_id: number;
    amount: number;
    type: string;
    category?: {
        ID: number;
        name: string;
        type: string;
    };
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<TransactionAPI | undefined>(undefined);
    const router = useRouter();
    const deleteTransaction = useDeleteTransaction();

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            const txResponse = await fetch("/api/v1/transactions");
            if (txResponse.status === 401) {
                router.push("/auth/signin");
                return;
            }
            if (!txResponse.ok) {
                throw new Error(`Error: ${txResponse.status}`);
            }
            const txData = await txResponse.json();
            const transactionData = txData.data || [];

            const mappedTransactions: Transaction[] = transactionData.map((t: TransactionAPI) => ({
                id: t.ID.toString(),
                date: t.date,
                description: t.note,
                category: t.category?.name || "Unknown",
                amount: t.amount,
                type: t.type.toLowerCase() as "income" | "expense",
                walletId: t.wallet_id,
                categoryId: t.category_id,
            }));

            setTransactions(mappedTransactions);
            setFilteredTransactions(mappedTransactions);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
        let filtered = transactions;

        if (searchQuery) {
            filtered = filtered.filter((t) =>
                t.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (typeFilter !== "all") {
            filtered = filtered.filter((t) => t.type === typeFilter);
        }

        setFilteredTransactions(filtered);
    }, [searchQuery, typeFilter, transactions]);

    const openEditModal = (transaction: Transaction) => {
        setEditingTransaction({
            ID: Number(transaction.id),
            date: transaction.date,
            note: transaction.description,
            category_id: transaction.categoryId || 0,
            wallet_id: transaction.walletId || 0,
            amount: transaction.amount,
            type: transaction.type,
        });
        setIsAddModalOpen(true);
    };

    const handleDelete = async (transaction: Transaction) => {
        if (!confirm(`Delete "${transaction.description}"?`)) return;
        try {
            await deleteTransaction.mutateAsync(Number(transaction.id));
            fetchTransactions();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Transactions
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            View and manage your financial activity.
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                setEditingTransaction(undefined);
                                setIsAddModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Transaction
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-500 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-400"
                        />
                    </div>
                    <div>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as "all" | "income" | "expense")}
                            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="h-48 rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-center">
                        <span className="text-zinc-400">Loading transactions...</span>
                    </div>
                ) : (
                    <TransactionTable
                        transactions={filteredTransactions}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                )}

                <Modal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setEditingTransaction(undefined);
                    }}
                    title={editingTransaction ? "Edit Transaction" : "Add New Transaction"}
                >
                    <AddTransactionForm
                        initialData={editingTransaction ? {
                            ID: editingTransaction.ID,
                            amount: editingTransaction.amount,
                            date: editingTransaction.date,
                            note: editingTransaction.note,
                            category_id: editingTransaction.category_id,
                            wallet_id: editingTransaction.wallet_id,
                            type: editingTransaction.type,
                        } : undefined}
                        onSuccess={() => {
                            setIsAddModalOpen(false);
                            setEditingTransaction(undefined);
                            fetchTransactions();
                        }}
                        onCancel={() => {
                            setIsAddModalOpen(false);
                            setEditingTransaction(undefined);
                        }}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
}
