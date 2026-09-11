// SanskritiVerse (Virasat) - Main Application Controller
import { monuments } from './data/monuments.js';
import { soundManager } from './utils/audioEffects.js';
import { initThreeViewer, loadMonumentModel } from './components/threeViewer.js';
import { initVoiceBot, speakText } from './components/voiceBot.js';
import { initMap, panToMonument, setMonumentSelectCallback } from './components/map.js';
import { translations } from './data/translations.js';
import { initSignLanguageStudio } from './components/signLanguage.js';
import { initHeritageLens } from './components/heritageLens.js';
import { initQuestGame } from './components/questGame.js';
import { initFestivalCalendar } from './components/festivalCalendar.js';
import { initTravelGuide, setTravelGuideMonument } from './components/travelGuide.js';
import { initChatBot } from './components/chatBot.js';

let currentLanguage = 'en';

window.addEventListener('load', async () => {
  // 1. Initialize Localization
  initLanguageSwitcher();

  // 2. Initialize Sound Toggle
  initSoundToggle();

  // 3. Register map callback and trigger secure Google Maps loader
  setMonumentSelectCallback(handleSelectMonument);
  try {
    await loadGoogleMaps();
    // If you have a specific map initialization function, call it here:
    if (typeof initHeritageMap === 'function') {
      initHeritageMap();
    } else if (typeof initMap === 'function') {
      initMap();
    }
  } catch (error) {
    console.error("Failed to load Google Maps SDK:", error);
  }

  // 4. Initialize Other Interactive Components
  initThreeViewer();
  initVoiceBot();
  initSignLanguageStudio();
  initHeritageLens();
  initQuestGame();
  initFestivalCalendar();
  initTravelGuide();
  initChatBot();

  // 5. Initialize Site Drawer Controls
  initSiteDrawer();

  // 6. Initialize Mobile Menu & Quick Anchors
  initNavigation();
});

function initLanguageSwitcher() {
  const langSelect = document.getElementById('global-lang-select');
  if (!langSelect) return;

  langSelect.addEventListener('change', (e) => {
    soundManager.playClick();
    currentLanguage = e.target.value;
    applyLanguage(currentLanguage);
  });
}

export function applyLanguage(lang) {
  currentLanguage = lang;
  const dict = translations[lang] || translations['en'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
}

function initSoundToggle() {
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    const isMuted = soundManager.toggleMute();
    soundBtn.classList.toggle('btn-muted', isMuted);
    soundBtn.innerHTML = isMuted ? `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      <span class="hidden sm:inline text-xs">Muted</span>
    ` : `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
      <span class="hidden sm:inline text-xs">Sound FX</span>
    `;
    if (!isMuted) soundManager.playClick();
  });
}

function handleSelectMonument(monument) {
  const drawer = document.getElementById('monument-detail-drawer');
  const drawerContent = document.getElementById('monument-drawer-content');
  if (!drawer || !drawerContent) return;

  drawerContent.innerHTML = `
    <div class="relative h-60 rounded-t-2xl overflow-hidden">
      <img src="${monument.image}" alt="${monument.name}" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
      <div class="absolute bottom-4 left-6 right-6">
        <span class="text-xs font-semibold px-2.5 py-1 bg-amber-500 text-slate-950 rounded-full font-bold">
          ${monument.city}, ${monument.state} ${monument.unescoYear ? '• UNESCO (' + monument.unescoYear + ')' : ''}
        </span>
        <h3 class="text-2xl font-black text-white mt-2">${monument.name}</h3>
        <p class="text-xs text-amber-300 font-serif">${monument.localName} — ${monument.tagline}</p>
      </div>
    </div>

    <div class="p-6 space-y-5 max-h-[62vh] overflow-y-auto">
      <div>
        <h5 class="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">Architecture & Historical Epoch</h5>
        <p class="text-sm text-slate-200 leading-relaxed">${monument.shortDesc}</p>
      </div>

      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="meta-box">
          <span class="meta-label">Dynasty / Reign</span>
          <span class="meta-val">${monument.dynasty}</span>
        </div>
        <div class="meta-box">
          <span class="meta-label">Era of Construction</span>
          <span class="meta-val">${monument.era}</span>
        </div>
        <div class="meta-box col-span-2">
          <span class="meta-label">Architectural Style</span>
          <span class="meta-val">${monument.architecturalStyle}</span>
        </div>
        <div class="meta-box col-span-2">
          <span class="meta-label">Primary Building Material</span>
          <span class="meta-val">${monument.material}</span>
        </div>
      </div>

      <div>
        <h5 class="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">Key Engineering & Cultural Marvels</h5>
        <ul class="space-y-2">
          ${monument.keyFacts.map(f => `
            <li class="text-xs text-slate-300 flex items-start gap-2">
              <span class="text-amber-400 font-bold">❖</span>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl">
        <h5 class="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">Folklore & Oral Tradition</h5>
        <p class="text-xs text-slate-300 leading-relaxed italic">"${monument.folklore}"</p>
      </div>

      <div class="pt-2 flex flex-wrap gap-3">
        ${monument.has3DModel ? `
          <button id="drawer-btn-view-3d" class="btn-primary-sm flex items-center gap-2" data-site-id="${monument.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <span>Explore in 3D</span>
          </button>
        ` : ''}

        <button id="drawer-btn-travel" class="btn-secondary-sm flex items-center gap-2" data-site-id="${monument.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
          <span>Plan Eco-Travel</span>
        </button>

        <button id="drawer-btn-voice" class="btn-secondary-sm flex items-center gap-2" data-text="${monument.name}. ${monument.shortDesc}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          <span>Listen</span>
        </button>
      </div>
    </div>
  `;

  drawer.classList.remove('hidden');

  const view3DBtn = document.getElementById('drawer-btn-view-3d');
  if (view3DBtn) {
    view3DBtn.addEventListener('click', () => {
      soundManager.playClick();
      drawer.classList.add('hidden');
      scrollToSection('three-section');
      loadMonumentModel(monument.id);
      const sel = document.getElementById('three-monument-select');
      if (sel) sel.value = monument.id;
    });
  }

  const travelBtn = document.getElementById('drawer-btn-travel');
  if (travelBtn) {
    travelBtn.addEventListener('click', () => {
      soundManager.playClick();
      drawer.classList.add('hidden');
      scrollToSection('travel-section');
      setTravelGuideMonument(monument.id);
    });
  }

  const voiceBtn = document.getElementById('drawer-btn-voice');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      soundManager.playClick();
      speakText(`${monument.name}. ${monument.shortDesc}. ${monument.folklore}`, 'en-IN');
    });
  }
}

function initSiteDrawer() {
  const closeBtn = document.getElementById('btn-close-drawer');
  const drawer = document.getElementById('monument-detail-drawer');
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      soundManager.playClick();
      drawer.classList.add('hidden');
    });
  }
}

function initNavigation() {
  const menuToggle = document.getElementById('btn-mobile-menu');
  const mobileMenu = document.getElementById('mobile-nav-drawer');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      soundManager.playClick();
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      soundManager.playClick();
      const targetId = btn.getAttribute('data-scroll-to');
      scrollToSection(targetId);
    });
  });
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

async function loadGoogleMaps() {
  const apiKey = "AIzaSyBmJpdh68E0E7ZYXi22Qxv1b2Nm31jlpHU";
  if (window.google && window.google.maps && window.google.maps.Map) return;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Ensure the Map constructor is fully ready before resolving
      if (window.google && window.google.maps && window.google.maps.Map) {
        resolve();
      } else {
        setTimeout(resolve, 100);
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}