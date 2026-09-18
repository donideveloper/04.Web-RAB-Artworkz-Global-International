/* ============================================================
   Web RAB — Shell (sidebar, topbar, role guard)
   Struktur menu = FSD Tabel 5H (14 menu utama)
   ============================================================ */
'use strict';

loadDB();

/* ---------- auth guard ---------- */
if (!sessionStorage.getItem('rab_session') && !/index\.html$/.test(location.pathname)){
  location.replace('index.html');
}

const NAV = [
  {cap:'Main'},
  {k:'dashboard', t:'Dashboard', ic:'grid', href:'dashboard.html', crumb:'Main'},
  {cap:'Master Data'},
  /* rev-5 poin 8 (P-27): Brand dan Supplier naik ke atas karena keduanya
     menjadi isi pilihan pada Specification.
     rev-6 poin 9 (P-45): menu "Kode Kategori" dinamai "Kategori".
     rev-6 poin 20 (P-56): nama "Kelompok Breakdown" dipertahankan (sempat
     diubah menjadi "Kelompok Barang" pada P-46, lalu dikembalikan).
     Kunci menu, nama berkas, dan rencana nama tabel tidak berubah. */
  {k:'reference', t:'Reference', ic:'layers', crumb:'Master Data', sub:[
    {k:'reference-brand',    t:'Brand',                 href:'reference-brand.html'},
    {k:'reference-supplier', t:'Supplier',              href:'reference-supplier.html'},
    {k:'reference-category', t:'Kategori',           href:'reference-category.html'},
    {k:'reference-client',   t:'Client',                href:'reference-client.html'},
    {k:'reference-uom',      t:'Unit of Measure',       href:'reference-uom.html'},
    {k:'reference-finishing',t:'Finishing',             href:'reference-finishing.html'},
    {k:'reference-building', t:'Building Type',         href:'reference-building.html'},
    {k:'reference-workgroup',t:'Work Group',            href:'reference-workgroup.html'},
    {k:'reference-partgroup',t:'Kelompok Breakdown',     href:'reference-partgroup.html'}
  ]},
  /* rev-6 poin 1 & 2: menu "Bahan" menjadi "Material" dan menu "Upah" menjadi
     "Upah Pekerja". Nama teknis (kunci menu, nama berkas, nama tabel) tetap. */
  {k:'material-price', t:'Material',     ic:'box',   href:'material-price.html', crumb:'Master Data'},
  {k:'labor-rate',     t:'Upah Pekerja', ic:'users', href:'labor-rate.html',     crumb:'Master Data'},
  {cap:'Price Analysis'},
  {k:'material-breakdown',   t:'Material Breakdown',  ic:'list',  href:'material-breakdown.html',   crumb:'Price Analysis'},
  {k:'unit-price-analysis',  t:'Unit Price Analysis', ic:'calc',  href:'unit-price-analysis.html',  crumb:'Price Analysis'},
  {k:'unit-price-list',      t:'Unit Price List',     ic:'tag',   href:'unit-price-list.html',      crumb:'Price Analysis'},
  {cap:'Project'},
  {k:'project', t:'Project & Quotation', ic:'folder', href:'project.html', crumb:'Project'},
  {k:'report',  t:'Report',              ic:'chart',  href:'report.html',  crumb:'Project'},
  {cap:'User Access'},
  {k:'permission', t:'Permission', ic:'shield', href:'permission.html', crumb:'User Access'},
  {k:'role',       t:'Role',       ic:'key',    href:'role.html',       crumb:'User Access'},
  /* rev-6 poin 6: matriks hak akses seluruh menu terhadap seluruh role,
     dibaca dari data yang sama dengan halaman Role — Set Permission. */
  {k:'role-matrix',t:'Matrix Akses Menu', ic:'grid2', href:'role-matrix.html', crumb:'User Access'},
  {k:'user',       t:'User',       ic:'user',   href:'user.html',       crumb:'User Access'},
  {cap:'System'},
  {k:'setting', t:'Setting',              ic:'settings', href:'setting.html',     crumb:'System'},
  {k:'audit',   t:'Audit Trail & Log',    ic:'history',  href:'audit-trail.html', crumb:'System'}
];

const PAGE  = document.body.dataset.page || 'dashboard';
const TITLE = document.body.dataset.title || '';

/* ---------- menu aktif ----------
   Halaman Upload Excel dibuka dari menu lain, sehingga penanda menu aktif
   (dan submenu Reference yang terbuka) tetap mengikuti menu asalnya. */
const MODNAV = {
  material:'material-price', labor:'labor-rate', breakdown:'material-breakdown',
  ahs:'unit-price-analysis', boq:'project', user:'user', permission:'permission'
};
const NAVKEY = (() => {
  if (PAGE !== 'upload') return PAGE;
  const m = new URLSearchParams(location.search).get('m') || '';
  return MODNAV[m] || (/^reference-/.test(m) ? m : 'material-price');
})();

/* ---------- role & permission ---------- */
function curRole(){ return sessionStorage.getItem('rab_role') || DB.PROFILE.role || 'ADM'; }
function roleName(){ return (DB.ROLES.find(r => r.kode === curRole()) || {}).nama || curRole(); }
function pagePerms(page){
  const map = DB.ROLE_PERM[curRole()] || {};
  if (map['*']) return map['*'];
  /* halaman turunan memakai hak akses menu induknya */
  const base = String(page || PAGE)
    .replace(/^reference-.*/, 'reference')
    .replace(/^role-matrix$/, 'role');
  return map[base] || [];
}
function can(page, feature){ return pagePerms(page).includes(String(feature).toLowerCase()); }
function menuVisible(k){ return pagePerms(k).length > 0; }

/* ---------- shell ---------- */
function buildShell(){
  const side = $('#sidebar');
  side.innerHTML = `
    <div class="side-brand">
      <span class="brand-logo">${icon('build', 19)}</span>
      <div><strong>Web RAB</strong><span>Artworkz Global Internasional</span></div>
    </div>
    <nav class="side-nav">
      ${NAV.map(n => {
        if (n.cap) return `<div class="nav-cap">${esc(n.cap)}</div>`;
        if (n.sub){
          if (!menuVisible('reference')) return '';
          const on = n.sub.some(s => s.k === NAVKEY);
          return `<a href="#" class="nav-item parent ${on ? 'open on' : ''}" data-parent>${icon(n.ic, 16)} ${esc(n.t)}
              <span class="caret">${icon('chev', 14)}</span></a>
            <div class="nav-sub ${on ? 'open' : ''}">
              ${n.sub.map(s => `<a class="nav-item ${s.k === NAVKEY ? 'active' : ''}" href="${s.href}">${esc(s.t)}</a>`).join('')}
            </div>`;
        }
        if (!menuVisible(n.k)) return '';
        return `<a class="nav-item ${n.k === NAVKEY ? 'active' : ''}" href="${n.href}">${icon(n.ic, 16)} ${esc(n.t)}</a>`;
      }).join('')}
    </nav>
    <div class="side-foot">UI Prototype · FSD v2.3<br>Seluruh data adalah data contoh.</div>`;

  const meta = flatNav().find(n => n.k === NAVKEY) || {t: TITLE || 'Web RAB', crumb: ''};
  $('#topbar').innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <button class="icon-btn tb-burger" id="btn-side">${icon('menu', 18)}</button>
      <div>
        <div class="tb-crumb">${esc(meta.crumb || '')}</div>
        <h1>${esc(TITLE || meta.t)}
          <button class="info-btn" id="btn-info" type="button"
            title="Informasi modul: sumber data, rumus, dan role">${icon('info', 15)}</button>
        </h1>
      </div>
    </div>
    <div class="d-flex align-items-center gap-2">
      <div class="dropdown hide-lg">
        <button class="btn btn-ghost btn-sm dropdown-toggle" data-bs-toggle="dropdown" title="Demo: ganti role untuk melihat perbedaan tampilan">
          ${icon('shield', 14)} ${esc(curRole())}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><h6 class="dropdown-header">Lihat sebagai role</h6></li>
          ${DB.ROLES.map(r => `<li><a class="dropdown-item" href="#" data-role="${r.kode}">
            <b style="width:34px">${r.kode}</b> <span class="text-ink2">${esc(r.nama)}</span></a></li>`).join('')}
        </ul>
      </div>
      <button class="icon-btn" id="btn-theme" title="Terang / gelap"></button>
      <div class="dropdown">
        <button class="icon-btn position-relative" data-bs-toggle="dropdown">${icon('bell', 17)}
          <span class="position-absolute translate-middle badge rounded-pill" id="bell-dot"
            style="top:6px;left:24px;background:var(--danger);font-size:9px">${DB.NOTIFS.filter(n => n.unread).length}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" style="width:320px">
          <li><h6 class="dropdown-header">Notifications</h6></li>
          ${DB.NOTIFS.map(n => `<li><a class="dropdown-item" href="${n.href}" style="white-space:normal">
            <span style="color:var(--${n.cls})">${icon(n.ic, 16)}</span>
            <span><b style="display:block;font-size:13px">${esc(n.title)}</b>
            <span class="text-ink3" style="font-size:11.5px">${esc(n.desc)} · ${esc(n.time)}</span></span></a></li>`).join('')}
        </ul>
      </div>
      <div class="tb-sep"></div>
      <div class="dropdown">
        <button class="tb-profile" data-bs-toggle="dropdown">
          <span class="avatar">${esc(DB.PROFILE.nama.split(' ').map(w => w[0]).slice(0, 2).join(''))}</span>
          <span class="tb-name"><strong>${esc(DB.PROFILE.nama)}</strong><span>${esc(roleName())}</span></span>
          ${icon('chevd', 15)}
        </button>
        <ul class="dropdown-menu dropdown-menu-end" style="width:250px">
          <li><h6 class="dropdown-header">${esc(DB.PROFILE.email)}</h6></li>
          <li><a class="dropdown-item" href="#" id="act-profile">${icon('user', 16)} My Profile</a></li>
          <li><a class="dropdown-item" href="#" id="act-pass">${icon('lock', 16)} Change Password</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" id="act-reset">${icon('refresh', 16)} Reset Demo Data</a></li>
          <li><a class="dropdown-item danger" href="#" id="act-logout">${icon('logout', 16)} Sign Out</a></li>
        </ul>
      </div>
    </div>`;

  /* interaksi */
  $$('[data-parent]').forEach(a => a.onclick = e => {
    e.preventDefault();
    a.classList.toggle('open');
    a.nextElementSibling.classList.toggle('open');
  });
  $$('[data-role]').forEach(a => a.onclick = e => {
    e.preventDefault();
    sessionStorage.setItem('rab_role', a.dataset.role);
    toast('Tampilan diubah sebagai role ' + a.dataset.role + '.', 'info');
    setTimeout(() => location.reload(), 500);
  });
  /* tombol (i) — keterangan modul (rev-4) */
  if ($('#btn-info')) $('#btn-info').onclick = () => openModuleInfo();
  $('#btn-side').onclick = () => { $('#sidebar').classList.toggle('show'); $('#side-backdrop').classList.toggle('show'); };
  $('#side-backdrop').onclick = () => { $('#sidebar').classList.remove('show'); $('#side-backdrop').classList.remove('show'); };
  $('#act-logout').onclick = e => { e.preventDefault(); sessionStorage.clear(); location.href = 'index.html'; };
  $('#act-reset').onclick  = e => { e.preventDefault(); confirmModal({title:'Reset Demo Data', text:'Seluruh perubahan pada prototipe akan dikembalikan ke data contoh awal.', okLabel:'Yes, Continue', onOk: resetDB}); };
  $('#act-profile').onclick = e => { e.preventDefault(); openModal({
    title:'My Profile', size:'md',
    body: formHTML([
      {key:'nama', label:'Nama Lengkap', required:true},
      {key:'username', label:'Username', disabled:true},
      {key:'email', label:'Email', type:'email', required:true, full:true},
      {key:'role', label:'Role Aktif', disabled:true}
    ], {...DB.PROFILE, role: curRole() + ' — ' + roleName()}),
    footer:[{label:'Cancel'}, {label:'Save', cls:'btn-primary', ic:'save', onClick: c => { c(); toast('Profil berhasil diperbarui.'); }}]
  }); };
  $('#act-pass').onclick = e => { e.preventDefault(); openModal({
    title:'Change Password', sub:'Password minimal 8 karakter, memuat huruf besar, huruf kecil, dan angka.', size:'md',
    body: formHTML([
      {key:'old', label:'Password Lama', type:'password', required:true, full:true},
      {key:'new', label:'Password Baru', type:'password', required:true},
      {key:'cfm', label:'Ulangi Password Baru', type:'password', required:true}
    ], {}),
    footer:[{label:'Cancel'}, {label:'Save', cls:'btn-primary', ic:'save', onClick: c => { c(); toast('Password berhasil diubah.'); }}]
  }); };

  /* tema */
  const applyTheme = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    $('#btn-theme').innerHTML = icon(dark ? 'sun' : 'moon', 17);
  };
  applyTheme();
  $('#btn-theme').onclick = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
    localStorage.setItem('rab_theme', dark ? 'light' : 'dark');
    applyTheme();
  };

  /* guard halaman: tanpa permission view
     rev-6 poin 8: halaman boleh menyebut menu lain yang juga memberi hak baca
     (data-altperm). Dipakai oleh rincian AHS yang dibuka dari Unit Price List:
     role yang hanya berhak pada Unit Price List tetap dapat membacanya. */
  const ALT = (document.body.dataset.altperm || '').split(',').map(s => s.trim()).filter(Boolean);
  const bolehBaca = can(PAGE, 'view') || ALT.some(a => can(a, 'view'));
  if (!['dashboard', 'upload'].includes(PAGE) && !bolehBaca){
    const z = $('#zone');
    z.style.display = 'none';                       /* isi asli disembunyikan, tidak dihapus */
    const nx = document.createElement('div');
    nx.className = 'card';
    nx.innerHTML = `<div class="empty">
      ${icon('lock', 28)}<strong class="d-block mt-3">Anda tidak memiliki akses ke halaman ini.</strong>
      Hubungi Administrator, atau ganti role demo pada tombol di pojok kanan atas.</div>`;
    z.parentNode.insertBefore(nx, z);
    window.NOACCESS = true;
  }
}
function flatNav(){
  const out = [];
  NAV.forEach(n => { if (n.cap) return; out.push(n); (n.sub || []).forEach(s => out.push({...s, crumb: 'Master Data › Reference'})); });
  return out;
}

/* ---------- role banner helper ---------- */
function roleNote(text){
  return `<div class="role-note">${icon('info', 16)}<div>${text}</div></div>`;
}

if (!/index\.html$/.test(location.pathname)) buildShell();
