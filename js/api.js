// ==========================================
// FILE: api.js (Dengan Timeout)
// ==========================================

export const callGAS = (functionName, ...args) => {
  return new Promise((resolve, reject) => {
    const requestId = 'req_' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    window._gasCallbacks = window._gasCallbacks || {};
    window._gasCallbacks[requestId] = { resolve, reject };

    // ⭐ TIMEOUT 15 DETIK
    const timeoutId = setTimeout(() => {
      if (window._gasCallbacks[requestId]) {
        delete window._gasCallbacks[requestId];
        reject(new Error('Koneksi ke GAS Timeout (15 detik). Cek koneksi atau fungsi GAS.'));
      }
    }, 15000);

    // Bungkus resolve/reject untuk membersihkan timeout
    window._gasCallbacks[requestId] = {
      resolve: (data) => { clearTimeout(timeoutId); resolve(data); },
      reject: (err) => { clearTimeout(timeoutId); reject(err); }
    };

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
  getBeranda: (nama, level, filterAktivis, filterMenunggak) => 
    callGAS('getDashboardDanPengingat', nama, level, filterAktivis, filterMenunggak),
  getTagihanPage: (nama, level, filterAktivis, filterMenunggak, page, limit) => 
    callGAS('getDaftarTagihanPaginated', nama, level, filterAktivis, filterMenunggak, page, limit),
  getDetailAnggota: (noRek, username, level) => 
    callGAS('getDetailAnggota', noRek, username, level),
  simpanKunjungan: (data) => callGAS('simpanKunjungan', data)
};
