import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Package,
    Upload,
    CheckCircle,
    XCircle,
    PlusCircle,
    Edit,
    Trash2,
} from "lucide-react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import Checkbox from "@/Components/Checkbox";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Prizes({ auth, prizes }) {
    // State untuk menyimpan hadiah mana yang sedang di-klik (di sebelah kanan)
    const [selectedPrize, setSelectedPrize] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Form Inertia untuk Upload CSV
    const { data, setData, post, processing, errors, reset } = useForm({
        csv_file: null,
    });

    // Form Inertia untuk Tambah Kategori
    const {
        data: newPrizeData,
        setData: setNewPrizeData,
        post: postNewPrize,
        processing: processingNewPrize,
        errors: newPrizeErrors,
        reset: resetNewPrize,
    } = useForm({
        name: "",
        probability: 0,
        is_zonk: false,
    });

    // Form Inertia untuk Edit & Hapus Kategori
    const {
        data: editPrizeData,
        setData: setEditPrizeData,
        patch: patchPrize,
        delete: destroyPrize,
        processing: processingEditPrize,
        errors: editPrizeErrors,
        reset: resetEditPrize,
    } = useForm({
        id: null,
        name: "",
        probability: 0,
        is_zonk: false,
    });

    // Menjaga selectedPrize tetap ter-update setelah upload CSV sukses (karena data props.prizes diperbarui Laravel)
    useEffect(() => {
        if (selectedPrize) {
            const updated = prizes.find((p) => p.id === selectedPrize.id);
            if (updated) setSelectedPrize(updated);
        }
    }, [prizes]);

    const handleImport = (e) => {
        e.preventDefault();
        post(route("prizes.import", selectedPrize.id), {
            onSuccess: () => {
                reset("csv_file");
                alert("Import CSV Berhasil!"); // Bisa diganti toast notification nanti
            },
        });
    };

    const openAddModal = () => {
        resetNewPrize();
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleAddNewPrize = (e) => {
        e.preventDefault();
        postNewPrize(route("prizes.store"), {
            onSuccess: () => closeAddModal(),
        });
    };

    const openEditModal = (e, prize) => {
        e.stopPropagation(); // Mencegah card terpilih saat klik tombol edit
        setEditPrizeData({
            id: prize.id,
            name: prize.name,
            probability: prize.probability,
            is_zonk: prize.is_zonk,
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleUpdatePrize = (e) => {
        e.preventDefault();
        patchPrize(route("prizes.update", editPrizeData.id), {
            onSuccess: () => closeEditModal(),
        });
    };

    const handleDeletePrize = (e, prize) => {
        e.stopPropagation(); // Mencegah card terpilih saat klik tombol hapus
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus kategori "${prize.name}"? Semua data item terkait juga akan terhapus.`,
            )
        ) {
            destroyPrize(route("prizes.destroy", prize.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Hadiah
                </h2>
            }
        >
            <Head title="Manajemen Hadiah" />

            <div className="flex flex-col md:flex-row gap-6">
                {/* KOLOM KIRI: Daftar Kategori Hadiah */}
                <div className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700 flex items-center">
                            <Package className="mr-2" size={20} /> Kategori
                            Hadiah
                        </h3>
                        <button
                            onClick={openAddModal}
                            className="flex items-center justify-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-all"
                        >
                            <PlusCircle size={16} />
                            Tambah
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                        {prizes.map((prize) => (
                            <div
                                key={prize.id}
                                onClick={() => setSelectedPrize(prize)}
                                className={`p-4 rounded-lg cursor-pointer border transition-all ${
                                    selectedPrize?.id === prize.id
                                        ? "border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500"
                                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">
                                            {prize.name}
                                        </h4>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-bold ${prize.is_zonk ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
                                    >
                                        {prize.is_zonk ? "ZONK" : "HADIAH"}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 flex justify-between">
                                    <span>
                                        Probabilitas: {prize.probability}%
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-indigo-600">
                                            Stok: {prize.available_stock}
                                        </span>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={(e) =>
                                                    openEditModal(e, prize)
                                                }
                                                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={(e) =>
                                                    handleDeletePrize(e, prize)
                                                }
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KOLOM KANAN: Detail Item / Import CSV */}
                <div className="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {selectedPrize ? (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Item Kode: {selectedPrize.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Kelola stok kode unik untuk hadiah ini.
                                    </p>
                                </div>

                                {/* Form Import CSV */}
                                {!selectedPrize.is_zonk && (
                                    <form
                                        onSubmit={handleImport}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) =>
                                                setData(
                                                    "csv_file",
                                                    e.target.files[0],
                                                )
                                            }
                                            className="text-sm border border-gray-300 rounded-lg p-1.5 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                !data.csv_file || processing
                                            }
                                            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:bg-gray-400 transition"
                                        >
                                            <Upload
                                                size={16}
                                                className="mr-2"
                                            />{" "}
                                            Import CSV
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Error validasi CSV jika ada */}
                            {errors.csv_file && (
                                <div className="mb-4 text-red-500 text-sm font-bold">
                                    {errors.csv_file}
                                </div>
                            )}

                            {/* Tabel Daftar Kode */}
                            {selectedPrize.is_zonk ? (
                                <div className="text-center py-12 text-gray-400">
                                    <XCircle
                                        size={48}
                                        className="mx-auto mb-3 opacity-50"
                                    />
                                    <p>
                                        Kategori Zonk tidak membutuhkan kode
                                        unik.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-y-auto max-h-[500px] border rounded-lg">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="p-3 font-semibold text-gray-600 text-sm border-b">
                                                    Kode Unik
                                                </th>
                                                <th className="p-3 font-semibold text-gray-600 text-sm border-b w-32 text-center">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPrize.items.length ===
                                            0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="2"
                                                        className="p-4 text-center text-gray-500"
                                                    >
                                                        Belum ada kode. Silakan
                                                        import CSV.
                                                    </td>
                                                </tr>
                                            ) : (
                                                selectedPrize.items.map(
                                                    (item) => (
                                                        <tr
                                                            key={item.id}
                                                            className="border-b hover:bg-gray-50"
                                                        >
                                                            <td className="p-3 font-mono text-gray-700">
                                                                {
                                                                    item.unique_code
                                                                }
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                {item.is_available ? (
                                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold flex items-center justify-center gap-1 w-max mx-auto">
                                                                        <CheckCircle
                                                                            size={
                                                                                12
                                                                            }
                                                                        />{" "}
                                                                        Tersedia
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold flex items-center justify-center gap-1 w-max mx-auto">
                                                                        <XCircle
                                                                            size={
                                                                                12
                                                                            }
                                                                        />{" "}
                                                                        Terpakai
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-gray-400 text-center">
                            <Package size={64} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium text-gray-500">
                                Pilih kategori hadiah di sebelah kiri
                            </p>
                            <p className="text-sm">
                                untuk melihat dan mengelola item kode uniknya.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={isAddModalOpen} onClose={closeAddModal}>
                <form onSubmit={handleAddNewPrize} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Tambah Kategori Hadiah Baru
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Pastikan total probabilitas semua hadiah tidak melebihi
                        100%.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="name" value="Nama Kategori" />
                        <TextInput
                            id="name"
                            name="name"
                            value={newPrizeData.name}
                            className="mt-1 block w-full"
                            autoComplete="off"
                            isFocused={true}
                            onChange={(e) =>
                                setNewPrizeData("name", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={newPrizeErrors.name}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="probability"
                            value="Probabilitas (%)"
                        />
                        <TextInput
                            id="probability"
                            name="probability"
                            type="number"
                            value={newPrizeData.probability}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setNewPrizeData("probability", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={newPrizeErrors.probability}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="is_zonk"
                                checked={newPrizeData.is_zonk}
                                onChange={(e) =>
                                    setNewPrizeData("is_zonk", e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Ini adalah Zonk (Hadiah Kosong)
                            </span>
                        </label>
                        <InputError
                            message={newPrizeErrors.is_zonk}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeAddModal}>
                            Batal
                        </SecondaryButton>

                        <PrimaryButton
                            className="ms-3"
                            disabled={processingNewPrize}
                        >
                            {processingNewPrize ? "Menyimpan..." : "Simpan"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={isEditModalOpen} onClose={closeEditModal}>
                <form onSubmit={handleUpdatePrize} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Edit Kategori Hadiah
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Perubahan probabilitas akan mempengaruhi peluang menang
                        partisipan.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="edit_name" value="Nama Kategori" />
                        <TextInput
                            id="edit_name"
                            name="name"
                            value={editPrizeData.name}
                            className="mt-1 block w-full"
                            autoComplete="off"
                            onChange={(e) =>
                                setEditPrizeData("name", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={editPrizeErrors.name}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="edit_probability"
                            value="Probabilitas (%)"
                        />
                        <TextInput
                            id="edit_probability"
                            name="probability"
                            type="number"
                            value={editPrizeData.probability}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setEditPrizeData("probability", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={editPrizeErrors.probability}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="is_zonk"
                                checked={editPrizeData.is_zonk}
                                onChange={(e) =>
                                    setEditPrizeData(
                                        "is_zonk",
                                        e.target.checked,
                                    )
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Ini adalah Zonk (Hadiah Kosong)
                            </span>
                        </label>
                        <InputError
                            message={editPrizeErrors.is_zonk}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeEditModal}>
                            Batal
                        </SecondaryButton>

                        <PrimaryButton
                            className="ms-3"
                            disabled={processingEditPrize}
                        >
                            {processingEditPrize
                                ? "Menyimpan..."
                                : "Simpan Perubahan"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
