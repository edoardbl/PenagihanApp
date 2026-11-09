// ==========================================
// FILE: detail.js
// Deskripsi: Tampilan Detail Anggota
// ==========================================

import { api } from './api.js';
import { showLoading, hideLoading, showToast } from './ui.js';
import { navigateTo } from './router.js';

let currentUser = null;
let currentNoRek = '';

export const initDetail = () => {
  // Listener untuk tombol kembali
  document.getElementById('btnBackDetail').addEventListener('click', () => {
    navigateTo('beranda');
  });

  // Listener untuk tombol "Catat Kunjungan"
  document.getElementById('btnBukaKunjungan').addEventListener('click', () => {
    // Panggil fungsi dari kunjungan.js (kita akan buat di file ke-3)
    window.dispatchEvent(new CustomEvent('bukaFormKunjungan', { 
      detail: { noRek: currentNoRek } 
    }));
  });
};

export const bukaDetailAnggota = async (noRek) => {
  currentNoRek = noRek;
  navigateTo('detail');
  
  const container = document.getElementById('detailContent');
  container.innerHTML = '<div style="text-align:center; padding:30px; color:#888;">⏳ Memuat profil...</div>';

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await api.getDetailAnggota(noRek, user.nama, user.level);

    if (res && res.sukses) {
      renderDetailUI(res.detail);
    } else {
      container.innerHTML = '<div style="color:red; text-align:center;">Data anggota tidak ditemukan.</div>';
    }
  } catch (error) {
    container.innerHTML = `<div style="color:red; text-align:center;">Error: ${error.message}</div>`;
  }
};

const renderDetailUI = (a) => {
  const container = document.getElementById('detailContent');
  
  // Modern JS: Menggunakan Template Literals & Method .toLocaleString()
  const html = `
    <div style="background:linear-gradient(135deg, #8B0000, #B83333); color:white; padding:20px; border-radius:12px; margin-bottom:15px; box-shadow:0 4px 10px rgba(0,0,0,0.2);">
      <div style="font-size:20px; font-weight:800;">${a.nama}</div>
      <div style="font-size:12px; color:#FFD700; margin-top:4px;">${a.cif} - ${a.panggilan}</div>
      <div style="margin-top:10px; font-size:13px; background:rgba(255,255,255,0.2); display:inline-block; padding:4px 8px; border-radius:6px;">${a.jenisLengkap}</div>
    </div>

    <div style="background:#FFF8DC; border:2px solid #FFD700; border-radius:12px; padding:15px; margin-bottom:15px;">
      <div style="font-size:11px; color:#B8860B; font-weight:700;">TAGIHAN NORMAL</div>
      <div style="font-size:24px; font-weight:800; color:#8B0000;">Rp ${(a.tagihanNormal || 0).toLocaleString('id-ID')}</div>
      <div style="margin-top:10px; font-size:11px; color:#B8860B; font-weight:700;">TAGIHAN PROGRAM</div>
      <div style="font-size:18px; font-weight:800; color:#E65100;">Rp ${(a.tagihanProgram || 0).toLocaleString('id-ID')}</div>
    </div>

    <div style="background:white; border-radius:12px; padding:15px; margin-bottom:15px; border:1px solid #E0E0E0;">
      <div style="font-size:14px; font-weight:700; color:#1976D2; margin-bottom:8px;">📞 ${a.noHp || 'Tidak ada No HP'}</div>
      <div style="font-size:13px; color:#666;">📍 ${a.alamat}, ${a.desa}</div>
    </div>
  `;
  container.innerHTML = html;
};
