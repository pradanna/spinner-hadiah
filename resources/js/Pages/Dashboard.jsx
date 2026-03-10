import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ auth, stats, recent_wins }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title="Total Partisipan"
                            value={stats.total_participants}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Hadiah Terklaim"
                            value={stats.total_wins}
                            color="bg-green-500"
                        />
                        <StatCard
                            title="Sisa Stok Hadiah"
                            value={stats.remaining_items}
                            color="bg-orange-500"
                        />
                    </div>

                    {/* RECENT WINS TABLE */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-4">
                                Pemenang Terbaru
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="p-4 font-semibold text-gray-600">
                                                Nomor WA
                                            </th>
                                            <th className="p-4 font-semibold text-gray-600">
                                                Hadiah
                                            </th>
                                            <th className="p-4 font-semibold text-gray-600">
                                                Kode Unik
                                            </th>
                                            <th className="p-4 font-semibold text-gray-600">
                                                Waktu
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recent_wins.map((win) => (
                                            <tr
                                                key={win.id}
                                                className="border-b hover:bg-gray-50 transition"
                                            >
                                                <td className="p-4 font-medium">
                                                    {
                                                        win.participant
                                                            .whatsapp_number
                                                    }
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${win.prize_item ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {
                                                            win.prize_item?.prize?.name ?? 'ZONK'
                                                        }
                                                    </span>
                                                </td>
                                                <td className="p-4 font-mono text-sm text-gray-500">
                                                    {win.prize_item?.unique_code ?? '-'}
                                                </td>
                                                <td className="p-4 text-sm text-gray-500">
                                                    {new Date(
                                                        win.created_at,
                                                    ).toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        ))}
                                        {recent_wins.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="p-8 text-center text-gray-400"
                                                >
                                                    Belum ada pemenang saat ini.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, color }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className={`w-2 h-12 ${color} rounded-full mr-4`}></div>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
