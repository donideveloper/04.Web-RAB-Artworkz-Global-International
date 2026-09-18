/* ============================================================
   Web RAB — Sample data (prototype)
   Angka diambil dari file kerja perusahaan (Data_Sample.xlsx)
   ============================================================ */
'use strict';

const DB = {};

/* ---------- Role & permission ---------- */
DB.ROLES = [
  {kode:'ADM', nama:'Administrator',  desc:'Pengelola pengguna, hak akses, dan parameter sistem.', status:'Aktif'},
  {kode:'DIR', nama:'Direktur',       desc:'Persetujuan akhir penawaran dan diskon di atas batas.', status:'Aktif'},
  {kode:'MGR', nama:'Manager Operasional', desc:'Persetujuan penawaran, penetapan margin dan diskon.', status:'Aktif'},
  {kode:'SPV', nama:'Supervisor Estimasi', desc:'Verifikasi AHS, breakdown, dan penyesuaian harga satuan.', status:'Aktif'},
  {kode:'EST', nama:'Estimator',      desc:'Menyusun BOQ, breakdown, AHS, dan quotation.', status:'Aktif'},
  {kode:'PRC', nama:'Procurement',    desc:'Mengelola material, supplier, dan harga satuan bahan.', status:'Aktif'}
];

DB.PERMISSIONS = [
  {kode:'PRM-001', menu:'Dashboard',            modul:'Main',           url:'/dashboard',            fitur:['View','Export'], status:'Aktif'},
  {kode:'PRM-002', menu:'Reference',            modul:'Master Data',    url:'/master/reference',     fitur:['View','Add','Edit','Delete','Import','Export'], status:'Aktif'},
  {kode:'PRM-003', menu:'Material & Price',     modul:'Master Data',    url:'/master/material',      fitur:['View','Add','Edit','Delete','Import','Export'], status:'Aktif'},
  {kode:'PRM-004', menu:'Labor Rate',           modul:'Master Data',    url:'/master/labor',         fitur:['View','Add','Edit','Delete','Import','Export'], status:'Aktif'},
  {kode:'PRM-005', menu:'Material Breakdown',   modul:'Price Analysis', url:'/analysis/breakdown',   fitur:['View','Add','Edit','Delete','Import','Export','Approve'], status:'Aktif'},
  {kode:'PRM-006', menu:'Unit Price Analysis',  modul:'Price Analysis', url:'/analysis/ahs',         fitur:['View','Add','Edit','Delete','Import','Export','Approve'], status:'Aktif'},
  {kode:'PRM-007', menu:'Unit Price List',      modul:'Price Analysis', url:'/analysis/price-list',  fitur:['View','Export'], status:'Aktif'},
  {kode:'PRM-008', menu:'Project & Quotation',  modul:'Project',        url:'/project',              fitur:['View','Add','Edit','Delete','Import','Export','Print','Finalize','Discount'], status:'Aktif'},
  {kode:'PRM-009', menu:'Report',               modul:'Project',        url:'/report',               fitur:['View','Export'], status:'Aktif'},
  {kode:'PRM-010', menu:'Permission',           modul:'User Access',    url:'/access/permission',    fitur:['View','Add','Edit','Delete','Import','Export'], status:'Aktif'},
  {kode:'PRM-011', menu:'Role',                 modul:'User Access',    url:'/access/role',          fitur:['View','Add','Edit','Delete','Set Permission'], status:'Aktif'},
  {kode:'PRM-012', menu:'User',                 modul:'User Access',    url:'/access/user',          fitur:['View','Add','Edit','Delete','Import','Export','Reset Password','Unlock'], status:'Aktif'},
  {kode:'PRM-013', menu:'Setting',              modul:'System',         url:'/system/setting',       fitur:['View','Edit','History'], status:'Aktif'},
  {kode:'PRM-014', menu:'Audit Trail & Log',    modul:'System',         url:'/system/audit',         fitur:['View','Export'], status:'Aktif'}
];

/* hak akses efektif per role: page -> daftar fitur */
DB.ROLE_PERM = {
  ADM: {'*':['view','add','edit','delete','import','export','print']},
  DIR: {dashboard:['view','export'], 'unit-price-list':['view','export'], project:['view','print','export','discount','approve'],
        report:['view','export'], audit:['view','export'], setting:['view'],
        'material-price':['view','export'], 'labor-rate':['view'], 'unit-price-analysis':['view'], 'material-breakdown':['view'], reference:['view']},
  MGR: {dashboard:['view','export'], project:['view','edit','print','export','discount','approve'], report:['view','export'],
        'unit-price-list':['view','export'], 'unit-price-analysis':['view','export'], 'material-breakdown':['view'],
        'material-price':['view','export'], 'labor-rate':['view','edit'], reference:['view'], setting:['view','edit'], user:['view']},
  SPV: {dashboard:['view'], 'material-breakdown':['view','add','edit','delete','import','export'],
        'unit-price-analysis':['view','add','edit','delete','import','export','approve'], 'unit-price-list':['view','export'],
        project:['view','edit','export','print'], report:['view','export'], 'material-price':['view','export'],
        'labor-rate':['view','add','edit','export'], reference:['view']},
  EST: {dashboard:['view'], 'material-breakdown':['view','add','edit','import','export'],
        'unit-price-analysis':['view','add','edit','import','export'], 'unit-price-list':['view','export'],
        project:['view','add','edit','import','export','print'], report:['view','export'],
        'material-price':['view'], 'labor-rate':['view'], reference:['view']},
  PRC: {dashboard:['view'], reference:['view','add','edit','delete','import','export'],
        'material-price':['view','add','edit','delete','import','export'],
        'labor-rate':['view','add','edit','delete','import','export'], 'unit-price-list':['view','export'], report:['view','export']}
};

DB.USERS = [
  {id:'U001', nama:'Andi Wijaya',    username:'andi.wijaya',    email:'andi.wijaya@artworkz.co.id',    jabatan:'IT Administrator',      roles:['ADM'],       status:'Aktif',    last:'18/09/2026 08:12'},
  {id:'U002', nama:'Hendra Kusuma',  username:'hendra.kusuma',  email:'hendra.k@artworkz.co.id',       jabatan:'Direktur',              roles:['DIR'],       status:'Aktif',    last:'17/09/2026 16:40'},
  {id:'U003', nama:'Maria Santoso',  username:'maria.santoso',  email:'maria.s@artworkz.co.id',        jabatan:'Manager Operasional',   roles:['MGR'],       status:'Aktif',    last:'18/09/2026 07:55'},
  {id:'U004', nama:'Budi Prasetyo',  username:'budi.prasetyo',  email:'budi.p@artworkz.co.id',         jabatan:'Supervisor Estimasi',   roles:['SPV','EST'], status:'Aktif',    last:'18/09/2026 09:02'},
  {id:'U005', nama:'Dewi Lestari',   username:'dewi.lestari',   email:'dewi.l@artworkz.co.id',         jabatan:'Estimator Senior',      roles:['EST'],       status:'Aktif',    last:'18/09/2026 08:47'},
  {id:'U006', nama:'Rina Purnama',   username:'rina.purnama',   email:'rina.p@artworkz.co.id',         jabatan:'Staff Procurement',     roles:['PRC'],       status:'Aktif',    last:'17/09/2026 15:20'},
  {id:'U007', nama:'Fajar Nugroho',  username:'fajar.nugroho',  email:'fajar.n@artworkz.co.id',        jabatan:'Estimator',             roles:['EST'],       status:'Terkunci', last:'12/09/2026 10:31'},
  {id:'U008', nama:'Siti Rahayu',    username:'siti.rahayu',    email:'siti.r@artworkz.co.id',         jabatan:'Admin Proyek',          roles:['EST','PRC'], status:'Nonaktif', last:'02/08/2026 11:05'}
];

/* ---------- Master referensi ---------- */
DB.CATEGORY = [
  {kode:'ACP', nama:'Alumunium Composite Panel', jml_type:2, jml_mat:8,  status:'Aktif'},
  {kode:'ACR', nama:'Acrylic',                   jml_type:2, jml_mat:16, status:'Aktif'},
  {kode:'ACC', nama:'Aksesoris Furniture',       jml_type:6, jml_mat:34, status:'Aktif'},
  {kode:'MPL', nama:'Multiplek / Plywood',       jml_type:4, jml_mat:22, status:'Aktif'},
  {kode:'HPL', nama:'High Pressure Laminate',    jml_type:3, jml_mat:41, status:'Aktif'},
  {kode:'VNR', nama:'Veneer',                    jml_type:2, jml_mat:12, status:'Aktif'},
  {kode:'CAT', nama:'Cat dan Finishing',         jml_type:5, jml_mat:28, status:'Aktif'},
  {kode:'GYP', nama:'Gypsum dan Plafon',         jml_type:3, jml_mat:9,  status:'Nonaktif'}
];
DB.TYPE = [
  {kode:'ACP.01', kategori:'ACP', nama:'PVDF Exterior', jml_spec:2, status:'Aktif'},
  {kode:'ACP.02', kategori:'ACP', nama:'PE Interior',   jml_spec:2, status:'Aktif'},
  {kode:'ACR.01', kategori:'ACR', nama:'Clear',         jml_spec:8, status:'Aktif'},
  {kode:'ACR.02', kategori:'ACR', nama:'Warna (Colored)', jml_spec:8, status:'Aktif'},
  {kode:'ACC.01', kategori:'ACC', nama:'Handle Pintu',  jml_spec:1, status:'Aktif'},
  {kode:'ACC.02', kategori:'ACC', nama:'Rail Laci',     jml_spec:1, status:'Aktif'},
  {kode:'ACC.03', kategori:'ACC', nama:'Rail Pintu Sliding', jml_spec:1, status:'Aktif'},
  {kode:'ACC.04', kategori:'ACC', nama:'Engsel',        jml_spec:2, status:'Aktif'}
];
DB.SPEC = [
  {kode:'01', type:'ACP.01', nama:'Tebal 0,3 mm', status:'Aktif'},
  {kode:'02', type:'ACP.01', nama:'Tebal 0,5 mm', status:'Aktif'},
  {kode:'01', type:'ACP.02', nama:'Tebal 0,21 mm', status:'Aktif'},
  {kode:'02', type:'ACP.02', nama:'Tebal 0,3 mm', status:'Aktif'},
  {kode:'01', type:'ACC.04', nama:'Engsel Sendok', status:'Aktif'},
  {kode:'02', type:'ACC.04', nama:'Engsel Kupu-kupu / Lurus', status:'Aktif'}
];
DB.BRAND = [
  {kode:'SV',  nama:'Seven',   jml_mat:12, status:'Aktif'},
  {kode:'GDS', nama:'Goodsense', jml_mat:8, status:'Aktif'},
  {kode:'BL',  nama:'Blum',    jml_mat:14, status:'Aktif'},
  {kode:'DTC', nama:'DTC',     jml_mat:16, status:'Aktif'},
  {kode:'HF',  nama:'Hafele',  jml_mat:18, status:'Aktif'},
  {kode:'HT',  nama:'Hettich', jml_mat:15, status:'Aktif'},
  {kode:'TC',  nama:'Taco',    jml_mat:21, status:'Aktif'},
  {kode:'00',  nama:'Tanpa Brand', jml_mat:52, status:'Aktif'}
];
DB.SUPPLIER = [
  {kode:'SUP-001', nama:'PT Sumber Panel Nusantara', kota:'Surabaya', kontak:'031-8291230', termin:'30 hari', status:'Aktif'},
  {kode:'SUP-002', nama:'CV Karya Kayu Jaya',        kota:'Sidoarjo', kontak:'031-8927741', termin:'14 hari', status:'Aktif'},
  {kode:'SUP-003', nama:'PT Hafele Indonesia',       kota:'Jakarta',  kontak:'021-29851100', termin:'45 hari', status:'Aktif'},
  {kode:'SUP-004', nama:'Toko Sinar Acrylic',        kota:'Surabaya', kontak:'0812-3344-5566', termin:'Tunai',  status:'Aktif'},
  {kode:'SUP-005', nama:'PT Propan Raya',            kota:'Tangerang',kontak:'021-5901234', termin:'30 hari', status:'Nonaktif'}
];
DB.CLIENT = [
  {kode:'CLT-001', nama:'PT Graha Mandiri Persada', jenis:'Kantor',     kota:'Surabaya', pic:'Bpk. Wirawan',  status:'Aktif'},
  {kode:'CLT-002', nama:'Hotel Santika Premiere',   jenis:'Hotel',      kota:'Surabaya', pic:'Ibu Karina',    status:'Aktif'},
  {kode:'CLT-003', nama:'Apartemen Puncak Bukit',   jenis:'Apartemen',  kota:'Surabaya', pic:'Bpk. Ardianto', status:'Aktif'},
  {kode:'CLT-004', nama:'PT Bank Artha Sejahtera',  jenis:'Kantor',     kota:'Jakarta',  pic:'Ibu Maya',      status:'Aktif'},
  {kode:'CLT-005', nama:'RS Mitra Keluarga Darmo',  jenis:'Rumah Sakit',kota:'Surabaya', pic:'Bpk. Hasan',    status:'Aktif'},
  {kode:'CLT-006', nama:'CV Retail Nusantara',      jenis:'Retail',     kota:'Malang',   pic:'Ibu Fitri',     status:'Nonaktif'}
];
DB.UOM = [
  {kode:'M2',  nama:'Meter Persegi', jenis:'Luas',    status:'Aktif'},
  {kode:'M1',  nama:'Meter Lari',    jenis:'Panjang', status:'Aktif'},
  {kode:'UNT', nama:'Unit',          jenis:'Jumlah',  status:'Aktif'},
  {kode:'LBR', nama:'Lembar',        jenis:'Jumlah',  status:'Aktif'},
  {kode:'PCS', nama:'Pieces',        jenis:'Jumlah',  status:'Aktif'},
  {kode:'SET', nama:'Set',           jenis:'Jumlah',  status:'Aktif'},
  {kode:'OH',  nama:'Orang Hari',    jenis:'Tenaga',  status:'Aktif'},
  {kode:'KG',  nama:'Kilogram',      jenis:'Berat',   status:'Aktif'},
  {kode:'LTR', nama:'Liter',         jenis:'Volume',  status:'Aktif'}
];
DB.FINISHING = [
  {kode:'FIN-01', nama:'HPL',              desc:'Pelapis high pressure laminate.',        status:'Aktif'},
  {kode:'FIN-02', nama:'Duco Doff / Matte',desc:'Cat duco permukaan tidak mengkilap.',    status:'Aktif'},
  {kode:'FIN-03', nama:'Duco Sattin',      desc:'Cat duco semi gloss.',                   status:'Aktif'},
  {kode:'FIN-04', nama:'Duco Glossy',      desc:'Cat duco mengkilap.',                    status:'Aktif'},
  {kode:'FIN-05', nama:'Veneer Doff',      desc:'Pelapis veneer kayu finishing matte.',   status:'Aktif'},
  {kode:'FIN-06', nama:'Veneer Glossy',    desc:'Pelapis veneer kayu finishing glossy.',  status:'Aktif'},
  {kode:'FIN-07', nama:'Veneer Laker',     desc:'Veneer dengan lapisan laker.',           status:'Aktif'},
  {kode:'FIN-08', nama:'Polosan',          desc:'Tanpa finishing, multiplek terekspos.',  status:'Aktif'}
];
DB.BUILDING = [
  {kode:'BLD-01', nama:'Kantor',      desc:'Gedung perkantoran dan ruang kerja.', status:'Aktif'},
  {kode:'BLD-02', nama:'Hotel',       desc:'Hotel, guest room, dan public area.', status:'Aktif'},
  {kode:'BLD-03', nama:'Apartemen',   desc:'Unit hunian bertingkat.',             status:'Aktif'},
  {kode:'BLD-04', nama:'Retail',      desc:'Toko, gerai, dan booth.',             status:'Aktif'},
  {kode:'BLD-05', nama:'Rumah Sakit', desc:'Fasilitas kesehatan.',                status:'Aktif'},
  {kode:'BLD-06', nama:'Residensial', desc:'Rumah tinggal.',                      status:'Aktif'}
];
DB.WORKGROUP = [
  {kode:'WG-01', nama:'Pekerjaan Furniture',  desc:'Wardrobe, kitchen set, credenza, meja.', status:'Aktif'},
  {kode:'WG-02', nama:'Pekerjaan Partisi',    desc:'Partisi gypsum, kaca, dan panel.',       status:'Aktif'},
  {kode:'WG-03', nama:'Pekerjaan Plafon',     desc:'Plafon gypsum, GRC, dan drop ceiling.',  status:'Aktif'},
  {kode:'WG-04', nama:'Pekerjaan Lantai',     desc:'Vinyl, parket, karpet, dan keramik.',    status:'Aktif'},
  {kode:'WG-05', nama:'Pekerjaan Wallpanel',  desc:'Wallpanel, pilar, dan backdrop.',        status:'Aktif'},
  {kode:'WG-06', nama:'Pekerjaan Elektrikal', desc:'Titik lampu, stop kontak, dan panel.',   status:'Aktif'},
  {kode:'WG-07', nama:'Pekerjaan Persiapan',  desc:'Bongkaran, proteksi, dan pembersihan.',  status:'Aktif'}
];

/* ---------- Material & harga ---------- */
DB.MATERIAL = [
  {kode:'ACP.01.01.SV.00', nama:'ACP PVDF Exterior 0,3 mm Ex. Seven', sat:'Lbr', harga:850000,  waste:0.05, supplier:'SUP-001', sts_harga:'Terkini',     upd:'2026-05-01', status:'Aktif'},
  {kode:'ACP.01.02.SV.00', nama:'ACP PVDF Exterior 0,5 mm Ex. Seven', sat:'Lbr', harga:1150000, waste:0.05, supplier:'SUP-001', sts_harga:'Terkini',     upd:'2026-05-01', status:'Aktif'},
  {kode:'ACP.02.01.GDS.00',nama:'ACP PE Interior 0,21 mm Ex. Goodsense', sat:'Lbr', harga:620000, waste:0.05, supplier:'SUP-001', sts_harga:'Kedaluwarsa', upd:'2026-01-15', status:'Aktif'},
  {kode:'ACC.01.00.BL.00', nama:'Handle Pintu Ex. Blum',              sat:'unit',harga:83270,   waste:0,    supplier:'SUP-003', sts_harga:'Terkini',     upd:'2026-05-01', status:'Aktif'},
  {kode:'ACC.02.00.DTC.00',nama:'Rail Laci 35 cm Ex. DTC (1 set = 2 bh)', sat:'set', harga:168000, waste:0, supplier:'SUP-003', sts_harga:'Terkini',     upd:'2026-05-01', status:'Aktif'},
  {kode:'ACC.02.00.BL.00', nama:'Rail Laci Ex. Blum',                 sat:'unit',harga:320485,  waste:0,    supplier:'SUP-003', sts_harga:'Terkini',     upd:'2026-05-01', status:'Aktif'},
  {kode:'ACC.03.00.BL.00', nama:'Rail Pintu Sliding Ex. Blum',        sat:'set', harga:1650000, waste:0,    supplier:'SUP-003', sts_harga:'Terkini',     upd:'2026-05-01', status:'Aktif'},
  {kode:'ACC.04.02.DTC.00',nama:'Engsel Lurus Ex. DTC',               sat:'pcs', harga:26000,   waste:0,    supplier:'SUP-003', sts_harga:'Terkini',     upd:'2026-05-01', status:'Aktif'},
  {kode:'MPL.01.18.00.00', nama:'Multiplek 18 mm 122 x 244 cm',       sat:'Lbr', harga:425000,  waste:0.08, supplier:'SUP-002', sts_harga:'Terkini',     upd:'2026-06-10', status:'Aktif'},
  {kode:'MPL.01.12.00.00', nama:'Multiplek 12 mm 122 x 244 cm',       sat:'Lbr', harga:310000,  waste:0.08, supplier:'SUP-002', sts_harga:'Terkini',     upd:'2026-06-10', status:'Aktif'},
  {kode:'MPL.01.09.00.00', nama:'Multiplek 9 mm 122 x 244 cm',        sat:'Lbr', harga:245000,  waste:0.08, supplier:'SUP-002', sts_harga:'Kedaluwarsa', upd:'2025-12-20', status:'Aktif'},
  {kode:'HPL.01.00.TC.00', nama:'HPL Ex. Taco 0,8 mm Motif Kayu',     sat:'Lbr', harga:295000,  waste:0.10, supplier:'SUP-002', sts_harga:'Terkini',     upd:'2026-07-01', status:'Aktif'},
  {kode:'HPL.01.00.GDS.00',nama:'HPL Ex. Goodsense 0,8 mm Solid',     sat:'Lbr', harga:238000,  waste:0.10, supplier:'SUP-002', sts_harga:'Terkini',     upd:'2026-07-01', status:'Aktif'},
  {kode:'VNR.01.00.00.00', nama:'Veneer Sungkai 0,25 mm',             sat:'Lbr', harga:180000,  waste:0.12, supplier:'SUP-002', sts_harga:'Terkini',     upd:'2026-06-10', status:'Aktif'},
  {kode:'CAT.02.00.00.00', nama:'Cat Duco Doff Ex. Propan',           sat:'kg',  harga:145000,  waste:0.05, supplier:'SUP-005', sts_harga:'Belum Ada Harga', upd:'', status:'Aktif'},
  {kode:'ACR.01.03.00.00', nama:'Acrylic Clear 3 mm',                 sat:'Lbr', harga:395000,  waste:0.06, supplier:'SUP-004', sts_harga:'Terkini',     upd:'2026-08-05', status:'Aktif'},
  {kode:'ACR.02.03.00.00', nama:'Acrylic Warna 3 mm',                 sat:'Lbr', harga:430000,  waste:0.06, supplier:'SUP-004', sts_harga:'Terkini',     upd:'2026-08-05', status:'Aktif'},
  {kode:'GYP.01.09.00.00', nama:'Gypsum Board 9 mm',                  sat:'Lbr', harga:78000,   waste:0.10, supplier:'SUP-001', sts_harga:'Terkini',     upd:'2026-07-20', status:'Nonaktif'}
];

DB.LABOR = [
  {kode:'UP.01', nama:'Pekerja',                       jenis:'Harian',   sat:'oh', tarif:150000, status:'Aktif'},
  {kode:'UP.02', nama:'Tukang Kayu',                   jenis:'Harian',   sat:'oh', tarif:200000, status:'Aktif'},
  {kode:'UP.03', nama:'Tukang Cat',                    jenis:'Harian',   sat:'oh', tarif:200000, status:'Aktif'},
  {kode:'UP.04', nama:'Tukang Besi / Alumunium',       jenis:'Harian',   sat:'oh', tarif:200000, status:'Aktif'},
  {kode:'UP.05', nama:'Tukang Plafon Gypsum',          jenis:'Harian',   sat:'oh', tarif:200000, status:'Aktif'},
  {kode:'UP.06', nama:'Tukang Batu',                   jenis:'Harian',   sat:'oh', tarif:200000, status:'Aktif'},
  {kode:'UP.07', nama:'Tukang Listrik',                jenis:'Harian',   sat:'oh', tarif:200000, status:'Aktif'},
  {kode:'UP.08', nama:'Kepala Tukang',                 jenis:'Harian',   sat:'oh', tarif:225000, status:'Aktif'},
  {kode:'UP.09', nama:'Mandor',                        jenis:'Harian',   sat:'oh', tarif:250000, status:'Aktif'},
  {kode:'UP.10', nama:'Upah Pemasangan Plywood',       jenis:'Borongan', sat:'m2', tarif:500000, status:'Aktif'},
  {kode:'UP.11', nama:'Finishing Duco Doff / Matte',   jenis:'Borongan', sat:'m2', tarif:236000, status:'Aktif'},
  {kode:'UP.12', nama:'Finishing Duco Sattin',         jenis:'Borongan', sat:'m2', tarif:264000, status:'Aktif'},
  {kode:'UP.13', nama:'Finishing Duco Glossy',         jenis:'Borongan', sat:'m2', tarif:290000, status:'Aktif'},
  {kode:'UP.14', nama:'Finishing Veneer Doff / Matte', jenis:'Borongan', sat:'m2', tarif:275000, status:'Aktif'},
  {kode:'UP.15', nama:'Finishing Veneer Glossy',       jenis:'Borongan', sat:'m2', tarif:385000, status:'Aktif'},
  {kode:'UP.16', nama:'Finishing Veneer Laker',        jenis:'Borongan', sat:'m2', tarif:825000, status:'Aktif'}
];

/* ---------- Material breakdown (master) ---------- */
DB.BREAKDOWN = [
  {kode:'BD-WD-001', nama:'Wardrobe / Lemari Pakaian 240x60x320', dim:'240 x 60 x 320 cm', sat:'Unit', finishing:'Polosan',       baris:8, status:'Disetujui'},
  {kode:'BD-WD-002', nama:'Wardrobe / Lemari Pakaian 240x60x320', dim:'240 x 60 x 320 cm', sat:'Unit', finishing:'HPL',           baris:9, status:'Disetujui'},
  {kode:'BD-WD-003', nama:'Wardrobe / Lemari Pakaian 240x60x320', dim:'240 x 60 x 320 cm', sat:'Unit', finishing:'Duco Doff / Matte', baris:9, status:'Disetujui'},
  {kode:'BD-WD-004', nama:'Wardrobe / Lemari Pakaian 240x60x320', dim:'240 x 60 x 320 cm', sat:'Unit', finishing:'Veneer Doff',   baris:9, status:'Menunggu Verifikasi'},
  {kode:'BD-KS-001', nama:'Kitchen Set Bawah 300x60x85',          dim:'300 x 60 x 85 cm',  sat:'Unit', finishing:'HPL',           baris:11,status:'Disetujui'},
  {kode:'BD-KS-002', nama:'Kitchen Set Atas 300x35x70',           dim:'300 x 35 x 70 cm',  sat:'Unit', finishing:'HPL',           baris:8, status:'Disetujui'},
  {kode:'BD-WP-001', nama:'Wallpanel Pilar / Kolom',              dim:'per m2',            sat:'M2',   finishing:'HPL',           baris:6, status:'Draft'},
  {kode:'BD-CR-001', nama:'Credenza 180x45x75',                   dim:'180 x 45 x 75 cm',  sat:'Unit', finishing:'Duco Glossy',   baris:7, status:'Draft'}
];
DB.BREAKDOWN_D = {
  'BD-WD-001': [
    {grp:'A. Body / Lambung', mat:'MPL.01.18.00.00', bagian:'Lambung samping kiri & kanan', p:0.60, l:3.20, jml:2, sat:'m2', waste:0.08},
    {grp:'A. Body / Lambung', mat:'MPL.01.18.00.00', bagian:'Top & bottom panel',           p:2.40, l:0.60, jml:2, sat:'m2', waste:0.08},
    {grp:'A. Body / Lambung', mat:'MPL.01.09.00.00', bagian:'Backing belakang',             p:2.40, l:3.20, jml:1, sat:'m2', waste:0.08},
    {grp:'B. Pintu',          mat:'MPL.01.18.00.00', bagian:'Daun pintu swing',             p:0.60, l:2.00, jml:4, sat:'m2', waste:0.08},
    {grp:'C. Ambalan & Rak',  mat:'MPL.01.18.00.00', bagian:'Ambalan dalam',                p:1.16, l:0.58, jml:6, sat:'m2', waste:0.08},
    {grp:'D. Pelapis',        mat:'HPL.01.00.TC.00', bagian:'Pelapis bagian tampak',        p:2.40, l:3.20, jml:1, sat:'m2', waste:0.10},
    {grp:'E. Aksesoris',      mat:'ACC.01.00.BL.00', bagian:'Handle pintu',                 p:0,    l:0,    jml:4, sat:'unit', waste:0},
    {grp:'E. Aksesoris',      mat:'ACC.04.02.DTC.00',bagian:'Engsel lurus',                 p:0,    l:0,    jml:12,sat:'pcs', waste:0}
  ]
};

/* ---------- AHS ---------- */
DB.AHS = [
  {kode:'WD.1',    nama:'1 Unit Wardrobe / Lemari Pakaian 240x60x320 - Polosan', grp:'WG-01', sat:'Unit', hsp:21884500, bd:'BD-WD-001', margin:0.15, status:'Disetujui', review:false},
  {kode:'WD.1.1',  nama:'1 m2 Wardrobe / Lemari Pakaian - Polosan',              grp:'WG-01', sat:'M2',   hsp:2850000,  bd:'BD-WD-001', margin:0.15, status:'Disetujui', review:false},
  {kode:'WD.2',    nama:'1 Unit Wardrobe / Lemari Pakaian 240x60x320 - HPL',     grp:'WG-01', sat:'Unit', hsp:80529700, bd:'BD-WD-002', margin:0.15, status:'Disetujui', review:true},
  {kode:'WD.2.1',  nama:'1 m2 Wardrobe / Lemari Pakaian - HPL',                  grp:'WG-01', sat:'M2',   hsp:10486000, bd:'BD-WD-002', margin:0.15, status:'Disetujui', review:false},
  {kode:'KS.1',    nama:'1 Unit Kitchen Set Bawah 300x60x85 - HPL',              grp:'WG-01', sat:'Unit', hsp:34750000, bd:'BD-KS-001', margin:0.15, status:'Disetujui', review:false},
  {kode:'KS.2',    nama:'1 Unit Kitchen Set Atas 300x35x70 - HPL',               grp:'WG-01', sat:'Unit', hsp:18420000, bd:'BD-KS-002', margin:0.15, status:'Disetujui', review:false},
  {kode:'EL-01.1', nama:'Wallpanel Pilar / Kolom - HPL',                         grp:'WG-05', sat:'Unit', hsp:68248000, bd:'BD-WP-001', margin:0.15, status:'Menunggu Verifikasi', review:true},
  {kode:'PT.1',    nama:'1 m2 Partisi Gypsum Double Rangka Hollow',              grp:'WG-02', sat:'M2',   hsp:485000,   bd:'',          margin:0.15, status:'Disetujui', review:false},
  {kode:'PL.1',    nama:'1 m2 Plafon Gypsum Rangka Hollow 60x60',                grp:'WG-03', sat:'M2',   hsp:365000,   bd:'',          margin:0.15, status:'Disetujui', review:false},
  {kode:'LT.1',    nama:'1 m2 Lantai Vinyl Roll 2 mm',                           grp:'WG-04', sat:'M2',   hsp:295000,   bd:'',          margin:0.15, status:'Draft',     review:false}
];
DB.AHS_D = {
  'WD.2': {
    A: [{kode:'UP.02', nama:'Tukang Kayu',   sat:'oh', koef:12,  harga:200000},
        {kode:'UP.01', nama:'Pekerja',       sat:'oh', koef:6,   harga:150000},
        {kode:'UP.08', nama:'Kepala Tukang', sat:'oh', koef:1.2, harga:225000},
        {kode:'UP.09', nama:'Mandor',        sat:'oh', koef:0.6, harga:250000}],
    B: [{kode:'MPL.01.18.00.00', nama:'Multiplek 18 mm', sat:'Lbr', koef:14.5, harga:425000},
        {kode:'MPL.01.09.00.00', nama:'Multiplek 9 mm',  sat:'Lbr', koef:2.2,  harga:245000},
        {kode:'HPL.01.00.TC.00', nama:'HPL Ex. Taco 0,8 mm', sat:'Lbr', koef:9.8, harga:295000},
        {kode:'ACC.01.00.BL.00', nama:'Handle Pintu Ex. Blum', sat:'unit', koef:4, harga:83270},
        {kode:'ACC.04.02.DTC.00',nama:'Engsel Lurus Ex. DTC',  sat:'pcs',  koef:12, harga:26000}],
    C: [{kode:'ALB', nama:'Alat Bantu',      jenis:'Persentase', nilai:0.02},
        {kode:'MOB', nama:'Mob. & Demob',    jenis:'Nilai Tetap', nilai:1500000}]
  }
};

/* ---------- Project ---------- */
DB.PROJECT = [
  {no:'PRJ-2026-013', nama:'Fit Out Kantor Lantai 8 - Graha Mandiri', client:'CLT-001', lokasi:'Surabaya', tgl:'2026-09-12', nilai:1842500000, est:'Dewi Lestari',  status:'Draft'},
  {no:'PRJ-2026-012', nama:'Renovasi Guest Room Lantai 5-7',          client:'CLT-002', lokasi:'Surabaya', tgl:'2026-09-05', nilai:3125800000, est:'Budi Prasetyo',status:'Sent'},
  {no:'PRJ-2026-011', nama:'Interior Unit Tipe A - Tower 2',          client:'CLT-003', lokasi:'Surabaya', tgl:'2026-08-28', nilai:865400000,  est:'Dewi Lestari',  status:'Won'},
  {no:'PRJ-2026-010', nama:'Banking Hall & Ruang Rapat',              client:'CLT-004', lokasi:'Jakarta',  tgl:'2026-08-14', nilai:2410000000, est:'Budi Prasetyo',status:'Sent'},
  {no:'PRJ-2026-009', nama:'Nurse Station & Ruang Tunggu',            client:'CLT-005', lokasi:'Surabaya', tgl:'2026-07-30', nilai:1180250000, est:'Dewi Lestari',  status:'Won'},
  {no:'PRJ-2026-008', nama:'Booth Retail Mall Tunjungan',             client:'CLT-006', lokasi:'Malang',   tgl:'2026-07-11', nilai:342700000,  est:'Fajar Nugroho', status:'Lost'},
  {no:'PRJ-2026-007', nama:'Lobby & Front Desk Renovation',           client:'CLT-002', lokasi:'Surabaya', tgl:'2026-06-22', nilai:1567900000, est:'Budi Prasetyo',status:'Won'}
];

/* BOQ project terpilih (PRJ-2026-013) */
DB.BOQ = [
  {t:'grp',  no:'I',   uraian:'PEKERJAAN PERSIAPAN'},
  {t:'item', no:'1.1', kode:'PS.1', uraian:'Proteksi lantai & dinding existing', sat:'M2',   vol:420,  harga:35000,    adj:false},
  {t:'item', no:'1.2', kode:'PS.2', uraian:'Bongkaran partisi existing',         sat:'M2',   vol:86,   harga:95000,    adj:false},
  {t:'sub',  no:'',    uraian:'Subtotal Pekerjaan Persiapan'},
  {t:'grp',  no:'II',  uraian:'PEKERJAAN FURNITURE'},
  {t:'item', no:'2.1', kode:'WD.2', uraian:'Wardrobe 240x60x320 finishing HPL',  sat:'Unit', vol:6,    harga:80529700, adj:false},
  {t:'note', no:'',    uraian:'Spesifikasi: rangka multiplek 18 mm, pelapis HPL Ex. Taco, handle & engsel Ex. Blum.'},
  {t:'item', no:'2.2', kode:'KS.1', uraian:'Kitchen set bawah 300x60x85 - HPL',  sat:'Unit', vol:2,    harga:34750000, adj:false},
  {t:'item', no:'2.3', kode:'KS.2', uraian:'Kitchen set atas 300x35x70 - HPL',   sat:'Unit', vol:2,    harga:18420000, adj:false},
  {t:'item', no:'2.4', kode:'CR.1', uraian:'Credenza 180x45x75 - Duco Glossy',   sat:'Unit', vol:3,    harga:22850000, adj:true},
  {t:'sub',  no:'',    uraian:'Subtotal Pekerjaan Furniture'},
  {t:'grp',  no:'III', uraian:'PEKERJAAN PARTISI & PLAFON'},
  {t:'item', no:'3.1', kode:'PT.1', uraian:'Partisi gypsum double rangka hollow',sat:'M2',   vol:168,  harga:485000,   adj:false},
  {t:'item', no:'3.2', kode:'PL.1', uraian:'Plafon gypsum rangka hollow 60x60',  sat:'M2',   vol:392,  harga:365000,   adj:false},
  {t:'item', no:'3.3', kode:'EL-01.1', uraian:'Wallpanel pilar / kolom - HPL',   sat:'Unit', vol:4,    harga:68248000, adj:false},
  {t:'sub',  no:'',    uraian:'Subtotal Pekerjaan Partisi & Plafon'},
  {t:'grp',  no:'IV',  uraian:'PEKERJAAN LANTAI'},
  {t:'item', no:'4.1', kode:'LT.1', uraian:'Lantai vinyl roll 2 mm',             sat:'M2',   vol:392,  harga:295000,   adj:false},
  {t:'sub',  no:'',    uraian:'Subtotal Pekerjaan Lantai'}
];
DB.PROJECT_PARAM = {margin:0.15, jasa:0.10, ppn:0.11, bulat:1000, tgl_harga:'2026-09-01', valid:30, disc:0};
DB.REVISI = [
  {rev:'R0', tgl:'2026-09-12', nilai:1842500000, selisih:0,          status:'Draft', oleh:'Dewi Lestari', alasan:'Versi awal.'},
  {rev:'R1', tgl:'2026-09-15', nilai:1798300000, selisih:-44200000,  status:'Sent',  oleh:'Dewi Lestari', alasan:'Permintaan client: volume wardrobe berkurang 1 unit.'},
  {rev:'R2', tgl:'2026-09-17', nilai:1826750000, selisih:28450000,   status:'Draft', oleh:'Budi Prasetyo',alasan:'Pembaruan harga multiplek ke harga terkini.'}
];
DB.ATTACH = [
  {nama:'Gambar Kerja Lt-8 Rev C.pdf', ukuran:'4,2 MB', oleh:'Dewi Lestari', waktu:'12/09/2026 10:22', drive:'Google Drive'},
  {nama:'Surat Permintaan Penawaran.pdf', ukuran:'820 KB', oleh:'Dewi Lestari', waktu:'12/09/2026 10:24', drive:'Google Drive'},
  {nama:'Foto Lokasi Existing.zip', ukuran:'18,6 MB', oleh:'Fajar Nugroho', waktu:'13/09/2026 08:05', drive:'Google Drive'}
];

/* ---------- Setting ---------- */
DB.SETTING = [
  {kode:'SET-001', kat:'Perhitungan', nama:'Margin Keuntungan Standar',       nilai:'15',    sat:'%',    sejak:'2026-01-01'},
  {kode:'SET-002', kat:'Perhitungan', nama:'Jasa Kontraktor',                 nilai:'10',    sat:'%',    sejak:'2026-01-01'},
  {kode:'SET-003', kat:'Perhitungan', nama:'PPN',                             nilai:'11',    sat:'%',    sejak:'2026-01-01'},
  {kode:'SET-004', kat:'Perhitungan', nama:'Pembulatan Nilai Penawaran',      nilai:'1000',  sat:'Rp',   sejak:'2026-01-01'},
  {kode:'SET-005', kat:'Perhitungan', nama:'Batas Umur Harga Material',       nilai:'90',    sat:'hari', sejak:'2026-01-01'},
  {kode:'SET-006', kat:'Dokumen',     nama:'Pola Nomor Quotation',            nilai:'{NNN}/QUO/INT/AGI/{RM}/{YY}', sat:'-', sejak:'2026-01-01'},
  {kode:'SET-007', kat:'Dokumen',     nama:'Masa Berlaku Penawaran',          nilai:'30',    sat:'hari', sejak:'2026-01-01'},
  {kode:'SET-008', kat:'Dokumen',     nama:'Nama Penanda Tangan Quotation',   nilai:'Hendra Kusuma',  sat:'-', sejak:'2026-03-01'},
  {kode:'SET-009', kat:'Keamanan',    nama:'Maksimal Percobaan Login Gagal',  nilai:'5',     sat:'kali', sejak:'2026-01-01'},
  {kode:'SET-010', kat:'Keamanan',    nama:'Masa Kedaluwarsa Password',       nilai:'90',    sat:'hari', sejak:'2026-01-01'},
  {kode:'SET-011', kat:'Sistem',      nama:'Masa Simpan Log Aktivitas',       nilai:'24',    sat:'bulan',sejak:'2026-01-01'},
  {kode:'SET-012', kat:'Sistem',      nama:'Folder Arsip Google Drive',       nilai:'/WebRAB/Arsip',  sat:'-', sejak:'2026-02-01'}
];

/* ---------- Audit trail ---------- */
DB.AUDIT = [
  {waktu:'18/09/2026 09:41', user:'rina.purnama',  modul:'Material & Price', aksi:'Update', data:'MPL.01.18.00.00', grp:'Operasional', ket:'Harga 410.000 → 425.000'},
  {waktu:'18/09/2026 09:12', user:'dewi.lestari',  modul:'Project',          aksi:'Insert', data:'PRJ-2026-013',    grp:'Legal',       ket:'Project baru dibuat'},
  {waktu:'18/09/2026 08:55', user:'budi.prasetyo', modul:'Unit Price Analysis', aksi:'Update', data:'WD.2',         grp:'Operasional', ket:'Koefisien HPL 9,2 → 9,8'},
  {waktu:'18/09/2026 08:12', user:'andi.wijaya',   modul:'User Access',      aksi:'Update', data:'U007',            grp:'Legal',       ket:'Akun dikunci: 5x gagal login'},
  {waktu:'17/09/2026 16:48', user:'maria.santoso', modul:'Project',          aksi:'Approve',data:'PRJ-2026-012',    grp:'Legal',       ket:'Status Draft → Sent'},
  {waktu:'17/09/2026 15:20', user:'rina.purnama',  modul:'Material & Price', aksi:'Import', data:'42 baris',        grp:'Operasional', ket:'Upload harga periode September'},
  {waktu:'17/09/2026 14:02', user:'budi.prasetyo', modul:'Material Breakdown',aksi:'Insert',data:'BD-WD-004',       grp:'Operasional', ket:'Duplikasi dari BD-WD-001'},
  {waktu:'17/09/2026 11:33', user:'dewi.lestari',  modul:'Project',          aksi:'Print',  data:'PRJ-2026-011',    grp:'Legal',       ket:'Cetak quotation R1 (PDF)'},
  {waktu:'17/09/2026 10:15', user:'hendra.kusuma', modul:'Setting',          aksi:'Update', data:'SET-001',         grp:'Legal',       ket:'Margin 14% → 15%'},
  {waktu:'17/09/2026 09:04', user:'andi.wijaya',   modul:'User Access',      aksi:'Insert', data:'U008',            grp:'Legal',       ket:'User baru: siti.rahayu'}
];

DB.NOTIFS = [
  {ic:'alert', cls:'warn', title:'3 material harga kedaluwarsa', desc:'Harga belum diperbarui lebih dari 90 hari.', time:'20 menit lalu', unread:true, href:'material-price.html'},
  {ic:'clock', cls:'info', title:'Penawaran PRJ-2026-010 akan berakhir', desc:'Masa berlaku tersisa 3 hari.', time:'2 jam lalu', unread:true, href:'project.html'},
  {ic:'refresh', cls:'warn', title:'2 AHS perlu ditinjau ulang', desc:'Harga komponen penyusun berubah.', time:'Kemarin', unread:false, href:'unit-price-analysis.html'}
];

/* profil sesi */
DB.PROFILE = {nama:'Andi Wijaya', username:'andi.wijaya', email:'andi.wijaya@artworkz.co.id', role:'ADM'};
