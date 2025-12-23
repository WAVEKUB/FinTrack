"use client";

import { Goal } from "@/services/goalService";
import { Edit2, Trash2, Target } from "lucide-react";

interface GoalListProps {
    goals: Goal[];
    onEdit: (goal: Goal) => void;
    onDelete: (id: number) => void;
}

export function GoalList({ goals, onEdit, onDelete }: GoalListProps) {
    if (goals.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No goals found. Set a new savings goal!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
                const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100);

                return (
                    <div
                        key={goal.ID}
                        className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {goal.name}
                                    </h3>
                                    {goal.deadline && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            By {new Date(goal.deadline).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(goal)}
                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(goal.ID)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                    ${goal.current_amount.toLocaleString()} of ${goal.target_amount.toLocaleString()}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {Math.round(percent)}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
