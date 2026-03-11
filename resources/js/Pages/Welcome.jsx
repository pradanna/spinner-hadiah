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
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                backgroundColor: "#000",
                backgroundImage: "url('/images/background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Head title="Scan & Win!" />

            <div className="bg-black bg-opacity-50 backdrop-blur-sm max-w-md w-full rounded-3xl shadow-2xl shadow-red-900/50 overflow-hidden border border-red-800/50">
                {/* Header Image / Banner */}
                <div className="p-6 text-center">
                    <img
                        src="/images/texttibatibasetan.png"
                        alt="Spin & Win"
                        className="mx-auto w-3/4"
                    />
                    <p className="text-red-200 text-sm mt-4">
                        Masukkan nomor WhatsApp kamu untuk memutar roda
                        keberuntungan.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={submit} className="p-8">
                    {/* Input Nama (Opsional) */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Nama Kamu{" "}
                            <span className="text-gray-400 font-normal">
                                (Opsional)
                            </span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border bg-gray-900/50 border-gray-700 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <div className="text-red-400 text-xs mt-1">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    {/* Input WhatsApp (Wajib) */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Nomor WhatsApp{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={data.whatsapp_number}
                            onChange={(e) =>
                                setData("whatsapp_number", e.target.value)
                            }
                            className={`w-full px-4 py-3 rounded-xl border bg-gray-900/50 text-white focus:ring-2 transition-colors ${
                                errors.whatsapp_number
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-700 focus:ring-red-500 focus:border-red-500"
                            }`}
                            placeholder="08123456789"
                        />
                        {/* Pesan Error Validasi Muncul di Sini */}
                        {errors.whatsapp_number && (
                            <div className="text-red-400 text-sm font-medium mt-2 bg-red-900/50 p-2 rounded-lg border border-red-800/50">
                                ⚠️ {errors.whatsapp_number}
                            </div>
                        )}
                    </div>

                    {/* Pesan Error Global dari Rate Limiter */}
                    {errors.ip_address && (
                        <div className="mb-4 text-red-400 text-sm font-medium p-3 bg-red-900/50 border border-red-800/50 rounded-lg text-center">
                            {errors.ip_address}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/50 transform transition active:scale-95 disabled:opacity-50 text-lg"
                    >
                        {processing ? "Memproses..." : "Lanjut Putar!"}
                    </button>
                </form>
            </div>
            <div className="absolute bottom-10 text-center">
                <p
                    className="text-yellow-400 font-bold text-xl"
                    style={{ textShadow: "0 0 10px #990000" }}
                >
                    Mulai 16 April 2025 di Bioskop
                </p>
            </div>
        </div>
    );
}
