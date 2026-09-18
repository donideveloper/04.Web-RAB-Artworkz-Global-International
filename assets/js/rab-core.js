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
  build:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
};
const icon = (n, s = 16) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;

/* ---------- storage ---------- */
const DBKEY = 'rab_db_v1';
function saveDB(){ try{ localStorage.setItem(DBKEY, JSON.stringify(DB)); }catch(e){} }
function loadDB(){
  try{
    const raw = localStorage.getItem(DBKEY);
    if (raw) Object.assign(DB, JSON.parse(raw));
  }catch(e){}
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
  el.addEventListener('shown.bs.modal', () => onShown && onShown(el, close));
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

/* ---------- form builder ---------- */
function formHTML(fields, data = {}){
  return '<div class="form-grid">' + fields.map(f => {
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
      ctl = `<div class="d-flex flex-wrap gap-3 p-2 rounded" style="border:1px solid var(--line)">` +
        f.options.map(o => {
          const val = typeof o === 'object' ? o.v : o, lb = typeof o === 'object' ? o.l : o;
          const on = (Array.isArray(v) ? v : String(v).split(',')).map(x => String(x).trim()).includes(String(val));
          return `<label class="form-check"><input class="form-check-input" type="checkbox" name="${f.key}" value="${esc(val)}" ${on ? 'checked' : ''}> <span class="form-check-label">${esc(lb)}</span></label>`;
        }).join('') + `</div>`;
    else if (f.type === 'static')
      ctl = `<div class="${f.cls || 'code-preview'}" data-static="${f.key}">${v || '—'}</div>`;
    else
      ctl = `<input class="form-control" type="${f.type || 'text'}" name="${f.key}" value="${esc(v)}" placeholder="${esc(f.ph || '')}" ${f.disabled ? 'disabled' : ''} ${f.step ? `step="${f.step}"` : ''}>`;
    return `<div class="${f.full ? 'full' : ''}">
      <label class="form-label">${esc(f.label)}${req}</label>${ctl}
      ${f.help ? `<span class="form-hint">${esc(f.help)}</span>` : ''}
      <span class="field-err" data-err="${f.key}" hidden></span></div>`;
  }).join('') + '</div>';
}

function readForm(el, fields){
  const out = {};
  fields.forEach(f => {
    if (f.type === 'checks'){
      out[f.key] = $$(`[name="${f.key}"]:checked`, el).map(i => i.value);
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
    tb.innerHTML = view.map((r, i) => `<tr data-i="${i}" class="${cfg.rowClass ? cfg.rowClass(r) : ''}">
      ${cfg.columns.map(c => `<td class="${c.align || ''}">${c.render ? c.render(r) : esc(r[c.key] ?? '')}</td>`).join('')}
      ${showActs ? `<td><div class="row-acts">${rowActions(cfg, r).join('')}</div></td>` : ''}</tr>`).join('');
    $$('tbody tr', host).forEach((tr, i) => {
      const r = view[i];
      $$('[data-act]', tr).forEach(b => b.onclick = e => { e.stopPropagation(); runAction(cfg, b.dataset.act, r); });
      if (cfg.onRowClick) tr.onclick = () => cfg.onRowClick(r, tr);
    });
  }
  $('.count', host).textContent = `of ${rows.length} entries`;
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
  open:   {ic: 'chev',    t: 'Open',      perm: 'view'}
};
function rowActions(cfg, r){
  const list = typeof cfg.actions === 'function' ? cfg.actions(r) : cfg.actions;
  return list.filter(a => {
    const m = ACT_META[a.k || a] || {};
    return can(cfg.perm, (a.perm || m.perm || 'view'));
  }).map(a => {
    const k = a.k || a, m = ACT_META[k] || {};
    return `<button class="icon-btn ${a.cls || m.cls || ''}" data-act="${k}" title="${esc(a.t || m.t || k)}">${icon(a.ic || m.ic || 'eye', 16)}</button>`;
  });
}
function runAction(cfg, k, r){
  if (cfg.onAction && cfg.onAction(k, r) === true) return;
  if (k === 'view' && cfg.detail) return openModal({title: cfg.entity + ' Detail', sub: cfg.detailSub ? cfg.detailSub(r) : '', size: 'lg', body: cfg.detail(r), footer: [{label: 'Close'}]});
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
    onShown: el => cfg.onFormShown && cfg.onFormShown(el, data)
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

/* ---------- misc renderers ---------- */
const statusBadge = s => {
  const m = {'Aktif':'ok','Active':'ok','Nonaktif':'off','Inactive':'off','Draft':'off','Sent':'info','Won':'ok','Lost':'danger',
    'Terkini':'ok','Kedaluwarsa':'warn','Belum Ada Harga':'danger','Disetujui':'ok','Menunggu Verifikasi':'warn',
    'Terkunci':'warn','Final':'ok','Revisi':'warn','Expired':'danger','Harian':'blue','Borongan':'ok'};
  return `<span class="bdg ${m[s] || 'off'}">${esc(s)}</span>`;
};
const chips = (arr, cls = '') => (arr || []).map(x => `<span class="chip ${cls}">${esc(x)}</span>`).join('');
const money = n => `<span class="num">${rp(n)}</span>`;
const nextCode = (pre, arr, key, pad = 3) => {
  const n = arr.reduce((m, r) => Math.max(m, parseInt(String(r[key]).replace(/\D/g, '')) || 0), 0) + 1;
  return pre + String(n).padStart(pad, '0');
};
