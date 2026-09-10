// Floating Heritage Guide AI Chatbot Component

import { soundManager } from '../utils/audioEffects.js';
import { speakText } from './voiceBot.js';

const knowledgeBase = [
  {
    triggers: ["dravidian", "nagara", "vesara", "temple style", "temple architecture"],
    response: "Indian temple architecture flourished primarily into three classical orders described in the Shilpa Shastras:\n\n1. **Dravidian Style (South India)**: Characterized by pyramidal multi-tiered towers called **Vimanas** over the sanctum, soaring entrance gateway towers called **Gopurams**, pillared corridors (Mandapas), and sacred water tanks (e.g. Brihadisvara Temple, Thanjavur; Meenakshi Amman, Madurai).\n\n2. **Nagara Style (North & Central India)**: Renowned for curvilinear beehive-shaped towers called **Shikharas** that emulate sacred mountain peaks, crowning ribbed stone discs called **Amalakas**, and rising fractal miniature spires (Urushringas) (e.g. Khajuraho Kandariya Mahadeva, Sun Temple Modhera).\n\n3. **Vesara Style (Deccan / Karnataka)**: A dynamic hybrid of Dravida and Nagara traditions developed by the Chalukyas and Hoysalas, famous for star-shaped (stellate) platform plans and soapstone filigree carvings (e.g. Belur and Halebidu)."
  },
  {
    triggers: ["taj", "taj mahal", "shah jahan", "mumtaz", "pietra dura", "foundation"],
    response: "The **Taj Mahal** in Agra (1632–1653 CE) represents the pinnacle of Mughal symmetry. Key engineering feats include:\n- **Subterranean Timber Wells**: The massive marble plinth rests upon deep wooden well caissons submerged in the Yamuna River. The ebony/teak timber relies on constant moisture from the riverbed to maintain structural integrity without drying out.\n- **Parchin Kari (Pietra Dura)**: Intricate floral arabesques created by inlaying precious and semi-precious stones (lapis lazuli from Badakhshan, turquoise from Tibet, carnelian from Arabia) directly into white Makrana marble.\n- **Optical Illusion**: The four corner minarets were deliberately tilted outward by 2 to 3 degrees. This creates a visually straight perspective from ground level and ensures they collapse away from the central dome during an earthquake."
  },
  {
    triggers: ["konark", "sun temple", "sundial", "wheel", "odisha", "dharmapada"],
    response: "The **Konark Sun Temple** in Odisha (c. 1250 CE) was designed by Eastern Ganga King Narasimhadeva I as a gigantic stone chariot for the Sun God Surya:\n- **24 Sundial Wheels**: Each 9.9-foot wheel represents the fortnights of the year. The shadow cast by the center axle hub onto the eight primary spokes indicates the exact Prahar (time of day) accurate to within 3 minutes.\n- **Magnetic Levitation Legend**: Historical records state the crowning kalasha originally contained a colossal 52-ton natural lodestone (magnet). This created a magnetic field with iron plates in the temple walls that suspended the sun idol floating in mid-air!\n- **Child Prodigy Dharmapada**: When 1,200 sculptors could not fix the crowning kalasha, the 12-year-old son of the chief architect completed the alignment, sacrificing himself into the sea to protect his father's guild."
  },
  {
    triggers: ["hampi", "vijayanagara", "stone chariot", "musical pillar", "vittala", "krishnadevaraya"],
    response: "**Hampi**, the magnificent capital of the Vijayanagara Empire (1336–1565 CE), is an open-air archaeological wonderland amidst granite boulders:\n- **Musical Pillars of Vittala Temple**: The Maha Mandapa holds 56 monolithic acoustic pillars. When lightly tapped, they resonate with the distinct timber notes of Indian classical instruments (Sa-Re-Ga-Ma).\n- **Stone Chariot**: Depicted on the ₹50 currency note, this shrine to Garuda features four ornate stone wheels that historically rotated freely on stone axles.\n- **Global Metropolis**: In the 15th and 16th centuries, Hampi was among the wealthiest and second-largest urban centers in the world, with gemstone markets where rubies and diamonds were traded in open weight measures."
  },
  {
    triggers: ["chola", "bronze", "nataraja", "brihadisvara", "rajaraja", "lost wax"],
    response: "The **Imperial Cholas** (9th – 13th Century CE) were peerless masters of architecture, maritime naval expeditions, and sacred metallurgy:\n- **Brihadisvara Temple (Thanjavur)**: Features a 216-foot granite vimana capped with an 80-ton single stone Kumbam, raised without mortar via a 6-km long inclined earthen ramp.\n- **Cire-Perdue (Lost-Wax Bronze Casting)**: Chola sculptors used beeswax sculpted models to cast hollow and solid Panchaloha (five-metal alloy) bronze masterworks. The **Nataraja** (Cosmic Dancer) captured the dynamic equilibrium of the cosmos, celebrated worldwide by both physicists and philosophers."
  },
  {
    triggers: ["ajanta", "ellora", "kailasa", "fresco", "buddhist", "rock cut"],
    response: "The **Ajanta and Ellora Caves** in Maharashtra showcase the zenith of Indian rock-cut architecture:\n- **Kailasa Temple (Cave 16, Ellora)**: The world's largest monolithic rock excavation, carved vertically top-down from a single basalt cliff. Over 200,000 tons of rock were scooped out by Rashtrakuta artisans without scaffolding.\n- **Ajanta Murals**: 30 rock-cut Buddhist caves dating from 200 BCE to 480 CE. The frescoes of Bodhisattvas Padmapani and Vajrapani were painted with natural mineral pigments (including lapis lazuli) on mud-plaster walls, enduring vibrantly for over 1,500 years."
  },
  {
    triggers: ["sanchi", "stupa", "ashoka", "buddha", "torana", "mauryan"],
    response: "The **Great Stupa at Sanchi** (Madhya Pradesh) is India's oldest stone structure, commissioned by Emperor Ashoka in the 3rd Century BCE:\n- **Sacred Anda**: The hemispherical dome represents the cosmic egg of the universe and the vault of heaven, housing the holy relics of Gautama Buddha.\n- **Four Torana Gateways**: Carved with wood-and-ivory-like delicacy by guild carvers from Vidisha, depicting Jataka tales, celestial beings, and the life of Buddha using aniconic symbols (the footprint, Bodhi tree, empty throne, and wheel)."
  },
  {
    triggers: ["varanasi", "kashi", "ganga", "ghats", "aarti"],
    response: "**Varanasi (Kashi)** is one of the world's oldest continuously inhabited sacred cities, nestled on the crescent bend of the holy Ganges:\n- **84 Sacred Ghats**: Stretching along 7 kilometers of stone riverfront. Famous ghats include Dashashwamedh (evening Ganga Aarti) and Manikarnika (the eternal cremation fire that has burned unbroken for thousands of years).\n- **Dev Deepawali**: Celebrated 15 days after Diwali on Kartik Purnima, when over one million earthen diyas illuminate all 84 ghats, welcoming the gods down from heaven."
  }
];

const fallbackAnswers = [
  "Namaste! India's heritage spans over 5,000 years of living traditions, from the urban planning of Harappa to the soaring granite gopurams of Tamil Nadu. Would you like to explore temple architecture (Dravidian vs Nagara), the engineering of the Taj Mahal foundation, or the secrets of the Konark sundial wheels?",
  "That is a fascinating query regarding India's cultural chronicle! I can guide you through ancient dynasties (Cholas, Mauryas, Mughals, Vijayanagara), rock-cut subterranean monuments like Ellora Kailasa and Rani ki Vav, or our regional festivals. What would you like to discover first?"
];

export function initChatBot() {
  const toggleBtn = document.getElementById('btn-chat-toggle');
  const chatWindow = document.getElementById('chat-window-modal');
  const closeBtn = document.getElementById('btn-chat-close');
  const sendBtn = document.getElementById('btn-chat-send');
  const inputEl = document.getElementById('chat-input-field');
  const chipsContainer = document.getElementById('chat-chips-container');

  if (!toggleBtn || !chatWindow) return;

  toggleBtn.addEventListener('click', () => {
    soundManager.playClick();
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden') && inputEl) {
      inputEl.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      soundManager.playClick();
      chatWindow.classList.add('hidden');
    });
  }

  // Quick Chips
  const quickChips = [
    "Dravidian vs Nagara architecture",
    "How was Taj Mahal foundation built?",
    "Tell me about Hampi musical pillars",
    "Secrets of Konark Sun Temple wheels",
    "Chola bronze Nataraja casting",
    "How was Kailasa temple carved top-down?"
  ];

  if (chipsContainer) {
    chipsContainer.innerHTML = quickChips.map(c => `
      <button class="chat-chip-btn text-xs px-2.5 py-1 bg-white/10 hover:bg-amber-500/20 hover:text-amber-300 text-slate-200 rounded-full border border-white/10 transition-all truncate">
        ${c}
      </button>
    `).join('');

    chipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-chip-btn');
      if (!chip) return;
      soundManager.playClick();
      sendUserMessage(chip.textContent.trim());
    });
  }

  // Send message events
  if (sendBtn && inputEl) {
    sendBtn.addEventListener('click', () => {
      const msg = inputEl.value.trim();
      if (msg) {
        sendUserMessage(msg);
        inputEl.value = '';
      }
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const msg = inputEl.value.trim();
        if (msg) {
          sendUserMessage(msg);
          inputEl.value = '';
        }
      }
    });
  }
}

function sendUserMessage(text) {
  const messagesContainer = document.getElementById('chat-messages-body');
  if (!messagesContainer) return;

  // Append user message
  const userMsgEl = document.createElement('div');
  userMsgEl.className = 'chat-bubble-user';
  userMsgEl.innerHTML = `<p class="text-xs text-white">${escapeHTML(text)}</p>`;
  messagesContainer.appendChild(userMsgEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Show typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-bubble-bot typing-bubble';
  typingEl.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;
  messagesContainer.appendChild(typingEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  soundManager.playClick();

  // Find match in knowledge base
  const lower = text.toLowerCase();
  let foundMatch = null;

  for (const item of knowledgeBase) {
    if (item.triggers.some(t => lower.includes(t))) {
      foundMatch = item.response;
      break;
    }
  }

  if (!foundMatch) {
    foundMatch = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
  }

  setTimeout(() => {
    if (typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }

    const botMsgEl = document.createElement('div');
    botMsgEl.className = 'chat-bubble-bot';
    
    // Parse simple markdown bold / bullets
    const formatted = formatBotMessage(foundMatch);

    botMsgEl.innerHTML = `
      <div class="text-xs text-slate-200 leading-relaxed">${formatted}</div>
      <button class="btn-read-aloud mt-2 flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold" data-speech="${escapeAttr(foundMatch)}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        <span>Listen to Answer</span>
      </button>
    `;

    messagesContainer.appendChild(botMsgEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    soundManager.playSuccess();

    // Attach speak button listener
    const speakBtn = botMsgEl.querySelector('.btn-read-aloud');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        soundManager.playClick();
        speakText(foundMatch.replace(/[*#]/g, ''), 'en-IN');
      });
    }
  }, 750);
}

function formatBotMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n- /g, '<br>• ');
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;');
}
