import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
// Import icon yang dibutuhkan dari lucide-react
import {
    LayoutDashboard,
    Gift,
    Users,
    Trophy,
    LogOut,
    Menu,
} from "lucide-react";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const { url } = usePage();

    // Menggunakan komponen icon Lucide langsung di dalam array
    const menuItems = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            active: url.startsWith("/dashboard"),
            icon: <LayoutDashboard size={20} />,
        },
        // Ubah bagian ini
        {
            name: "Manajemen Hadiah",
            href: route("prizes.index"),
            active: url.startsWith("/prizes"),
            icon: <Gift size={20} />,
        },
        {
            name: "Data Partisipan",
            href: route("participants.index"),
            active: url.startsWith("/participants"),
            icon: <Users size={20} />,
        },
        {
            name: "Log Pemenang",
            href: route("winlog.index"),
            active: url.startsWith("/winlog"),
            icon: <Trophy size={20} />,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* SIDEBAR */}
            <aside
                className={`bg-gray-900 text-white w-64 flex-shrink-0 fixed inset-y-0 left-0 transform transition-transform duration-300 z-50 ${showingNavigationDropdown ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-widest text-indigo-400">
                        ADMIN PANEL
                    </h1>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                item.active
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Tombol Logout */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <span className="mr-3">
                            <LogOut size={20} />
                        </span>
                        <span className="font-medium">Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Overlay Mobile */}
            {showingNavigationDropdown && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={() => setShowingNavigationDropdown(false)}
                ></div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* TOPBAR */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 relative">
                    <button
                        onClick={() =>
                            setShowingNavigationDropdown(
                                !showingNavigationDropdown,
                            )
                        }
                        className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="font-semibold text-xl text-gray-800 ml-2 md:ml-0 flex-1">
                        {header}
                    </div>

                    <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 mr-2 border-r pr-4 border-gray-300">
                            Halo, {user.name}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
