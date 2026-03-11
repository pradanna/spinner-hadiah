import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link, usePage } from "@inertiajs/react";
import { MessageSquare, Search, CheckCircle, XCircle, Send, Loader2 } from "lucide-react";
import Pagination from "@/Components/Pagination";
import { useState, useEffect } from "react";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function WinLog({ auth, winLogs: initialWinLogs, filters, flash }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [sendingId, setSendingId] = useState(null); // ID of the log being sent
    const [showFlash, setShowFlash] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        if (flash?.success) {
            setShowFlash({ show: true, message: flash.success, type: 'success' });
        } else if (flash?.error) {
            setShowFlash({ show: true, message: flash.error, type: 'error' });
        }

        if(flash?.success || flash?.error) {
            const timer = setTimeout(() => {
                setShowFlash({ show: false, message: '', type: '' });
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [flash]);


    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('winlog.index'), { search: searchTerm, status: filters.status }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSendMessage = (log) => {
        if (log.is_sent) {
            alert("Pesan untuk pemenang ini sudah dikirim.");
            return;
        }

        if (!confirm(`Kirim pesan WhatsApp ke ${log.participant.name} (${log.participant.whatsapp_number})?`)) {
            return;
        }

        router.post(route('winlog.sendWhatsapp', log.id), {}, {
            preserveScroll: true,
            onStart: () => setSendingId(log.id),
            onFinish: () => setSendingId(null),
        });
    };

    const StatusFilterLink = ({ status, label }) => {
        const isActive = (filters.status || '') === status;
        return (
            <Link
                href={route('winlog.index', { search: filters.search, status })}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                preserveState
                replace
            >
                {label}
            </Link>
        );
    };

    const FlashMessage = () => {
        if (!showFlash.show) return null;

        const baseClasses = "fixed top-20 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm";
        const typeClasses = showFlash.type === 'success' ? 'bg-green-500' : 'bg-red-500';

        return (
            <div className={`${baseClasses} ${typeClasses}`}>
                {showFlash.message}
            </div>
        )
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Log Pemenang
                </h2>
            }
        >
            <Head title="Log Pemenang" />
            <FlashMessage />


            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                                {/* Filter Status */}
                                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                    <StatusFilterLink status="" label="Semua" />
                                    <StatusFilterLink status="sent" label="Terkirim" />
                                    <StatusFilterLink status="unsent" label="Belum Terkirim" />
                                </div>
                                {/* Form Pencarian */}
                                <form onSubmit={handleSearch} className="flex items-center gap-2">
                                    <TextInput
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cari nama atau no. WA..."
                                        className="w-full sm:w-64"
                                    />
                                    <PrimaryButton type="submit">
                                        <Search size={16} />
                                    </PrimaryButton>
                                </form>
                            </div>

                            <div className="overflow-x-auto border rounded-lg">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-3 font-semibold text-gray-600 text-sm border-b">
                                                Status
                                            </th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm border-b">
                                                Nama Partisipan
                                            </th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm border-b">
                                                Nama Hadiah
                                            </th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm border-b">
                                                Kode Unik
                                            </th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm border-b w-40 text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {initialWinLogs.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="p-6 text-center text-gray-500"
                                                >
                                                    Tidak ada data pemenang yang cocok dengan filter yang diterapkan.
                                                </td>
                                            </tr>
                                        ) : (
                                            initialWinLogs.data.map((log) => (
                                                <tr
                                                    key={log.id}
                                                    className={`border-b transition-colors ${log.is_sent ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                                                >
                                                    <td className="p-3 text-center">
                                                        {log.is_sent ? (
                                                            <span className="inline-flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                                                                <CheckCircle size={12} /> Terkirim
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
                                                                <XCircle size={12} /> Belum
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 font-medium text-gray-800">
                                                        <div>{log.participant?.name}</div>
                                                        <div className="text-xs text-gray-500">{log.participant?.whatsapp_number}</div>
                                                    </td>
                                                     <td className="p-3 text-gray-700">
                                                        {log.prize_item?.prize?.name}
                                                    </td>
                                                     <td className="p-3 font-mono text-indigo-600">
                                                        {log.prize_item?.unique_code}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <button
                                                            onClick={() => handleSendMessage(log)}
                                                            disabled={log.is_sent || sendingId === log.id}
                                                            className="flex w-full items-center justify-center gap-2 text-sm font-semibold p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {sendingId === log.id ? (
                                                                <><Loader2 size={16} className="animate-spin" /> Mengirim...</>
                                                            ) : log.is_sent ? (
                                                                <><CheckCircle size={16} /> Terkirim</>
                                                            ) : (
                                                                <><Send size={16} /> Kirim Pesan</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={initialWinLogs.links} className="mt-6" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
