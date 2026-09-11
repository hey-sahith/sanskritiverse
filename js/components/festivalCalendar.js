// Cultural Calendar & Regional Festivals Component

import { festivals } from '../data/festivals.js';
import { soundManager } from '../utils/audioEffects.js';

let activeCategory = 'all';

export function initFestivalCalendar() {
  const container = document.getElementById('festival-grid-container');
  const filterTabs = document.getElementById('festival-filter-tabs');
  if (!container) return;

  renderFestivalCards(activeCategory);

  if (filterTabs) {
    filterTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-category]');
      if (!btn) return;

      soundManager.playClick();
      activeCategory = btn.getAttribute('data-category');

      filterTabs.querySelectorAll('button').forEach(b => b.classList.remove('active-tab'));
      btn.classList.add('active-tab');

      renderFestivalCards(activeCategory);
    });
  }
}

function renderFestivalCards(category) {
  const container = document.getElementById('festival-grid-container');
  if (!container) return;

  const filtered = category === 'all'
    ? festivals
    : festivals.filter(f => f.category === category);

  container.innerHTML = filtered.map(f => `
    <div class="festival-card group" data-festival-id="${f.id}">
      <div class="fest-image-wrapper">
        <img src="${f.image}" alt="${f.name}" class="fest-image" loading="lazy" onerror="this.onerror=null; this.src='images/festivals/pongal.jpg';" />
        <div class="fest-tag-pill">${f.month}</div>
        <div class="fest-overlay"></div>
      </div>
      <div class="p-4">
        <span class="text-xs uppercase font-semibold text-amber-500 tracking-wider">${f.season}</span>
        <h4 class="text-base font-bold text-white group-hover:text-amber-400 transition-colors mt-0.5">${f.name}</h4>
        <p class="text-xs text-slate-300 mt-1 line-clamp-2">${f.significance}</p>
        
        <div class="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
          <span class="text-slate-400 truncate max-w-[170px]">${f.regions}</span>
          <span class="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Explore →
          </span>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.festival-card').forEach(card => {
    card.addEventListener('click', () => {
      soundManager.playClick();
      const fId = card.getAttribute('data-festival-id');
      const found = festivals.find(item => item.id === fId);
      if (found) openFestivalModal(found);
    });
  });
}

function openFestivalModal(fest) {
  const modal = document.getElementById('festival-detail-modal');
  const modalBody = document.getElementById('festival-modal-body');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="relative h-64 rounded-t-2xl overflow-hidden bg-slate-900">
      <img src="${fest.image}" alt="${fest.name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='images/festivals/pongal.jpg';" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
      <div class="absolute bottom-4 left-6 right-6">
        <span class="text-xs font-semibold px-2.5 py-1 bg-amber-500 text-slate-950 rounded-full font-bold">
          ${fest.season} • ${fest.month}
        </span>
        <h3 class="text-2xl font-black text-white mt-2">${fest.name}</h3>
        <p class="text-xs text-amber-300">${fest.localName} • Celebrated in ${fest.regions}</p>
      </div>
    </div>

    <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
      <div>
        <h5 class="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">Cultural Significance & Origin</h5>
        <p class="text-sm text-slate-200 leading-relaxed">${fest.significance}</p>
      </div>

      <div>
        <h5 class="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5">Living Traditions & Sacred Rituals</h5>
        <ul class="space-y-1.5">
          ${fest.traditions.map(t => `
            <li class="text-xs text-slate-300 flex items-start gap-2">
              <span class="text-amber-400 mt-0.5 font-bold">✦</span>
              <span>${t}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div class="p-3 bg-white/5 border border-white/10 rounded-xl">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-amber-400 font-bold text-sm">🍲 Traditional Delicacies:</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${fest.foods}</p>
        </div>

        <div class="p-3 bg-white/5 border border-white/10 rounded-xl">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-orange-400 font-bold text-sm">🪘 Folk Dance & Rhythms:</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${fest.danceMusic}</p>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

// Close Modal delegation
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'btn-close-fest-modal') {
    soundManager.playClick();
    const modal = document.getElementById('festival-detail-modal');
    if (modal) modal.classList.add('hidden');
  }
});
