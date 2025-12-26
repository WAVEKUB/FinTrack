"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { TransactionTable, Transaction as UiTransaction } from "@/components/TransactionTable";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTransactions, useTransactionSummary, Transaction } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useAuthState } from "@/hooks/useAuthState";
import { ArrowRight, TrendingUp, Wallet, PieChart } from "lucide-react";

// Mock data for unauthenticated users
const mockTransactions: Transaction[] = [
  { ID: 1, date: "2024-12-20", note: "Grocery Shopping", category_id: 1, wallet_id: 1, amount: 85.50, type: "expense" },
  { ID: 2, date: "2024-12-19", note: "Salary Deposit", category_id: 2, wallet_id: 1, amount: 3500.00, type: "income" },
  { ID: 3, date: "2024-12-18", note: "Electric Bill", category_id: 3, wallet_id: 1, amount: 120.00, type: "expense" },
  { ID: 4, date: "2024-12-17", note: "Freelance Project", category_id: 2, wallet_id: 1, amount: 800.00, type: "income" },
  { ID: 5, date: "2024-12-16", note: "Restaurant Dinner", category_id: 1, wallet_id: 1, amount: 65.00, type: "expense" },
];

const mockSummary = {
  total_balance: 12450.00,
  income: 4300.00,
  expense: 1850.50,
};

const mockCategories: Record<number, string> = {
  1: "Food & Dining",
  2: "Income",
  3: "Utilities",
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthState();

  // Only fetch from API when authenticated
  const { data: rawTransactions, isLoading: isTxLoading } = useTransactions(isAuthenticated === true);
  const { data: summary, isLoading: isSummaryLoading } = useTransactionSummary(isAuthenticated === true);
  const { data: categories } = useCategories(isAuthenticated === true);

  // Create category lookup map
  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return categories.reduce((acc, cat) => {
      acc[cat.ID] = cat.name;
      return acc;
    }, {} as Record<number, string>);
  }, [categories]);

  // Use mock data when not authenticated, real data when authenticated
  const displayTransactions = isAuthenticated ? rawTransactions : mockTransactions;
  const displaySummary = isAuthenticated
    ? (summary || { total_balance: 0, income: 0, expense: 0 })
    : mockSummary;


  const transactions: UiTransaction[] = useMemo(() => {
    if (!displayTransactions) return [];
    return displayTransactions.map((t) => ({
      id: t.ID.toString(),
      date: t.date,
      description: t.note,
      category: isAuthenticated
        ? (t.category?.name || categoryMap[t.category_id] || "Unknown")
        : (mockCategories[t.category_id] || "Other"),
      amount: t.amount,
      type: t.type.toLowerCase() as "income" | "expense",
    }));
  }, [displayTransactions, isAuthenticated, categoryMap]);

  const isLoading = isAuthenticated === null || (isAuthenticated && (isTxLoading || isSummaryLoading));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleLoginClick = () => {
    router.push("/auth/signin");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with CTA for unauthenticated users */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {isAuthenticated
                ? "Overview of your financial health."
                : "See how FinTrack can help you manage your finances."}
            </p>
          </div>

          {!isAuthenticated && isAuthenticated !== null && (
            <button
              onClick={handleLoginClick}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-105"
            >
              Sign In to Track Your Finances
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Demo Banner for unauthenticated users */}
        {!isAuthenticated && isAuthenticated !== null && (
          <div className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                  <TrendingUp className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    You&apos;re viewing demo data
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Sign in to see your actual financial data and start tracking
                  </p>
                </div>
              </div>
              <button
                onClick={handleLoginClick}
                className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/20"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Total Balance", value: formatCurrency(displaySummary.total_balance), icon: Wallet },
            { label: "Monthly Income", value: formatCurrency(displaySummary.income), icon: TrendingUp },
            { label: "Monthly Expenses", value: formatCurrency(displaySummary.expense), icon: PieChart },
          ].map((stat, i) => (
            <div
              key={i}
              onClick={!isAuthenticated ? handleLoginClick : undefined}
              className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 ${!isAuthenticated ? "cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10" : ""
                }`}
            >
              <div className="flex items-center justify-between">
                <dt className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </dt>
                <stat.icon className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
              </div>
              <dd className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                {stat.value}
              </dd>
              {!isAuthenticated && (
                <p className="mt-2 text-xs text-indigo-400">Click to sign in →</p>
              )}
            </div>
          ))}
        </div>

        {/* Charts */}
        <div
          onClick={!isAuthenticated ? handleLoginClick : undefined}
          className={!isAuthenticated ? "cursor-pointer" : ""}
        >
          <DashboardCharts transactions={displayTransactions || []} isLoading={isLoading} />
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-zinc-900 dark:text-white">Recent Activity</h3>
            {!isAuthenticated && isAuthenticated !== null && (
              <button
                onClick={handleLoginClick}
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Sign in to add transactions →
              </button>
            )}
          </div>
          {isLoading ? (
            <div className="h-48 rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-center">
              <span className="text-zinc-400">Loading transactions...</span>
            </div>
          ) : (
            <div
              onClick={!isAuthenticated ? handleLoginClick : undefined}
              className={!isAuthenticated ? "cursor-pointer relative" : ""}
            >
              <TransactionTable transactions={transactions} />
              {!isAuthenticated && (
                <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
                  <span className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg pointer-events-auto">
                    Sign in to see your transactions
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
