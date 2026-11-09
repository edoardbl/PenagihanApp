// ==========================================
// FILE: api.js (Versi Jembatan PostMessage)
// ==========================================

export const callGAS = (functionName, ...args) => {
  return new Promise((resolve, reject) => {
    const requestId = 'req_' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    // Simpan callback agar bisa dipanggil saat menerima balasan
    window._gasCallbacks = window._gasCallbacks || {};
    window._gasCallbacks[requestId] = { resolve, reject };

    // Kirim pesan ke Induk (GAS)
    window.parent.postMessage({
      action: 'callGAS',
      requestId: requestId,
      functionName: functionName,
      args: args
    }, '*');
  });
};

export const api = {
  login: (username, password) => callGAS('cekLogin', username, password),
  getProfil: (username) => callGAS('getProfilPetugas', username),
  getBeranda: (nama, level, filterAktivis, filterMenunggak) => 
    callGAS('getDashboardDanPengingat', nama, level, filterAktivis, filterMenunggak),
  getTagihanPage: (nama, level, filterAktivis, filterMenunggak, page, limit) => 
    callGAS('getDaftarTagihanPaginated', nama, level, filterAktivis, filterMenunggak, page, limit)
};
