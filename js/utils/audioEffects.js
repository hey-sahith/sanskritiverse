// Web Audio API Sound Effects Synthesizer for SanskritiVerse
// Provides rich UI feedback with zero external audio file dependencies

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.06);
  }

  playScanBeep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
    osc.frequency.setValueAtTime(1760, this.audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.22);
  }

  playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + index * 0.09);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime + index * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + index * 0.09 + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime + index * 0.09);
      osc.stop(this.audioCtx.currentTime + index * 0.09 + 0.26);
    });
  }

  playWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, this.audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, this.audioCtx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.26);
  }

  playTempleBell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const fundamentals = [440, 880, 1320, 1760]; // Rich bell harmonics
    fundamentals.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (Math.random() * 4 - 2), this.audioCtx.currentTime);

      const decay = 2.0 / (idx + 1);
      gain.gain.setValueAtTime(0.1 / (idx + 1), this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + decay);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + decay + 0.05);
    });
  }
}

export const soundManager = new SoundManager();
