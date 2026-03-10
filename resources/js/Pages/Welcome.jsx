import { Head, useForm } from "@inertiajs/react";

export default function Welcome() {
    // Gunakan useForm bawaan Inertia untuk handle state & error
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        whatsapp_number: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/join");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
            <Head title="Scan & Win!" />

            <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden">
                {/* Header Image / Banner */}
                <div className="bg-indigo-900 p-6 text-center text-white">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                        SPIN & WIN!
                    </h1>
                    <p className="text-indigo-200 text-sm">
                        Masukkan nomor WhatsApp kamu untuk memutar roda
                        keberuntungan.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={submit} className="p-8">
                    {/* Input Nama (Opsional) */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nama Kamu{" "}
                            <span className="text-gray-400 font-normal">
                                (Opsional)
                            </span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    {/* Input WhatsApp (Wajib) */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nomor WhatsApp{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={data.whatsapp_number}
                            onChange={(e) =>
                                setData("whatsapp_number", e.target.value)
                            }
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 transition-colors ${
                                errors.whatsapp_number
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            }`}
                            placeholder="08123456789"
                        />
                        {/* Pesan Error Validasi Muncul di Sini */}
                        {errors.whatsapp_number && (
                            <div className="text-red-500 text-sm font-medium mt-2 bg-red-50 p-2 rounded-lg border border-red-100">
                                ⚠️ {errors.whatsapp_number}
                            </div>
                        )}
                    </div>

                    {/* Pesan Error Global dari Rate Limiter */}
                    {errors.ip_address && (
                        <div className="mb-4 text-red-600 text-sm font-medium p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                            {errors.ip_address}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 text-lg"
                    >
                        {processing ? "Memproses..." : "Lanjut Putar!"}
                    </button>
                </form>
            </div>
        </div>
    );
}
