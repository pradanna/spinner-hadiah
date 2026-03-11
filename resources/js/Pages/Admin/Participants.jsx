import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { MessageSquare, Download, Search } from "lucide-react";
import Pagination from "@/Components/Pagination";
import { useRef, useEffect } from "react";

export default function Participants({ auth, participants, filters }) {

    const searchInput = useRef(null);

    // Set initial value of search input if filter is active
    useEffect(() => {
        if (filters.search) {
            searchInput.current.value = filters.search;
        }
    }, [filters]);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('participants.index'), { search: searchInput.current.value }, {
            preserveState: true,
            replace: true,
        });
    };
    
    // Format WhatsApp number for the wa.me link
    const formatWhatsAppNumber = (number) => {
        let cleaned = ('' + number).replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        } else if (!cleaned.startsWith('62')) {
            cleaned = '62' + cleaned;
        }
        return cleaned;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Data Partisipan
                </h2>
            }
        >
            <Head title="Data Partisipan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header: Search and Export */}
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                                {/* Search Form */}
                                <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                                    <input
                                        ref={searchInput}
                                        type="text"
                                        placeholder="Cari nama atau nomor..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Search size={18} />
                                    </div>
                                </form>

                                {/* Export Buttons */}
                                <div className="flex items-center gap-2">
                                     <a
                                        href={route('participants.export', { format: 'xlsx' })}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <Download size={16} />
                                        Export XLSX
                                    </a>
                                    <a
                                        href={route('participants.export', { format: 'pdf' })}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <Download size={16} />
                                        Export PDF
                                    </a>
                                </div>
                            </div>

                            <div className="overflow-x-auto border rounded-lg">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-3 font-semibold text-gray-600 text-sm border-b">
                                                Nama
                                            </th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm border-b">
                                                No. WhatsApp
                                            </th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm border-b">
                                                Alamat IP
                                            </th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm border-b">
                                                Waktu Daftar
                                            </th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm border-b w-40 text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participants.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="p-4 text-center text-gray-500"
                                                >
                                                    {filters.search ? 'Tidak ada data yang cocok dengan pencarian Anda.' : 'Belum ada partisipan.'}
                                                </td>
                                            </tr>
                                        ) : (
                                            participants.data.map((participant) => (
                                                <tr
                                                    key={participant.id}
                                                    className="border-b hover:bg-gray-50"
                                                >
                                                    <td className="p-3 font-medium text-gray-800">
                                                        {participant.name}
                                                    </td>
                                                    <td className="p-3 text-gray-700">
                                                        {participant.whatsapp_number}
                                                    </td>
                                                     <td className="p-3 text-gray-600">
                                                        {participant.ip_address}
                                                    </td>
                                                     <td className="p-3 text-gray-600">
                                                        {new Date(participant.created_at).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <a
                                                            href={`https://wa.me/${formatWhatsAppNumber(participant.whatsapp_number)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center gap-2 text-sm font-semibold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 p-2 rounded-lg transition-all"
                                                        >
                                                            <MessageSquare size={16} />
                                                            Hubungi
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Links */}
                            <Pagination links={participants.links} className="mt-6" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
