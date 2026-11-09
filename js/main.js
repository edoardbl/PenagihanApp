// ==========================================
// FILE: main.js
// ==========================================

import { initLogin } from './login.js';
import { initBeranda } from './beranda.js';
import { initDetail, bukaDetailAnggota } from './detail.js';
import { initKunjungan } from './kunjungan.js';

// ⭐ 1. MENDENGARKAN BALASAN DARI GAS (Jembatan PostMessage)
window.addEventListener('message', function(event) {
  const data = event.data;
  if (data && data.action === 'responseGAS') {
    const callback = window._gasCallbacks && window._gasCallbacks[data.requestId];
    if (callback) {
      if (data.success) {
        callback.resolve(data.data);
      } else {
        callback.reject(new Error(data.error));
      }
      delete window._gasCallbacks[data.requestId];
    }
  }
});

// ⭐ 2. JALANKAN SAAT HALAMAN DIMUAT
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Aplikasi Modern v2 Berjalan!');
  
  initLogin();
  initBeranda();
  initDetail();
  initKunjungan();
  
  // Cek session login
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      document.getElementById('viewLoginModern').style.display = 'none';
      document.getElementById('viewBerandaModern').style.display = 'block';
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
    } catch (e) {
      console.error('Session error:', e);
    }
  }
});

// ⭐ 3. DAFTARKAN FUNGSI KE WINDOW (Agar bisa dipanggil dari HTML onclick)
window.bukaDetailAnggota = bukaDetailAnggota;
