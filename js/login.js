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
      showLoading('Memeriksa kredensial...');
      
      // ⭐ Panggil API GAS (Hapus bypass-nya)
      const res = await api.login(username, password);

      if (res.sukses) {
        showToast('Login Berhasil! Selamat datang, ' + res.nama, 'success');
        localStorage.setItem('user', JSON.stringify(res));
        
        document.getElementById('viewLoginModern').style.display = 'none';
        document.getElementById('viewBerandaModern').style.display = 'block';
        
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: res }));
      } else {
        errorEl.textContent = res.pesan || 'Login gagal.';
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
