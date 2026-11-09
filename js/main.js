// ==========================================
// FILE: main.js (UPDATE FASE 2)
// ==========================================

import { initLogin } from './login.js';
import { initBeranda } from './beranda.js';

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
