import { Head } from "@inertiajs/react";

export default function SpinnerNotReady() {
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
            <Head title="Segera Hadir!" />

            <div className="bg-black bg-opacity-50 backdrop-blur-sm max-w-md w-full rounded-3xl shadow-2xl shadow-red-900/50 overflow-hidden border border-red-800/50">
                {/* Header Image / Banner */}
                <div className="p-6 text-center">
                    <img
                        src="/images/texttibatibasetan.png"
                        alt="Spin & Win"
                        className="mx-auto w-3/4"
                    />
                </div>

                {/* Message Section */}
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-200 mb-4">
                        Maaf, Spinner Hadiah Belum Siap
                    </h2>
                    <p className="text-gray-300">
                        Silakan coba lagi nanti.
                    </p>
                </div>
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
