// Heritage Quest Game & Student Gamification Component

import { quests } from '../data/quests.js';
import { soundManager } from '../utils/audioEffects.js';
import { fireConfetti } from '../utils/confetti.js';

let activeQuest = quests[0];
let currentQuestionIdx = 0;
let userScore = 0;
let userXP = 250;
let streak = 3;
let unlockedBadges = ["Heritage Scout"];

export function initQuestGame() {
  const container = document.getElementById('quest-module-container');
  if (!container) return;

  renderQuestInterface();
}

function renderQuestInterface() {
  const container = document.getElementById('quest-module-container');
  if (!container) return;

  const currentRank = getRank(userXP);

  container.innerHTML = `
    <!-- Player Stats Bar -->
    <div class="quest-player-bar">
      <div class="flex items-center gap-3">
        <div class="player-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <div>
          <h4 class="font-bold text-white text-sm">Student Explorer</h4>
          <span class="rank-badge">${currentRank}</span>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div class="stat-pill">
          <span class="stat-num text-amber-400 font-extrabold text-lg">${userXP}</span>
          <span class="stat-lbl text-xs text-slate-400">Total XP</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num text-orange-400 font-extrabold text-lg">🔥 ${streak}</span>
          <span class="stat-lbl text-xs text-slate-400">Day Streak</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num text-emerald-400 font-extrabold text-lg">${unlockedBadges.length}</span>
          <span class="stat-lbl text-xs text-slate-400">Badges</span>
        </div>
      </div>
    </div>

    <!-- Mission Selector Tabs -->
    <div class="mission-tabs-grid mt-6">
      ${quests.map(q => `
        <button class="mission-tab-card ${q.id === activeQuest.id ? 'active-mission' : ''}" data-quest-id="${q.id}">
          <div class="flex justify-between items-start mb-2">
            <span class="mission-category">${q.category}</span>
            <span class="mission-reward">+${q.xpReward} XP</span>
          </div>
          <h4 class="mission-title">${q.title}</h4>
          <p class="mission-desc line-clamp-2">${q.description}</p>
        </button>
      `).join('')}
    </div>

    <!-- Active Quest Quiz Card -->
    <div class="quest-quiz-card mt-6" id="quest-quiz-body">
      ${renderQuestionView()}
    </div>
  `;

  // Attach Mission Card listeners
  container.querySelectorAll('button[data-quest-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = btn.getAttribute('data-quest-id');
      const found = quests.find(q => q.id === qId);
      if (found) {
        soundManager.playClick();
        activeQuest = found;
        currentQuestionIdx = 0;
        renderQuestInterface();
      }
    });
  });

  attachQuizOptionListeners();
}

function renderQuestionView() {
  const q = activeQuest.questions[currentQuestionIdx];
  const total = activeQuest.questions.length;

  if (currentQuestionIdx >= total) {
    return renderCompletionView();
  }

  return `
    <div class="quiz-header flex justify-between items-center pb-3 border-b border-white/10">
      <div>
        <span class="text-xs uppercase font-semibold text-amber-400 tracking-wider">Mission Challenge</span>
        <h3 class="text-lg font-bold text-white">${activeQuest.title}</h3>
      </div>
      <div class="text-right">
        <span class="text-xs text-slate-400">Question ${currentQuestionIdx + 1} of ${total}</span>
        <div class="progress-bar-bg mt-1">
          <div class="progress-bar-fill" style="width: ${((currentQuestionIdx + 1) / total) * 100}%"></div>
        </div>
      </div>
    </div>

    <div class="quiz-question-text mt-4 text-base font-medium text-slate-100">
      ${q.question}
    </div>

    <div class="quiz-options-grid mt-5 space-y-2.5">
      ${q.options.map((opt, idx) => `
        <button class="quiz-option-btn group" data-option-idx="${idx}">
          <span class="opt-bullet">${String.fromCharCode(65 + idx)}</span>
          <span class="opt-text">${opt}</span>
        </button>
      `).join('')}
    </div>

    <div id="quiz-explanation-box" class="quiz-explanation-box hidden mt-4">
      <div class="flex items-start gap-2">
        <div id="quiz-status-icon"></div>
        <div>
          <h5 id="quiz-status-title" class="font-bold text-sm"></h5>
          <p class="text-xs text-slate-300 mt-1">${q.explanation}</p>
        </div>
      </div>
      <button id="btn-next-question" class="btn-primary-sm mt-3 ml-auto block">
        Next Question →
      </button>
    </div>
  `;
}

function attachQuizOptionListeners() {
  const options = document.querySelectorAll('.quiz-option-btn');
  const expBox = document.getElementById('quiz-explanation-box');
  const q = activeQuest.questions[currentQuestionIdx];

  options.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = parseInt(btn.getAttribute('data-option-idx'), 10);
      options.forEach(b => b.disabled = true);

      const statusTitle = document.getElementById('quiz-status-title');
      const statusIcon = document.getElementById('quiz-status-icon');

      if (selected === q.correct) {
        soundManager.playSuccess();
        btn.classList.add('correct-opt');
        userXP += 75;
        if (statusTitle) {
          statusTitle.textContent = "Correct! Archaeological Insight Unlocked";
          statusTitle.className = "font-bold text-sm text-emerald-400";
        }
      } else {
        soundManager.playWrong();
        btn.classList.add('wrong-opt');
        options[q.correct].classList.add('correct-opt');
        if (statusTitle) {
          statusTitle.textContent = "Incorrect Observation";
          statusTitle.className = "font-bold text-sm text-rose-400";
        }
      }

      if (expBox) expBox.classList.remove('hidden');

      const nextBtn = document.getElementById('btn-next-question');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          soundManager.playClick();
          currentQuestionIdx++;
          const quizBody = document.getElementById('quest-quiz-body');
          if (quizBody) {
            quizBody.innerHTML = renderQuestionView();
            attachQuizOptionListeners();
          }
        });
      }
    });
  });
}

function renderCompletionView() {
  soundManager.playTempleBell();
  fireConfetti();

  if (!unlockedBadges.includes(activeQuest.badge.name)) {
    unlockedBadges.push(activeQuest.badge.name);
  }

  return `
    <div class="text-center py-6">
      <div class="inline-flex p-4 rounded-full bg-gradient-to-tr ${activeQuest.badge.color} text-white shadow-xl shadow-amber-500/20 mb-3 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
      </div>
      <h3 class="text-2xl font-black text-white">Mission Accomplished!</h3>
      <p class="text-sm text-amber-300 font-semibold mt-1">Badge Unlocked: ${activeQuest.badge.name}</p>
      <p class="text-xs text-slate-300 max-w-md mx-auto mt-2">${activeQuest.badge.description}</p>

      <div class="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-3 mt-5">
        <div>
          <span class="text-xs text-slate-400">Reward Awarded</span>
          <p class="text-lg font-bold text-amber-400">+${activeQuest.xpReward} XP</p>
        </div>
        <div class="h-8 w-px bg-white/10"></div>
        <div>
          <span class="text-xs text-slate-400">Total Progress</span>
          <p class="text-lg font-bold text-emerald-400">${userXP} XP</p>
        </div>
      </div>

      <div class="mt-6 flex justify-center gap-3">
        <button id="btn-replay-quest" class="btn-secondary-sm">
          Replay Mission
        </button>
        <button id="btn-next-quest" class="btn-primary-sm">
          Next Discovery Quest →
        </button>
      </div>
    </div>
  `;
}

function getRank(xp) {
  if (xp < 350) return "Heritage Scout";
  if (xp < 750) return "Cultural Chronicler";
  if (xp < 1200) return "Virasat Custodian";
  return "Virasat Grand Guardian";
}

// Delegation for completion buttons
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'btn-replay-quest') {
    soundManager.playClick();
    currentQuestionIdx = 0;
    renderQuestInterface();
  } else if (e.target && e.target.id === 'btn-next-quest') {
    soundManager.playClick();
    const currentIdx = quests.findIndex(q => q.id === activeQuest.id);
    const nextIdx = (currentIdx + 1) % quests.length;
    activeQuest = quests[nextIdx];
    currentQuestionIdx = 0;
    renderQuestInterface();
  }
});
