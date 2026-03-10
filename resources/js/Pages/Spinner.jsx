import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import Modal from "@/Components/Modal";

// --- Komponen SpinnerWheel ---
const SpinnerWheel = ({ prizes, rotation }) => {
    const segmentCount = prizes.length;
    const segmentAngle = 360 / segmentCount;

    // Palet warna yang menarik dan kontras
    const colors = [ "#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#D946EF", "#F43F5E" ];

    // 1. Membuat style background dengan conic-gradient yang akurat
    const gradientColors = prizes.map((prize, index) => {
        const color = colors[index % colors.length];
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;
        return `${color} ${startAngle}deg ${endAngle}deg`;
    }).join(', ');

    const wheelStyle = {
        background: `conic-gradient(from 0deg at 50% 50%, ${gradientColors})`,
        transform: `rotate(${rotation}deg)`
    };

    return (
        <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto">
            {/* Pointer */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" style={{ filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.3))' }}>
                <div className="w-0 h-0 
                    border-l-[15px] border-l-transparent
                    border-r-[15px] border-r-transparent
                    border-t-[30px] border-t-red-600">
                </div>
            </div>

            {/* Roda */}
            <div
                className="relative w-full h-full rounded-full border-8 border-white shadow-2xl transition-transform duration-[5000ms] ease-out"
                style={wheelStyle}
            >
                {/* Posisi Teks Hadiah */}
                {prizes.map((prize, index) => {
                    const angle = (index * segmentAngle) + (segmentAngle / 2); // Sudut tengah segmen
                    return (
                        <div
                            key={prize.id}
                            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                            style={{ transform: `rotate(${angle}deg)` }}
                        >
                            <span
                                className="text-white font-bold text-sm"
                                style={{
                                    transform: 'translateY(-100px) rotate(-90deg)', // Dorong teks ke luar dari pusat
                                }}
                            >
                                {prize.name.substring(0, 12)}
                            </span>
                        </div>
                    );
                })}
                
                {/* Tombol tengah */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full border-4 border-gray-200 shadow-inner flex items-center justify-center">
                    <span className="font-bold text-gray-700">SPIN</span>
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
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <Head title="Error" />
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
                    <p className="text-gray-700">{error}</p>
                    <button onClick={() => router.get(route('home'))} className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                        Kembali ke Home
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
        const initialRotation = rotation + (360 * randomSpins);
        setRotation(initialRotation);

        try {
            const response = await axios.post(route('spinner.spin'));
            const wonPrize = response.data;

            const winningIndex = prizes.findIndex(p => p.id === wonPrize.id);
            const segmentCount = prizes.length;
            const segmentAngle = 360 / segmentCount;
            
            // Sudut tengah dari segmen pemenang
            const targetAngleInSegment = segmentAngle / 2;
            // Sudut awal dari segmen pemenang
            const startAngleOfWinningSegment = winningIndex * segmentAngle;
            
            // Total rotasi yang dibutuhkan agar pointer menunjuk ke tengah segmen pemenang
            // Pointer ada di atas (posisi 0 atau 360). Kita perlu memutar RODA ke arah sebaliknya.
            const finalAngle = 360 - (startAngleOfWinningSegment + targetAngleInSegment);
            
            const finalRotation = initialRotation - (rotation % 360) + finalAngle;

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
            alert(err.response?.data?.error || "Terjadi kesalahan. Silakan coba lagi.");
            setIsSpinning(false);
            setRotation(0); // Reset rotasi jika error
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4 overflow-hidden">
            <Head title="Spinner Hadiah" />
            
            <h1 className="text-4xl font-bold text-white mb-2 text-center" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Putar Rodanya!
            </h1>
            <p className="text-indigo-300 mb-10">Semoga kamu beruntung hari ini.</p>
            
            <SpinnerWheel prizes={prizes} rotation={rotation} />
            
            <button
                onClick={handleSpin}
                disabled={isSpinning || spinResult}
                className="mt-12 bg-green-500 text-white font-bold text-2xl px-12 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
            >
                {isSpinning ? "BERPUTAR..." : "SPIN SEKARANG"}
            </button>

            {/* Modal Hasil */}
            <Modal show={!!spinResult && !isSpinning} onClose={() => {}}>
                {spinResult?.is_zonk ? (
                    // --- Tampilan jika ZONK ---
                    <div className="p-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-700 mb-4">
                            MOHON MAAF!
                        </h2>
                        <p className="text-gray-700 text-lg mb-2">Anda mendapatkan:</p>
                        <p className="text-2xl font-extrabold text-gray-500 mb-6">
                            {spinResult?.name}
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Jangan berkecil hati, silakan coba lagi di lain kesempatan.
                        </p>
                        <div className="text-xs text-gray-400">
                            Anda bisa menutup halaman ini.
                        </div>
                    </div>
                ) : (
                    // --- Tampilan jika MENANG ---
                    <div className="p-8 text-center">
                        <h2 className="text-3xl font-bold text-indigo-600 mb-4">
                            SELAMAT!
                        </h2>
                        <p className="text-gray-700 text-lg mb-2">Anda mendapatkan:</p>
                        <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-6">
                            {spinResult?.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                            Admin akan segera mengirimkan kode hadiah Anda melalui WhatsApp.
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Mohon ditunggu ya!
                        </p>
                        <div className="text-xs text-gray-400">
                            Anda bisa menutup halaman ini.
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
