"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Bell, Moon, Shield, Sun, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { userService } from "@/services/userService";

export default function SettingsPage() {
    const router = useRouter();
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [notifications, setNotifications] = useState({
        email: true,
        budgetAlerts: true,
        goalReminders: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        avatar: "",
    });
    const [passwords, setPasswords] = useState({
        current: "",
        next: "",
        confirm: "",
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState("");

    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");

        userService.getProfile()
            .then((data) => {
                setProfile({
                    name: data.name || "",
                    email: data.email || "",
                    avatar: data.avatar || "",
                });
            })
            .catch((error) => {
                console.error(error);
                toast.error("Failed to load profile");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", newTheme);
        toast.success(`Switched to ${newTheme} mode`);
    };

    const handleProfileSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setIsSavingProfile(true);
            const updated = await userService.updateProfile(profile);
            setProfile({
                name: updated.name || "",
                email: updated.email || "",
                avatar: updated.avatar || "",
            });
            toast.success("Profile updated");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (passwords.next !== passwords.confirm) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            setIsSavingPassword(true);
            await userService.changePassword({
                current_password: passwords.current,
                new_password: passwords.next,
            });
            setPasswords({ current: "", next: "", confirm: "" });
            toast.success("Password updated");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== profile.email) {
            toast.error("Type your email to confirm account deletion");
            return;
        }
        if (!confirm("Permanently delete your account and finance data?")) return;

        try {
            setIsDeleting(true);
            await userService.deleteAccount();
            Cookies.remove("Authorization", { path: "/" });
            localStorage.removeItem("token");
            toast.success("Account deleted");
            router.push("/auth/signup");
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-gray-400";

    return (
        <DashboardLayout>
            <div className="max-w-4xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your profile, password, and local preferences.
                    </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your identity in FinTrack</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                                    className={inputClass}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                                    className={inputClass}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Avatar URL
                            </label>
                            <input
                                type="url"
                                value={profile.avatar}
                                onChange={(event) => setProfile({ ...profile, avatar: event.target.value })}
                                className={inputClass}
                                disabled={isLoading}
                                placeholder="https://example.com/avatar.png"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSavingProfile || isLoading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSavingProfile ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>

                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                            {theme === "dark" ? (
                                <Moon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Stored on this browser</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
                        </div>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === "dark" ? "bg-blue-600" : "bg-gray-200"}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                            <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Local notification preferences</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { key: "budgetAlerts", label: "Budget Alerts", desc: "Get notified when approaching budget limits" },
                            { key: "goalReminders", label: "Goal Reminders", desc: "Receive reminders about savings goals" },
                            { key: "email", label: "Email Notifications", desc: "Receive finance updates via email" },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setNotifications((prev) => ({
                                        ...prev,
                                        [item.key]: !prev[item.key as keyof typeof prev],
                                    }))}
                                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? "bg-blue-600" : "bg-gray-200"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Change your password</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={passwords.current}
                                onChange={(event) => setPasswords({ ...passwords, current: event.target.value })}
                                className={inputClass}
                                required
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwords.next}
                                    onChange={(event) => setPasswords({ ...passwords, next: event.target.value })}
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })}
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSavingPassword}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSavingPassword ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>

                <div className="rounded-xl border border-red-200 bg-white p-6 dark:border-red-900 dark:bg-zinc-950">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Account</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Permanently remove your profile and private finance data.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Type your email to confirm
                            </label>
                            <input
                                value={deleteConfirmation}
                                onChange={(event) => setDeleteConfirmation(event.target.value)}
                                className={inputClass}
                                placeholder={profile.email}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            <Trash2 className="h-4 w-4" />
                            {isDeleting ? "Deleting..." : "Delete Account"}
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
