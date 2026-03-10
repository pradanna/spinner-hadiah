import { Link } from '@inertiajs/react';

// Fungsi untuk membersihkan HTML dari label, misal &laquo; Previous
const cleanLabel = (label) => {
    return label.replace(/&laquo;|&raquo;/g, '').trim();
}

export default function Pagination({ links = [], className = '' }) {
    // Jika tidak ada link atau hanya ada link Previous & Next (artinya cuma 1 halaman)
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="flex flex-wrap -mb-1">
                {links.map((link, index) => {
                    // Jika link tidak punya URL (misal: "...") atau link non-aktif
                    if (link.url === null) {
                        return (
                            <div
                                key={index}
                                className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                            >
                                {cleanLabel(link.label)}
                            </div>
                        );
                    }

                    // Render Link aktif
                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${
                                link.active ? 'bg-indigo-500 text-white' : 'bg-white'
                            }`}
                        >
                            {cleanLabel(link.label)}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
