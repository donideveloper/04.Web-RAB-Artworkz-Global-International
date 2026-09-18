/* ============================================================
   Web RAB — Core engine (prototype)
   Data table, modal, toast, export. Bootstrap 5 based.
   ============================================================ */
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ---------- format ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf  = n => (isNaN(n) || n === null || n === '' ? '-' : Number(n).toLocaleString('id-ID', {maximumFractionDigits: 2}));
const rp  = n => (isNaN(n) || n === null || n === '' ? '-' : 'Rp ' + Number(n).toLocaleString('id-ID', {maximumFractionDigits: 0}));
const pct = n => (Number(n) * 100).toLocaleString('id-ID', {maximumFractionDigits: 2}) + '%';
const today = () => new Date().toISOString().slice(0, 10);
const dmy = s => { if (!s) return '-'; const d = new Date(s); return isNaN(d) ? s : String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + d.getFullYear(); };

/* terbilang (Indonesia) — dipakai modul Rekapitulasi & Quotation */
function terbilang(n){
  n = Math.floor(Math.abs(Number(n) || 0));
  const s = ['','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan','sepuluh','sebelas'];
  const f = x => x < 12 ? s[x]
    : x < 20 ? f(x - 10) + ' belas'
    : x < 100 ? f(Math.floor(x / 10)) + ' puluh ' + f(x % 10)
    : x < 200 ? 'seratus ' + f(x - 100)
    : x < 1000 ? f(Math.floor(x / 100)) + ' ratus ' + f(x % 100)
    : x < 2000 ? 'seribu ' + f(x - 1000)
    : x < 1e6 ? f(Math.floor(x / 1000)) + ' ribu ' + f(x % 1000)
    : x < 1e9 ? f(Math.floor(x / 1e6)) + ' juta ' + f(x % 1e6)
    : x < 1e12 ? f(Math.floor(x / 1e9)) + ' miliar ' + f(x % 1e9)
    : f(Math.floor(x / 1e12)) + ' triliun ' + f(x % 1e12);
  const t = f(n).replace(/\s+/g, ' ').trim();
  return (t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Nol') + ' rupiah';
}

/* ---------- icons (feather subset) ---------- */
const ICONS = {
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  box:'<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  tag:'<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="12" y2="18"/><line x1="16" y1="18" x2="16" y2="18"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  folder:'<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  chart:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  key:'<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  history:'<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><polyline points="12 7 12 12 15 15"/>',
  eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  list:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  print:'<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  alert:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  menu:'<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  sun:'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  moon:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  unlock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  chev:'<polyline points="9 18 15 12 9 6"/>',
  chevd:'<polyline points="6 9 12 15 18 9"/>',
  back:'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  send:'<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  money:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  paperclip:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  trend:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  refresh:'<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
  /* rev-6 poin 3: ikon aksi "Open" diganti dari tanda panah kecil (chev)
     menjadi lambang buka-halaman yang lebih mudah dikenali pengguna. */
  openpage:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  grid2:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="9" x2="9" y2="21"/>',
  minus:'<line x1="5" y1="12" x2="19" y2="12"/>',
  build:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
};
const icon = (n, s = 16) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;

/* ---------- storage ----------
   rev-6 poin 7: kunci penyimpanan diberi nomor revisi. Data contoh yang
   tersimpan dari revisi sebelumnya memakai istilah status lama
   (Sent / Won / Lost), sehingga kartu ringkasan Submit, Succeed, dan Failed
   pada Dashboard serta Project & Quotation terbaca 0 walaupun kolom Status
   pada tabel sudah memakai istilah baru. Dengan kunci baru, data lama tidak
   lagi terbaca; isi lama yang masih tersimpan tetap dipetakan oleh
   migrateDB() sebagai pengaman. */
const DBKEY  = 'rab_db_v6';
const DBOLD  = ['rab_db_v1', 'rab_db_v2', 'rab_db_v3', 'rab_db_v4', 'rab_db_v5'];
const STATUS_MAP = {sent:'Submit', terkirim:'Submit', won:'Succeed', menang:'Succeed',
                    succed:'Succeed', success:'Succeed', lost:'Failed', kalah:'Failed'};

/* samakan istilah status project apa pun asal datanya */
function normPrjStatus(s){
  const v = String(s ?? '').trim();
  if (!v) return 'Draft';
  const hit = PRJ_STATUS.find(x => x.toLowerCase() === v.toLowerCase());
  if (hit) return hit;
  return STATUS_MAP[v.toLowerCase()] || 'Draft';
}
function migrateDB(){
  (DB.PROJECT || []).forEach(p => { p.status = normPrjStatus(p.status); });
  (DB.REVISI  || []).forEach(r => { r.status = normPrjStatus(r.status); });
}
function saveDB(){ try{ localStorage.setItem(DBKEY, JSON.stringify(DB)); }catch(e){} }
function loadDB(){
  try{
    DBOLD.forEach(k => localStorage.removeItem(k));   /* buang data revisi lama */
    const raw = localStorage.getItem(DBKEY);
    if (raw) Object.assign(DB, JSON.parse(raw));
  }catch(e){}
  migrateDB();
}
function resetDB(){ localStorage.removeItem(DBKEY); location.reload(); }

/* ---------- toast (FSD Tabel 4) ---------- */
function toast(msg, type = 'ok'){
  let w = $('#toast-wrap');
  if (!w){ w = document.createElement('div'); w.id = 'toast-wrap'; w.className = 'toast-wrap'; document.body.appendChild(w); }
  const ic = type === 'err' ? 'alert' : type === 'warn' ? 'alert' : type === 'info' ? 'info' : 'check';
  const el = document.createElement('div');
  el.className = 'rtoast ' + (type === 'ok' ? '' : type);
  el.innerHTML = `<span style="color:var(--${type === 'err' ? 'danger' : type === 'warn' ? 'warn' : type === 'info' ? 'info' : 'ok'})">${icon(ic, 17)}</span><div>${esc(msg)}</div>`;
  w.appendChild(el);
  setTimeout(() => el.remove(), type === 'err' ? 5000 : 3000);
}

/* ---------- modal ---------- */
let modalSeq = 0;
function openModal({title, sub = '', body = '', size = 'md', footer = [], onShown}){
  const id = 'm' + (++modalSeq);
  const wrap = document.createElement('div');
  wrap.innerHTML = `
  <div class="modal fade" id="${id}" tabindex="-1">
    <div class="modal-dialog modal-${size} modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <div><h5>${esc(title)}</h5>${sub ? `<p>${esc(sub)}</p>` : ''}</div>
          <button type="button" class="icon-btn" data-bs-dismiss="modal" aria-label="Close">${icon('x', 17)}</button>
        </div>
        <div class="modal-body">${body}</div>
        ${footer.length ? '<div class="modal-footer"></div>' : ''}
      </div>
    </div>
  </div>`;
  document.body.appendChild(wrap.firstElementChild);
  const el = $('#' + id);
  const inst = new bootstrap.Modal(el);
  const close = () => inst.hide();
  const ft = $('.modal-footer', el);
  if (ft) footer.forEach(b => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn ' + (b.cls || 'btn-ghost');
    btn.innerHTML = (b.ic ? icon(b.ic, 15) : '') + ' ' + esc(b.label);
    if (b.id) btn.id = b.id;
    if (b.disabled) btn.disabled = true;
    btn.onclick = () => b.onClick ? b.onClick(close, el) : close();
    ft.appendChild(btn);
  });
  el.addEventListener('shown.bs.modal', () => { SW.bind(el); onShown && onShown(el, close); });
  el.addEventListener('hidden.bs.modal', () => el.remove());
  inst.show();
  return {el, close};
}

function confirmModal({title, text, okLabel = 'Yes, Continue', danger = true, onOk}){
  openModal({
    title, size: 'sm',
    body: `<div class="alert-box ${danger ? 'danger' : 'warn'}">${icon('alert', 17)}<div>${text}</div></div>`,
    footer: [
      {label: 'Cancel'},
      {label: okLabel, cls: danger ? 'btn-danger' : 'btn-primary', ic: 'check', onClick: c => { c(); onOk && onOk(); }}
    ]
  });
}

function detailHTML(pairs){
  return '<dl class="dl-detail">' + pairs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v ?? '-'}</dd>`).join('') + '</dl>';
}

/* ---------- kendali switch (rev-5 / P-29) ----------
   Satu tempat untuk seluruh aplikasi: pembacaan nilai, label, dan pengikatan
   peristiwa. Halaman cukup menulis {type:'switch'} pada field status. */
const SW = {
  isOn(v, f){
    if (v === true) return true;
    if (v === false || v === undefined || v === null || v === '') return f && f.def === false ? false : (v === '' ? true : false);
    return String(v).toLowerCase() === String((f && f.on) || 'Aktif').toLowerCase();
  },
  /* pasang label yang berubah mengikuti keadaan switch */
  bind(el){
    $$('[data-switch]', el).forEach(i => {
      const lb = $(`[data-swlb="${i.name}"]`, el);
      const paint = () => { if (lb) lb.textContent = i.checked ? 'Aktif' : 'Non Aktif'; };
      i.onchange = paint;
      paint();
    });
  }
};

/* ============================================================
   rev-6 poin 4 — Searchable dropdown (SSEL)
   ------------------------------------------------------------
   Seluruh dropdown pada aplikasi (form Add/Edit, filter kolom tabel, dan
   pemilih pada halaman laporan) diganti menjadi dropdown yang dapat dicari.

   Cara kerja: elemen <select> aslinya TIDAK dihapus, hanya disembunyikan,
   lalu di sampingnya dipasang tombol + panel pencarian. Dengan cara ini
   seluruh kode yang sudah ada tetap berjalan tanpa perubahan:
     - readForm()   membaca nilai melalui select.value
     - validateForm() menandai select yang kosong (kelas is-invalid)
     - halaman yang memuat ulang pilihan dengan select.innerHTML = ...
       (contoh: Brand dan Supplier pada menu Material) otomatis tersegarkan
       melalui MutationObserver.
   Panel memakai position:fixed agar tidak terpotong oleh area modal atau
   tabel yang dapat digulir.
   ============================================================ */
const SSEL = {
  cur: null,

  /* ubah seluruh <select> yang memenuhi syarat menjadi searchable */
  scan(root = document){
    $$('select', root).forEach(sel => {
      if (sel.dataset.ssel || sel.classList.contains('page-size') || sel.hasAttribute('data-nossel')) return;
      SSEL.upgrade(sel);
    });
  },

  upgrade(sel){
    sel.dataset.ssel = '1';
    const small = !!sel.closest('.filter-row');
    const wrap = document.createElement('div');
    wrap.className = 'ssel' + (small ? ' sm' : '');
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    sel.classList.add('ssel-src');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ssel-btn';
    btn.disabled = sel.disabled;
    btn.innerHTML = `<span class="ssel-txt"></span><span class="ssel-car">${icon('chevd', small ? 13 : 15)}</span>`;
    wrap.appendChild(btn);

    SSEL.paint(wrap);
    /* pilihan yang dimuat ulang oleh halaman (cascading dropdown) */
    new MutationObserver(() => SSEL.paint(wrap)).observe(sel, {childList: true});
    sel.addEventListener('change', () => SSEL.paint(wrap));
  },

  paint(wrap){
    const sel = $('select', wrap), btn = $('.ssel-btn', wrap);
    if (!sel || !btn) return;
    const o = sel.selectedOptions[0];
    const t = $('.ssel-txt', btn);
    const empty = !o || o.value === '';
    t.textContent = o ? o.textContent : '';
    t.classList.toggle('ph', empty);
    if (empty && (!o || !o.textContent)) t.textContent = sel.dataset.ph || 'Pilih…';
    btn.disabled = sel.disabled;
  },

  open(wrap){
    SSEL.close();
    const sel = $('select', wrap);
    if (!sel || sel.disabled) return;
    wrap.classList.add('open');

    const pop = document.createElement('div');
    pop.className = 'ssel-pop';
    const many = sel.options.length > 5;
    pop.innerHTML = `
      ${many ? `<div class="ssel-sb">${icon('search', 15)}<input type="text" class="ssel-q" placeholder="Cari pilihan…" autocomplete="off"></div>` : ''}
      <div class="ssel-list"></div>
      <div class="ssel-none" hidden>Pilihan tidak ditemukan.</div>
      ${many ? `<div class="ssel-foot">${sel.options.length} pilihan · ketik untuk menyaring</div>` : ''}`;
    document.body.appendChild(pop);
    SSEL.cur = {wrap, sel, pop};

    SSEL.list('');
    SSEL.place();
    const q = $('.ssel-q', pop);
    if (q){ q.focus(); q.oninput = () => SSEL.list(q.value); }
  },

  list(term){
    const c = SSEL.cur;
    if (!c) return;
    const t = String(term || '').trim().toLowerCase();
    const box = $('.ssel-list', c.pop);
    const opts = Array.from(c.sel.options).filter(o => !t || o.textContent.toLowerCase().includes(t));
    box.innerHTML = opts.map(o => {
      const lb = esc(o.textContent);
      const hl = t ? lb.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>') : lb;
      return `<button type="button" class="ssel-opt ${o.selected ? 'on' : ''}" data-v="${esc(o.value)}">
        <span class="ssel-ck">${icon('check', 14)}</span><span>${hl || '<i class="text-ink3">(kosong)</i>'}</span></button>`;
    }).join('');
    $('.ssel-none', c.pop).hidden = opts.length > 0;
    $$('.ssel-opt', box).forEach(b => b.onclick = () => SSEL.pick(b.dataset.v));
    const on = $('.ssel-opt.on', box);
    if (on) on.scrollIntoView({block: 'nearest'});
  },

  pick(v){
    const c = SSEL.cur;
    if (!c) return;
    c.sel.value = v;
    c.sel.dispatchEvent(new Event('input',  {bubbles: true}));
    c.sel.dispatchEvent(new Event('change', {bubbles: true}));
    SSEL.paint(c.wrap);
    const btn = $('.ssel-btn', c.wrap);
    SSEL.close();
    if (btn) btn.focus();
  },

  place(){
    const c = SSEL.cur;
    if (!c) return;
    const r = $('.ssel-btn', c.wrap).getBoundingClientRect();
    const w = Math.max(r.width, 210);
    const h = c.pop.offsetHeight;
    const below = window.innerHeight - r.bottom;
    c.pop.style.width = w + 'px';
    c.pop.style.left  = Math.min(Math.max(8, r.left), window.innerWidth - w - 8) + 'px';
    c.pop.style.top   = (below < h + 12 && r.top > h + 12 ? r.top - h - 5 : r.bottom + 5) + 'px';
  },

  move(step){
    const c = SSEL.cur;
    if (!c) return;
    const items = $$('.ssel-opt', c.pop);
    if (!items.length) return;
    let i = items.findIndex(x => x.classList.contains('hi'));
    if (i < 0) i = items.findIndex(x => x.classList.contains('on'));
    i = Math.max(0, Math.min(items.length - 1, i + step));
    items.forEach(x => x.classList.remove('hi'));
    items[i].classList.add('hi');
    items[i].scrollIntoView({block: 'nearest'});
  },

  close(){
    if (!SSEL.cur) return;
    SSEL.cur.wrap.classList.remove('open');
    SSEL.cur.pop.remove();
    SSEL.cur = null;
  }
};

document.addEventListener('mousedown', e => {
  const btn = e.target.closest('.ssel-btn');
  if (btn){
    e.preventDefault();
    const wrap = btn.closest('.ssel');
    if (SSEL.cur && SSEL.cur.wrap === wrap) SSEL.close(); else SSEL.open(wrap);
    return;
  }
  if (SSEL.cur && !e.target.closest('.ssel-pop')) SSEL.close();
});
/* Dipasang pada tahap capture agar berjalan lebih dulu daripada penangan
   milik Bootstrap. rev-6 poin 14 (P-50): tanpa ini, menekan Esc untuk menutup
   panel pilihan ikut menutup seluruh jendela Add/Edit dan isian yang sudah
   diketik hilang. */
document.addEventListener('keydown', e => {
  if (!SSEL.cur) return;
  if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); SSEL.close(); }
  else if (e.key === 'ArrowDown'){ e.preventDefault(); SSEL.move(1); }
  else if (e.key === 'ArrowUp'){ e.preventDefault(); SSEL.move(-1); }
  else if (e.key === 'Enter'){
    e.preventDefault(); e.stopPropagation();
    const hi = $('.ssel-opt.hi', SSEL.cur.pop) || $('.ssel-opt', SSEL.cur.pop);
    if (hi) SSEL.pick(hi.dataset.v);
  }
}, true);
window.addEventListener('resize', () => SSEL.close());
window.addEventListener('scroll', () => SSEL.close(), true);

/* pasang otomatis pada isi halaman yang digambar belakangan (tabel, modal) */
(function(){
  let t;
  const run = () => { clearTimeout(t); t = setTimeout(() => SSEL.scan(document), 30); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  new MutationObserver(run).observe(document.documentElement, {childList: true, subtree: true});
})();

/* ---------- form builder ----------
   rev-6 poin 13 (P-49): field bertanda {seg:true} yang letaknya berurutan
   dikumpulkan ke dalam SATU panel. Dipakai oleh lima segmen pembentuk kode
   material (Category . Type . Specification . Brand . Varian) supaya terbaca
   sebagai satu kesatuan. Lebar kolom tetap dua seperti form lainnya agar isi
   dropdown tidak terpotong; yang merapatkan Varian ke Specification adalah
   keterangan bantuan yang dipendekkan, bukan penyempitan kolom. */
function formHTML(fields, data = {}){
  const out = [];
  let buf = [];
  const flush = () => {
    if (!buf.length) return;
    out.push(`<div class="full seg-row"><div class="seg-grid">${buf.map(f => fieldHTML(f, data)).join('')}</div></div>`);
    buf = [];
  };
  fields.forEach(f => { if (f.seg) buf.push(f); else { flush(); out.push(fieldHTML(f, data)); } });
  flush();
  return '<div class="form-grid">' + out.join('') + '</div>';
}

function fieldHTML(f, data = {}){
  return [f].map(f => {
    const v = data[f.key] ?? f.def ?? '';
    const req = f.required ? '<span class="req">*</span>' : '';
    let ctl;
    if (f.type === 'select')
      ctl = `<select class="form-select" name="${f.key}" ${f.disabled ? 'disabled' : ''}>${(typeof f.options === 'function' ? f.options(data) : f.options).map(o => {
        const val = typeof o === 'object' ? o.v : o, lb = typeof o === 'object' ? o.l : o;
        return `<option value="${esc(val)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(lb)}</option>`;
      }).join('')}</select>`;
    else if (f.type === 'textarea')
      ctl = `<textarea class="form-control" rows="${f.rows || 3}" name="${f.key}" placeholder="${esc(f.ph || '')}">${esc(v)}</textarea>`;
    else if (f.type === 'checks')
      /* Perbaikan rev-4: options boleh berupa fungsi (sama seperti tipe select).
         Sebelumnya f.options.map() gagal bila options berupa fungsi, sehingga
         form Add/Edit User tidak dapat dibuka. */
      ctl = `<div class="d-flex flex-wrap gap-3 p-2 rounded" style="border:1px solid var(--line)">` +
        (typeof f.options === 'function' ? f.options(data) : f.options).map(o => {
          const val = typeof o === 'object' ? o.v : o, lb = typeof o === 'object' ? o.l : o;
          const on = (Array.isArray(v) ? v : String(v).split(',')).map(x => String(x).trim()).includes(String(val));
          return `<label class="form-check"><input class="form-check-input" type="checkbox" name="${f.key}" value="${esc(val)}" ${on ? 'checked' : ''}> <span class="form-check-label">${esc(lb)}</span></label>`;
        }).join('') + `</div>`;
    else if (f.type === 'switch'){
      /* rev-5 poin 10 (P-29): status Aktif/Non Aktif memakai switch, bukan dropdown.
         Nilai di layar berupa menyala/mati, namun tetap disimpan sebagai teks
         'Aktif' / 'Nonaktif' agar penyaring tabel, badge status, dan seluruh
         fungsi yang membaca kolom status tidak perlu diubah. */
      const on = SW.isOn(v, f);
      ctl = `<div class="switch-wrap">
        <div class="form-check form-switch m-0">
          <input class="form-check-input" type="checkbox" role="switch" name="${f.key}" data-switch="1"
                 data-on="${esc(f.on || 'Aktif')}" data-off="${esc(f.off || 'Nonaktif')}" ${on ? 'checked' : ''} ${f.disabled ? 'disabled' : ''}>
        </div>
        <span class="switch-lb" data-swlb="${f.key}">${on ? esc(f.onLabel || 'Aktif') : esc(f.offLabel || 'Non Aktif')}</span>
      </div>`;
    }
    else if (f.type === 'static')
      ctl = `<div class="${f.cls || 'code-preview'}" data-static="${f.key}">${v || '—'}</div>`;
    else
      ctl = `<input class="form-control" type="${f.type || 'text'}" name="${f.key}" value="${esc(v)}" placeholder="${esc(f.ph || '')}" ${f.disabled ? 'disabled' : ''} ${f.step ? `step="${f.step}"` : ''}>`;
    return `<div class="${f.full ? 'full' : ''}">
      <label class="form-label">${esc(f.label)}${req}</label>${ctl}
      ${f.help ? `<span class="form-hint">${esc(f.help)}</span>` : ''}
      <span class="field-err" data-err="${f.key}" hidden></span></div>`;
  }).join('');
}

function readForm(el, fields){
  const out = {};
  fields.forEach(f => {
    if (f.type === 'checks'){
      out[f.key] = $$(`[name="${f.key}"]:checked`, el).map(i => i.value);
    } else if (f.type === 'switch'){
      const i = $(`[name="${f.key}"][data-switch]`, el);
      if (i) out[f.key] = i.checked ? (i.dataset.on || 'Aktif') : (i.dataset.off || 'Nonaktif');
    } else if (f.type === 'static'){
      const s = $(`[data-static="${f.key}"]`, el);
      out[f.key] = s ? s.textContent.trim() : '';
    } else {
      const i = $(`[name="${f.key}"]`, el);
      if (i) out[f.key] = f.type === 'number' ? (i.value === '' ? '' : Number(i.value)) : i.value.trim();
    }
  });
  return out;
}

function validateForm(el, fields, values, extra){
  let ok = true;
  $$('.field-err', el).forEach(e => { e.hidden = true; });
  $$('.form-control,.form-select', el).forEach(e => e.classList.remove('is-invalid'));
  const fail = (key, msg) => {
    ok = false;
    const e = $(`[data-err="${key}"]`, el);
    if (e){ e.textContent = msg; e.hidden = false; }
    const i = $(`[name="${key}"]`, el);
    if (i) i.classList.add('is-invalid');
  };
  fields.forEach(f => {
    const v = values[f.key];
    if (f.required && (v === '' || v === null || v === undefined || (Array.isArray(v) && !v.length)))
      fail(f.key, `${f.label} wajib diisi.`);
    else if (f.rule){ const m = f.rule(v, values); if (m) fail(f.key, m); }
  });
  if (extra) extra(fail, values);
  return ok;
}

/* ============================================================
   Data table
   ============================================================ */
const TSTATE = {};

function renderTable(mount, cfg){
  const host = typeof mount === 'string' ? $(mount) : mount;
  const st = TSTATE[cfg.key] = TSTATE[cfg.key] || {sort: null, dir: 1, filters: {}, page: 1, size: 10};
  cfg._host = host;

  const acts = (cfg.toolbar || []).filter(b => can(cfg.perm, b.perm || 'view'));
  host.innerHTML = `
    <div class="card">
      <div class="card-tb">
        <div><h2>${esc(cfg.title)}</h2>${cfg.desc ? `<p>${esc(cfg.desc)}</p>` : ''}</div>
        <div class="acts">${acts.map((b, i) => `<button class="btn ${b.cls || 'btn-ghost'}" data-tb="${i}">${icon(b.ic || 'plus', 15)} ${esc(b.label)}</button>`).join('')}</div>
      </div>
      <div class="tbl-wrap"><table class="dt"><thead></thead><tbody></tbody></table></div>
      <div class="card-foot">
        <div class="d-flex align-items-center gap-2">
          <span>Show</span>
          <select class="page-size">${[10, 25, 50, 100].map(n => `<option ${n === st.size ? 'selected' : ''}>${n}</option>`).join('')}</select>
          <span class="count"></span>
        </div>
        <div class="pager"></div>
      </div>
    </div>`;
  acts.forEach((b, i) => $(`[data-tb="${i}"]`, host).onclick = () => b.onClick(cfg));
  $('.page-size', host).onchange = e => { st.size = +e.target.value; st.page = 1; drawTable(cfg); };
  drawTable(cfg);
}

function tableRows(cfg){
  const st = TSTATE[cfg.key];
  let rows = (typeof cfg.rows === 'function' ? cfg.rows() : cfg.rows).slice();
  Object.entries(st.filters).forEach(([k, v]) => {
    if (!v) return;
    const col = cfg.columns.find(c => c.key === k);
    rows = rows.filter(r => {
      const val = String(col.filterValue ? col.filterValue(r) : (r[k] ?? ''));
      return col.filter === 'select' ? val === v : val.toLowerCase().includes(v.toLowerCase());
    });
  });
  if (st.sort){
    const col = cfg.columns.find(c => c.key === st.sort);
    rows.sort((a, b) => {
      const va = col.sortValue ? col.sortValue(a) : a[st.sort], vb = col.sortValue ? col.sortValue(b) : b[st.sort];
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * st.dir;
      return String(va ?? '').localeCompare(String(vb ?? ''), 'id') * st.dir;
    });
  }
  return rows;
}

function drawTable(cfg){
  const host = cfg._host, st = TSTATE[cfg.key];
  const rows = tableRows(cfg);
  const pages = Math.max(1, Math.ceil(rows.length / st.size));
  if (st.page > pages) st.page = pages;
  const view = rows.slice((st.page - 1) * st.size, st.page * st.size);
  const showActs = cfg.actions && cfg.actions.length;

  $('thead', host).innerHTML = `
    <tr>${cfg.columns.map(c => `<th class="${c.align || ''} ${c.sort === false ? '' : 'sortable'} ${st.sort === c.key ? 'sorted' : ''}"
        data-col="${c.key}" ${c.width ? `style="width:${c.width}"` : ''}>${esc(c.label)}${c.sort === false ? '' :
        `<span class="arr">${st.sort === c.key ? (st.dir > 0 ? '↑' : '↓') : '↕'}</span>`}</th>`).join('')}
      ${showActs ? '<th class="right" style="width:130px">Actions</th>' : ''}</tr>
    <tr class="filter-row">${cfg.columns.map(c => `<th>${c.filter === false ? '' :
      c.filter === 'select'
        ? `<select data-f="${c.key}"><option value="">All</option>${(typeof c.options === 'function' ? c.options() : c.options || []).map(o => `<option ${st.filters[c.key] === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`
        : `<input data-f="${c.key}" placeholder="Search" value="${esc(st.filters[c.key] || '')}">`}</th>`).join('')}
      ${showActs ? '<th></th>' : ''}</tr>`;

  $$('th.sortable', host).forEach(th => th.onclick = () => {
    const k = th.dataset.col;
    if (st.sort === k) st.dir = -st.dir; else { st.sort = k; st.dir = 1; }
    drawTable(cfg);
  });
  $$('[data-f]', host).forEach(inp => {
    const ev = inp.tagName === 'SELECT' ? 'change' : 'input';
    let t;
    inp.addEventListener(ev, e => {
      clearTimeout(t);
      t = setTimeout(() => { st.filters[inp.dataset.f] = e.target.value; st.page = 1; drawTable(cfg); }, ev === 'input' ? 300 : 0);
    });
    inp.addEventListener('click', e => e.stopPropagation());
  });

  const tb = $('tbody', host);
  if (!view.length){
    tb.innerHTML = `<tr><td colspan="${cfg.columns.length + (showActs ? 1 : 0)}"><div class="empty">
      <strong>Data tidak ditemukan.</strong>Ubah kata kunci pencarian atau filter.</div></td></tr>`;
  } else {
    /* rev-6 poin 24 (P-60): kolom kode menjadi tautan pembuka jendela Detail,
       menggantikan ikon View pada kolom Actions. Kolom yang dijadikan tautan
       adalah kolom kunci (cfg.idKey); bila kunci itu tidak muncul sebagai
       kolom, dipakai kolom pertama. Tautan hanya dipasang bila menu tersebut
       memang memiliki jendela Detail. */
    const linkKey = linkColumn(cfg);
    tb.innerHTML = view.map((r, i) => `<tr data-i="${i}" class="${cfg.rowClass ? cfg.rowClass(r) : ''}">
      ${cfg.columns.map(c => {
        const isi = c.render ? c.render(r) : esc(r[c.key] ?? '');
        return `<td class="${c.align || ''}">${c.key === linkKey
          ? `<a href="#" class="cell-link" data-view title="Lihat detail">${isi}</a>` : isi}</td>`;
      }).join('')}
      ${showActs ? `<td><div class="row-acts">${rowActions(cfg, r).join('')}</div></td>` : ''}</tr>`).join('');
    $$('tbody tr', host).forEach((tr, i) => {
      const r = view[i];
      $$('[data-act]', tr).forEach(b => b.onclick = e => { e.stopPropagation(); runAction(cfg, b.dataset.act, r); });
      $$('[data-view]', tr).forEach(a => a.onclick = e => { e.preventDefault(); e.stopPropagation(); runAction(cfg, 'view', r); });
      if (cfg.onRowClick) tr.onclick = () => cfg.onRowClick(r, tr);
    });
  }
  $('.count', host).textContent = `of ${rows.length} entries`;
  /* rev-6 poin 7: ringkasan di atas tabel digambar ulang setiap tabel berubah,
     sehingga angka kartu selalu sama dengan isi kolom Status. */
  if (cfg.onDraw) cfg.onDraw(rows);
  const pg = $('.pager', host);
  const btn = (lb, p, dis, act) => `<button ${dis ? 'disabled' : ''} class="${act ? 'active' : ''}" data-p="${p}">${lb}</button>`;
  let h = btn('‹', st.page - 1, st.page === 1);
  const from = Math.max(1, st.page - 2), to = Math.min(pages, from + 4);
  for (let p = from; p <= to; p++) h += btn(p, p, false, p === st.page);
  h += btn('›', st.page + 1, st.page === pages);
  pg.innerHTML = h;
  $$('button[data-p]', pg).forEach(b => b.onclick = () => { st.page = +b.dataset.p; drawTable(cfg); });
}

const ACT_META = {
  view:   {ic: 'eye',     t: 'View',      perm: 'view'},
  edit:   {ic: 'edit',    t: 'Edit',      perm: 'edit'},
  delete: {ic: 'trash',   t: 'Delete',    perm: 'delete', cls: 'danger'},
  copy:   {ic: 'copy',    t: 'Duplicate', perm: 'add'},
  history:{ic: 'history', t: 'History',   perm: 'view'},
  detail: {ic: 'list',    t: 'Detail',    perm: 'view'},
  print:  {ic: 'print',   t: 'Print',     perm: 'print'},
  unlock: {ic: 'unlock',  t: 'Unlock Account', perm: 'edit', cls: 'warnh'},
  price:  {ic: 'money',   t: 'Add New Price', perm: 'edit'},
  perm:   {ic: 'shield',  t: 'Set Permission', perm: 'edit'},
  /* rev-6 poin 3: ikon "Open" memakai lambang buka-halaman dan judul yang
     menyebut tujuannya, agar pengguna langsung paham fungsinya. */
  open:   {ic: 'openpage', t: 'Buka Halaman Detail', perm: 'view'},
  /* rev-4 — rev-6 poin 11 (P-47): kedua aksi ini sama-sama berarti "buka
     tingkat berikutnya" pada menu Kategori, sehingga memakai ikon yang sama
     dengan aksi Open (openpage). Yang membedakan hanya keterangan tombolnya. */
  types:  {ic: 'openpage', t: 'Lihat Type',          perm: 'view'},
  specs:  {ic: 'openpage', t: 'Lihat Specification', perm: 'view'},
  rate:   {ic: 'money',   t: 'Add New Rate',        perm: 'edit'},
  submit: {ic: 'send',    t: 'Submit for Verification', perm: 'edit'},
  approve:{ic: 'check',   t: 'Approve',   perm: 'approve'},
  reject: {ic: 'x',       t: 'Reject',    perm: 'approve', cls: 'danger'}
};
/* rev-6 poin 24 (P-60): kolom mana yang dijadikan tautan Detail.
   Dipakai bersama oleh drawTable dan rowActions supaya keduanya tidak pernah
   berbeda pendapat: bila kolomnya ada, ikon View dilepas; bila tidak ada
   (menu tanpa jendela Detail), ikon View tetap seperti semula. */
function linkColumn(cfg){
  if (!cfg.detail) return null;
  const k = cfg.columns.some(c => c.key === cfg.idKey) ? cfg.idKey : (cfg.columns[0] || {}).key;
  return k || null;
}

function rowActions(cfg, r){
  const list = typeof cfg.actions === 'function' ? cfg.actions(r) : cfg.actions;
  const adaTautan = !!linkColumn(cfg);
  return list.filter(a => {
    const k = a.k || a;
    /* rev-6 poin 24 (P-60): ikon View dilepas dari kolom Actions karena
       fungsinya sudah dipegang tautan pada kolom kode. */
    if (k === 'view' && adaTautan) return false;
    const m = ACT_META[k] || {};
    return can(cfg.perm, (a.perm || m.perm || 'view'));
  }).map(a => {
    const k = a.k || a, m = ACT_META[k] || {};
    return `<button class="icon-btn ${a.cls || m.cls || ''}" data-act="${k}" title="${esc(a.t || m.t || k)}">${icon(a.ic || m.ic || 'eye', 16)}</button>`;
  });
}
function runAction(cfg, k, r){
  if (cfg.onAction && cfg.onAction(k, r) === true) return;
  /* rev-6 poin 8: ukuran jendela dan tombol tambahan dapat diatur per menu
     melalui cfg.detailSize dan cfg.detailFooter. */
  if (k === 'view' && cfg.detail) return openModal({
    title: cfg.entity + ' Detail',
    sub: cfg.detailSub ? cfg.detailSub(r) : '',
    size: cfg.detailSize || 'lg',
    body: cfg.detail(r),
    footer: [{label: 'Close'}].concat(cfg.detailFooter ? cfg.detailFooter(r) : [])
  });
  if (k === 'edit') return formModal(cfg, r);
  if (k === 'copy') { const c = {...r}; c[cfg.idKey] = ''; return formModal(cfg, c, true); }
  if (k === 'delete') return confirmModal({
    title: 'Confirm Delete',
    text: `Nonaktifkan <b>${esc(r[cfg.idKey])}</b>? Data tidak akan muncul pada transaksi baru (soft delete, kolom IS_DELETE).`,
    onOk: () => {
      const arr = typeof cfg.rows === 'function' ? cfg.rows() : cfg.rows;
      const i = arr.findIndex(x => x[cfg.idKey] === r[cfg.idKey]);
      if (i > -1) arr.splice(i, 1);
      saveDB(); drawTable(cfg); toast('Data berhasil dihapus.');
    }
  });
  if (k === 'history') return openModal({
    title: 'Change History', sub: r[cfg.idKey], size: 'lg',
    body: historyHTML(r, cfg), footer: [{label: 'Close'}]
  });
  if (k === 'print'){ toast('Menyiapkan dokumen cetak…', 'info'); setTimeout(() => window.print(), 400); return; }
  toast('Prototype: aksi "' + k + '" belum dihubungkan ke server.', 'info');
}

function historyHTML(r, cfg){
  const base = Number(r.harga || r.tarif || r.hsp || 0) || 1000000;
  const rows = [0, -1, -2, -3].map((i, n) => {
    const val = Math.round(base * (1 - n * 0.06));
    const prev = Math.round(base * (1 - (n + 1) * 0.06));
    return {per: `01/${String(9 - n * 3).padStart(2, '0')}/2026 — ${n ? 'berakhir' : 'sekarang'}`, val, d: val - prev};
  });
  return `<div class="tbl-wrap"><table class="dt"><thead><tr>
    <th>Periode Berlaku</th><th class="right">Harga</th><th class="right">Selisih</th><th class="right">%</th><th>Dicatat Oleh</th><th>Waktu</th>
  </tr></thead><tbody>${rows.map(x => `<tr>
    <td>${x.per}</td><td class="right num">${rp(x.val)}</td>
    <td class="right num" style="color:var(--${x.d >= 0 ? 'danger' : 'ok'})">${x.d >= 0 ? '+' : ''}${nf(x.d)}</td>
    <td class="right num" style="color:var(--${x.d >= 0 ? 'danger' : 'ok'})">${((x.d / (x.val - x.d)) * 100).toFixed(2)}%</td>
    <td>Rina Purnama</td><td class="text-ink3">01/09/2026 09:14</td></tr>`).join('')}</tbody></table></div>
    <p class="text-ink3 mt-3" style="font-size:12px">Selisih positif ditampilkan merah, selisih negatif hijau (FSD — Riwayat Harga).</p>`;
}

/* ---------- add / edit modal ---------- */
function formModal(cfg, row, isCopy){
  const isNew = !row || !row[cfg.idKey] || isCopy;
  const data = row ? {...row} : (cfg.formDefaults ? cfg.formDefaults() : {});
  const fields = typeof cfg.form === 'function' ? cfg.form(data, isNew) : cfg.form;
  openModal({
    title: (isNew ? 'Add ' : 'Edit ') + cfg.entity,
    sub: cfg.formSub || 'Isian bertanda * wajib diisi.',
    size: cfg.formSize || 'md',
    body: formHTML(fields, data),
    footer: [
      {label: 'Cancel'},
      {label: 'Save', cls: 'btn-primary', ic: 'save', onClick: (close, el) => {
        const out = readForm(el, fields);
        if (!validateForm(el, fields, out, cfg.extraValidate)) return;
        const arr = typeof cfg.rows === 'function' ? cfg.rows() : cfg.rows;
        if (cfg.beforeSave) cfg.beforeSave(out, isNew);
        if (isNew) arr.unshift(out);
        else Object.assign(arr.find(x => x[cfg.idKey] === row[cfg.idKey]), out);
        saveDB(); drawTable(cfg); close();
        toast(`Data ${cfg.entity.toLowerCase()} berhasil disimpan.`);
      }}
    ],
    onShown: el => { SW.bind(el); cfg.onFormShown && cfg.onFormShown(el, data); }
  });
}

/* ---------- toolbar presets ---------- */
const TB = {
  add: ent => ({label: 'Add ' + ent, ic: 'plus', cls: 'btn-primary', perm: 'add', onClick: c => formModal(c)}),
  /* Download Template TIDAK disediakan di toolbar menu — tombolnya hanya ada
     pada halaman Upload Excel, agar tidak ada dua tempat untuk fungsi yang sama. */
  upload: (mod) => ({label: 'Upload Excel', ic: 'upload', perm: 'import', onClick: () => location.href = 'upload-preview.html?m=' + mod}),
  download: () => ({label: 'Download Excel', ic: 'download', perm: 'export', onClick: cfg => exportExcel(cfg)})
};

function exportExcel(cfg){
  const rows = tableRows(cfg);
  const head = cfg.columns.map(c => c.label);
  const body = rows.map(r => cfg.columns.map(c => c.exportValue ? c.exportValue(r) : (r[c.key] ?? '')));
  const csv = [head, ...body].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], {type: 'text/csv;charset=utf-8'}));
  a.download = cfg.key + '-' + today() + '.csv';
  a.click();
  toast(`${rows.length} baris berhasil diekspor sesuai filter aktif.`);
}

/* ---------- rev-4: umur harga / tarif ----------
   Batas umur diambil dari Master Data Setting SET-005 "Batas Umur Harga Material".
   Logika sama untuk Bahan dan Upah:
     - harga kosong / belum pernah dicatat        -> Belum Ada Harga
     - umur (hari) > SET-005                      -> Kedaluwarsa
     - selain itu                                 -> Terkini                        */
function priceAgeLimit(){
  const s = (DB.SETTING || []).find(x => x.kode === 'SET-005');
  return Number(s ? s.nilai : 90) || 90;
}
function priceAgeDays(tgl){
  if (!tgl) return null;
  const d = new Date(tgl);
  if (isNaN(d)) return null;
  return Math.floor((new Date(today()) - d) / 86400000);
}
function priceStatus(nilai, tgl){
  if (!nilai || !tgl) return 'Belum Ada Harga';
  const u = priceAgeDays(tgl);
  return (u !== null && u > priceAgeLimit()) ? 'Kedaluwarsa' : 'Terkini';
}
function priceAgeNote(tgl){
  const u = priceAgeDays(tgl);
  if (u === null) return 'Belum pernah dicatat.';
  return `Umur harga ${u} hari sejak ${dmy(tgl)} · batas ${priceAgeLimit()} hari (Setting SET-005).`;
}

/* ---------- rev-4: alur persetujuan Material Breakdown ----------
   Submit  : Estimator (hak akses edit)  — Draft / Ditolak -> Menunggu Verifikasi
   Approve : Supervisor Estimasi (hak akses approve) — Menunggu Verifikasi -> Disetujui
   Reject  : Supervisor Estimasi (hak akses approve) — Menunggu Verifikasi -> Ditolak   */
function logAudit(modul, aksi, data, ket){
  if (!DB.AUDIT) return;
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  DB.AUDIT.unshift({
    waktu: `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`,
    user: DB.PROFILE.username, modul, aksi, data, grp: 'Operasional', ket
  });
}
function bdSubmit(r, after){
  if (!can('material-breakdown', 'edit')){ toast('Role Anda tidak berhak mengajukan verifikasi breakdown.', 'err'); return; }
  openModal({
    title: 'Submit for Verification', sub: r.kode + ' — ' + r.nama, size: 'md',
    body: `<div class="alert-box info">${icon('info',17)}<div>Breakdown diajukan kepada <b>Supervisor Estimasi</b>.
      Setelah diajukan, baris material terkunci dari penyuntingan sampai disetujui atau ditolak.</div></div>` +
      formHTML([{key:'ket', label:'Catatan untuk Verifikator', type:'textarea', full:true,
        ph:'contoh: penyesuaian ukuran ambalan sesuai gambar kerja rev C'}], {}),
    footer: [{label:'Cancel'}, {label:'Submit', cls:'btn-primary', ic:'send', onClick:(c, el) => {
      r.status = 'Menunggu Verifikasi';
      r.oleh_submit = DB.PROFILE.nama;
      r.catatan_submit = ($('[name="ket"]', el) || {}).value || '';
      logAudit('Material Breakdown', 'Submit', r.kode, 'Status ' + (r.status) + ' — diajukan ' + DB.PROFILE.nama);
      saveDB(); c(); after && after();
      toast('Breakdown ' + r.kode + ' diajukan untuk verifikasi Supervisor Estimasi.');
    }}]
  });
}
function bdApprove(r, ok, after){
  if (!can('material-breakdown', 'approve')){ toast('Hanya Supervisor Estimasi yang dapat menyetujui atau menolak breakdown.', 'err'); return; }
  openModal({
    title: ok ? 'Approve Breakdown' : 'Reject Breakdown', sub: r.kode + ' — ' + r.nama, size: 'md',
    body: `<div class="alert-box ${ok ? 'info' : 'warn'}">${icon(ok ? 'info' : 'alert', 17)}<div>${ok
        ? 'Setelah disetujui, rekapitulasi breakdown ini dapat ditarik menjadi blok B (Bahan) pada Unit Price Analysis (AHS).'
        : 'Breakdown dikembalikan kepada Estimator untuk diperbaiki. Alasan penolakan wajib diisi.'}</div></div>` +
      formHTML([{key:'ket', label: ok ? 'Catatan Persetujuan' : 'Alasan Penolakan', type:'textarea', full:true,
        required: !ok}], {}),
    footer: [{label:'Cancel'}, {label: ok ? 'Approve' : 'Reject', cls: ok ? 'btn-primary' : 'btn-danger',
      ic: ok ? 'check' : 'x', onClick:(c, el) => {
        const ket = ($('[name="ket"]', el) || {}).value || '';
        if (!ok && !ket.trim()){ toast('Alasan penolakan wajib diisi.', 'err'); return; }
        r.status = ok ? 'Disetujui' : 'Ditolak';
        r.oleh_approve = DB.PROFILE.nama;
        r.catatan_approve = ket;
        logAudit('Material Breakdown', ok ? 'Approve' : 'Reject', r.kode, 'Status → ' + r.status + (ket ? ' — ' + ket : ''));
        saveDB(); c(); after && after();
        toast('Breakdown ' + r.kode + ' ' + (ok ? 'disetujui' : 'ditolak') + '.', ok ? 'ok' : 'warn');
      }}]
  });
}

/* ---------- rev-4: alur status Project & Quotation ----------
   Istilah baru (menggantikan Sent / Won / Lost):
     Draft   : disusun Estimator, masih bebas disunting.
     Submit  : Estimator mengirim penawaran ke client (butuh hak akses edit).
     Succeed : penawaran dimenangkan  — ditetapkan Manager Operasional / Direktur (hak akses approve).
     Failed  : penawaran tidak dimenangkan — ditetapkan Manager Operasional / Direktur (hak akses approve). */
const PRJ_STATUS = ['Draft', 'Submit', 'Succeed', 'Failed'];
const PRJ_FLOW = {
  Submit:  {from: ['Draft'],            perm: 'edit',    role: 'Estimator (EST)', ic: 'send',  cls: 'btn-primary',
            note: 'Penawaran dikirim ke client. Setelah Submit, BOQ dan rekapitulasi terkunci; perubahan harus melalui Create Revision.'},
  Succeed: {from: ['Submit'],           perm: 'approve', role: 'Manager Operasional (MGR) atau Direktur (DIR)', ic: 'check', cls: 'btn-primary',
            note: 'Penawaran dinyatakan dimenangkan. Nilai penawaran masuk ke laporan win rate.'},
  Failed:  {from: ['Submit'],           perm: 'approve', role: 'Manager Operasional (MGR) atau Direktur (DIR)', ic: 'x',     cls: 'btn-danger',
            note: 'Penawaran dinyatakan tidak dimenangkan. Alasan wajib diisi sebagai bahan evaluasi pada laporan.'},
  Draft:   {from: ['Submit'],           perm: 'approve', role: 'Manager Operasional (MGR) atau Direktur (DIR)', ic: 'back',  cls: 'btn-ghost',
            note: 'Mengembalikan penawaran menjadi Draft agar dapat disunting kembali oleh Estimator.'}
};
function prjCanSet(prj, target){
  const f = PRJ_FLOW[target];
  return !!f && f.from.includes(prj.status) && can('project', f.perm);
}
function prjSetStatus(prj, target, after){
  const f = PRJ_FLOW[target];
  if (!f) return;
  if (!f.from.includes(prj.status)){
    toast('Status ' + prj.status + ' tidak dapat langsung diubah menjadi ' + target + '.', 'warn'); return;
  }
  if (!can('project', f.perm)){
    toast('Aksi ' + target + ' hanya dapat dilakukan oleh ' + f.role + '.', 'err'); return;
  }
  const wajib = (target === 'Failed');
  openModal({
    title: 'Ubah Status — ' + target, sub: prj.no + ' — ' + prj.nama, size: 'md',
    body: `<div class="alert-box ${target === 'Failed' ? 'warn' : 'info'}">${icon(target === 'Failed' ? 'alert' : 'info', 17)}
        <div><b>${esc(prj.status)} &rarr; ${esc(target)}</b><br>${esc(f.note)}<br>
        <span class="text-ink3" style="font-size:12px">Berhak melakukan aksi ini: ${esc(f.role)}.</span></div></div>` +
      formHTML([
        target === 'Failed'
          ? {key:'kat', label:'Kategori Alasan', type:'select', full:true,
             options:['Harga tidak bersaing','Pekerjaan dibatalkan client','Kalah spesifikasi / mutu','Jadwal tidak sesuai','Lain-lain']}
          : {key:'kat', label:'Catatan', type:'static', full:true, def:'—'},
        {key:'ket', label: wajib ? 'Keterangan (wajib)' : 'Keterangan', type:'textarea', full:true}
      ], {}),
    footer: [{label:'Cancel'}, {label: target, cls: f.cls === 'btn-ghost' ? 'btn-primary' : f.cls, ic: f.ic, onClick:(c, el) => {
      const ket = ($('[name="ket"]', el) || {}).value || '';
      const kat = ($('[name="kat"]', el) || {}).value || '';
      if (wajib && !ket.trim()){ toast('Keterangan wajib diisi untuk status Failed.', 'err'); return; }
      const dari = prj.status;
      prj.status = target;
      prj.oleh_status = DB.PROFILE.nama;
      prj.ket_status = [kat, ket].filter(x => x && x !== '—').join(' — ');
      logAudit('Project', target === 'Draft' ? 'Update' : 'Approve', prj.no,
        'Status ' + dari + ' → ' + target + (prj.ket_status ? ' — ' + prj.ket_status : ''));
      saveDB(); c(); after && after();
      toast('Status ' + prj.no + ' diubah menjadi ' + target + ' oleh ' + DB.PROFILE.nama + '.');
    }}]
  });
}

/* ============================================================
   rev-6 poin 8 — Rincian harga satuan pekerjaan (AHS) untuk jendela Detail
   ------------------------------------------------------------
   Dipakai bersama oleh Unit Price List dan Unit Price Analysis, sehingga
   jendela Detail pada kedua menu menampilkan keterangan yang sama:
     A  Upah Tenaga Kerja   = SUM(Koefisien x Tarif)
     B  Bahan / Material    = SUM(Koefisien x Harga Satuan Pakai)
     C  Biaya Lain          = nilai tetap, atau persentase x (A + B)
     D  Jumlah Biaya        = A + B + C          (harga pokok)
     E  Margin              = D x Margin %
     F  Harga Satuan        = D + E              (nilai kolom Harga Satuan)
   Bila rincian komponen belum tersedia, D dan E tetap dapat dihitung mundur
   dari Harga Satuan dan Margin: D = F / (1 + Margin), E = F - D.
   ============================================================ */
function ahsCost(ahs){
  const d   = (DB.AHS_D || {})[ahs.kode];
  const m   = Number(ahs.margin) || 0;
  const hsp = Number(ahs.hsp) || 0;
  if (d){
    const A = d.A.reduce((s, x) => s + x.koef * x.harga, 0);
    const B = d.B.reduce((s, x) => s + x.koef * x.harga, 0);
    const C = d.C.reduce((s, x) => s + (x.jenis === 'Persentase' ? (A + B) * x.nilai : x.nilai), 0);
    const D = A + B + C, E = D * m, F = D + E;
    /* Pemeriksaan keterpaduan: jumlah komponen harus sama dengan kolom
       Harga Satuan yang tersimpan. Selisih di atas 0,5% berarti komponen
       sudah berubah tetapi AHS belum disimpan ulang. */
    const beda = hsp > 0 ? Math.abs(F - hsp) / hsp : 0;
    return {rinci: true, d, A, B, C, D, E, F, hsp, margin: m, timpang: beda > 0.005, selisih: F - hsp};
  }
  /* tanpa rincian komponen: hitung mundur dari Harga Satuan */
  const D = hsp / (1 + m);
  return {rinci: false, d: null, A: null, B: null, C: null, D, E: hsp - D, F: hsp, hsp,
          margin: m, timpang: false, selisih: 0};
}

/* batang komposisi biaya */
function costBar(c){
  const parts = c.rinci
    ? [[c.A, 'var(--primary)', 'A · Upah'], [c.B, 'var(--ok)', 'B · Bahan'],
       [c.C, 'var(--warn)', 'C · Biaya Lain'], [c.E, 'var(--info)', 'E · Margin']]
    : [[c.D, 'var(--primary)', 'D · Harga Pokok'], [c.E, 'var(--info)', 'E · Margin']];
  const tot = parts.reduce((s, p) => s + (p[0] || 0), 0) || 1;
  return `<div class="cost-bar">${parts.map(p =>
      `<span style="width:${(p[0] / tot) * 100}%;background:${p[1]}" title="${esc(p[2])}: ${rp(p[0])} (${pct(p[0] / tot)})"></span>`).join('')}</div>
    <div class="cost-lgd">${parts.map(p =>
      `<span><i style="background:${p[1]}"></i>${esc(p[2])} &middot; <b class="num">${rp(p[0])}</b>
       <span class="text-ink3">(${pct(p[0] / tot)})</span></span>`).join('')}</div>`;
}

/* satu blok tabel komponen (A / B) */
function ahsBlock(title, rows, total, note){
  return `<div class="ahs-blk">
    <h6>${esc(title)}</h6>
    <div class="tbl-wrap"><table class="dt sm"><thead><tr>
      <th style="width:150px">Kode</th><th>Uraian</th><th style="width:70px">Satuan</th>
      <th class="right" style="width:86px">Koefisien</th><th class="right" style="width:130px">Harga Satuan</th>
      <th class="right" style="width:140px">Jumlah</th></tr></thead>
      <tbody>${rows.map(x => `<tr>
        <td><span class="mono">${esc(x.kode)}</span></td><td>${esc(x.nama)}</td><td>${esc(x.sat)}</td>
        <td class="right num">${nf(x.koef)}</td><td class="right num">${rp(x.harga)}</td>
        <td class="right num cell-main">${rp(x.koef * x.harga)}</td></tr>`).join('')}
        <tr class="sub-total"><td colspan="5">${esc(note)}</td><td class="right num">${rp(total)}</td></tr>
      </tbody></table></div></div>`;
}

/* isi jendela Detail untuk satu baris AHS / harga satuan pekerjaan */
function ahsDetailHTML(r){
  const c   = ahsCost(r);
  const grp = (DB.WORKGROUP.find(w => w.kode === r.grp) || {}).nama || r.grp || '-';
  /* pemakaian nyata pada BOQ project contoh */
  const pakai = (DB.BOQ || []).filter(b => b.t === 'item' && b.kode === r.kode);

  return `
  <div class="ahs-head">
    <div>
      <div class="text-ink3" style="font-size:12px">Harga Satuan Pekerjaan &mdash; nilai tersimpan</div>
      <div class="ahs-big num">${rp(c.hsp)}</div>
      <div class="text-ink3" style="font-size:12px">per 1 ${esc(r.sat || '-')} &middot; ${esc(r.kode)}</div>
    </div>
    <div class="text-end">
      ${statusBadge(r.status)}
      ${r.review ? `<div class="mt-2"><span class="bdg warn">Perlu ditinjau ulang</span></div>` : ''}
    </div>
  </div>

  <div class="ahs-kv">
    <div><span>Uraian Pekerjaan</span><b>${esc(r.nama)}</b></div>
    <div><span>Kelompok Pekerjaan</span><b>${esc(grp)}</b></div>
    <div><span>Satuan</span><b>${esc(r.sat || '-')}</b></div>
    <div><span>Margin</span><b>${pct(c.margin)}</b></div>
    <div><span>Harga Pokok (D)</span><b class="num">${rp(c.D)}</b></div>
    <div><span>Margin (E)</span><b class="num">${rp(c.E)}</b></div>
  </div>

  ${c.timpang ? `<div class="alert-box warn">${icon('alert', 16)}<div>
      <b>Jumlah komponen belum sama dengan Harga Satuan tersimpan.</b><br>
      Hasil hitung komponen A + B + C + Margin = <b class="num">${rp(c.F)}</b>,
      sedangkan nilai tersimpan <b class="num">${rp(c.hsp)}</b>
      (selisih <b class="num">${c.selisih > 0 ? '+' : '&minus;'} ${rp(Math.abs(c.selisih))}</b> atau ${pct(Math.abs(c.selisih) / c.hsp)}).
      Penyebab yang lazim: harga bahan atau tarif upah penyusunnya sudah berubah, tetapi AHS belum disimpan ulang.
      Buka <b>Rincian AHS</b>, jalankan <b>Price Simulation</b>, lalu tekan <b>Save AHS</b> agar Harga Satuan diperbarui.
    </div></div>` : ''}

  <div class="ahs-sec"><h6>${icon('chart', 15)} Komposisi Harga${c.rinci ? ' — hasil hitung komponen' : ''}</h6>${costBar(c)}</div>

  ${c.rinci ? `
    ${ahsBlock('A — Upah Tenaga Kerja', c.d.A, c.A, 'Jumlah Upah (A)')}
    ${ahsBlock('B — Bahan / Material',  c.d.B, c.B, 'Jumlah Bahan (B)')}
    <div class="ahs-blk"><h6>C — Biaya Lain</h6>
      <div class="tbl-wrap"><table class="dt sm"><thead><tr>
        <th style="width:150px">Kode</th><th>Uraian</th><th style="width:150px">Jenis</th>
        <th class="right" style="width:110px">Nilai</th><th class="right" style="width:140px">Jumlah</th></tr></thead>
        <tbody>${c.d.C.map(x => `<tr>
          <td><span class="mono">${esc(x.kode)}</span></td><td>${esc(x.nama)}</td><td>${esc(x.jenis)}</td>
          <td class="right num">${x.jenis === 'Persentase' ? pct(x.nilai) : rp(x.nilai)}</td>
          <td class="right num cell-main">${rp(x.jenis === 'Persentase' ? (c.A + c.B) * x.nilai : x.nilai)}</td></tr>`).join('')}
          <tr class="sub-total"><td colspan="4">Jumlah Biaya Lain (C)</td><td class="right num">${rp(c.C)}</td></tr>
        </tbody></table></div></div>
    <div class="ahs-tot">
      <div><span>D &middot; Jumlah Biaya (A + B + C)</span><b class="num">${rp(c.D)}</b></div>
      <div><span>E &middot; Margin ${pct(c.margin)} &times; D</span><b class="num">${rp(c.E)}</b></div>
      <div class="f"><span>F &middot; Harga Satuan hasil hitung komponen (D + E)</span><b class="num">${rp(c.F)}</b></div>
      ${c.timpang ? `<div><span>Harga Satuan tersimpan pada daftar</span><b class="num">${rp(c.hsp)}</b></div>` : ''}
    </div>`
  : `<div class="alert-box info">${icon('info', 16)}<div>Rincian komponen A, B, dan C untuk kode ini belum disusun pada data contoh prototipe.
       Nilai <b>Harga Pokok</b> dan <b>Margin</b> di atas dihitung mundur dari Harga Satuan dan persentase margin.
       Buka <b>Rincian AHS</b> untuk menyusun komponennya.</div></div>`}

  <div class="ahs-sec"><h6>${icon('layers', 15)} Keterkaitan</h6>
    <dl class="dl-detail">
      <dt>Material Breakdown Rujukan</dt>
      <dd>${r.bd ? `<span class="mono">${esc(r.bd)}</span> &mdash; sumber blok B (Bahan)`
                 : '<span class="text-ink3">Tidak memakai breakdown; komponen bahan diisi langsung.</span>'}</dd>
      <dt>Dipakai pada BOQ</dt>
      <dd>${pakai.length
            ? pakai.map(b => `<span class="chip">${esc(b.no)} &middot; ${esc(b.uraian)} &middot; ${nf(b.vol)} ${esc(b.sat)}</span>`).join('')
            : '<span class="text-ink3">Belum dipakai pada BOQ project contoh.</span>'}</dd>
      <dt>Dasar Perhitungan</dt>
      <dd class="text-ink3">F = (A + B + C) &times; (1 + Margin). Harga komponen diambil dari menu Material dan
          Upah Pekerja pada tanggal harga yang berlaku di project.</dd>
    </dl></div>`;
}

/* ---------- misc renderers ---------- */
const statusBadge = s => {
  const m = {'Aktif':'ok','Active':'ok','Nonaktif':'off','Inactive':'off','Draft':'off',
    'Submit':'info','Succeed':'ok','Failed':'danger',
    'Terkini':'ok','Kedaluwarsa':'warn','Belum Ada Harga':'danger','Disetujui':'ok','Menunggu Verifikasi':'warn','Ditolak':'danger',
    'Terkunci':'warn','Final':'ok','Revisi':'warn','Expired':'danger','Harian':'blue','Borongan':'ok'};
  return `<span class="bdg ${m[s] || 'off'}">${esc(s)}</span>`;
};
const chips = (arr, cls = '') => (arr || []).map(x => `<span class="chip ${cls}">${esc(x)}</span>`).join('');
const money = n => `<span class="num">${rp(n)}</span>`;
const nextCode = (pre, arr, key, pad = 3) => {
  const n = arr.reduce((m, r) => Math.max(m, parseInt(String(r[key]).replace(/\D/g, '')) || 0), 0) + 1;
  return pre + String(n).padStart(pad, '0');
};
