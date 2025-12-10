"use client";

import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 sm:hidden dark:border-zinc-800 dark:bg-zinc-950">
                <span className="text-xl font-semibold text-zinc-900 dark:text-white">
                    FinTrack
                </span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:focus:ring-zinc-700"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <Sidebar />

            {/* Main Content */}
            <div className="p-4 sm:ml-64">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 sm:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
