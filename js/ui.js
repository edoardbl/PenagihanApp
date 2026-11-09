
// ==========================================
// FILE: ui.js
// Deskripsi: Komponen UI Modern (Toast, Modal, Loading)
// ==========================================

// --- 1. LOADING OVERLAY ---
let _loadingCount = 0;

export const showLoading = (message = 'Memproses...') => {
  _loadingCount++;
  let overlay = document.getElementById('modernLoadingOverlay');
  
  if (!overlay) {
    const html = `
      <div id="modernLoadingOverlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:inherit;">
        <div style="width:50px;height:50px;border:5px solid rgba(255,215,0,0.3);border-top-color:#FFD700;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:15px;"></div>
        <div id="modernLoadingText" style="font-weight:700;font-size:16px;">${message}</div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Tambahkan keyframes jika belum ada
    if (!document.getElementById('spinKeyframe')) {
      document.head.insertAdjacentHTML('beforeend', `
        <style id="spinKeyframe">@keyframes spin { 100% { transform: rotate(360deg); } }</style>
      `);
    }
  } else {
    const textEl = document.getElementById('modernLoadingText');
    if (textEl) textEl.textContent = message;
  }
};

export const hideLoading = () => {
  _loadingCount--;
  if (_loadingCount <= 0) {
    _loadingCount = 0;
    const overlay = document.getElementById('modernLoadingOverlay');
    if (overlay) overlay.remove();
  }
};

// --- 2. TOAST NOTIFICATION ---
export const showToast = (message, type = 'success', duration = 3000) => {
  const colors = {
    success: 'linear-gradient(135deg,#2E7D32,#388E3C)',
    error: 'linear-gradient(135deg,#C62828,#E53935)',
    warning: 'linear-gradient(135deg,#E65100,#F57C00)',
    info: 'linear-gradient(135deg,#1565C0,#1976D2)'
  };
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

  let container = document.getElementById('modernToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modernToastContainer';
    container.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:999999;display:flex;flex-direction:column;gap:10px;width:90%;max-width:400px;';
    document.body.appendChild(container);
  }

  const toastId = 'toast_' + Date.now();
  const html = `
    <div id="${toastId}" style="background:${colors[type]};color:white;padding:12px 16px;border-radius:10px;font-weight:700;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.2);display:flex;align-items:center;gap:10px;opacity:0;transform:translateY(20px);transition:all 0.3s ease;">
      <span style="font-size:18px;">${icons[type]}</span>
      <span>${message}</span>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
  
  const toastEl = document.getElementById(toastId);
  
  // Animasi Masuk
  requestAnimationFrame(() => {
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translateY(0)';
  });

  // Animasi Keluar
  setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateY(20px)';
    setTimeout(() => toastEl.remove(), 300);
  }, duration);
};

// --- 3. MODERN CONFIRM DIALOG ---
export const showConfirm = (title, message, onConfirm) => {
  const html = `
    <div id="modernModalOverlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;">
      <div style="background:white;border-radius:12px;width:100%;max-width:400px;padding:20px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.3);">
        <div style="font-size:40px;margin-bottom:10px;">❓</div>
        <h3 style="color:#8B0000;margin:0 0 10px 0;font-size:18px;">${title}</h3>
        <p style="color:#555;font-size:14px;margin-bottom:20px;line-height:1.5;">${message}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <button id="btnModernCancel" style="background:#F5F5F5;color:#333;border:1px solid #DDD;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;">Batal</button>
          <button id="btnModernConfirm" style="background:#8B0000;color:white;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;">Ya, Lanjutkan</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  const overlay = document.getElementById('modernModalOverlay');
  
  document.getElementById('btnModernCancel').onclick = () => overlay.remove();
  document.getElementById('btnModernConfirm').onclick = () => {
    overlay.remove();
    if (typeof onConfirm === 'function') onConfirm();
  };
};
