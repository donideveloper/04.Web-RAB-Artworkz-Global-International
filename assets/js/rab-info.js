/* ============================================================
   Web RAB — Module Info (rev-4)
   Sumber tunggal keterangan setiap halaman: berasal dari sheet mana pada
   Data_Sample.xlsx, mengambil data dari menu apa, rumus perhitungannya,
   dan role mana yang boleh melakukan aksi.
   Dipakai oleh tombol (i) di samping judul halaman pada topbar.
   ============================================================ */
'use strict';

const MODULE_INFO = {

/* ---------------- MAIN ---------------- */
dashboard: {
  ringkas:'Ringkasan angka berjalan: jumlah dan nilai penawaran per status, material yang harganya kedaluwarsa, serta AHS yang perlu ditinjau ulang.',
  sheet:[['BOQ','Nilai penawaran per project untuk kartu statistik dan grafik.'],
         ['Bahan & Upah','Dasar penghitungan jumlah material berstatus Kedaluwarsa.']],
  menu:[['Project & Quotation','Jumlah dan nilai penawaran per status Draft / Submit / Succeed / Failed.'],
        ['Bahan','Kartu peringatan harga kedaluwarsa.'],
        ['Unit Price Analysis (AHS)','Kartu AHS perlu ditinjau ulang.']],
  formula:[['Win Rate','Jumlah project Succeed ÷ (Succeed + Failed) × 100%'],
           ['Nilai per status','SUM(NILAI_PENAWARAN) dikelompokkan berdasarkan STATUS']],
  roles:[['Semua role','Melihat dashboard sesuai hak akses menu yang dimilikinya.'],
         ['DIR, MGR','Melihat seluruh project perusahaan.'],
         ['EST','Hanya melihat project yang menjadi tanggung jawabnya.']]
},

/* ---------------- MASTER DATA REFERENSI ---------------- */
'reference-category': {
  ringkas:'Tiga tingkat penyusun kode material (Category → Type → Specification) beserta pemetaan Brand dan Supplier yang sah untuk setiap category.',
  sheet:[['KODE-Kategori','Kolom KATEGORI MATERIAL & KODE KATEGORI → tab Category; kolom TYPE / JENIS MATERIAL → tab Type; kolom SPESIFIKASI / UKURAN → tab Specification; kolom BRAND → tab Mapping Brand; kolom SUPLIER / VENDOR → tab Mapping Supplier.']],
  menu:[['Brand','Daftar brand yang dapat dipilih pada tab Mapping Brand.'],
        ['Supplier','Daftar supplier yang dapat dipilih pada tab Mapping Supplier.']],
  formula:[['Kode Material','KATEGORI . TYPE . SPEC . BRAND . VARIAN — contoh ACP.01.01.SV.00'],
           ['Jumlah Type','COUNT(TB_M_TYPE) untuk category bersangkutan'],
           ['Jumlah Material','COUNT(TB_M_MATERIAL) untuk category bersangkutan']],
  roles:[['PRC (Procurement)','Add, Edit, Delete, Import, Export seluruh tab termasuk mapping brand & supplier.'],
         ['ADM','Seluruh aksi.'],
         ['EST, SPV, MGR, DIR','Hanya melihat (read only).']],
  catatan:'Perpindahan antar tingkat memakai satu ikon yang sama pada kolom Actions, yaitu ikon buka-halaman: pada baris Category ia membuka Type, pada baris Type ia membuka Specification. Yang membedakan hanya keterangan tombolnya. Klik pada badan baris tidak berpindah halaman.'
},
'reference-brand': {
  ringkas:'Daftar merek material. Brand menjadi segmen ke-4 pada kode material.',
  sheet:[['KODE-Kategori','Kolom BRAND (kode singkat dan nama merek), contoh SV = SEVEN, BL = BLUM, TC = TACO.']],
  menu:[['Kategori — tab Mapping Brand','Menentukan brand ini boleh dipakai pada category apa saja.']],
  formula:[['Jumlah Material','COUNT(TB_M_MATERIAL) yang memakai brand bersangkutan']],
  roles:[['PRC, ADM','Add, Edit, Delete, Import, Export.'],['Role lain','Hanya melihat.']]
},
'reference-supplier': {
  ringkas:'Daftar pemasok material beserta kota, kontak, dan termin pembayaran.',
  sheet:[['KODE-Kategori','Kolom SUPLIER / VENDOR.']],
  menu:[['Kategori — tab Mapping Supplier','Menentukan supplier ini memasok brand dan category apa saja.'],
        ['Bahan','Supplier utama setiap material dipilih dari daftar ini.']],
  formula:[['Supplier Utama','Ditandai pada tab Mapping Supplier, dipakai sebagai nilai awal saat material baru dibuat.']],
  roles:[['PRC, ADM','Add, Edit, Delete, Import, Export.'],['Role lain','Hanya melihat.']]
},
'reference-client': {
  ringkas:'Daftar pemberi kerja. Dipakai pada kepala dokumen penawaran.',
  sheet:[['BOQ','Bagian kepala dokumen: nama client, PIC, dan lokasi pekerjaan.']],
  menu:[['Project & Quotation','Client dipilih saat project dibuat.']],
  formula:[['—','Tidak ada perhitungan, murni data referensi.']],
  roles:[['PRC, ADM','Add, Edit, Delete.'],['EST','Hanya melihat saat memilih client pada project.']]
},
'reference-uom': {
  ringkas:'Satuan pengukuran yang dipakai seluruh modul: satuan pakai material, satuan upah, dan satuan item pekerjaan.',
  sheet:[['Bahan & Upah','Kolom SATUAN (Lbr, unit, set, pcs, m2, oh, kg).'],
         ['BOQ','Kolom SATUAN pada item pekerjaan.']],
  menu:[['Bahan','Satuan Pakai dan Satuan Beli.'],
        ['Upah','Satuan upah (oh untuk harian, m2/m1/unit untuk borongan).']],
  formula:[['Jenis Satuan','Pengelompokan Luas / Panjang / Jumlah / Tenaga / Berat / Volume untuk validasi konversi.']],
  roles:[['PRC, ADM','Add, Edit, Delete.'],['Role lain','Hanya melihat.']]
},
'reference-finishing': {
  ringkas:'Jenis lapisan akhir benda kerja (HPL, Duco, Veneer, Polosan). Menjadi pembeda varian pada Material Breakdown dan AHS: satu benda kerja yang sama dengan finishing berbeda menghasilkan harga satuan berbeda.',
  sheet:[['BD-WD (240x60x320)','Judul lembar breakdown menyebut jenis finishing, contoh POLOSAN.'],
         ['Analisa Harga Sat (AHS)','Uraian pekerjaan memuat finishing, contoh "Wardrobe — HPL" dan "Wardrobe — Polosan".'],
         ['Bahan & Upah','Baris UP.11 s.d. UP.16 adalah upah borongan finishing per jenis.']],
  menu:[['Material Breakdown','Field Jenis Finishing pada header breakdown; tombol Duplicate membentuk varian finishing baru.'],
        ['Unit Price Analysis (AHS)','Nama pekerjaan mengikuti finishing breakdown rujukannya.']],
  formula:[['Dampak ke harga','Finishing menentukan material pelapis pada blok B dan upah borongan finishing pada blok A AHS.']],
  roles:[['PRC, ADM','Add, Edit, Delete.'],['EST, SPV','Memilih finishing saat menyusun breakdown.']],
  catatan:'Finishing bukan transaksi tersendiri. Ia dipakai sebagai penanda varian agar satu benda kerja dapat memiliki beberapa harga satuan sesuai mutu lapisan akhirnya.'
},
'reference-building': {
  ringkas:'Jenis bangunan client (kantor, hotel, apartemen, retail, rumah sakit, residensial). Dipakai sebagai pengelompokan laporan.',
  sheet:[['BOQ','Keterangan jenis pekerjaan pada kepala dokumen penawaran.']],
  menu:[['Project & Quotation','Field Jenis Bangunan.'],['Report','Laporan penawaran per jenis bangunan dan win rate.']],
  formula:[['Win Rate per Jenis','Jumlah Succeed ÷ jumlah penawaran pada jenis bangunan tersebut × 100%']],
  roles:[['PRC, ADM','Add, Edit, Delete.'],['Role lain','Hanya melihat.']]
},
'reference-workgroup': {
  ringkas:'Kelompok besar pekerjaan (furniture, partisi, plafon, lantai, wallpanel, elektrikal, persiapan). Menjadi pengelompokan AHS dan judul kelompok pada BOQ.',
  sheet:[['BOQ','Baris judul kelompok bernomor romawi I, II, III, IV.'],
         ['Daftar Harga Satuan Pekerjaan','Pengurutan daftar harga satuan per kelompok pekerjaan.']],
  menu:[['Unit Price Analysis (AHS)','Field Kelompok Pekerjaan.'],['Project & Quotation','Judul kelompok dan subtotal per kelompok pada BOQ.']],
  formula:[['Subtotal Kelompok','SUM(VOLUME × HARGA_SATUAN) seluruh item pada kelompok tersebut']],
  roles:[['PRC, ADM','Add, Edit, Delete.'],['EST','Memilih kelompok saat menyusun AHS dan BOQ.']]
},
'reference-partgroup': {
  ringkas:'Kelompok item barang. Inilah sumber isi dropdown "Kelompok" pada layar Material Breakdown — Add Row.',
  sheet:[['BD-WD (240x60x320)','Baris pengelompokan di dalam lembar breakdown: Body/Lambung, Pintu, Ambalan & Rak, Pelapis, Aksesoris, Laci.']],
  menu:[['Material Breakdown','Dropdown Kelompok pada form Add Row dan judul pengelompokan baris pada tabel detail.']],
  formula:[['Urutan Tampil','Baris breakdown diurutkan berdasarkan kolom Urutan, sehingga susunan pada layar sama dengan susunan pada lembar kerja Excel.']],
  roles:[['PRC, ADM','Add, Edit, Delete.'],['EST, SPV','Memakai daftar ini saat menyusun breakdown.']],
  catatan:'Tabel basis data: TB_M_BREAKDOWN_GROUP. Sebelum revisi ini, isi dropdown diambil dari baris yang sudah ada sehingga tidak dapat dikelola; kini dikelola melalui menu ini.'
},

/* ---------------- MASTER MATERIAL & UPAH ---------------- */
'material-price': {
  ringkas:'Daftar material beserta harga yang berlaku, satuan beli dan satuan pakai, faktor konversi, waste, dan supplier utama.',
  sheet:[['Bahan & Upah — blok B. MATERIAL','Kolom KODE, UPAH/MATERIAL (nama), SATUAN (satuan beli), HARGA SATUAN (harga beli), KETERANGAN (contoh "1 set = 2 bh rail" → faktor konversi), WASTE, SATUAN (satuan pakai), HARGA SATUAN (harga pakai hasil konversi), UPDATE (tanggal harga berlaku).'],
        ['KODE-Kategori','Pembentuk kode material: Category, Type, Spec, Brand.']],
  menu:[['Kategori','Tiga segmen pertama kode material.'],['Brand','Segmen ke-4 kode material.'],
        ['Supplier','Supplier utama material.'],['Unit of Measure','Satuan beli dan satuan pakai.'],
        ['Setting — SET-005','Batas umur harga (hari) penentu status Kedaluwarsa.']],
  formula:[['Harga Satuan Pakai','Harga Beli ÷ Faktor Konversi'],
           ['Volume Terpakai','Volume Bersih × (1 + Waste %)'],
           ['Harga Efektif ke AHS','Harga Satuan Pakai × (1 + Waste %)'],
           ['Status Harga','Belum Ada Harga bila harga kosong; Kedaluwarsa bila DATEDIFF(day, Berlaku Sejak, GETDATE()) > SET-005 (90 hari); selain itu Terkini.']],
  roles:[['PRC (Procurement)','Add, Edit, Delete, Add New Price, Import, Export — pemilik data harga.'],
         ['ADM','Seluruh aksi.'],
         ['SPV, MGR, DIR','Melihat dan Export.'],
         ['EST','Hanya melihat saat memilih material pada breakdown dan AHS.']],
  istilah:[['Satuan Beli','Satuan saat material dibeli dari supplier, contoh Lembar, Set, Kaleng.'],
           ['Satuan Pakai','Satuan saat material dihitung pada breakdown dan AHS, contoh m2, pcs, kg.'],
           ['Faktor Konversi','Berapa satuan pakai yang diperoleh dari 1 satuan beli. Contoh 1 lembar multiplek 122×244 cm = 2,9768 m2, maka faktor konversi 2,9768. Contoh lain 1 set rail laci = 2 batang, maka faktor konversi 2.'],
           ['Waste %','Persentase susut dan sisa potongan yang wajar. Contoh multiplek 8%: untuk kebutuhan bersih 10 m2 dibeli 10,8 m2.']]
},
'labor-rate': {
  ringkas:'Daftar tarif upah tenaga kerja. "Labor" adalah istilah untuk Upah Kerja pada lembar kerja perusahaan — bukan nama orang atau vendor, melainkan jenis pekerja dan tarifnya.',
  sheet:[['Bahan & Upah — blok A. UPAH KERJA','Baris UP.01 s.d. UP.16, kolom KODE, UPAH/MATERIAL (jenis pekerja atau jenis pekerjaan borongan), SATUAN, HARGA SATUAN, UPDATE.']],
  menu:[['Unit of Measure','Satuan oh (orang-hari) untuk upah harian; m2, m1, unit untuk upah borongan.'],
        ['Setting — SET-005','Batas umur tarif (hari) penentu status Kedaluwarsa.'],
        ['Unit Price Analysis (AHS)','Tarif ini menjadi harga satuan pada blok A — Upah Tenaga Kerja.']],
  formula:[['Jumlah Upah per Baris AHS','Koefisien × Tarif Berlaku'],
           ['Blok A pada AHS','SUM(Koefisien × Tarif) seluruh baris upah'],
           ['Status Tarif','Kedaluwarsa bila DATEDIFF(day, Berlaku Sejak, GETDATE()) > SET-005 (90 hari); selain itu Terkini.']],
  roles:[['PRC (Procurement)','Add, Edit, Delete, Add New Rate, Import, Export.'],
         ['SPV','Add, Edit, Add New Rate, Export.'],
         ['MGR','Edit tarif.'],
         ['EST, DIR','Hanya melihat.']],
  istilah:[['Labor / Upah Kerja','Biaya tenaga kerja, salah satu dari tiga komponen AHS: Upah (A), Bahan (B), Biaya Lain (C).'],
           ['Harian (oh)','Dihitung per orang per hari. 1 oh = 1 orang bekerja 1 hari. Contoh Tukang Kayu Rp 200.000/oh.'],
           ['Borongan','Dihitung per satuan hasil pekerjaan, contoh Finishing Duco Doff Rp 236.000/m2 — sudah termasuk tenaga dan alat.']],
  catatan:'Sejak revisi ini, Upah memiliki tombol Add New Rate dan Riwayat Tarif dengan cara kerja yang sama seperti Add New Price pada Bahan: tarif lama tidak ditimpa, melainkan ditutup masa berlakunya dan tarif baru dicatat dengan tanggal berlaku tersendiri.'
},

/* ---------------- PRICE ANALYSIS ---------------- */
'material-breakdown': {
  ringkas:'Rincian kebutuhan material untuk satu benda kerja, lengkap dengan ukuran tiap bagian. Hasil rekapitulasinya menjadi blok B (Bahan) pada AHS.',
  sheet:[['BD-WD (240x60x320)','Seluruh isi layar ini: kolom KODE, DESCRIPTION (item barang), P, L, JUMLAH, VOLUME, SATUAN, dan pengelompokan bagian.'],
         ['Bahan & Upah','Harga dan waste setiap material yang dipakai.']],
  menu:[['Bahan','Daftar material pada dropdown Material.'],
        ['Kelompok Breakdown','Isi dropdown Kelompok.'],
        ['Finishing','Jenis finishing pada header breakdown.'],
        ['Unit of Measure','Satuan setiap baris.']],
  formula:[['Volume per Baris','Bila P dan L diisi: P × L × Jumlah. Bila tidak: Jumlah (untuk material satuan pcs, unit, set).'],
           ['Volume + Waste','Volume × (1 + Waste %)'],
           ['Rekapitulasi per Material','SUM(Volume + Waste) seluruh baris dengan kode material sama'],
           ['Nilai Kebutuhan','Volume + Waste × Harga Satuan Pakai material'],
           ['Koefisien untuk AHS','(Volume + Waste) ÷ volume acuan benda kerja']],
  roles:[['EST (Estimator)','Add, Edit, Import, Export, dan Submit for Verification.'],
         ['SPV (Supervisor Estimasi)','Seluruh aksi Estimator ditambah Approve dan Reject.'],
         ['ADM','Seluruh aksi.'],
         ['MGR, DIR, PRC','Hanya melihat.']],
  istilah:[['Item Barang','Nama bagian fisik dari benda kerja yang sedang dirinci, contoh "Lambung samping kiri & kanan", "Daun pintu swing", "Backing belakang". Pada Excel kolom ini bernama DESCRIPTION.'],
           ['Kelompok','Pengelompokan item barang (Body, Pintu, Ambalan, Pelapis, Aksesoris, Laci) agar susunan baris mudah dibaca dan dijumlah per kelompok.']],
  alur:[['Draft','Dibuat dan disunting oleh Estimator. Belum boleh dipakai pada AHS.'],
        ['Menunggu Verifikasi','Estimator menekan Submit for Verification. Data terkunci dari penyuntingan.'],
        ['Disetujui','Supervisor Estimasi menekan Approve. Breakdown boleh ditarik ke AHS.'],
        ['Ditolak','Supervisor Estimasi menekan Reject disertai alasan; status kembali dapat disunting Estimator.']]
},
'unit-price-analysis': {
  ringkas:'Analisa Harga Satuan Pekerjaan (AHS): menyusun harga satu satuan pekerjaan dari komponen Upah (A), Bahan (B), Biaya Lain (C), lalu ditambah margin.',
  sheet:[['Analisa Harga Sat (AHS)','Susunan blok A, B, C beserta koefisien setiap komponen.'],
         ['AHS - PAKAI','Daftar AHS yang benar-benar dipakai pada penawaran berjalan.'],
         ['Daftar Harga Satuan Pekerjaan','Hasil akhir: kode, uraian, satuan, dan harga satuan pekerjaan.']],
  menu:[['Upah','Harga satuan baris pada blok A.'],
        ['Bahan','Harga satuan baris pada blok B.'],
        ['Material Breakdown','Sumber isi blok B melalui tombol Load from Breakdown.'],
        ['Work Group','Kelompok pekerjaan.'],
        ['Setting — SET-001','Margin standar 15%.']],
  formula:[['A — Upah','SUM(Koefisien × Tarif Upah)'],
           ['B — Bahan','SUM(Koefisien × Harga Satuan Pakai Material)'],
           ['C — Biaya Lain','Nilai tetap, atau persentase × (A + B) untuk jenis Persentase'],
           ['D','A + B + C'],['E — Margin','D × Margin %'],
           ['F — Harga Satuan Pekerjaan','D + E']],
  roles:[['EST','Add, Edit, Import, Export. Margin terkunci.'],
         ['SPV','Seluruh aksi Estimator ditambah Approve dan pengubahan margin.'],
         ['MGR','Melihat dan Export.'],['DIR','Melihat.'],['ADM','Seluruh aksi.']],
  tombol:[['Price Simulation','Membandingkan harga komponen yang tersimpan pada AHS ini dengan harga terkini pada menu Bahan dan Upah, lalu menampilkan selisihnya per baris dan dampaknya ke harga satuan. Bersifat simulasi — tidak mengubah data tersimpan sampai tombol Save AHS ditekan.'],
          ['Load from Breakdown','Mengisi blok B (Bahan) dari rekapitulasi kebutuhan material pada menu Material Breakdown yang dirujuk AHS ini. Koefisien tiap material diambil dari kolom Volume + Waste pada breakdown, sehingga tidak perlu mengetik ulang.']]
},
'unit-price-list': {
  ringkas:'Daftar harga satuan pekerjaan yang sudah disetujui, siap dipakai pada BOQ. Hanya tampilan; penyusunannya di menu Unit Price Analysis.',
  sheet:[['Daftar Harga Satuan Pekerjaan','Persis isi layar ini: NO, KODE, URAIAN PEKERJAAN, SATUAN, HARGA SATUAN.']],
  menu:[['Unit Price Analysis (AHS)','Sumber seluruh baris; hanya AHS berstatus Disetujui yang tampil.']],
  formula:[['Harga Satuan','Nilai F dari AHS yang bersangkutan (D + E).']],
  roles:[['Semua role','Melihat dan Export.'],['—','Tidak ada aksi ubah pada menu ini.']]
},

/* ---------------- PROJECT ---------------- */
project: {
  ringkas:'Transaksi penawaran: identitas project, BOQ, rekapitulasi, dokumen quotation, dan riwayat revisi.',
  sheet:[['BOQ','Seluruh isi modul: kepala dokumen quotation, kelompok pekerjaan, item, volume, harga satuan, PPN, dan nilai akhir.']],
  menu:[['Client','Pemberi kerja.'],['Building Type','Jenis bangunan.'],
        ['Unit Price List / AHS','Harga satuan setiap item BOQ.'],
        ['Setting','SET-001 margin, SET-002 jasa kontraktor, SET-003 PPN, SET-004 pembulatan, SET-006 pola nomor quotation, SET-007 masa berlaku.']],
  formula:[['Jumlah Harga Item','Volume × Harga Satuan'],
           ['Subtotal Kelompok','SUM(Jumlah Harga) item dalam kelompok'],
           ['Jumlah Total','SUM seluruh subtotal kelompok'],
           ['Setelah Diskon','Jumlah Total − Diskon'],
           ['PPN','Setelah Diskon × SET-003 (11%)'],
           ['Nilai Akhir','ROUND((Setelah Diskon + PPN) ÷ SET-004) × SET-004']],
  roles:[['EST (Estimator)','Membuat project, menyusun BOQ, dan menekan Submit.'],
         ['MGR (Manager Operasional)','Menyetujui penawaran, memberi diskon, serta menetapkan hasil Succeed atau Failed.'],
         ['DIR (Direktur)','Persetujuan akhir untuk diskon di atas batas kewenangan MGR dan nilai penawaran besar; dapat pula menetapkan Succeed atau Failed.'],
         ['SPV','Melihat, menyunting BOQ, Export, dan Print.'],
         ['ADM','Seluruh aksi.']],
  alur:[['Draft','Estimator menyusun BOQ dan rekapitulasi. Masih bebas disunting.'],
        ['Submit','Estimator menekan Submit setelah pemeriksaan kelengkapan bersih. Penawaran terkunci dan dikirim ke client. (Istilah sebelumnya: Sent.)'],
        ['Succeed','Manager atau Direktur menandai penawaran dimenangkan. (Istilah sebelumnya: Won.)'],
        ['Failed','Manager atau Direktur menandai penawaran tidak dimenangkan, disertai alasan. (Istilah sebelumnya: Lost.)']],
  catatan:'Aksi cetak dipindahkan dari tabel daftar ke dalam halaman detail project (tombol Print Quotation pada tab Quotation), agar dokumen yang dicetak selalu berasal dari revisi yang sedang dibuka.'
},
report: {
  ringkas:'Laporan penawaran, win rate, rekapitulasi biaya, dan pemakaian material.',
  sheet:[['BOQ','Nilai penawaran per project.'],['AHS - PAKAI','Pemakaian AHS pada penawaran.'],
         ['Bahan & Upah','Harga material untuk laporan pemakaian material.']],
  menu:[['Project & Quotation','Sumber utama seluruh laporan.'],['Building Type','Pengelompokan laporan per jenis bangunan.']],
  formula:[['Win Rate','Jumlah Succeed ÷ (Succeed + Failed) × 100%'],
           ['Nilai Succeed','SUM(NILAI_PENAWARAN) project berstatus Succeed']],
  roles:[['DIR, MGR','Seluruh laporan.'],['SPV, EST, PRC','Laporan sesuai lingkup kerjanya.']]
},

/* ---------------- USER ACCESS ---------------- */
permission: {
  ringkas:'Daftar menu aplikasi beserta fitur yang dapat diberikan kepada role.',
  sheet:[['—','Tidak berasal dari Data_Sample.xlsx; disusun dari struktur menu aplikasi pada FSD.']],
  menu:[['Role','Permission di sini dipasangkan ke role melalui layar Set Permission.']],
  formula:[['Hak Akses Efektif','Gabungan seluruh permission dari seluruh role yang dimiliki user.']],
  roles:[['ADM','Add, Edit, Delete, Import, Export.'],['Role lain','Tidak memiliki akses ke menu ini.']]
},
role: {
  ringkas:'Kelompok hak akses. Satu user boleh memiliki lebih dari satu role.',
  sheet:[['—','Tidak berasal dari Data_Sample.xlsx; disusun dari pembagian tugas pada SRS bab Role dan Pengguna Sistem.']],
  menu:[['Permission','Daftar fitur yang dicentang pada layar Set Permission.'],['User','Role dipasang ke user melalui checkbox Role.']],
  formula:[['—','Tidak ada perhitungan.']],
  roles:[['ADM','Seluruh aksi termasuk Set Permission.'],['Role lain','Tidak memiliki akses.']]
},
/* rev-6 poin 6 */
'role-matrix': {
  ringkas:'Tampilan hanya-baca yang menjawab pertanyaan "role mana boleh melakukan apa pada menu mana". Baris adalah menu, kolom adalah role, isi sel adalah fitur yang diizinkan.',
  sheet:[['—','Tidak berasal dari Data_Sample.xlsx; disusun dari pembagian tugas pada SRS bab Role dan Pengguna Sistem.']],
  menu:[['Permission','Daftar menu beserta fitur yang tersedia (baris matriks).'],
        ['Role','Daftar role aktif (kolom matriks).'],
        ['Role — Set Permission','Tempat mengubah isi matriks; halaman ini hanya menampilkan.']],
  formula:[['Isi Sel','Irisan antara fitur yang tersedia pada menu (TB_M_PERMISSION) dengan fitur yang diberikan kepada role (TB_M_ROLE_PERMISSION).'],
           ['Akses Penuh','Jumlah fitur diizinkan = jumlah fitur tersedia pada menu tersebut.'],
           ['Akses Sebagian','Sebagian fitur diizinkan, contoh hanya View dan Export.'],
           ['Tanpa Akses','Tidak ada satu pun fitur diizinkan; menu tidak muncul pada sidebar role tersebut.'],
           ['Hak Akses Efektif User','Gabungan seluruh kolom role yang dimiliki user tersebut.']],
  istilah:[['Menu','Satu layar aplikasi yang dapat dibuka, tercatat pada TB_M_PERMISSION beserta URL-nya.'],
           ['Fitur','Aksi yang dapat dilakukan pada satu menu: View, Add, Edit, Delete, Import, Export, Print, Approve, Discount, serta fitur khusus seperti Reset Password dan Unlock.'],
           ['Role','Kelompok hak akses; satu user boleh memiliki lebih dari satu role.']],
  tombol:[['Tampilkan Rinci / Ringkas','Beralih antara tampilan ikon tingkat akses dengan daftar nama fitur pada setiap sel.'],
          ['Download Excel','Mengekspor seluruh matriks menjadi satu berkas untuk dilampirkan pada dokumen SRS dan berita acara UAT.']],
  roles:[['ADM','Melihat dan mengekspor matriks, serta mengubahnya melalui Role — Set Permission.'],
         ['Role lain','Tidak memiliki akses ke menu ini.']]
},
user: {
  ringkas:'Daftar pengguna aplikasi beserta role, status akun, dan waktu login terakhir.',
  sheet:[['—','Tidak berasal dari Data_Sample.xlsx; data pengguna disiapkan saat implementasi.']],
  menu:[['Role','Pilihan role pada checkbox Role Pengguna.'],['Setting — SET-009, SET-010','Batas percobaan login gagal dan masa kedaluwarsa password.']],
  formula:[['Status Terkunci','Akun terkunci otomatis setelah percobaan login gagal mencapai SET-009 (5 kali).']],
  roles:[['ADM','Add, Edit, Delete, Reset Password, Unlock, Import, Export.'],['MGR','Hanya melihat.'],['Role lain','Tidak memiliki akses.']]
},

/* ---------------- SYSTEM ---------------- */
setting: {
  ringkas:'Parameter sistem yang dipakai seluruh modul perhitungan dan dokumen.',
  sheet:[['BOQ','Angka PPN, jasa kontraktor, dan pola nomor quotation diambil dari kepala dokumen pada lembar ini.']],
  menu:[['Seluruh modul perhitungan','Setting menjadi nilai awal margin, jasa, PPN, pembulatan, dan masa berlaku penawaran.']],
  formula:[['SET-001 Margin','Nilai awal margin pada AHS dan project.'],
           ['SET-003 PPN','Dipakai pada rekapitulasi: PPN = Setelah Diskon × SET-003.'],
           ['SET-004 Pembulatan','Nilai Akhir dibulatkan ke kelipatan nilai ini.'],
           ['SET-005 Batas Umur Harga','Penentu status Kedaluwarsa pada Bahan dan Upah: umur harga > nilai ini (90 hari) → Kedaluwarsa.'],
           ['SET-006 Pola Nomor','Pembentuk nomor quotation, contoh 013/QUO/INT/AGI/IX/26.']],
  roles:[['ADM','Edit seluruh parameter.'],['MGR','Edit parameter perhitungan.'],['DIR','Melihat.'],['Role lain','Tidak memiliki akses.']],
  catatan:'Perubahan parameter tidak mengubah project yang sudah berstatus Submit, Succeed, atau Failed. Nilai yang dipakai project tersimpan pada saat penawaran dibuat.'
},
audit: {
  ringkas:'Catatan seluruh perubahan data: siapa, kapan, modul apa, dan nilai sebelum–sesudah.',
  sheet:[['—','Tidak berasal dari Data_Sample.xlsx; dibentuk otomatis oleh aplikasi.']],
  menu:[['Seluruh modul','Setiap Insert, Update, Delete, Approve, Print, dan Import dicatat di sini.'],
        ['Setting — SET-011','Masa simpan log aktivitas (24 bulan).']],
  formula:[['Pengarsipan','Log lebih lama dari SET-011 dipindahkan ke basis data arsip (TB_R_*).']],
  roles:[['ADM, DIR','Melihat dan Export seluruh log.'],['Role lain','Tidak memiliki akses.']]
},
upload: {
  ringkas:'Layar pratinjau unggah Excel: memeriksa setiap baris sebelum disimpan ke basis data.',
  sheet:[['Sesuai modul asal','Template unggah mengikuti susunan kolom sheet asal pada Data_Sample.xlsx.']],
  menu:[['Modul asal','Tombol Upload Excel pada menu yang bersangkutan.']],
  formula:[['Aturan Submit','Tombol Submit non-aktif selama masih ada baris berstatus Error. Baris Warning tetap dapat disimpan.']],
  roles:[['Role dengan hak Import pada modul asal','Mengunggah dan menyimpan hasil unggahan.']]
}
};

/* halaman detail memakai keterangan modul induknya */
MODULE_INFO['material-breakdown-detail'] = MODULE_INFO['material-breakdown'];
MODULE_INFO['unit-price-analysis-detail'] = MODULE_INFO['unit-price-analysis'];

/* ---------- penyaji ---------- */
function infoSection(title, ic, rows){
  if (!rows || !rows.length) return '';
  return `<div class="info-sec">
    <h6>${icon(ic,15)} ${esc(title)}</h6>
    <dl class="dl-detail">${rows.map(([k,v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>`;
}

function openModuleInfo(key){
  const k = key || (document.body.dataset.info || document.body.dataset.page || 'dashboard');
  const m = MODULE_INFO[k];
  const judul = document.body.dataset.title || 'Modul';
  if (!m){
    openModal({title:'Informasi Modul', sub:judul, size:'md',
      body:`<div class="alert-box info">${icon('info',16)}<div>Keterangan modul ini belum disiapkan.</div></div>`,
      footer:[{label:'Close'}]});
    return;
  }
  openModal({
    title:'Informasi Modul — ' + judul,
    sub:'Sumber data, rumus perhitungan, dan role yang berhak melakukan aksi.',
    size:'lg',
    body:`
      <div class="alert-box info">${icon('info',16)}<div>${esc(m.ringkas)}</div></div>
      ${infoSection('Sumber Data — Data_Sample.xlsx','file', m.sheet)}
      ${infoSection('Sumber Data dari Menu Lain','layers', m.menu)}
      ${infoSection('Rumus Perhitungan','calc', m.formula)}
      ${infoSection('Istilah pada Layar Ini','tag', m.istilah)}
      ${infoSection('Fungsi Tombol Khusus','build', m.tombol)}
      ${infoSection('Alur Status','history', m.alur)}
      ${infoSection('Role dan Aksi yang Diperbolehkan','shield', m.roles)}
      ${m.catatan ? `<div class="alert-box warn">${icon('alert',16)}<div>${esc(m.catatan)}</div></div>` : ''}`,
    footer:[{label:'Close'}]
  });
}
