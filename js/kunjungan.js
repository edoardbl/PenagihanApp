// ==========================================
// FILE: kunjungan.js
// Deskripsi: Form Kunjungan Modern
// ==========================================

import { api } from './api.js';
import { showLoading, hideLoading, showToast } from './ui.js';
import { navigateTo } from './router.js';

let canvas, ctx, isDrawing = false;
let currentGps = { lat: '', lng: '' };
let targetNoRek = '';

export const initKunjungan = () => {
  // Listener saat tombol "Catat Kunjungan" di detail diklik
  window.addEventListener('bukaFormKunjungan', (e) => {
    targetNoRek = e.detail.noRek;
    navigateTo('kunjungan');
    
    // Inisialisasi Canvas TTD
    setTimeout(() => {
      setupCanvas();
      ambilGps();
    }, 100);
  });

  // Listener tombol Batal
  document.getElementById('btnBatalKunjungan').addEventListener('click', () => {
    navigateTo('detail');
  });

  // Listener tombol Simpan
  document.getElementById('btnSimpanKunjungan').addEventListener('click', simpanKunjungan);
};

// --- LOGIKA TTD (CANVAS) ---
const setupCanvas = () => {
  canvas = document.getElementById('ttdCanvasModern');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth; // Sesuaikan dengan lebar layar HP
  canvas.height = 200;
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  // Event untuk Mouse (PC)
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  
  // Event untuk Touch (HP)
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);
};

const getPos = (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  return { x, y };
};

const startDrawing = (e) => {
  e.preventDefault();
  isDrawing = true;
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
};

const draw = (e) => {
  if (!isDrawing) return;
  e.preventDefault();
  const pos = getPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
};

const stopDrawing = (e) => {
  e.preventDefault();
  isDrawing = false;
};

// --- LOGIKA GPS ---
const ambilGps = () => {
  const gpsInfo = document.getElementById('gpsInfoModern');
  if (!navigator.geolocation) {
    gpsInfo.textContent = 'GPS tidak didukung';
    return;
  }
  
  gpsInfo.textContent = '⏳ Mengambil lokasi...';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      currentGps.lat = pos.coords.latitude.toFixed(6);
      currentGps.lng = pos.coords.longitude.toFixed(6);
      gpsInfo.textContent = `✅ Lokasi: ${currentGps.lat}, ${currentGps.lng}`;
      gpsInfo.style.color = '#2E7D32';
    },
    (err) => {
      gpsInfo.textContent = '⚠️ Gagal mengambil GPS';
      gpsInfo.style.color = '#C62828';
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
};

// --- LOGIKA SIMPAN ---
const simpanKunjungan = async () => {
  const statusEl = document.getElementById('selectStatusModern');
  const status = statusEl.value;
  
  if (!status) {
    showToast('Pilih status kunjungan dulu!', 'warning');
    return;
  }

  // Ambil gambar TTD (jika ada)
  let ttdBase64 = '';
  if (canvas) {
    ttdBase64 = canvas.toDataURL('image/png');
  }

  const payload = {
    noRek: targetNoRek,
    status: status,
    lat: currentGps.lat,
    lng: currentGps.lng,
    ttdBase64: ttdBase64,
    tanggalKunjungan: new Date().toISOString().slice(0, 10)
  };

  showLoading('Menyimpan kunjungan...');
  
  try {
    const res = await api.simpanKunjungan(payload);
    hideLoading();
    
    if (res && res.sukses) {
      showToast('Kunjungan berhasil disimpan!', 'success');
      // Kembali ke beranda setelah sukses
      setTimeout(() => navigateTo('beranda'), 1500);
    } else {
      showToast('Gagal: ' + (res.error || 'Unknown'), 'error');
    }
  } catch (error) {
    hideLoading();
    showToast('Error: ' + error.message, 'error');
  }
};
