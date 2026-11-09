// ==========================================
// FILE: api.js
// Deskripsi: Wrapper Async/Await untuk GAS
// ==========================================

/**
 * Fungsi pembungkus untuk memanggil fungsi di Google Apps Script.
 * Mengubah gaya callback menjadi Promise modern.
 */
export const callGAS = (functionName, ...args) => {
  return new Promise((resolve, reject) => {
    if (typeof google === 'undefined' || !google.script) {
      return reject(new Error('Google Apps Script environment not found.'));
    }

    google.script.run
      .withSuccessHandler((response) => resolve(response))
      .withFailureHandler((error) => reject(error))
      [functionName](...args);
  });
};

/**
 * Kumpulan endpoint API (dipisah agar rapi)
 */
export const api = {
  // Auth & Profil
  login: (username, password) => callGAS('cekLogin', username, password),
  getProfil: (username) => callGAS('getProfilPetugas', username),

  // Beranda & Tagihan
  getBeranda: (nama, level, filterAktivis, filterMenunggak) => 
    callGAS('getDashboardDanPengingat', nama, level, filterAktivis, filterMenunggak),
  getTagihanPage: (nama, level, filterAktivis, filterMenunggak, page, limit) => 
    callGAS('getDaftarTagihanPaginated', nama, level, filterAktivis, filterMenunggak, page, limit),

  // Detail & Aksi
  getDetailAnggota: (noRek, username, level) => 
    callGAS('getDetailAnggota', noRek, username, level),
  simpanKunjungan: (data) => callGAS('simpanKunjungan', data),
  simpanPenanganan: (data) => callGAS('simpanPenanganan', data),
  
  // KLPK
  getDaftarKLPK: (namaPetugas, level, filter) => 
    callGAS('getDaftarKLPK', namaPetugas, level, filter)
};
