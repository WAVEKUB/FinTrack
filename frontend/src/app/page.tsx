"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { TransactionTable, Transaction as UiTransaction } from "@/components/TransactionTable";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTransactions, useTransactionSummary } from "@/hooks/useTransactions";
import { isAxiosError } from "axios";

interface DashboardSummary {
  total_balance: number;
  income: number;
  expense: number;
}

export default function Home() {
  const router = useRouter();
  const { data: rawTransactions, error: txError, isLoading: isTxLoading } = useTransactions();
  const { data: summary = { total_balance: 0, income: 0, expense: 0 }, isLoading: isSummaryLoading } = useTransactionSummary();

  useEffect(() => {
    if (isAxiosError(txError) && txError.response?.status === 401) {
      router.push("/auth/signin");
    }
  }, [txError, router]);

  const transactions: UiTransaction[] = useMemo(() => {
    if (!rawTransactions) return [];
    return rawTransactions.map((t) => ({
      id: t.ID.toString(),
      date: t.date,
      description: t.note,
      category: "Category " + t.category_id,
      amount: t.amount,
      type: t.type.toLowerCase() as "income" | "expense",
    }));
  }, [rawTransactions]);

  const isLoading = isTxLoading || isSummaryLoading;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Overview of your financial health.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Total Balance", value: formatCurrency(summary.total_balance) },
            { label: "Monthly Income", value: formatCurrency(summary.income) },
            { label: "Monthly Expenses", value: formatCurrency(summary.expense) },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <dt className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </dt>
              <dd className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-6 text-zinc-900 dark:text-white">Recent Activity</h3>
          {isLoading ? (
            <div className="h-48 rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-center">
              <span className="text-zinc-400">Loading transactions...</span>
            </div>
          ) : (
            <TransactionTable transactions={transactions} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
