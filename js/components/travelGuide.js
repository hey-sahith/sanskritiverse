// Smart & Sustainable Travel Guide Component

import { monuments } from '../data/monuments.js';
import { soundManager } from '../utils/audioEffects.js';

let activeMonument = monuments[0];

export function initTravelGuide() {
  const container = document.getElementById('travel-guide-container');
  const selector = document.getElementById('travel-site-selector');
  if (!container || !selector) return;

  // Populate site dropdown
  selector.innerHTML = monuments.map(m => `
    <option value="${m.id}">${m.name} (${m.city}, ${m.state})</option>
  `).join('');

  selector.addEventListener('change', (e) => {
    soundManager.playClick();
    const found = monuments.find(m => m.id === e.target.value);
    if (found) {
      activeMonument = found;
      renderTravelCard(found);
    }
  });

  renderTravelCard(activeMonument);
}

export function setTravelGuideMonument(monumentId) {
  const selector = document.getElementById('travel-site-selector');
  const found = monuments.find(m => m.id === monumentId);
  if (found) {
    activeMonument = found;
    if (selector) selector.value = monumentId;
    renderTravelCard(found);
  }
}

function renderTravelCard(m) {
  const container = document.getElementById('travel-guide-container');
  if (!container) return;

  container.innerHTML = `
    <div class="travel-card-main">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Site Overview -->
        <div class="lg:col-span-1 space-y-4">
          <div class="relative rounded-2xl overflow-hidden h-48">
            <img src="${m.image}" alt="${m.name}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            <div class="absolute bottom-3 left-3 right-3">
              <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">${m.city}, ${m.state}</span>
              <h4 class="text-lg font-bold text-white leading-tight">${m.name}</h4>
            </div>
          </div>

          <div class="p-4 bg-white/5 border border-white/10 rounded-2xl">
            <div class="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
              <span>Best Time to Visit</span>
            </div>
            <p class="text-sm text-slate-100 font-semibold">${m.travel.bestMonths}</p>
          </div>
        </div>

        <!-- Transit & Eco-Travel -->
        <div class="lg:col-span-2 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Transit Hubs -->
            <div class="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <div class="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
                <span>Nearest Transit Hubs</span>
              </div>
              <ul class="text-xs text-slate-300 space-y-2">
                <li><strong class="text-slate-200">Flight:</strong> ${m.travel.nearestAirport}</li>
                <li><strong class="text-slate-200">Railways:</strong> ${m.travel.nearestRail}</li>
              </ul>
            </div>

            <!-- Eco-Friendly Transport -->
            <div class="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl">
              <div class="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"/></svg>
                <span>Green & Eco-Friendly Transit</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">${m.travel.ecoTransit}</p>
            </div>
          </div>

          <!-- Artisanal Crafts & Food -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-amber-950/20 border border-amber-500/20 rounded-2xl">
              <div class="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span>GI-Tagged Crafts & Handlooms</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">${m.travel.localCrafts}</p>
            </div>

            <div class="p-4 bg-orange-950/20 border border-orange-500/20 rounded-2xl">
              <div class="flex items-center gap-2 text-orange-300 font-bold text-xs uppercase tracking-wider mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                <span>Regional Heritage Cuisine</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">${m.travel.cuisine}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
