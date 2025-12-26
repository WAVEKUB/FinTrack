"use client";

import { Budget } from "@/services/budgetService";
import { Edit2, Trash2 } from "lucide-react";

interface BudgetListProps {
    budgets: Budget[];
    onEdit: (budget: Budget) => void;
    onDelete: (id: number) => void;
}

export function BudgetList({ budgets, onEdit, onDelete }: BudgetListProps) {
    if (budgets.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No budgets found. Create one to get started!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
                <div
                    key={budget.ID}
                    className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                                style={{
                                    backgroundColor: budget.category?.color + "20",
                                    color: budget.category?.color,
                                }}
                            >
                                {budget.category?.icon || "💰"}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {budget.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {budget.period}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(budget)}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(budget.ID)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500 dark:text-gray-400">Limit</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    ${budget.amount.toLocaleString()}
                                </span>
                            </div>
                            {/* 
                                Since we don't have 'current spent', we just show the limit. 
                                In a real app we would want a progress bar here. 
                                For now, just a full bar to indicate 'Active' 
                            */}
                            <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between text-xs text-gray-400">
                            <span>{new Date(budget.start_date).toLocaleDateString()}</span>
                            <span>{new Date(budget.end_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
