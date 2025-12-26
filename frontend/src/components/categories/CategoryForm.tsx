"use client";

import { useState } from "react";
import { categoryService } from "@/services/categoryService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface CategoryFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function CategoryForm({ onSuccess, onCancel }: CategoryFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [icon, setIcon] = useState("🏷️");
    const [color, setColor] = useState("#3B82F6");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Name is required");
            return;
        }

        try {
            setIsLoading(true);
            await categoryService.createCategory({
                name,
                type,
                icon,
                color,
            });
            await queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category created successfully");
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to create category");
        } finally {
            setIsLoading(false);
        }
    };

    const emojis = ["🏷️", "🍔", "🚗", "🏠", "💡", "🎮", "💊", "🎓", "✈️", "🛒", "💰", "📈"];
    const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#6366F1", "#14B8A6"];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    placeholder="Category Name"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Type</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="type"
                            value="EXPENSE"
                            checked={type === "EXPENSE"}
                            onChange={() => setType("EXPENSE")}
                            className="text-blue-600"
                        />
                        <span className="dark:text-white">Expense</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="type"
                            value="INCOME"
                            checked={type === "INCOME"}
                            onChange={() => setType("INCOME")}
                            className="text-blue-600"
                        />
                        <span className="dark:text-white">Income</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Icon</label>
                <div className="flex gap-2 flex-wrap">
                    {emojis.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => setIcon(emoji)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${icon === emoji
                                    ? "bg-blue-100 ring-2 ring-blue-500 dark:bg-blue-900/40 dark:ring-blue-400"
                                    : "bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                                }`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Color</label>
                <div className="flex gap-2 flex-wrap">
                    {colors.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={`w-8 h-8 rounded-full transition-transform ${color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"
                                }`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
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
                    Create Category
                </button>
            </div>
        </form>
    );
}
