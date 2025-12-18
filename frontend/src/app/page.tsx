"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { TransactionTable, Transaction } from "@/components/TransactionTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardSummary {
  total_balance: number;
  income: number;
  expense: number;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({ total_balance: 0, income: 0, expense: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    async function fetchData() {
      try {
        // Fetch Transactions
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

        const mappedTransactions: Transaction[] = transactionData.map((t: any) => ({
          id: t.ID.toString(),
          date: t.date,
          description: t.note,
          category: "Category " + t.category_id,
          amount: t.amount,
          type: t.type.toLowerCase(),
        }));

        setTransactions(mappedTransactions);

        // Fetch Summary
        const summaryResponse = await fetch("/api/v1/transactions/summary");
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          setSummary(summaryData);
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

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
