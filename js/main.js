// ==========================================
// FILE: main.js (UPDATE FASE 2)
// ==========================================

import { initLogin } from './login.js';
import { initBeranda } from './beranda.js';

// ⭐ MENDENGARKAN BALASAN DARI GAS
window.addEventListener('message', function(event) {
  const data = event.data;
  if (data && data.action === 'responseGAS') {
    const callback = window._gasCallbacks[data.requestId];
    if (callback) {
      if (data.success) {
        callback.resolve(data.data);
      } else {
        callback.reject(new Error(data.error));
      }
      // Hapus callback dari memori setelah dipakai
      delete window._gasCallbacks[data.requestId];
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Aplikasi Modern v2 - Fase 2 Berjalan!');
  
  // Inisialisasi Halaman
  initLogin();
  initBeranda();

  // Cek apakah user sudah login (session)
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      document.getElementById('viewLoginModern').style.display = 'none';
      document.getElementById('viewBerandaModern').style.display = 'block';
      
      // Trigger event agar beranda memuat data
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
    } catch (e) {
      console.error('Session error:', e);
    }
  }
});
