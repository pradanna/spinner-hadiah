import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { MessageSquare } from "lucide-react";
import Pagination from "@/Components/Pagination";

export default function Participants({ auth, participants }) {
    // Fungsi untuk memformat nomor WhatsApp
    const formatWhatsAppNumber = (number) => {
        // Hapus karakter selain angka
        let cleaned = ('' + number).replace(/\D/g, '');
        // Jika nomor dimulai dengan 0, ganti dengan 62
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        }
        // Jika tidak dimulai dengan 62, tambahkan 62 (asumsi nomor lokal)
        else if (!cleaned.startsWith('62')) {
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
                            <p className="text-gray-600 mb-6">
                                Daftar semua pengguna yang telah berpartisipasi dalam spinner.
                            </p>

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
                                                    Belum ada partisipan.
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
