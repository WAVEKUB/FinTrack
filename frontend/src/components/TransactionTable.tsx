"use client";

import { ArrowDownIcon, ArrowUpIcon, MoreHorizontal } from "lucide-react";

export interface Transaction {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    type: "income" | "expense";
}

interface TransactionTableProps {
    transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-500 dark:text-zinc-400">
                    <thead className="bg-zinc-50 text-xs uppercase text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                                >
                                    <td className="whitespace-nowrap px-6 py-4 text-zinc-900 dark:text-zinc-100">
                                        {new Date(transaction.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${transaction.type === 'income'
                                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                                                }`}>
                                                {transaction.type === 'income' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                                            </div>
                                            {transaction.description}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                                            {transaction.category}
                                        </span>
                                    </td>
                                    <td className={`whitespace-nowrap px-6 py-4 font-semibold ${transaction.type === 'income'
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-zinc-900 dark:text-zinc-100'
                                        }`}>
                                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                                    </td>
                                    <td className="relative whitespace-nowrap px-6 py-4 text-right">
                                        <button className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
