import { IncomeExpenseChart } from "./charts/IncomeExpenseChart";
import { SpendingPieChart } from "./charts/SpendingPieChart";
import { useCategories } from "@/hooks/useCategories";
import { Transaction } from "@/hooks/useTransactions";

interface DashboardChartsProps {
    transactions: Transaction[];
    isLoading: boolean;
}

const DEFAULT_CATEGORIES = [
    { ID: 1, name: "Groceries", type: "expense" as const },
    { ID: 2, name: "Transport", type: "expense" as const },
    { ID: 3, name: "Entertainment", type: "expense" as const },
    { ID: 4, name: "Utilities", type: "expense" as const },
    { ID: 5, name: "Salary", type: "income" as const },
];

export function DashboardCharts({ transactions, isLoading }: DashboardChartsProps) {
    const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

    const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

    // Only block on transaction loading or if we have no categories AND validly loading
    if (isLoading || (isCategoriesLoading && categories.length === 0)) {
        // If api is broken/redirecting, isCategoriesLoading might eventually stop with error.
        // We rely on useCategories eventually returning or erroring.
        // For now, standard behavior.
        return (
            <div className="grid gap-4 md:grid-cols-2">
                <div className="h-[300px] animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-zinc-800 dark:bg-zinc-900" />
                <div className="h-[300px] animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-zinc-800 dark:bg-zinc-900" />
            </div>
        );
    }

    const handleCategoryClick = (categoryId: number) => {
        // TODO: Navigate to filtered view or show details using useTransactionsByCategory
        console.log("Selected category:", categoryId);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Income vs Expense Chart */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="mb-4 text-lg font-medium text-zinc-900 dark:text-white">
                    Income vs Expense
                </h3>
                <div className="h-[300px] w-full">
                    <IncomeExpenseChart transactions={transactions} />
                </div>
            </div>

            {/* Spending by Category Chart */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="mb-4 text-lg font-medium text-zinc-900 dark:text-white">
                    Spending by Category
                </h3>
                <div className="h-[300px] w-full">
                    <SpendingPieChart
                        transactions={transactions}
                        categories={displayCategories}
                        onSelectCategory={handleCategoryClick}
                    />
                </div>
            </div>
        </div>
    );
}
