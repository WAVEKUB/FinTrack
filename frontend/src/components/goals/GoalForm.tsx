"use client";

import { useState } from "react";
import { Goal, GoalInput } from "@/services/goalService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface GoalFormProps {
    initialData?: Goal;
    onSubmit: (data: GoalInput) => Promise<void>;
    onCancel: () => void;
}

export function GoalForm({ initialData, onSubmit, onCancel }: GoalFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [name, setName] = useState(initialData?.name || "");
    const [targetAmount, setTargetAmount] = useState(initialData?.target_amount?.toString() || "");
    const [currentAmount, setCurrentAmount] = useState(initialData?.current_amount?.toString() || "0");
    const [deadline, setDeadline] = useState(
        initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : ""
    );
    const [notes, setNotes] = useState(initialData?.notes || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !targetAmount) {
            toast.error("Please fill in required fields (Name, Target Amount)");
            return;
        }

        try {
            setIsLoading(true);
            await onSubmit({
                name,
                target_amount: parseFloat(targetAmount),
                current_amount: parseFloat(currentAmount) || 0,
                deadline: deadline ? new Date(deadline).toISOString() : undefined,
                notes,
            });
            toast.success(initialData ? "Goal updated successfully" : "Goal created successfully");
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
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Goal Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    placeholder="e.g. New Laptop"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Target Amount</label>
                    <input
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Current Amount</label>
                    <input
                        type="number"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Target Date (Optional)</label>
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Notes (Optional)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    placeholder="Add details about your goal..."
                    rows={3}
                />
            </div>

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
                    {initialData ? "Update Goal" : "Create Goal"}
                </button>
            </div>
        </form>
    );
}
