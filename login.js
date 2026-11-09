// ==========================================
// FILE: login.js
// Deskripsi: Logika Halaman Login
// ==========================================

import { api } from './api.js';
import { showLoading, hideLoading, showToast } from './ui.js';

export const initLogin = () => {
  const btnLogin = document.getElementById('btnLoginModern');
  if (!btnLogin) return;

  btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('inputUsernameModern').value.trim();
    const password = document.getElementById('inputPasswordModern').value.trim();
    const errorEl = document.getElementById('loginErrorModern');

    if (!username || !password) {
      errorEl.textContent = 'Username dan Password wajib diisi!';
      errorEl.style.display = 'block';
      return;
    }

    errorEl.style.display = 'none';
    showLoading('Memeriksa kredensial...');
    
    try {
      // ⭐ Panggil API Login
      const res = await api.login(username, password);

      if (res.sukses) {
        showToast('Login Berhasil! Selamat datang, ' + res.nama, 'success');
        
        // Simpan session (contoh sederhana di localStorage)
        localStorage.setItem('user', JSON.stringify(res));
        
        // Sembunyikan login, tampilkan beranda (Routing sederhana)
        document.getElementById('viewLoginModern').style.display = 'none';
        document.getElementById('viewBerandaModern').style.display = 'block';
        
        // Panggil fungsi muat beranda
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: res }));
      } else {
        errorEl.textContent = res.pesan || 'Login gagal. Periksa kembali akun Anda.';
        errorEl.style.display = 'block';
      }
    } catch (error) {
      errorEl.textContent = 'Error Server: ' + error.message;
      errorEl.style.display = 'block';
    } finally {
      hideLoading();
    }
  });
};
