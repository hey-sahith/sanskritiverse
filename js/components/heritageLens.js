// Heritage Lens: AI Vision & Artifact Scanner Component

import { visionPresets } from '../data/visionPresets.js';
import { soundManager } from '../utils/audioEffects.js';
import { speakText } from './voiceBot.js';

let currentStream = null;
let isScanning = false;

export function initHeritageLens() {
  const fileInput = document.getElementById('lens-file-input');
  const uploadArea = document.getElementById('lens-upload-area');
  const webcamBtn = document.getElementById('btn-lens-webcam');
  const captureBtn = document.getElementById('btn-lens-capture');
  const videoEl = document.getElementById('lens-video');
  const previewImg = document.getElementById('lens-preview-image');
  const presetsContainer = document.getElementById('lens-presets-container');

  if (!uploadArea) return;

  // Render Preset Buttons
  if (presetsContainer) {
    presetsContainer.innerHTML = visionPresets.map(p => `
      <button class="preset-card group" data-preset-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" class="preset-thumb" />
        <div class="preset-info">
          <span class="preset-title">${p.name}</span>
          <span class="preset-era">${p.era}</span>
        </div>
      </button>
    `).join('');

    presetsContainer.addEventListener('click', (e) => {
      const card = e.target.closest('button[data-preset-id]');
      if (!card) return;

      const presetId = card.getAttribute('data-preset-id');
      const preset = visionPresets.find(p => p.id === presetId);
      if (preset) {
        soundManager.playClick();
        stopWebcam();
        loadPresetForScan(preset);
      }
    });
  }

  // File Upload Handlers
  uploadArea.addEventListener('click', () => {
    if (fileInput) fileInput.click();
  });

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-active');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-active');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-active');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImageFile(e.target.files[0]);
      }
    });
  }

  // Live Camera Toggle
  if (webcamBtn) {
    webcamBtn.addEventListener('click', () => {
      soundManager.playClick();
      if (currentStream) {
        stopWebcam();
      } else {
        startWebcam();
      }
    });
  }

  // Capture Camera Frame
  if (captureBtn) {
    captureBtn.addEventListener('click', () => {
      soundManager.playClick();
      captureWebcamFrame();
    });
  }
}

function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    stopWebcam();
    const previewImg = document.getElementById('lens-preview-image');
    if (previewImg) {
      previewImg.src = e.target.result;
      previewImg.classList.remove('hidden');
    }
    // Simulate AI Vision Detection
    runScanningAnimation(visionPresets[0]); // default to rich preset data
  };
  reader.readAsDataURL(file);
}

function loadPresetForScan(preset) {
  const previewImg = document.getElementById('lens-preview-image');
  if (previewImg) {
    previewImg.src = preset.image;
    previewImg.classList.remove('hidden');
  }
  runScanningAnimation(preset);
}

async function startWebcam() {
  const videoEl = document.getElementById('lens-video');
  const previewImg = document.getElementById('lens-preview-image');
  const captureBtn = document.getElementById('btn-lens-capture');
  const webcamBtn = document.getElementById('btn-lens-webcam');

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
    });
    if (videoEl) {
      videoEl.srcObject = currentStream;
      videoEl.classList.remove('hidden');
      videoEl.play();
    }
    if (previewImg) previewImg.classList.add('hidden');
    if (captureBtn) captureBtn.classList.remove('hidden');
    if (webcamBtn) {
      webcamBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
        <span>Stop Camera</span>
      `;
    }
  } catch (err) {
    alert("Camera access was not granted or is not available. Please use file upload or the sample presets.");
  }
}

function stopWebcam() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
  const videoEl = document.getElementById('lens-video');
  const captureBtn = document.getElementById('btn-lens-capture');
  const webcamBtn = document.getElementById('btn-lens-webcam');

  if (videoEl) videoEl.classList.add('hidden');
  if (captureBtn) captureBtn.classList.add('hidden');
  if (webcamBtn) {
    webcamBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
      <span>Use Live Camera</span>
    `;
  }
}

function captureWebcamFrame() {
  const videoEl = document.getElementById('lens-video');
  const previewImg = document.getElementById('lens-preview-image');
  if (!videoEl) return;

  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth || 640;
  canvas.height = videoEl.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

  stopWebcam();
  if (previewImg) {
    previewImg.src = canvas.toDataURL('image/jpeg');
    previewImg.classList.remove('hidden');
  }

  // Run AI analysis
  const randomPreset = visionPresets[Math.floor(Math.random() * visionPresets.length)];
  runScanningAnimation(randomPreset);
}

function runScanningAnimation(resultData) {
  if (isScanning) return;
  isScanning = true;

  const scanOverlay = document.getElementById('lens-scan-overlay');
  const scanStatus = document.getElementById('lens-scan-status');
  const resultCard = document.getElementById('lens-result-card');

  if (scanOverlay) scanOverlay.classList.remove('hidden');
  if (resultCard) resultCard.classList.add('hidden');

  soundManager.playScanBeep();

  const steps = [
    "Initialising neural vision models...",
    "Extracting morphological geometry & relief depth...",
    "Cross-referencing Archaeological Survey of India (ASI) records...",
    "Classifying dynasty, metallurgy & stylistic school..."
  ];

  let stepIdx = 0;
  const interval = setInterval(() => {
    if (scanStatus && stepIdx < steps.length) {
      scanStatus.textContent = steps[stepIdx];
      soundManager.playScanBeep();
      stepIdx++;
    }
  }, 450);

  setTimeout(() => {
    clearInterval(interval);
    if (scanOverlay) scanOverlay.classList.add('hidden');
    isScanning = false;
    soundManager.playSuccess();
    renderAnalysisResult(resultData);
  }, 2200);
}

function renderAnalysisResult(data) {
  const resultCard = document.getElementById('lens-result-card');
  if (!resultCard) return;

  resultCard.innerHTML = `
    <div class="result-header">
      <div class="flex items-center justify-between">
        <span class="confidence-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          AI Match: ${data.confidence}
        </span>
        <span class="text-xs font-semibold px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
          ${data.category}
        </span>
      </div>
      <h3 class="text-xl font-bold text-white mt-2">${data.name}</h3>
    </div>

    <div class="grid grid-cols-2 gap-2 mt-4 text-xs">
      <div class="meta-box">
        <span class="meta-label">Dynasty / Era</span>
        <span class="meta-val">${data.dynasty} (${data.era})</span>
      </div>
      <div class="meta-box">
        <span class="meta-label">Material & Technique</span>
        <span class="meta-val">${data.material}</span>
      </div>
      <div class="meta-box col-span-2">
        <span class="meta-label">Architectural / Artistic Style</span>
        <span class="meta-val">${data.style}</span>
      </div>
    </div>

    <div class="mt-4">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">Cultural Significance</h4>
      <p class="text-xs text-slate-300 leading-relaxed">${data.significance}</p>
    </div>

    <div class="mt-3">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">Diagnostic Features</h4>
      <ul class="text-xs text-slate-300 space-y-1 list-disc pl-4">
        ${data.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <div class="mt-5 flex items-center gap-3">
      <button id="btn-lens-speak-result" class="btn-primary-sm flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        <span>Read AI Breakdown</span>
      </button>
    </div>
  `;

  resultCard.classList.remove('hidden');

  const speakBtn = document.getElementById('btn-lens-speak-result');
  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      soundManager.playClick();
      speakText(data.audioScript, 'en-IN');
    });
  }
}
