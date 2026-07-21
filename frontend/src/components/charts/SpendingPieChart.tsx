import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useMemo } from "react";
import { Transaction } from "@/hooks/useTransactions";
import { Category } from "@/hooks/useCategories";

interface SpendingPieChartProps {
    transactions: Transaction[];
    categories: Category[];
    onSelectCategory?: (categoryId: number) => void;
}

type SpendingDatum = {
    name: string;
    value: number;
    id: number;
};

const COLORS = [
    "#2563eb", // blue-600
    "#dc2626", // red-600
    "#d97706", // amber-600
    "#16a34a", // green-600
    "#9333ea", // purple-600
    "#db2777", // pink-600
    "#0891b2", // cyan-600
    "#4f46e5", // indigo-600
];

export function SpendingPieChart({ transactions, categories, onSelectCategory }: SpendingPieChartProps) {
    const data = useMemo(() => {
        const categoryMap = new Map(categories.map((c) => [String(c.ID), c.name]));

        // Filter expenses only
        const expenses = transactions.filter((t) => t.type.toLowerCase() === "expense");

        const grouped = expenses.reduce((acc, t) => {
            // Use preloaded category name from transaction, fallback to lookup
            const categoryName = t.category?.name || categoryMap.get(String(t.category_id)) || "Unknown";
            if (!acc[categoryName]) {
                acc[categoryName] = { value: 0, id: t.category?.ID || t.category_id };
            }
            acc[categoryName].value += Math.abs(t.amount);
            return acc;
        }, {} as Record<string, { value: number; id: number }>);

        return Object.entries(grouped)
            .map(([name, data]) => ({ name, value: data.value, id: data.id }))
            .sort((a, b) => b.value - a.value);
    }, [transactions, categories]);

    const handlePieClick = (data: SpendingDatum) => {
        if (onSelectCategory && data && data.id) {
            onSelectCategory(data.id);
        }
    };

    if (transactions.filter(t => t.type.toLowerCase() === "expense").length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                No expense data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    onClick={handlePieClick}
                    className="cursor-pointer"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ fontSize: "12px" }}
                    formatter={(value: number | string) => `$${Number(value).toFixed(2)}`}
                />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: "12px" }}
                />
            </RechartsPieChart>
        </ResponsiveContainer>
    );
}
