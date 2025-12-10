"use client";

import { DashboardLayout } from "@/components/DashboardLayout";

export default function Home() {
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
            { label: "Total Balance", value: "$12,345.00" },
            { label: "Monthly Income", value: "$4,500.00" },
            { label: "Monthly Expenses", value: "$2,100.00" },
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

        {/* Recent Activity Placeholder */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white">
              Recent Activity
            </h3>
            <div className="mt-4 h-48 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
              Chart / List Placeholder
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
