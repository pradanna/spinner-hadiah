# Panduan Proyek Spinner Hadiah (GEMINI.md)

Dokumen ini bertujuan untuk memberikan konteks kepada AI Assistant (Gemini) agar dapat membantu pengembangan proyek ini secara efisien dan konsisten.

## 1. Struktur Folder Utama

- **/app**: Berisi logika inti aplikasi Laravel, termasuk Model, Controller, dan Request.
    - **/Http/Controllers**: Mengatur logika untuk menangani request dari frontend.
    - **/Models**: Representasi tabel database (Eloquent ORM).
- **/config**: Menyimpan semua file konfigurasi aplikasi Laravel (database, cache, dll).
- **/database**: Berisi migrasi, seeder, dan factory untuk skema database.
- **/public**: Folder root untuk web server. Aset yang sudah di-build oleh Vite akan ditempatkan di sini.
- **/resources**: Berisi kode sumber frontend (React) dan file CSS.
    - **/js/Pages**: Komponen React yang berfungsi sebagai halaman, dirender oleh Inertia.
    - **/js/Components**: Komponen React yang dapat digunakan kembali.
    - **/css**: File CSS utama.
- **/routes**: Definisi semua rute aplikasi (web.php, api.php).
- **/vendor**: Berisi dependensi dari Composer (paket PHP).
- **/node_modules**: Berisi dependensi dari NPM (paket JavaScript).

## 2. Tech Stack

- **Backend**: Laravel 12
- **Frontend**: React.js 18.2
- **PHP Version**: ^8.2
- **Database**: MYSQL .
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Penghubung Backend-Frontend**: Inertia.js
- **Icons**: Lucide-React

## 3. Alur Aplikasi Utama

### Alur Admin

1.  **Login**: Admin masuk melalui sistem otentikasi standar Laravel.
2.  **Manajemen Hadiah**: Di halaman "Manajemen Hadiah", admin dapat melakukan CRUD untuk kategori hadiah, mengatur probabilitas kemenangan, dan menandai hadiah sebagai "Zonk".
3.  **Unggah Kode Unik**: Untuk setiap kategori hadiah (kecuali Zonk), admin bisa mengunggah file `.csv` yang berisi daftar kode unik hadiah.
4.  **Melihat Partisipan**: Terdapat menu untuk melihat data semua partisipan yang telah mengikuti spin.
5.  **Log Pemenang**: Terdapat halaman untuk melihat daftar pemenang, hadiah yang didapat, dan kode uniknya. Di halaman ini ada tombol "WhatsApp" untuk memudahkan admin mengirimkan kode secara manual.
6.  **Laporan**: Admin dapat mencetak/mengekspor laporan data pemenang beserta hadiahnya.
7.  **Dashboard**: Halaman utama setelah login yang menampilkan ringkasan data.

### Alur User (Partisipan)

1.  **Input Data**: Pengguna membuka website dan mengisi form yang berisi Nama dan No. WhatsApp.
2.  **Validasi**:
    - Sistem mengecek apakah No. WhatsApp sudah pernah digunakan. Jika ya, pengguna ditolak.
    - Sistem melakukan _rate limiting_ berdasarkan IP untuk mencegah spam/bot.
3.  **Halaman Spinner**: Setelah validasi berhasil, pengguna diarahkan ke halaman spinner.
    - Roda spinner berputar dengan visual warna-warni (desain acak, tidak merepresentasikan hadiah).
    - Hasil spin (hadiah yang didapat) ditentukan di backend berdasarkan probabilitas yang telah diatur admin.
4.  **Hasil Spin**: Setelah putaran selesai, muncul tampilan "Selamat Anda mendapatkan [Nama Hadiah]!".
5.  **Penyimpanan Data**: Data pemenang (nama, no. whatsapp, hadiah, dan kode unik yang dialokasikan) disimpan ke database.
6.  **Pengiriman Hadiah**: Admin akan melihat data pemenang di "Log Pemenang" dan mengirimkan kode unik hadiah via WhatsApp secara manual.

## 4. Panduan Konteks & Aturan Coding

Untuk menjaga konsistensi, mohon ikuti panduan berikut saat memberikan saran atau menulis kode:

- **Bahasa**: Gunakan **Bahasa Indonesia** untuk semua teks yang terlihat oleh pengguna (UI, pesan error, notifikasi) dan komentar kode jika diperlukan.
- **Backend (Laravel)**:
    - Ikuti konvensi Laravel (Nama model singular, nama tabel plural, dll).
    - Gunakan Eloquent ORM secara maksimal dan hindari Raw Query jika memungkinkan.
    - Manfaatkan Form Request untuk validasi (`php artisan make:request`).
    - Gunakan `DB::transaction` untuk operasi database yang kritikal (seperti pada `PrizeController@import`).
    - Tulis validasi yang jelas dan berikan pesan error kustom dalam Bahasa Indonesia.
- **Frontend (React)**:
    - Gunakan **React Hooks** dan **Functional Components**. Hindari Class Components.
    - Manfaatkan hook `useForm` dari `@inertiajs/react` untuk semua interaksi form ke backend. Ini menjaga konsistensi state (processing, errors).
    - Struktur file mengikuti yang sudah ada: letakkan halaman di `resources/js/Pages` dan komponen re-usable di `resources/js/Components`.
    - Gunakan **Tailwind CSS** untuk styling dengan mengikuti konfigurasi di `tailwind.config.js`.
    - Gunakan ikon dari `lucide-react` untuk konsistensi visual.
- **Routing**: Gunakan helper `route()` dari Ziggy baik di Blade maupun di file `.jsx` untuk merujuk ke rute Laravel.
