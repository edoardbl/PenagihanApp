// ==========================================
// FILE: router.js
// Deskripsi: Navigasi Halaman Tanpa Reload
// ==========================================

export const navigateTo = (pageName) => {
  // Sembunyikan semua view
  const views = document.querySelectorAll('.app-view');
  views.forEach(v => v.style.display = 'none');

  // Tampilkan view yang dituju
  const target = document.getElementById('view' + pageName.charAt(0).toUpperCase() + pageName.slice(1));
  if (target) {
    target.style.display = 'block';
    window.scrollTo(0, 0);
  }

  // Update Hash di URL (opsional, agar tombol Back browser bekerja)
  window.location.hash = pageName;
};

// Dengarkan perubahan Hash (tombol Back/Forward browser)
window.addEventListener('hashchange', () => {
  const page = window.location.hash.replace('#', '') || 'beranda';
  navigateTo(page);
});
