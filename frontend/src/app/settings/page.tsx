"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { User, Moon, Sun, Bell, Shield, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        budgetAlerts: true,
        goalReminders: true,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check current theme from document
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
        toast.success(`Switched to ${newTheme} mode`);
    };

    const handleExportData = async () => {
        setIsLoading(true);
        try {
            // Placeholder for export functionality
            toast.success("Data export started. You'll receive a download link shortly.");
        } catch {
            toast.error("Failed to export data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Settings
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your account preferences and application settings
                    </p>
                </div>

                {/* Profile Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Profile
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Your personal information
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-gray-400"
                                />
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            {theme === "dark" ? (
                                <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            ) : (
                                <Sun className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Appearance
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Customize how the app looks
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Dark Mode
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Toggle between light and dark theme
                            </p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === "dark" ? "bg-blue-600" : "bg-gray-200"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Notifications
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Choose what you want to be notified about
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { key: "budgetAlerts", label: "Budget Alerts", desc: "Get notified when approaching budget limits" },
                            { key: "goalReminders", label: "Goal Reminders", desc: "Receive reminders about your savings goals" },
                            { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {item.label}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.desc}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setNotifications(prev => ({
                                        ...prev,
                                        [item.key]: !prev[item.key as keyof typeof prev]
                                    }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? "bg-blue-600" : "bg-gray-200"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Security
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage your account security
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Update Password
                        </button>
                    </div>
                </div>

                {/* Data Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Data Management
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Export or delete your data
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleExportData}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-gray-300"
                        >
                            <Download className="w-4 h-4" />
                            Export Data
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400">
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
