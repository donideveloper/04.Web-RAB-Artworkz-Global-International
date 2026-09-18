==========================================================
  WEB RAB — PROTOTIPE HTML (CLICKABLE DEMO)  —  revisi 6
  Mengacu pada FSD Web RAB v2.3 & template HTML "Access Central v2.1"
==========================================================

0. PERUBAHAN PADA REVISI 6 (feedback putaran 4 — poin P-34 s.d. P-40)
   P-34  Menu "Bahan" dinamai "Material".
         Berubah: sidebar (assets/js/rab-layout.js), judul & breadcrumb halaman,
         judul tabel, tombol Add Material, label Kode/Nama Material, serta nama
         menu pada master Permission (TB_M_PERMISSION). Nama teknis TIDAK
         berubah: kunci menu material-price, berkas material-price.html, dan
         rencana tabel TB_M_MATERIAL.
   P-35  Menu "Upah" dinamai "Upah Pekerja" (kunci menu labor-rate tetap).
   P-36  Ikon aksi "Open" pada kolom Actions diganti dari tanda panah kecil
         menjadi lambang buka-halaman, dengan keterangan "Buka Halaman Detail".
         Berlaku serentak di seluruh menu melalui ACT_META pada rab-core.js.
   P-37  SELURUH dropdown menjadi searchable dropdown (kendali SSEL pada
         assets/js/rab-core.js + gaya .ssel pada assets/css/rab.css):
         form Add/Edit, baris filter kolom tabel, dan pemilih pada halaman
         Report. Kotak pencarian muncul otomatis bila pilihan lebih dari 5.
         Mendukung papan ketik: panah atas/bawah, Enter, dan Esc.
         Catatan teknis: elemen <select> aslinya tetap ada (disembunyikan),
         sehingga pembacaan nilai, validasi, dan pemuatan ulang pilihan
         bertingkat (contoh Brand & Supplier pada menu Material) tidak berubah.
         Pada implementasi .NET nanti, kendali ini setara dengan Select2 /
         TomSelect — cukup ganti satu berkas, halaman tidak perlu disentuh.
   P-38  Klik pada baris tabel TIDAK lagi membuka halaman detail. Perpindahan
         ke detail hanya melalui tombol aksi "Buka Halaman Detail".
         Terpengaruh: Project & Quotation, Material Breakdown, Unit Price
         Analysis. Baris kini dapat disorot dan disalin tanpa berpindah halaman.
   P-39  Menu baru "Matrix Akses Menu" (role-matrix.html) pada kelompok User
         Access: matriks menu x role, hanya-baca, dengan dua tampilan (ringkas
         berupa ikon tingkat akses n/m, dan rinci berupa daftar nama fitur),
         tombol Download Excel, dan Print untuk lampiran SRS/UAT.
         Pencocokan menu dengan hak akses tidak lagi menebak dari nama menu,
         melainkan memakai kolom kunci baru p.key pada DB.PERMISSIONS
         (TB_M_PERMISSION.MENU_KEY). Kunci yang sama dipakai sidebar, penjaga
         halaman, Role - Set Permission, dan matriks ini.
   P-40  Kartu ringkasan status pada Dashboard dan Project & Quotation kembali
         konsisten dengan kolom Status:
         a. Penyebab: data contoh revisi lama masih tersimpan pada localStorage
            dengan istilah status lama (Sent/Won/Lost), sehingga kartu Submit,
            Succeed, dan Failed terbaca 0. Kunci penyimpanan kini bernomor
            revisi (rab_db_v6) dan kunci lama dihapus saat halaman dibuka.
         b. Pengaman tambahan: normPrjStatus() menyeragamkan nilai status apa
            pun (termasuk Sent/Won/Lost) sebelum dihitung dan sebelum
            ditampilkan pada kolom Status.
         c. Kartu digambar ulang setiap tabel berubah (cfg.onDraw), sehingga
            setelah aksi Submit/Succeed/Failed angkanya ikut berubah.
         d. Kartu dapat diklik untuk menyaring kolom Status; kartu Dashboard
            menuju project.html?status=<status>.

   P-41  Jendela Detail pada Unit Price List (dan Unit Price Analysis) dibuat
         informatif. Sebelumnya hanya tujuh baris keterangan, sehingga tidak
         menjawab pertanyaan utama estimator: "harga ini tersusun dari apa".
         Isi baru (fungsi ahsDetailHTML pada assets/js/rab-core.js, dipakai
         bersama oleh kedua menu supaya isinya selalu sama):
         a. Harga Satuan tersimpan, satuan, status, penanda Perlu Ditinjau.
         b. Harga Pokok (D) dan Margin (E).
         c. Batang komposisi biaya A / B / C / Margin beserta persentasenya.
         d. Tabel komponen A (Upah) dan B (Bahan) lengkap dengan koefisien,
            harga satuan, dan jumlah per baris; tabel C (Biaya Lain).
         e. Rekap D, E, F dengan rumus F = (A + B + C) x (1 + Margin).
         f. Keterkaitan: Material Breakdown rujukan, dan daftar baris BOQ
            project yang memakai kode AHS ini.
         Bila rincian komponen belum ada, D dan E tetap dihitung mundur dari
         Harga Satuan dan Margin, disertai keterangan.
   P-42  Aksi "Buka Halaman Detail" ditambahkan pada Unit Price List, menuju
         halaman rincian AHS (unit-price-analysis-detail.html?kode=..&from=upl).
         Tombol Back mengikuti asal halaman. Agar role yang hanya berhak pada
         Unit Price List tetap dapat membacanya, penjaga halaman pada
         rab-layout.js kini mengenal atribut data-altperm pada <body>.
   P-43  Pemeriksaan keterpaduan harga. Jendela Detail membandingkan hasil
         hitung komponen dengan kolom Harga Satuan yang tersimpan; bila selisih
         di atas 0,5% ditampilkan peringatan beserta nilai selisihnya dan
         langkah perbaikannya (Price Simulation lalu Save AHS).
         Temuan pada data contoh: AHS WD.2 tersimpan Rp 80.529.700 sedangkan
         susunan komponennya menghasilkan Rp 18.097.241 (selisih 77,53%).
         Angka tersimpan TIDAK diubah karena dipakai pada BOQ dan quotation
         project contoh; yang ditambahkan adalah peringatannya.
   P-44  Rincian contoh pada halaman AHS dibuat konsisten. Bila satu AHS belum
         memiliki komponen, prototipe menyalin susunan WD.2 sebagai contoh;
         kini seluruh koefisien dan biaya tetap diskalakan agar
         D x (1 + Margin) tepat sama dengan Harga Satuan yang terdaftar, dan
         diberi keterangan bahwa isinya masih contoh.

   P-45  Menu "Kode Kategori" dinamai "Kategori".
   P-46  Menu "Kelompok Breakdown" dinamai "Kelompok Barang" (judul halaman
         tidak lagi memakai embel-embel "(Item Barang)" karena sudah jelas).
         Pada kedua poin di atas yang berubah hanya tulisan di layar: sidebar,
         judul & breadcrumb, judul tabel, tombol Add, dan rujukan silang pada
         layar lain serta keterangan tombol (i). Kunci menu
         (reference-category, reference-partgroup), nama berkas, dan rencana
         nama tabel (TB_M_CATEGORY, TB_M_BREAKDOWN_GROUP) TIDAK berubah.
         Catatan: tulisan "sheet KODE-Kategori" pada keterangan sumber data
         sengaja dipertahankan karena itu nama sheet pada Data_Sample.xlsx.

   P-47  Ikon pada kolom Actions menu Kategori disamakan. Sebelumnya "Lihat
         Type" memakai ikon lapisan dan "Lihat Specification" memakai ikon
         daftar, sehingga dua aksi yang maksudnya sama (membuka tingkat
         berikutnya) terlihat berbeda. Keduanya kini memakai ikon yang sama
         dengan aksi Open, yaitu ikon buka-halaman; yang membedakan hanya
         keterangan tombol saat kursor diarahkan ("Lihat Type" dan "Lihat
         Specification"). Diubah pada ACT_META di assets/js/rab-core.js,
         sehingga berlaku serentak. Keterangan pada banner peran, deskripsi
         tabel, dan tombol (i) ikut disesuaikan.

   P-48  Cascading penuh pada form Add/Edit Material.
         Sebelumnya hanya Brand dan Supplier yang dimuat ulang; mengganti
         Category tidak mengubah isi Type, dan Specification masih berupa
         daftar angka tetap 00..08 yang tidak berhubungan dengan master.
         Sekarang rantainya: Category -> Type -> Specification -> Brand &
         Supplier, seluruhnya dibaca dari master Kategori (DB.TYPE, DB.SPEC).
         Bila satu Type belum memiliki spesifikasi terdaftar, disediakan satu
         pilihan "00 - Tanpa spesifikasi" agar kode tetap dapat dibentuk.
         Ikutan yang diperbaiki pada poin yang sama:
         a. Master Kategori dilengkapi. Data contoh sebelumnya hanya memuat
            Type untuk ACP, ACR, dan ACC, padahal material memakai MPL, HPL,
            VNR, CAT, dan GYP - sehingga cascading menghasilkan daftar kosong.
            Ditambahkan Type MPL.01, HPL.01, VNR.01, CAT.02, GYP.01 dan
            Specification MPL.01.09/12/18 serta ACR.01.03, ACR.02.03.
         b. Form Edit tidak lagi merusak kode. Kode material disimpan sebagai
            satu kolom KODE, sedangkan formnya memakai lima dropdown segmen
            yang sebelumnya TIDAK pernah diisi dari kode tersimpan; membuka
            Edit selalu menampilkan pilihan pertama, dan menekan Save akan
            menimpa kode material menjadi ACP.01.01.SV.00. Kini kode dipecah
            lebih dahulu menjadi lima segmen.
         c. Waste tidak lagi menyusut. Nilai disimpan sebagai pecahan (0,08)
            tetapi diisi dalam persen (8); tanpa penyesuaian, setiap Edit yang
            disimpan membuat nilainya menjadi seperseratus.
         d. Saat form dibuka, nilai tersimpan yang belum terdaftar pada master
            tidak diganti diam-diam, melainkan tetap ditampilkan dengan
            keterangan "(tidak terdaftar pada master)" supaya ketidakcocokan
            datanya terlihat.
   P-49  Lima segmen pembentuk kode (Category, Type, Specification, Brand,
         Varian) kini berada dalam SATU baris rapat berlatar panel, mengikuti
         urutan kodenya. Sebelumnya form dua kolom membuat Varian terlempar ke
         baris berikutnya sehingga jauh dari Specification. Ditambahkan
         penanda {seg:true} pada formHTML (assets/js/rab-core.js) dan gaya
         .seg-row/.seg-grid.
         Catatan: sempat dicoba lima kolom sebaris, tetapi isi dropdown jadi
         terpotong ("ACP - Alu..."). Lebar kolom dikembalikan menjadi DUA
         seperti bagian form lainnya; yang merapatkan Varian ke Specification
         adalah keterangan bantuan yang dipendekkan, bukan penyempitan kolom.
         Susunannya kini: Category | Type, Specification | Brand, Varian.
         Pada layar sempit menjadi satu kolom.
   P-50  Tombol Esc pada searchable dropdown hanya menutup panel pilihannya,
         tidak lagi ikut menutup jendela Add/Edit beserta isian yang sudah
         diketik. Penangan papan ketik dipindah ke tahap capture dan
         menghentikan perambatan kejadian (berlaku juga untuk Enter, agar
         memilih pilihan tidak ikut menekan tombol Save).

   P-51  Ikon Edit (pensil) disamakan dengan menu Material. Sebelumnya menu
         Material Breakdown, Unit Price Analysis, Unit Price List, dan
         Project & Quotation hanya memiliki ikon buka-halaman, sehingga
         mengubah keterangan kepala data (nama, satuan, kelompok, status)
         harus lewat halaman detail. Kini keduanya tersedia berdampingan:
         pensil untuk kepala data melalui jendela, ikon buka-halaman untuk
         isi rinciannya.
         a. Material Breakdown, Unit Price Analysis, Project & Quotation:
            aksi 'edit' ditambahkan pada daftar Actions.
         b. Unit Price List: menu ini bersifat hanya-baca (PRM-007 hanya
            memiliki fitur View dan Export), jadi tombol Edit di sana TIDAK
            membuka hak sunting baru. Ditambahkan kemampuan baru a.permPage
            pada rowActions (assets/js/rab-core.js) sehingga satu aksi dapat
            diuji terhadap hak akses MENU LAIN — di sini terhadap Unit Price
            Analysis, pemilik data yang sebenarnya. Hasilnya tombol pensil
            hanya muncul bagi ADM, SPV, dan EST; bagi PRC, DIR, dan MGR tidak
            tampil. Matrix Akses Menu tetap sesuai kenyataan.
         c. Margin tidak lagi menyusut. Sama seperti kolom Waste pada menu
            Material (P-48c), Margin disimpan sebagai pecahan (0,15) tetapi
            diisi dalam persen (15); tanpa penyesuaian saat form dibuka,
            setiap Edit yang disimpan membuat nilainya seperseratus.
            Diperbaiki pada Unit Price Analysis dan Unit Price List.

   P-52  Approve dan Reject dikeluarkan dari kolom Actions.
         Alasannya bukan sekadar kerapian: keputusan menyetujui atau menolak
         menuntut verifikator membaca lebih dahulu isi yang diputuskan, dan
         isi itu hanya terlihat di halaman detail. Menaruh tombolnya juga di
         daftar membuat keputusan dapat diambil tanpa pernah membuka rincian.
         a. Material Breakdown: aksi approve dan reject dihapus dari kolom
            Actions. Tombol Approve dan Reject sudah tersedia pada kepala
            halaman material-breakdown-detail.html, jadi tidak ada fungsi yang
            hilang - hanya pintu masuknya yang dipusatkan.
         b. Project & Quotation: penetapan Succeed dan Failed - padanan
            Approve dan Reject pada alur penawaran - juga dikeluarkan dari
            kolom Actions. Keduanya tetap ada pada kepala halaman
            project-detail.html bersama "Kembalikan ke Draft".
         c. Submit sempat dibiarkan di kolom Actions, lalu ikut dikeluarkan
            pada P-58.
         d. Keterangan di bawah judul tabel kedua menu diberi kalimat yang
            menunjukkan di mana keputusan itu kini dilakukan.

   P-53  Kolom Status pada form Add/Edit tidak lagi berupa dropdown.
         a. Menu Material: TIDAK ada perubahan - status di sana memang sudah
            berupa switch Aktif / Non Aktif sejak rev-5 (P-29), sama persis
            dengan menu Brand. Bila di layar masih tampak dropdown, berkas
            yang terbuka bukan dari folder web-rab-rev6.
         b. Unit Price Analysis dan Project & Quotation: statusnya bukan
            Aktif/Non Aktif melainkan status ALUR dengan lebih dari dua
            keadaan (Draft, Menunggu Verifikasi, Disetujui / Draft, Submit,
            Succeed, Failed), sehingga tidak muat pada switch dua keadaan.
            Yang dilakukan adalah memisahkan dua hal yang memang berbeda:
              - Status  : switch Aktif / Non Aktif, sama persis dengan Brand.
                          Menentukan data masih dipakai atau tidak. Kolom baru
                          AKTIF pada tabel, bawaannya Aktif.
              - Status Alur : ditampilkan sebagai kotak yang TIDAK dapat
                          diketik. Nilainya hanya berubah lewat tombol Submit,
                          Approve, Reject, Succeed, dan Failed pada halaman
                          detail (P-52), jadi memang tidak boleh dipilih
                          tangan - itu pula sebabnya dropdown lama keliru.
            Berlaku juga pada form Edit AHS yang dibuka dari Unit Price List.
         c. Kolom Status pada tabel menampilkan badge Non Aktif di samping
            status alur bila baris tersebut dimatikan.
         d. Material Breakdown ikut diubah dengan pola yang sama. Daftar lama
            di sana mencampur dua hal berbeda dalam satu kolom: status alur
            (Draft, Menunggu Verifikasi, Disetujui, Ditolak) dengan keadaan
            hidup-mati data (Nonaktif). Keduanya kini terpisah, dan data lama
            yang berstatus "Nonaktif" otomatis dipindahkan ke switch saat form
            dibuka. Pilihan Nonaktif dihapus dari penyaring kolom Status.

   P-54  Aksi Edit dihapus dari menu Unit Price List (membatalkan P-51b).
         Menu ini adalah daftar rujukan harian yang bersifat hanya-baca;
         penyuntingan AHS tetap pada menu Unit Price Analysis. Kolom Actions
         di sana kini tinggal dua: buka-halaman dan lihat detail.
         Ikut dibersihkan: form kepala AHS yang sempat dipasang di berkas ini,
         serta kemampuan a.permPage pada rowActions (assets/js/rab-core.js)
         yang dibuat khusus untuk keperluan itu - keduanya tidak lagi terpakai,
         sehingga rowActions kembali ke bentuk semula.

   P-55  Kelompok pekerjaan pada BOQ kini berasal dari master Work Group.
         Masalah sebelumnya: judul kelompok pada BOQ hanyalah teks bebas, dan
         dropdown "Kelompok Pekerjaan" pada Add Item membacanya dari baris
         judul yang KEBETULAN sudah ada pada BOQ project itu sendiri. Akibatnya
         kelompok baru tidak dapat dibuat sama sekali, isinya berbeda-beda tiap
         project, dan satu salah ketik ikut menjadi pilihan permanen. Padahal
         master Work Group (TB_M_WORKGROUP) sudah ada dan sudah dipakai dengan
         benar oleh menu Unit Price Analysis - jadi dua tempat yang membicarakan
         hal yang sama bersumber pada data yang berbeda.
         a. Dropdown pada Add Item membaca judul kelompok BOQ yang sah, dan
            seluruh judul itu kini berasal dari master.
         b. Tombol baru "Add Work Group" pada kepala tabel BOQ: memilih satu
            Work Group dari master, lalu judul kelompok beserta baris
            subtotalnya dibuatkan. Kelompok yang sudah dipakai tidak
            ditawarkan lagi.
         c. Nomor romawi dihitung ulang otomatis (renumberBOQ) sehingga
            penambahan atau penghapusan kelompok tidak meninggalkan nomor
            yang bolong.
         d. Baris judul kelompok menyimpan kode masternya pada kolom baru WG.
         e. Data contoh diselaraskan. BOQ sebelumnya memakai "PEKERJAAN
            PARTISI & PLAFON" yang tidak ada pada master - master memisahkan
            Pekerjaan Partisi, Pekerjaan Plafon, dan Pekerjaan Wallpanel.
            Kelompok itu dipecah menjadi tiga sesuai master, sehingga BOQ
            contoh kini memiliki enam kelompok (I s.d. VI). Nilai total
            penawaran TIDAK berubah, hanya pengelompokan subtotalnya.
            Bila di lapangan Partisi dan Plafon memang selalu digabung dalam
            satu kelompok penawaran, yang perlu diubah adalah masternya
            (menu Reference > Work Group), bukan BOQ-nya.
   P-56  Menu "Kelompok Barang" dikembalikan menjadi "Kelompok Breakdown"
         (membatalkan P-46).
   P-57  Label dropdown memakai nama menu sumbernya, supaya pengguna langsung
         tahu daftar itu dikelola di menu yang mana:
         a. Add Item pada BOQ: "Kelompok Pekerjaan" menjadi "Work Group".
         b. Add Row pada Material Breakdown: "Kelompok" menjadi
            "Kelompok Breakdown".
         Keduanya diberi keterangan bantuan yang menyebut letak menunya.

   P-58  Ikon Submit ikut dikeluarkan dari kolom Actions pada Material
         Breakdown dan Project & Quotation, melanjutkan P-52. Tombolnya sudah
         tersedia pada kepala halaman detail masing-masing ("Submit for
         Verification" dan "Submit"), jadi tidak ada fungsi yang hilang.
         Hasil akhirnya lebih bersih daripada P-52: kolom Actions kini murni
         berisi navigasi dan pengelolaan baris (buka-halaman, lihat, sunting,
         duplikat, hapus), sedangkan SELURUH perpindahan status dilakukan di
         halaman detail, tempat isi yang bersangkutan terlihat. Kelima menu
         utama kini memiliki susunan Actions yang seragam.
         Keterangan pada deskripsi tabel dan bantuan field Status Alur ikut
         disesuaikan agar tidak lagi menyebut "tombol Submit pada daftar".

   P-59  Jarak antara kartu ringkasan dengan isi di bawahnya diperbaiki pada
         Dashboard dan Project & Quotation. Penyebabnya gutter vertikal
         Bootstrap: setiap .row memiliki margin-top negatif sebesar gutter-nya
         (16 px pada g-3), sehingga jarak yang diberikan baris di atasnya ikut
         termakan dan kedua baris tampak menempel. Kelas mb-4 dipasang pada
         baris kartu sehingga jarak bersihnya menjadi 24 px, sama pada kedua
         halaman.

   P-60  Ikon View dihapus dari kolom Actions; fungsinya dipindahkan menjadi
         TAUTAN pada kolom kode di seluruh menu yang memiliki tabel data.
         Alasannya: kode adalah hal pertama yang dibaca dan ditunjuk pengguna,
         sehingga lebih wajar menjadi jalan masuk ke keterangan barisnya
         daripada satu ikon mata di ujung kanan layar. Kolom Actions pun
         menyusut satu ikon di semua menu.
         Dikerjakan terpusat pada assets/js/rab-core.js sehingga berlaku
         serentak tanpa menyentuh berkas halaman satu per satu:
         a. linkColumn(cfg) menentukan kolom yang dijadikan tautan, yaitu kolom
            kunci (cfg.idKey); bila kunci itu tidak muncul sebagai kolom,
            dipakai kolom pertama - contohnya menu User yang kuncinya ID
            sedangkan kolomnya Nama Pengguna.
         b. drawTable membungkus isi kolom itu dengan tautan yang membuka
            jendela Detail.
         c. rowActions melepas aksi 'view' pada menu yang sudah punya tautan.
            Menu yang memang tidak memiliki jendela Detail (contoh Setting)
            tidak berubah sama sekali.
         Terpengaruh 20 tabel: Material, Upah Pekerja, Material Breakdown,
         Unit Price Analysis, Unit Price List, Project & Quotation, seluruh
         sembilan menu Reference termasuk ketiga tab pada Kategori, Permission,
         Role, User, dan Audit Trail.

0A. PERUBAHAN PADA REVISI 5 (feedback putaran 2 & 3 — poin P-20 s.d. P-33)
   P-20  Ikon informasi (i) memakai warna netral abu muda (assets/css/rab.css).
   P-21  Kolom Actions disederhanakan: satu ikon navigasi pada Category (buka
         Type) dan satu pada Type (buka Specification).
   P-22  Tab Mapping Brand & Mapping Supplier DIHAPUS. Pemetaan menjadi dua
         pilihan (multi) pada form Specification + dua kolom pada tabel index.
         Rencana tabel: TB_M_SPEC_BRAND_D dan TB_M_SPEC_SUPPLIER_D.
         Pilihan Brand/Supplier pada menu Bahan dibatasi oleh pemetaan ini.
   P-23  Istilah "Labor Rate" pada layar menjadi "Upah Kerja" / "Upah".
   P-24  Tombol "Print / Download" menjadi "Download"; pilihan format keluaran
         tinggal PDF dan Excel (cetak dilakukan dari berkas PDF).
   P-25  Tombol Print Quotation pada kepala halaman detail project dihapus;
         pencetakan hanya dari tab Quotation.
   P-26  Jendela Print Quotation mendapat bagian "Lampiran": Lampiran
         Spesifikasi dan Lampiran Gambar Kerja. Sumber gambar kerja = berkas
         berjenis "Gambar Kerja" pada kartu Lampiran (tab Information).
   P-27  Urutan submenu Reference: Brand, Supplier, Kode Kategori, Client, dst.
   P-28  Istilah "Bagian Benda Kerja" menjadi "Item Barang".
   P-29  Seluruh field Status Aktif/Non Aktif memakai switch (tipe kendali baru
         'switch' pada formHTML di assets/js/rab-core.js). Nilai tersimpan tetap
         "Aktif"/"Nonaktif". Filter tabel tetap dropdown (3 keadaan).
         Pengecualian: menu User memiliki 3 keadaan (Aktif/Nonaktif/Terkunci)
         sehingga tetap memakai dropdown.
   P-30  Menu "Category, Type & Spec" dinamai "Kode Kategori".
   P-31  Menu Bahan: kolom Keterangan ditambahkan pada Add, Edit, Detail, dan
         tabel index (sumber: sheet Bahan & Upah kolom KETERANGAN).
   P-32  Menu "Material & Price" dinamai "Bahan".
   P-33  Menu "Labor Rate" dinamai "Upah".

   Nama berkas, kunci menu, hak akses, dan nama tabel TIDAK berubah.

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
         (tab: Category / Type / Specification / Mapping Brand / Mapping Supplier)
       Brand ...................... reference-brand.html
       Supplier ................... reference-supplier.html
       Client ..................... reference-client.html
       Unit of Measure ............ reference-uom.html
       Finishing .................. reference-finishing.html
       Building Type .............. reference-building.html
       Work Group ................. reference-workgroup.html
       Kelompok Breakdown ......... reference-partgroup.html   (BARU rev-3)
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
   assets/js/rab-info.js     — keterangan setiap modul untuk tombol (i): sumber
                                sheet Data_Sample.xlsx, menu sumber data, rumus,
                                istilah, alur status, dan role yang berhak
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
