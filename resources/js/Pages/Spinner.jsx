import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import Modal from "@/Components/Modal";

// --- Komponen SpinnerWheel ---
const SpinnerWheel = ({ prizes, rotation }) => {
    const segmentCount = prizes.length;
    const segmentAngle = 360 / segmentCount;

    // Palet warna horor dengan transparansi
    const colors = [
        "rgba(127, 29, 29, 0.7)", // dark red
        "rgba(55, 65, 81, 0.7)", // gray
        "rgba(156, 163, 175, 0.6)", // lighter gray
        "rgba(185, 28, 28, 0.7)", // red
        "rgba(31, 41, 55, 0.8)", // dark gray
        "rgba(107, 114, 128, 0.7)", // mid gray
        "rgba(148, 0, 0, 0.6)", // dark blood red
        "rgba(75, 85, 99, 0.8)", // darker gray
    ];

    // 1. Membuat style background dengan conic-gradient yang akurat
    const gradientColors = prizes
        .map((prize, index) => {
            const color = colors[index % colors.length];
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            return `${color} ${startAngle}deg ${endAngle}deg`;
        })
        .join(", ");

    const wheelStyle = {
        background: `conic-gradient(from 0deg at 50% 50%, ${gradientColors})`,
        transform: `rotate(${rotation}deg)`,
    };

    return (
        <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto">
            {/* Pointer */}
            <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                style={{ filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.5))" }}
            >
                <div
                    className="w-0 h-0
                    border-l-[15px] border-l-transparent
                    border-r-[15px] border-r-transparent
                    border-t-[30px] border-t-red-900" // Darker red pointer
                ></div>
            </div>

            {/* Background Image Container */}
            <div
                className="absolute inset-0 w-full h-full rounded-full"
                style={{
                    backgroundImage: "url('/images/background.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Roda */}
            <div
                className="relative w-full h-full rounded-full border-8 border-gray-800 shadow-2xl shadow-red-900/50 transition-transform duration-[5000ms] ease-out"
                style={wheelStyle}
            >
                {/* Posisi Teks Hadiah */}
                {prizes.map((prize, index) => {
                    const angle = index * segmentAngle + segmentAngle / 2; // Sudut tengah segmen
                    return (
                        <div
                            key={prize.id}
                            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                            style={{ transform: `rotate(${angle}deg)` }}
                        >
                            <span
                                className="text-white font-bold text-sm"
                                style={{
                                    transform:
                                        "translateY(-100px) rotate(-90deg)", // Dorong teks ke luar dari pusat
                                    textShadow: "0 0 5px #000",
                                }}
                            >
                                {prize.name.substring(0, 12)}
                            </span>
                        </div>
                    );
                })}

                {/* Tombol tengah */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-900 rounded-full border-4 border-gray-700 shadow-inner flex items-center justify-center">
                    <span className="font-bold text-red-500">SPIN</span>
                </div>
            </div>
        </div>
    );
};

// --- Halaman Utama ---
export default function Spinner({ prizes, error }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [spinResult, setSpinResult] = useState(null);

    // Jika user sudah pernah spin sebelumnya
    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <Head title="Error" />
                <div className="bg-gray-900 border border-red-800/50 p-8 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Akses Ditolak
                    </h1>
                    <p className="text-gray-300">{error}</p>
                    <button
                        onClick={() => router.get(route("home"))}
                        className="mt-6 bg-red-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const handleSpin = async () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setSpinResult(null);

        // Animasi putaran awal
        const randomSpins = Math.floor(Math.random() * 5 + 5);
        const initialRotation = rotation + 360 * randomSpins;
        setRotation(initialRotation);

        try {
            const response = await axios.post(route("spinner.spin"));
            const wonPrize = response.data;

            const winningIndex = prizes.findIndex((p) => p.id === wonPrize.id);
            const segmentCount = prizes.length;
            const segmentAngle = 360 / segmentCount;

            // Sudut tengah dari segmen pemenang
            const targetAngleInSegment = segmentAngle / 2;
            // Sudut awal dari segmen pemenang
            const startAngleOfWinningSegment = winningIndex * segmentAngle;

            // Total rotasi yang dibutuhkan agar pointer menunjuk ke tengah segmen pemenang
            // Pointer ada di atas (posisi 0 atau 360). Kita perlu memutar RODA ke arah sebaliknya.
            const finalAngle =
                360 - (startAngleOfWinningSegment + targetAngleInSegment);

            const finalRotation =
                initialRotation - (rotation % 360) + finalAngle;

            // Beri sedikit waktu untuk server response sebelum menghentikan roda
            setTimeout(() => {
                setRotation(finalRotation);
                // Setelah animasi berhenti, tampilkan modal
                setTimeout(() => {
                    setSpinResult(wonPrize);
                    setIsSpinning(false);
                }, 5000); // Harus sama dengan durasi transisi CSS
            }, 500);
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.error ||
                    "Terjadi kesalahan. Silakan coba lagi.",
            );
            setIsSpinning(false);
            setRotation(0); // Reset rotasi jika error
        }
    };

    const cast = [
        "OKI RENGGA",
        "LOLOX",
        "RATU FELISHA",
        "TANTA GINTING",
        "REZA NANGIN",
        "POPPY SOVIA",
        "AMARA ANGELICA",
        "SHAHABI SAKRI",
        "NAURA HAKIM",
    ];

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
            <Head title="Spinner Hadiah" />

            <img
                src="/images/texttibatibasetan.png"
                alt="Tiba Tiba Setan"
                className="w-1/2 md:w-1/3 max-w-xs mx-auto mb-4"
            />

            <h1
                className="text-4xl font-bold text-red-500 mb-2 text-center"
                style={{ textShadow: "0 2px 10px rgba(150,0,0,0.7)" }}
            >
                Putar Rodanya!
            </h1>
            <p className="text-gray-400 mb-10">Uji Keberuntunganmu...</p>

            <SpinnerWheel prizes={prizes} rotation={rotation} />

            <button
                onClick={handleSpin}
                disabled={isSpinning || spinResult}
                className="mt-12 bg-red-900 hover:bg-red-800 text-white font-bold text-2xl px-12 py-4 rounded-lg shadow-lg shadow-red-900/50 transform hover:scale-105 transition-transform disabled:bg-gray-700 disabled:cursor-not-allowed disabled:scale-100"
            >
                {isSpinning ? "BERPUTAR..." : "SPIN SEKARANG"}
            </button>

            {/* --- Cast List --- */}
            <div className="mt-12 w-full max-w-4xl text-center">
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                    {cast.map((name) => (
                        <span
                            key={name}
                            className="uppercase text-yellow-400 text-xs font-semibold"
                            style={{ textShadow: "0 0 5px #900" }}
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Modal Hasil */}
            <Modal show={!!spinResult && !isSpinning} onClose={() => {}}>
                {spinResult?.is_zonk ? (
                    // --- Tampilan jika ZONK ---
                    <div className="p-8 text-center bg-gray-900 border border-red-800/50 rounded-lg">
                        <h2 className="text-3xl font-bold text-gray-400 mb-4">
                            NASIBMU BURUK!
                        </h2>
                        <p className="text-gray-400 text-lg mb-2">
                            Kamu mendapatkan:
                        </p>
                        <p className="text-2xl font-extrabold text-gray-500 mb-6">
                            {spinResult?.name}
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Keberuntungan tidak berpihak padamu.
                        </p>
                        <div className="text-xs text-gray-600">
                            Kau boleh pergi sekarang.
                        </div>
                    </div>
                ) : (
                    // --- Tampilan jika MENANG ---
                    <div className="p-8 text-center bg-gray-900 border border-yellow-500/50 rounded-lg">
                        <h2 className="text-3xl font-bold text-yellow-500 mb-4">
                            KAU BERUNTUNG...
                        </h2>
                        <p className="text-gray-400 text-lg mb-2">
                            Kamu mendapatkan:
                        </p>
                        <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">
                            {spinResult?.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                            Seseorang akan menghubungimu... segera.
                        </p>
                        <p className="text-gray-400 text-sm mb-6">
                            Tunggu saja.
                        </p>
                        <div className="text-xs text-gray-600">
                            Kau boleh pergi sekarang.
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
