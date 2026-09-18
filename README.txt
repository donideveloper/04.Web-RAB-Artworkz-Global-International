==========================================================
  WEB RAB — PROTOTIPE HTML (CLICKABLE DEMO)  —  revisi 2
  Mengacu pada FSD Web RAB v2.2 & template HTML "Access Central v2.1"
==========================================================

0. PERUBAHAN PADA REVISI INI (hasil review 18/09/2026)
   - Menu induk bersubmenu (Reference) ikut ditandai aktif dan submenu tetap
     terbuka, termasuk saat berada di halaman Upload Excel yang dibuka dari
     submenu tersebut.
   - Halaman Category, Type & Spec kini memakai 3 tab (Category / Type /
     Specification), satu tabel per tab, menggantikan 3 card berdampingan.
   - Tombol "Download Template" dihapus dari toolbar semua menu; tombol
     tersebut hanya ada di halaman Upload Excel.
   - Area seret berkas pada halaman Upload Excel (dan lampiran project) kini
     dapat diklik untuk membuka file explorer perangkat, serta menerima
     drag & drop.
   - Kotak ringkasan Valid/Warning/Error di atas tabel preview diganti label
     kecil tanpa kotak di bawah tabel, agar tabel preview tidak terhalang.
   - Tombol "Download PDF" dihapus dari seluruh menu kecuali cetak quotation.
   - Dokumen FSD ikut diperbarui ke versi 2.2 (lihat FSD-Web-RAB-v2_2.docx).

1. CARA MENJALANKAN
   - Ekstrak folder ini, lalu buka file  index.html  di browser (Chrome/Edge/Firefox).
   - Tidak perlu web server, tidak perlu koneksi internet (Bootstrap 5.3 di-bundle lokal
     pada assets/vendor/). Font dari Google Fonts, bila offline akan memakai font sistem.
   - Login: password apa pun diterima. Pilih "Masuk sebagai (demo role)" untuk mencoba
     perbedaan menu/tombol antar role.
   - Akun contoh: andi.wijaya (ADM), hendra.kusuma (DIR), maria.santoso (MGR),
     budi.prasetyo (SPV), dewi.lestari (EST), rina.purnama (PRC),
     fajar.nugroho (Terkunci), siti.rahayu (Nonaktif).

2. STRUKTUR MENU & FILE (FSD Tabel 5H — 14 menu utama)
   Main
     Dashboard .................... dashboard.html
   Master Data
     Reference
       Category, Type & Spec ...... reference-category.html
       Brand ...................... reference-brand.html
       Supplier ................... reference-supplier.html
       Client ..................... reference-client.html
       Unit of Measure ............ reference-uom.html
       Finishing .................. reference-finishing.html
       Building Type .............. reference-building.html
       Work Group ................. reference-workgroup.html
     Material & Price ............. material-price.html
     Labor Rate ................... labor-rate.html
   Price Analysis
     Material Breakdown ........... material-breakdown.html  → material-breakdown-detail.html
     Unit Price Analysis (AHS) .... unit-price-analysis.html → unit-price-analysis-detail.html
     Unit Price List .............. unit-price-list.html
   Project
     Project & Quotation .......... project.html → project-detail.html
       (tab: Information, Work Items/BOQ, Recap, Quotation, Revision History)
     Report ....................... report.html
   User Access
     Permission ................... permission.html
     Role ......................... role.html → role-permission.html (Set Permission)
     User ......................... user.html
   System
     Setting ...................... setting.html
     Audit Trail & Log ............ audit-trail.html
   Lain-lain
     Login ........................ index.html
     Upload Excel (preview) ....... upload-preview.html
       (Status & Message di kolom paling kiri, baris Error di atas, Submit non-aktif
        bila masih ada Error, tombol maroon "Download Error Excel")

3. ASET
   assets/vendor/bootstrap.min.css, bootstrap.bundle.min.js  — Bootstrap 5.3 (lokal)
   assets/css/rab.css        — design system: token warna/tipografi dari template
                                Access Central v2.1 + override variabel Bootstrap,
                                layout shell, tabel, modal, toast, login, responsif, print
   assets/js/rab-core.js     — helper umum (format angka/rupiah/terbilang, ikon SVG,
                                storage, toast, modal, form + validasi, engine tabel,
                                export CSV/Excel, badge status)
   assets/js/rab-data.js     — data contoh (role, permission, user, master referensi,
                                material, upah, breakdown, AHS, proyek/BOQ, revisi,
                                setting, audit trail) mengikuti Data_Sample.xlsx
   assets/js/rab-layout.js   — sidebar/topbar, struktur menu, hak akses per role,
                                notifikasi, profil, tema terang/gelap, guard halaman

4. CATATAN PROTOTIPE
   - Data disimpan di localStorage browser (key: rab_db_v1). Tambah/ubah/hapus akan
     tersimpan di browser Anda. Untuk mengembalikan data awal: menu profil (pojok kanan
     atas) → "Reset Data Demo", atau hapus key rab_db_v1 dari DevTools.
   - Tema tersimpan di localStorage (rab_theme); sesi login di sessionStorage
     (rab_session, rab_role) sehingga tertutup saat tab ditutup.
   - Role switcher pada topbar dipakai untuk mendemokan bab "Perbedaan Tampilan Antar
     Role" pada FSD: menu, tombol aksi, kolom margin/HPP, serta approval mengikuti
     matriks permission di rab-data.js (DB.ROLE_PERM).
   - Seluruh perhitungan (breakdown, AHS, BOQ, rekap, PPN, diskon, terbilang) dihitung
     di sisi klien hanya untuk demo tampilan. Implementasi sebenarnya mengikuti TSD:
     C# .NET 10 MVC + BLL/DTO + SQL Server Express 2022 (USP_*, VW_*, UDF_*).

5. RESPONSIF
   > 1080px  : tampilan penuh (sidebar 242px + konten)
   960–1080  : grid menyusut, toolbar membungkus
   < 960px   : sidebar disembunyikan (tombol burger + backdrop), form menjadi 1 kolom,
               tabel dapat digeser horizontal, kartu menjadi 1 kolom.
