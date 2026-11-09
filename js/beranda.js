// ==========================================
// FILE: beranda.js
// Deskripsi: Logika Halaman Beranda (Dashboard)
// ==========================================

import { api } from './api.js';
import { showLoading, hideLoading, showToast } from './ui.js';

let currentUser = null;

export const initBeranda = () => {
  window.addEventListener('userLoggedIn', (e) => {
    currentUser = e.detail;
    muatBeranda();
  });
};

export const muatBeranda = async () => {
  if (!currentUser) return;
  
  showLoading('Memuat data beranda...');
  
  try {
    // ⭐ Panggil API Beranda
    const res = await api.getBeranda(currentUser.nama, currentUser.level, [], 'semua');
    
    if (res && res.dashboard) {
      renderDashboard(res.dashboard);
    }
    
    // Ambil Tagihan Halaman 1
    const resTagihan = await api.getTagihanPage(currentUser.nama, currentUser.level, [], 'semua', 1, 10);
    if (resTagihan && resTagihan.list) {
      renderTagihanList(resTagihan.list);
    }
    
  } catch (error) {
    showToast('Gagal memuat beranda: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
};

const renderDashboard = (d) => {
  const container = document.getElementById('dashboardContainer');
  if (!container) return;

  // ⭐ Template Literals (Backtick) - Jauh lebih rapi dari string concatenation
  const html = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:15px;">
      <div style="background:#FFF8DC; padding:15px; border-radius:10px; border:2px solid #FFD700; text-align:center;">
        <div style="font-size:12px; color:#B8860B; font-weight:700;">SALDO TERTUNGGAK</div>
        <div style="font-size:18px; font-weight:800; color:#8B0000; margin-top:5px;">Rp ${(d.saldoTertunggak || 0).toLocaleString('id-ID')}</div>
      </div>
      <div style="background:#FFEBEE; padding:15px; border-radius:10px; border:2px solid #C62828; text-align:center;">
        <div style="font-size:12px; color:#C62828; font-weight:700;">% KREDIT LALAI</div>
        <div style="font-size:18px; font-weight:800; color:#C62828; margin-top:5px;">${(d.persenKL || 0).toFixed(2)}%</div>
      </div>
    </div>
    <div style="display:flex; gap:10px; justify-content:space-around; text-align:center; background:white; padding:10px; border-radius:10px;">
      <div><div style="font-size:16px; font-weight:800;">${d.totalAnggota || 0}</div><div style="font-size:11px; color:#666;">Anggota</div></div>
      <div><div style="font-size:16px; font-weight:800;">${d.totalMeminjam || 0}</div><div style="font-size:11px; color:#666;">Meminjam</div></div>
      <div><div style="font-size:16px; font-weight:800;">${d.belumBayar || 0}</div><div style="font-size:11px; color:#666;">Belum Bayar</div></div>
    </div>
  `;
  container.innerHTML = html;
};

const renderTagihanList = (list) => {
  const container = document.getElementById('listTagihanContainer');
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:#888;">Tidak ada tagihan</div>';
    return;
  }

  // Render list menggunakan .map()
  const html = list.map(item => `
    <div onclick="bukaDetailAnggota('${item.noRek}')" style="background:white; padding:15px; border-radius:10px; margin-bottom:10px; border-left:4px solid ${item.menunggak ? '#C62828' : '#2E7D32'}; box-shadow:0 2px 5px rgba(0,0,0,0.05); cursor:pointer;">
      <div style="font-weight:800; color:#8B0000; font-size:14px;">${item.nama}</div>
      <div style="font-size:11px; color:#666; margin-top:2px;">${item.noRek} - ${item.desa}</div>
      <div style="margin-top:8px; font-size:13px; font-weight:700; color:#C62828;">Tagihan: Rp ${(item.tagihanNormal || 0).toLocaleString('id-ID')}</div>
    </div>
  `).join('');

  container.innerHTML = html;
};
