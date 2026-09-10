// AI Voice Bot (Narration in Local Languages via Web Speech API)

import { soundManager } from '../utils/audioEffects.js';

export const folkloreStories = [
  {
    id: "konark-dharmapada",
    title: "The Sacrifice of Child Architect Dharmapada",
    region: "Odisha (Konark)",
    languageCode: "en-IN",
    content: "Over seven centuries ago, King Narasimhadeva ordered twelve hundred sculptors to construct the celestial sun chariot of Konark within twelve years, or face royal punishment. As the deadline loomed, the master sculptors could not align the crowning magnetic kalasha atop the two-hundred-foot shikhara. Twelve-year-old Dharmapada, the chief architect's son, arrived at the site. Having studied the ancient architectural shilpa shastras, the young boy scaled the soaring scaffolding and set the final crowning stone in place. Yet, knowing the king might execute the twelve hundred sculptors if he discovered a child accomplished what they could not, brave Dharmapada leapt into the turbulent sea, sacrificing his life to save his father and the entire guild of artisans.",
    contentHi: "सात सौ वर्ष पूर्व, राजा नरसिंहदेव ने बारह सौ शिल्पकारों को बारह वर्षों में कोणार्क का भव्य सूर्य रथ मंदिर बनाने का आदेश दिया था। पर अंतिम दिन तक कोई भी शिल्पी दो सौ फीट ऊंचे शिखर पर मुख्य कलश स्थापित नहीं कर पा रहा था। तभी मुख्य वास्तुकार बिशु महाराणा का बारह वर्षीय पुत्र धर्मपद पहुंचा। उसने प्राचीन शिल्प शास्त्रों के ज्ञान से शिखर पर कलश को पूर्ण संतुलित कर दिया। परंतु यह जानकर कि एक बालक के कारण सभी शिल्पकारों का जीवन संकट में पड़ सकता है, उस वीर बालक ने समुद्र में कूदकर अपने पिता और बारह सौ शिल्पकारों के प्राणों की रक्षा की।",
    contentTa: "ஏழு நூற்றாண்டுகளுக்கு முன்பு, கொனார்க்கின் பிரம்மாண்டமான சூரிய ரதக் கோயிலை பன்னிரண்டு ஆண்டுகளில் முடிக்க பன்னிரண்டு நூறு சிற்பிகளுக்கு அரசர் உத்தரவிட்டார். ஆனால் உச்சிக் கலசத்தை யாராலும் பொருத்த முடியவில்லை. அப்போது தலைமை சிற்பியின் பன்னிரண்டு வயது மகன் தர்மபதா வந்து, தனது அபார அறிவால் கலசத்தை சரியாகப் பொருத்தினார். தன் சாதனையால் பிற சிற்பிகளின் உயிருக்கு ஆபத்து வரக்கூடாது என்பதற்காக, கடலில் குதித்து தன் இன்னுயிரை தியாகம் செய்தார்.",
    contentTe: "ఏడు శతాబ్దాల క్రితం, ఒడిశాలోని కోణార్క్ సూర్య దేవాలయాన్ని నిర్మించడానికి 1200 మంది శిల్పులు 12 ఏళ్ళు శ్రమించారు. అయితే ఆలయ శిఖరంపై భారీ కలశాన్ని సరిగ్గా అమర్చడం ఎవరికీ సాధ్యపడలేదు. అప్పుడు ప్రధాన శిల్పి యొక్క 12 ఏళ్ల కుమారుడు ధర్మపద వచ్చి శిఖర కలశాన్ని అద్భుతంగా నిలిపాడు. కానీ తన విజయం ఇతర శిల్పుల ప్రాణాలకు ముప్పు తెస్తుందని గ్రహించి, సాగరంలోకి దూకి తన తండ్రిని, శిల్పులందరినీ కాపాడాడు."
  },
  {
    id: "hampi-musical-pillars",
    title: "The Resonant Mystery of Hampi's Sa-Re-Ga-Ma Pillars",
    region: "Karnataka (Hampi)",
    languageCode: "en-IN",
    content: "Deep within the ruins of the Vijayanagara Empire at Hampi stands the Vittala Temple's Maha Mandapa, an acoustic triumph sculpted from solid granite. Here, fifty-six monolithic pillars emit musical notes of flutes, bells, and drums when tapped lightly with the fingertips. The sculptors achieved this by varying the proportions of silica and metallic oxides within the native porphyritic granite. During the reign of Emperor Krishnadevaraya, court dancers performed classical Bharatanatyam to the pure melodic resonance of these stone pillars, creating music directly from the rock without any human musical instruments.",
    contentHi: "हम्पी के विट्ठल मंदिर का महामंडप भारतीय ध्वनिकी और मूर्तिकला का अद्भुत चमत्कार है। यहां छप्पन अखंड ग्रेनाइट खंभे हैं, जिन्हें उंगलियों से धीरे से थपथपाने पर बांसुरी, घंटी और मृदंग के सप्त सुर (सा-रे-गा-मा) गूंजते हैं। विजयनगर के सम्राट कृष्णदेवराय के काल में, राज नर्तकियां इन संगीतमय स्तंभों से निकलने वाली पावन धुनों पर नृत्य करती थीं। यह आज भी विश्व के भौतिक वैज्ञानिकों के लिए एक अनसुलझा रहस्य है।",
    contentTa: "ஹம்பியின் விட்டலா கோயிலில் உள்ள ஐம்பத்தாறு ஒற்றைக் கல் தூண்கள், கைகளால் தட்டும்போது சப்த ஸ்வரங்களை இசைக்கின்றன. விஜயநகர சாம்ராஜ்யத்தின் சிற்பிகள் பாறைகளின் அடர்த்தியைக் கணக்கிட்டு இந்த இசைக் கல் தூண்களை உருவாக்கினர்.",
    contentTe: "హంపిలోని విజయ విఠల దేవాలయంలోని 56 గ్రానైట్ స్తంభాలు కేవలం చేతివేళ్లతో తట్టినప్పుడు వీణ, మృదంగం వంటి సప్త స్వరాలను (స-రి-గ-మ) ప్రతిధ్వనిస్తాయి. శ్రీకృష్ణదేవరాయల కాలంలో వీటి నాదస్వరాల నడుమ నాట్య ప్రదర్శనలు జరిగేవి."
  },
  {
    id: "thanjavur-shadow-mystery",
    title: "The Shadowless Vimana of the Great Chola Temple",
    region: "Tamil Nadu (Thanjavur)",
    languageCode: "en-IN",
    content: "Completed in 1010 CE by Emperor Rajaraja Chola I, the Brihadisvara Temple rises 216 feet into the sky of Thanjavur. Crowned by a single eighty-ton granite dome, the entire monument was constructed without any binding mortar. Ancient Tamil tradition marvels at the geometry of the Vimana, whose shadow is engineered so that at solar noon, the shadow of the central peak never falls outside the plinth, disappearing into itself. Built with interlocking stone mortise joints, it stands unconquered by six major earthquakes across a thousand unbroken years.",
    contentHi: "तंजावुर का बृहदीश्वर मंदिर चोल साम्राज्य की वास्तुकला का अनुपम गौरव है। वर्ष 1010 ईस्वी में राजा राज चोल द्वारा निर्मित, इसका 216 फीट ऊंचा विमान अस्सी टन के एक ही अखंड ग्रेनाइट पत्थर से सुशोभित है। यह मंदिर बिना किसी गारे या सीमेंट के, केवल इंटरलॉकिंग पत्थरों से बना है। दोपहर के समय इसके मुख्य गुंबद की परछाई जमीन पर नहीं गिरती, जो प्राचीन भारतीय गणित और खगोलशास्त्र का प्रमाण है।",
    contentTa: "தஞ்சாவூர் பெரிய கோயில் ராஜராஜ சோழனால் கட்டப்பட்டது. எண்பது டன் எடையுள்ள ஒரே கல்லை உச்சிக்குக் கொண்டு சென்று கலசம் அமைத்தனர். இதன் நிழல் நண்பகலில் தரையில் விழாத வகையில் மிகத் துல்லியமான வடிவியல் அறிவோடு கட்டப்பட்டுள்ளது.",
    contentTe: "తంజావూరులోని బృహదీశ్వరాలయం చోళుల శిల్పకళా వైభవానికి నిదర్శనం. 80 టన్నుల ఏకశిలా గ్రానైట్ గుమ్మటాన్ని 6 కిలోమీటర్ల వాలుతో ఏనుగుల సహాయంతో శిఖరంపైకి చేర్చారు. ఎలాంటి సిమెంట్ వాడకుండా ఇంటర్‌లాకింగ్ విధానంలో నిర్మించిన ఈ ఆలయం వేయి సంవత్సరాల నుండి అచలంగా నిలిచింది."
  },
  {
    id: "varanasi-eternal-kashi",
    title: "The City of Light: Shiva's Trishul at Kashi",
    region: "Uttar Pradesh (Varanasi)",
    languageCode: "en-IN",
    content: "Varanasi, or Kashi, is known as the City of Light, resting on the tip of Lord Shiva's celestial trident above the earth. For more than three thousand years, the eighty-four stone ghats along the crescent curve of the sacred Ganges have welcomed seekers of truth and liberation. At Manikarnika, the sacred pyre has burned continuously for millenniums without ever extinguishing, reminding humanity of the transient illusion of the physical world and the eternal journey of the soul towards divine consciousness.",
    contentHi: "काशी, भगवान शिव के त्रिशूल पर बसी शाश्वत ज्योतिर्मय नगरी है। तीन हजार वर्षों से मां गंगा के 84 घाटों पर जीवन और मोक्ष की धारा अविरल बह रही है। मणिकर्णिका घाट पर हजारों वर्षों से पावन अग्नि कभी शांत नहीं हुई, जो मनुष्य को जीवन की नश्वरता और आत्मा की अमरता का स्मरण कराती है। शाम को दशाश्वमेध घाट पर होने वाली गंगा महाआरती ब्रह्मांडीय ऊर्जा का साक्षात्कार कराती है।",
    contentTa: "வாரணாசி அல்லது காசி, உலகின் மிகத் தொன்மையான வாழும் ஆன்மீக நகரம். கங்கை நதிக்கரையில் அமைந்துள்ள 84 படித்துறைகளும் ஆன்ம முக்தி அளிக்கும் தலங்களாக விளங்குகின்றன.",
    contentTe: "కాశీ నగరం పరమశివుని త్రిశూలంపై నిలిచిన దివ్య క్షేత్రంగా భావిస్తారు. మూడు వేల సంవత్సరాలుగా గంగా తీరంలోని 84 ఘాట్‌లు ఆధ్యాత్మిక జ్యోతితో ప్రకాశిస్తున్నాయి."
  }
];

let currentUtterance = null;
let isSpeaking = false;
let animVisualizerId = null;

export function initVoiceBot() {
  const playBtn = document.getElementById('btn-voice-play');
  const pauseBtn = document.getElementById('btn-voice-pause');
  const stopBtn = document.getElementById('btn-voice-stop');
  const storySelect = document.getElementById('voice-story-select');
  const langSelect = document.getElementById('voice-lang-select');

  if (!playBtn || !storySelect) return;

  storySelect.innerHTML = folkloreStories.map(s => `
    <option value="${s.id}">${s.title} (${s.region})</option>
  `).join('');

  updateStoryDisplay(storySelect.value);

  storySelect.addEventListener('change', () => {
    soundManager.playClick();
    stopNarration();
    updateStoryDisplay(storySelect.value);
  });

  if (langSelect) {
    langSelect.addEventListener('change', () => {
      soundManager.playClick();
      stopNarration();
      updateStoryDisplay(storySelect.value);
    });
  }

  playBtn.addEventListener('click', () => {
    soundManager.playClick();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      isSpeaking = true;
      startVisualizer();
      return;
    }
    startNarration();
  });

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      soundManager.playClick();
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        isSpeaking = false;
        stopVisualizer();
      }
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      soundManager.playClick();
      stopNarration();
    });
  }

  if ('speechSynthesis' in window) {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }

  initVisualizerCanvas();
}

function updateStoryDisplay(storyId) {
  const story = folkloreStories.find(s => s.id === storyId);
  const textEl = document.getElementById('voice-story-text');
  const langSelect = document.getElementById('voice-lang-select');
  if (!story || !textEl) return;

  const currentLang = langSelect ? langSelect.value : 'en';

  let textToDisplay = story.content;
  if (currentLang === 'hi' && story.contentHi) textToDisplay = story.contentHi;
  else if (currentLang === 'ta' && story.contentTa) textToDisplay = story.contentTa;
  else if (currentLang === 'te' && story.contentTe) textToDisplay = story.contentTe;

  textEl.textContent = textToDisplay;
}

export function speakText(text, lang = 'en-IN') {
  if (!('speechSynthesis' in window)) {
    alert("Speech Synthesis is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const rateSlider = document.getElementById('voice-rate-slider');
  const rate = rateSlider ? parseFloat(rateSlider.value) : 1.0;

  utterance.rate = rate;
  utterance.pitch = 1.0;
  utterance.lang = lang;

  const executeSpeech = () => {
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.substring(0, 2).toLowerCase();

    const matchedVoice = voices.find(v => v.lang === lang || v.lang.toLowerCase().replace('_', '-') === lang.toLowerCase().replace('_', '-')) ||
      voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    executeSpeech();
  } else {
    window.speechSynthesis.onvoiceschanged = executeSpeech;
    setTimeout(executeSpeech, 200);
  }

  utterance.onstart = () => {
    isSpeaking = true;
    startVisualizer();
    updatePlayButtonState(true);
  };

  utterance.onend = () => {
    isSpeaking = false;
    stopVisualizer();
    updatePlayButtonState(false);
  };

  utterance.onerror = (e) => {
    console.error("Speech synthesis error:", e);
    isSpeaking = false;
    stopVisualizer();
    updatePlayButtonState(false);
  };
}

function startNarration() {
  const storySelect = document.getElementById('voice-story-select');
  const langSelect = document.getElementById('voice-lang-select');
  if (!storySelect) return;

  const story = folkloreStories.find(s => s.id === storySelect.value);
  if (!story) return;

  const lang = langSelect ? langSelect.value : 'en';
  let speechText = story.content;
  let voiceLang = 'en-IN';

  if (lang === 'hi') {
    speechText = story.contentHi || story.content;
    voiceLang = 'hi-IN';
  } else if (lang === 'ta') {
    speechText = story.contentTa || story.content;
    voiceLang = 'ta-IN';
  } else if (lang === 'te') {
    speechText = story.contentTe || story.content;
    voiceLang = 'te-IN';
  } else if (lang === 'bn') {
    voiceLang = 'bn-IN';
  } else if (lang === 'mr') {
    voiceLang = 'mr-IN';
  } else if (lang === 'gu') {
    voiceLang = 'gu-IN';
  }

  speakText(speechText, voiceLang);
}

export function stopNarration() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  stopVisualizer();
  updatePlayButtonState(false);
}

function updatePlayButtonState(playing) {
  const playBtn = document.getElementById('btn-voice-play');
  if (!playBtn) return;
  if (playing) {
    playBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      <span>Speaking...</span>
    `;
    playBtn.classList.add('btn-speaking');
  } else {
    playBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      <span>Narrate Story</span>
    `;
    playBtn.classList.remove('btn-speaking');
  }
}

let visualizerCanvas, visualizerCtx;
function initVisualizerCanvas() {
  visualizerCanvas = document.getElementById('voice-visualizer-canvas');
  if (!visualizerCanvas) return;
  visualizerCtx = visualizerCanvas.getContext('2d');
  visualizerCanvas.width = visualizerCanvas.parentElement.clientWidth || 320;
  visualizerCanvas.height = 48;
  drawIdleWaves();
}

function drawIdleWaves() {
  if (!visualizerCtx || !visualizerCanvas) return;
  const ctx = visualizerCtx;
  const w = visualizerCanvas.width;
  const h = visualizerCanvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
  ctx.lineWidth = 2;
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();
}

function startVisualizer() {
  if (animVisualizerId) cancelAnimationFrame(animVisualizerId);

  let step = 0;
  function renderWave() {
    if (!visualizerCtx || !visualizerCanvas) return;
    const ctx = visualizerCtx;
    const w = visualizerCanvas.width;
    const h = visualizerCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const bars = 28;
    const barWidth = w / bars;

    for (let i = 0; i < bars; i++) {
      const height = isSpeaking
        ? (Math.sin(step * 0.15 + i * 0.4) * 0.5 + 0.5) * (h * 0.75) + 4
        : 3;

      const grad = ctx.createLinearGradient(0, (h - height) / 2, 0, (h + height) / 2);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(1, '#ea580c');

      ctx.fillStyle = grad;
      ctx.fillRect(i * barWidth + 2, (h - height) / 2, barWidth - 4, height);
    }

    step++;
    if (isSpeaking) {
      animVisualizerId = requestAnimationFrame(renderWave);
    } else {
      drawIdleWaves();
    }
  }

  animVisualizerId = requestAnimationFrame(renderWave);
}

function stopVisualizer() {
  if (animVisualizerId) {
    cancelAnimationFrame(animVisualizerId);
    animVisualizerId = null;
  }
  drawIdleWaves();
}