import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
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

// --- Flash Message Component ---
const FlashMessage = () => {
    const { flash = {}, errors } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            setType("success");
            setVisible(true);
        } else if (flash.error) {
            setMessage(flash.error);
            setType("error");
            setVisible(true);
        } else if (Object.keys(errors).length > 0) {
            setMessage("Terdapat kesalahan validasi.");
            setType("error");
            setVisible(true);
        } else {
            setMessage("");
            setVisible(false);
        }

        if (flash.success || flash.error || Object.keys(errors).length > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash, errors]);

    if (!visible) return null;

    return (
        <div
            className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${
                type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
            {message}
        </div>
    );
};

export default function Prizes({ auth, prizes }) {
    const [selectedPrize, setSelectedPrize] = useState(null);

    // --- STATE UNTUK MODAL KATEGORI ---
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] =
        useState(false);

    // --- STATE UNTUK MODAL ITEM KODE ---
    const [isAddItemCodeModalOpen, setIsAddItemCodeModalOpen] = useState(false);
    const [isEditItemCodeModalOpen, setIsEditItemCodeModalOpen] =
        useState(false);

    // --- FORM UNTUK IMPORT CSV ---
    const {
        data: importData,
        setData: setImportData,
        post: postImport,
        processing: processingImport,
        errors: importErrors,
        reset: resetImport,
    } = useForm({
        csv_file: null,
    });

    // --- FORM UNTUK KATEGORI (PRIZE) ---
    const {
        data: prizeData,
        setData: setPrizeData,
        post: postPrize,
        patch: patchPrize,
        delete: destroyPrize,
        processing: processingPrize,
        errors: prizeErrors,
        reset: resetPrize,
    } = useForm({
        id: null,
        name: "",
        probability: 0,
        is_zonk: false,
    });

    // --- FORM UNTUK ITEM KODE (PRIZE ITEM) ---
    const {
        data: itemData,
        setData: setItemData,
        post: postItem,
        patch: patchItem,
        processing: processingItem,
        errors: itemErrors,
        reset: resetItem,
    } = useForm({
        id: null,
        prize_id: null,
        unique_code: "",
    });

    // Effect untuk menjaga `selectedPrize` tetap update setelah ada perubahan data
    useEffect(() => {
        if (selectedPrize) {
            const updated = prizes.find((p) => p.id === selectedPrize.id);
            if (updated) setSelectedPrize(updated);
        }
    }, [prizes]);

    // --- HANDLER UNTUK KATEGORI ---
    const handleImport = (e) => {
        e.preventDefault();
        postImport(route("prizes.import", selectedPrize.id), {
            onSuccess: () => resetImport("csv_file"),
        });
    };
    const openAddCategoryModal = () => {
        resetPrize();
        setIsAddCategoryModalOpen(true);
    };
    const closeAddCategoryModal = () => setIsAddCategoryModalOpen(false);
    const handleAddNewPrize = (e) => {
        e.preventDefault();
        postPrize(route("prizes.store"), {
            onSuccess: () => closeAddCategoryModal(),
        });
    };
    const openEditCategoryModal = (e, prize) => {
        e.stopPropagation();
        setPrizeData({
            id: prize.id,
            name: prize.name,
            probability: prize.probability,
            is_zonk: prize.is_zonk,
        });
        setIsEditCategoryModalOpen(true);
    };
    const closeEditCategoryModal = () => setIsEditCategoryModalOpen(false);
    const handleUpdatePrize = (e) => {
        e.preventDefault();
        patchPrize(route("prizes.update", prizeData.id), {
            onSuccess: () => closeEditCategoryModal(),
        });
    };
    const handleDeletePrize = (e, prize) => {
        e.stopPropagation();
        if (
            confirm(
                `Yakin hapus kategori "${prize.name}"? Semua kode unik terkait akan ikut terhapus.`,
            )
        ) {
            destroyPrize(route("prizes.destroy", prize.id));
        }
    };

    // --- HANDLER UNTUK ITEM KODE ---
    const openAddItemCodeModal = () => {
        resetItem();
        setItemData("prize_id", selectedPrize.id);
        setIsAddItemCodeModalOpen(true);
    };
    const closeAddItemCodeModal = () => setIsAddItemCodeModalOpen(false);
    const handleAddItemCode = (e) => {
        e.preventDefault();
        postItem(route("prize-items.store"), {
            preserveScroll: true,
            onSuccess: () => closeAddItemCodeModal(),
        });
    };

    const openEditItemCodeModal = (item) => {
        resetItem();
        setItemData({ id: item.id, unique_code: item.unique_code });
        setIsEditItemCodeModalOpen(true);
    };
    const closeEditItemCodeModal = () => setIsEditItemCodeModalOpen(false);
    const handleEditItemCode = (e) => {
        e.preventDefault();
        patchItem(route("prize-items.update", itemData.id), {
            preserveScroll: true,
            onSuccess: () => closeEditItemCodeModal(),
        });
    };

    const handleDeleteItemCode = (item) => {
        if (confirm(`Yakin hapus kode unik "${item.unique_code}"?`)) {
            router.delete(route("prize-items.destroy", item.id), {
                preserveScroll: true,
            });
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
            <FlashMessage />

            <div className="flex flex-col md:flex-row gap-6 p-4 sm:p-6 lg:p-8">
                {/* KOLOM KIRI */}
                <div className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow-sm border h-fit">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700 flex items-center">
                            <Package className="mr-2" size={20} /> Kategori
                            Hadiah
                        </h3>
                        <button
                            onClick={openAddCategoryModal}
                            className="flex items-center justify-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-all"
                        >
                            <PlusCircle size={16} /> Tambah
                        </button>
                    </div>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                        {prizes.map((prize) => (
                            <div
                                key={prize.id}
                                onClick={() => setSelectedPrize(prize)}
                                className={`p-4 rounded-lg cursor-pointer border transition-all ${selectedPrize?.id === prize.id ? "border-indigo-500 bg-indigo-50 shadow-md" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 flex-1">
                                        {prize.name}
                                    </h4>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-bold ${prize.is_zonk ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
                                    >
                                        {prize.is_zonk ? "ZONK" : "HADIAH"}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 flex justify-between items-end">
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
                                                    openEditCategoryModal(
                                                        e,
                                                        prize,
                                                    )
                                                }
                                                className="p-1 text-gray-400 hover:text-indigo-600"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={(e) =>
                                                    handleDeletePrize(e, prize)
                                                }
                                                className="p-1 text-gray-400 hover:text-red-600"
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

                {/* KOLOM KANAN */}
                <div className="w-full md:w-2/3 bg-white rounded-xl shadow-sm border overflow-hidden">
                    {selectedPrize ? (
                        <div className="p-6">
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Item Kode: {selectedPrize.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Kelola stok kode unik untuk hadiah ini.
                                    </p>
                                </div>
                                {!selectedPrize.is_zonk && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={openAddItemCodeModal}
                                            className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-bold border hover:bg-gray-100 transition"
                                        >
                                            <PlusCircle
                                                size={16}
                                                className="mr-2"
                                            />{" "}
                                            Tambah Kode
                                        </button>
                                        <form
                                            onSubmit={handleImport}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={(e) =>
                                                    setImportData(
                                                        "csv_file",
                                                        e.target.files[0],
                                                    )
                                                }
                                                className="text-sm border rounded-lg p-1.5 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            />
                                            <button
                                                type="submit"
                                                disabled={
                                                    !importData.csv_file ||
                                                    processingImport
                                                }
                                                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:bg-gray-400 transition"
                                            >
                                                <Upload
                                                    size={16}
                                                    className="mr-2"
                                                />{" "}
                                                Import
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>

                            {importErrors.csv_file && (
                                <div className="mb-4 text-red-500 text-sm font-bold">
                                    {importErrors.csv_file}
                                </div>
                            )}

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
                                                <th className="p-3 font-semibold text-gray-600 text-sm border-b w-32 text-center">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPrize.items.length ===
                                            0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="p-4 text-center text-gray-500"
                                                    >
                                                        Belum ada kode. Silakan
                                                        import atau tambah
                                                        manual.
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
                                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold inline-flex items-center gap-1">
                                                                        <CheckCircle
                                                                            size={
                                                                                12
                                                                            }
                                                                        />{" "}
                                                                        Tersedia
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold inline-flex items-center gap-1">
                                                                        <XCircle
                                                                            size={
                                                                                12
                                                                            }
                                                                        />{" "}
                                                                        Terpakai
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                <div className="flex justify-center gap-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            openEditItemCodeModal(
                                                                                item,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            !item.is_available
                                                                        }
                                                                        className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                    >
                                                                        <Edit
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDeleteItemCode(
                                                                                item,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            !item.is_available
                                                                        }
                                                                        className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
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

            {/* --- MODALS KATEGORI --- */}
            <Modal
                show={isAddCategoryModalOpen}
                onClose={closeAddCategoryModal}
            >
                <form onSubmit={handleAddNewPrize} className="p-6">
                    {/* ... existing form ... */}
                </form>
            </Modal>
            <Modal
                show={isEditCategoryModalOpen}
                onClose={closeEditCategoryModal}
            >
                <form onSubmit={handleUpdatePrize} className="p-6">
                    {/* ... existing form ... */}
                </form>
            </Modal>

            {/* --- MODALS ITEM KODE --- */}
            <Modal
                show={isAddItemCodeModalOpen}
                onClose={closeAddItemCodeModal}
            >
                <form onSubmit={handleAddItemCode} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Tambah Kode Unik Baru
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Tambahkan satu kode unik untuk hadiah{" "}
                        <span className="font-bold">{selectedPrize?.name}</span>
                        .
                    </p>
                    <div className="mt-6">
                        <InputLabel htmlFor="unique_code" value="Kode Unik" />
                        <TextInput
                            id="unique_code"
                            name="unique_code"
                            value={itemData.unique_code}
                            className="mt-1 block w-full"
                            autoComplete="off"
                            isFocused={true}
                            onChange={(e) =>
                                setItemData("unique_code", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={itemErrors.unique_code}
                            className="mt-2"
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeAddItemCodeModal}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ms-3"
                            disabled={processingItem}
                        >
                            {processingItem ? "Menyimpan..." : "Simpan"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal
                show={isEditItemCodeModalOpen}
                onClose={closeEditItemCodeModal}
            >
                <form onSubmit={handleEditItemCode} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Edit Kode Unik
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Mengubah kode unik untuk hadiah{" "}
                        <span className="font-bold">{selectedPrize?.name}</span>
                        .
                    </p>
                    <div className="mt-6">
                        <InputLabel
                            htmlFor="edit_unique_code"
                            value="Kode Unik"
                        />
                        <TextInput
                            id="edit_unique_code"
                            name="unique_code"
                            value={itemData.unique_code}
                            className="mt-1 block w-full"
                            autoComplete="off"
                            isFocused={true}
                            onChange={(e) =>
                                setItemData("unique_code", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={itemErrors.unique_code}
                            className="mt-2"
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeEditItemCodeModal}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ms-3"
                            disabled={processingItem}
                        >
                            {processingItem
                                ? "Menyimpan..."
                                : "Simpan Perubahan"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
