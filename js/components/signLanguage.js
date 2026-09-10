// Inclusive Indian Sign Language (ISL) Animated Interpreter Studio

import { soundManager } from '../utils/audioEffects.js';

// Colour constants for the avatar
const BODY_COLOR = '#1A237E'; // Navy blue
const HAND_COLOR = '#F5C6A5'; // Light skin tone

export const signPhrases = [
  {
    id: "namaste",
    title: "Namaste / Welcome (नमस्ते)",
    category: "Sacred Greeting",
    captionEn: "Namaste: I bow to the divine within you.",
    captionHi: "नमस्ते: आपके भीतर के दिव्य स्वरूप को मेरा प्रणाम।",
    description: "Hands brought together in Anjali Mudra at heart level with a gentle, reverent forward bow of the head.",
    gestureType: "prayer"
  },
  {
    id: "temple",
    title: "Temple / Mandir (मंदिर)",
    category: "Architecture",
    captionEn: "Temple: The sacred abode and mountain peak of God.",
    captionHi: "मंदिर: ईश्वर का पावन धाम और शिखर।",
    description: "Both hands rise together forming a peaked triangle (Shikhara roof), then open gracefully outward symbolizing sanctum entrance.",
    gestureType: "roof"
  },
  {
    id: "sun-wheel",
    title: "Sun God / Konark Wheel (सूर्य / चक्र)",
    category: "Astronomy",
    captionEn: "Surya: The cosmic Sun God radiating light and time.",
    captionHi: "सूर्य: प्रकाश और काल का शाश्वत चक्र।",
    description: "Fingers spread outward from a glowing center like solar rays, rotating clockwise in a circular wheel motion.",
    gestureType: "sun"
  },
  {
    id: "river-ganga",
    title: "Sacred River / Ganga (पवित्र नदी)",
    category: "Nature & Heritage",
    captionEn: "Ganga: The celestial river flowing from the heavens.",
    captionHi: "गंगा: स्वर्ग से अवतरित पावन जलधारा।",
    description: "Palms facing down, undulating rhythmically in graceful river waves flowing forward across the chest.",
    gestureType: "wave"
  },
  {
    id: "stone-carving",
    title: "Stone Sculptor / Shilpi (शिल्पकार)",
    category: "Artisanship",
    captionEn: "Shilpakala: Carving immortal sculptures from hard granite.",
    captionHi: "शिल्पकला: कठोर पाषाण से जीवंत मूर्तियों का सृजन।",
    description: "Left hand held fixed like a stone chisel, right hand lightly tapping rhythmically as a sculptor's mallet.",
    gestureType: "chisel"
  },
  {
    id: "chola-king",
    title: "Emperor / Rajaraja Chola (सम्राट)",
    category: "History",
    captionEn: "Emperor: The sovereign ruler crowned with dharma.",
    captionHi: "सम्राट: धर्म और शौर्य से मुकुटधारी चक्रवर्ती शासक।",
    description: "Both hands lift to the temples, tracing a three-pointed royal crown above the head, then arms spreading wide in imperial sovereignty.",
    gestureType: "crown"
  }
];

let activePhrase = signPhrases[0];
let animCanvas, animCtx;
let currentGestureAnim = null;
let animSpeed = 1.0;
let frameCount = 0;

export function initSignLanguageStudio() {
  const container = document.getElementById('sign-phrase-selector');
  animCanvas = document.getElementById('sign-avatar-canvas');
  if (!animCanvas) return;

  animCtx = animCanvas.getContext('2d');
  animCanvas.width = animCanvas.parentElement.clientWidth || 340;
  animCanvas.height = 280;

  // Render phrase buttons
  if (container) {
    container.innerHTML = signPhrases.map(p => `
      <button class="sign-phrase-btn ${p.id === activePhrase.id ? 'active-phrase' : ''}" data-sign-id="${p.id}">
        <span class="sign-phrase-cat">${p.category}</span>
        <span class="sign-phrase-title">${p.title}</span>
      </button>
    `).join('');

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-sign-id]');
      if (!btn) return;

      const signId = btn.getAttribute('data-sign-id');
      const found = signPhrases.find(p => p.id === signId);
      if (found) {
        soundManager.playClick();
        activePhrase = found;

        container.querySelectorAll('button').forEach(b => b.classList.remove('active-phrase'));
        btn.classList.add('active-phrase');

        updateSignCaptions();
        frameCount = 0;
      }
    });
  }

  // Speed controls
  const speedButtons = document.querySelectorAll('button[data-sign-speed]');
  speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      soundManager.playClick();
      speedButtons.forEach(b => b.classList.remove('active-speed'));
      btn.classList.add('active-speed');
      animSpeed = parseFloat(btn.getAttribute('data-sign-speed'));
    });
  });

  updateSignCaptions();
  startAvatarLoop();
}

function updateSignCaptions() {
  const enEl = document.getElementById('sign-caption-en');
  const hiEl = document.getElementById('sign-caption-hi');
  const descEl = document.getElementById('sign-gesture-desc');

  if (enEl) enEl.textContent = activePhrase.captionEn;
  if (hiEl) hiEl.textContent = activePhrase.captionHi;
  if (descEl) descEl.textContent = activePhrase.description;
}

function startAvatarLoop() {
  function render() {
    frameCount += 0.04 * animSpeed;
    drawAvatar(activePhrase.gestureType, frameCount);
    currentGestureAnim = requestAnimationFrame(render);
  }
  render();
}

// Procedural 2D Animated Avatar Renderer
function drawAvatar(gestureType, t) {
  if (!animCtx || !animCanvas) return;
  const ctx = animCtx;
  const w = animCanvas.width;
  const h = animCanvas.height;

  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h * 0.42;

  // Gentle breathing / idle bounce
  const breathe = Math.sin(t * 2) * 2;

  // 1. Shoulders & Torso (Royal Indian Nehru Kurta)
  ctx.save();
  ctx.translate(cx, cy + breathe);

  // Kurta Body
  ctx.fillStyle = BODY_COLOR;
  ctx.beginPath();
  ctx.moveTo(-50, 45);
  ctx.lineTo(50, 45);
  ctx.lineTo(60, 150);
  ctx.lineTo(-60, 150);
  ctx.closePath();
  ctx.fill();

  // Golden Collar Trim
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 45);
  ctx.lineTo(0, 130);
  ctx.stroke();

  // Neck
  ctx.fillStyle = '#e0a97a';
  ctx.fillRect(-12, 15, 24, 32);

  // 2. Head & Facial Expressions
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.fillStyle = '#e0a97a';
  ctx.fill();

  // Hair
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(0, -6, 33, Math.PI * 0.85, Math.PI * 2.15);
  ctx.fill();

  // Eyes (Blinking subtly)
  const isBlinking = Math.sin(t * 1.2) > 0.96;
  ctx.fillStyle = '#0f172a';
  if (isBlinking) {
    ctx.fillRect(-14, -2, 8, 2);
    ctx.fillRect(6, -2, 8, 2);
  } else {
    ctx.beginPath();
    ctx.arc(-10, -2, 3, 0, Math.PI * 2);
    ctx.arc(10, -2, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Kind Smile
  ctx.beginPath();
  ctx.arc(0, 10, 8, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.strokeStyle = '#8c482b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Tilak / Bindi on forehead
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(0, -12, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Hands & Arm Gestures based on ISL gesture type
  drawHandsByGesture(ctx, gestureType, t);

  ctx.restore();
}

function drawHandsByGesture(ctx, type, t) {
    ctx.fillStyle = HAND_COLOR;
  ctx.strokeStyle = '#0e1f3d';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'prayer') {
    // Namaste Anjali Mudra
    const offset = Math.sin(t * 3) * 3;
    // Left arm
    ctx.beginPath();
    ctx.moveTo(-45, 55);
    ctx.lineTo(-12, 60 + offset);
    ctx.stroke();
    // Right arm
    ctx.beginPath();
    ctx.moveTo(45, 55);
    ctx.lineTo(12, 60 + offset);
    ctx.stroke();

    // Joined Palms
    ctx.fillStyle = '#d49867';
    ctx.beginPath();
    ctx.ellipse(0, 58 + offset, 10, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'roof') {
    // Temple Shikhara gesture (hands joining at peak above head)
    const peakY = -40 + Math.sin(t * 2.5) * 4;

    ctx.beginPath();
    ctx.moveTo(-45, 55);
    ctx.lineTo(-20, -10);
    ctx.lineTo(-4, peakY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(45, 55);
    ctx.lineTo(20, -10);
    ctx.lineTo(4, peakY);
    ctx.stroke();

    // Hands meeting at triangle tip
    ctx.fillStyle = '#d49867';
    ctx.beginPath();
    ctx.arc(0, peakY, 9, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'sun') {
    // Radiating circular sun wheel
    const angle = t * 3;
    const handX = Math.cos(angle) * 30;
    const handY = 30 + Math.sin(angle) * 20;

    ctx.beginPath();
    ctx.moveTo(-45, 55);
    ctx.lineTo(-25, 45);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(45, 55);
    ctx.lineTo(25, 45);
    ctx.lineTo(-handX, handY);
    ctx.stroke();

    // Radiating rays
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 30, 8, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'wave') {
    // River wave undulating motion
    const wave1 = Math.sin(t * 4) * 14;
    const wave2 = Math.cos(t * 4) * 14;

    ctx.beginPath();
    ctx.moveTo(-45, 55);
    ctx.lineTo(-20, 60 + wave1);
    ctx.lineTo(10, 60 - wave2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(45, 55);
    ctx.lineTo(20, 60 - wave1);
    ctx.lineTo(-10, 60 + wave2);
    ctx.stroke();
  } else if (type === 'chisel') {
    // Chisel and hammer tapping motion
    const hammer = Math.abs(Math.sin(t * 5)) * 18;

    // Left hand fixed as chisel
    ctx.beginPath();
    ctx.moveTo(-45, 55);
    ctx.lineTo(0, 50);
    ctx.stroke();

    // Right hand tapping with hammer
    ctx.beginPath();
    ctx.moveTo(45, 55);
    ctx.lineTo(25, 30 - hammer);
    ctx.lineTo(5, 48 - hammer * 0.4);
    ctx.stroke();
  } else if (type === 'crown') {
    // Tracing crown on head
    const crownOffset = Math.sin(t * 2.5) * 4;

    ctx.beginPath();
    ctx.moveTo(-45, 55);
    ctx.lineTo(-35, -20 + crownOffset);
    ctx.lineTo(-20, -38 + crownOffset);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(45, 55);
    ctx.lineTo(35, -20 + crownOffset);
    ctx.lineTo(20, -38 + crownOffset);
    ctx.stroke();
  }
}
