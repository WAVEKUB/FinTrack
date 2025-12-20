"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    CreditCard,
    Wallet,
    Target,
    Settings,
    LogOut,
} from "lucide-react";
import { useLogout } from "@/hooks/useAuth";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Transactions",
        href: "/transactions",
        icon: CreditCard,
    },
    {
        title: "Budget",
        href: "/budget",
        icon: Wallet,
    },
    {
        title: "Goals",
        href: "/goals",
        icon: Target,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { mutate: logout } = useLogout();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white transition-transform sm:translate-x-0 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex h-full flex-col px-3 py-4">
                {/* Logo / Brand */}
                <div className="mb-6 flex items-center pl-2.5">
                    <span className="self-center whitespace-nowrap text-xl font-semibold text-zinc-900 dark:text-white">
                        FinTrack
                    </span>
                </div>

                {/* Navigation */}
                <ul className="space-y-2 font-medium">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`group flex items-center rounded-lg p-2 text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800 ${isActive ? "bg-zinc-100 dark:bg-zinc-800" : ""
                                        }`}
                                >
                                    <item.icon
                                        className={`h-5 w-5 flex-shrink-0 text-zinc-500 transition duration-75 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white ${isActive ? "text-zinc-900 dark:text-white" : ""
                                            }`}
                                    />
                                    <span className="ml-3">{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Footer / Logout */}
                <div className="mt-auto">
                    <button
                        type="button"
                        onClick={() => logout()}
                        className="group flex w-full items-center rounded-lg p-2 text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0 text-zinc-500 transition duration-75 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white" />
                        <span className="ml-3 whitespace-nowrap">Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
