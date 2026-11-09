// ==========================================
// FILE: api.js
// ==========================================

export const callGAS = (functionName, ...args) => {
  return new Promise((resolve, reject) => {
    const requestId = 'req_' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    window._gasCallbacks = window._gasCallbacks || {};
    window._gasCallbacks[requestId] = { resolve, reject };

    const timeoutId = setTimeout(() => {
      if (window._gasCallbacks[requestId]) {
        delete window._gasCallbacks[requestId];
        reject(new Error('Koneksi ke GAS Timeout (15 detik).'));
      }
    }, 15000);

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

// ⭐ TES KONEKSI SAAT PERTAMA KALI DIMUAT
console.log("Mencoba tes koneksi ke GAS...");
callGAS('tesKoneksi')
  .then(res => console.log("✅ TES BERHASIL:", res))
  .catch(err => console.error("❌ TES GAGAL:", err.message));

export const api = {
  // ... (sisa fungsi api tetap sama seperti sebelumnya) ...
  login: (username, password) => callGAS('cekLogin', username, password),
};
