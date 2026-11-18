/* ==========================================================================
   QuantumLab OS - Audio Synthesis Engine (Web Audio API)
   Synthesizes all UI and quantum feedback sounds with zero external assets.
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.voiceEnabled = true;
    this.ambientEnabled = false;
    this.initialized = false;

    // Ambient lab drone nodes
    this.ambientGain = null;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientFilter = null;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.getSoftestVoice();
        };
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopSpeech();
      this.stopAmbient();
    } else if (this.ambientEnabled) {
      this.startAmbient();
    }
    return this.muted;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled) {
      this.stopSpeech();
    }
    return this.voiceEnabled;
  }

  toggleAmbient() {
    this.ambientEnabled = !this.ambientEnabled;
    if (this.ambientEnabled && !this.muted) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    return this.ambientEnabled;
  }

  // ==========================================================================
  // AMBIENT CLEANROOM QUANTUM OPTICS DRONE
  // A subtle, low-frequency atmospheric hum (55Hz / 110Hz) for immersion
  // ==========================================================================
  startAmbient() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx || this.ambientGain) return;

    try {
      const t = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, t);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.025, t + 1.5); // Very gentle background volume

      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(140, t);

      // Low fundamental cleanroom hum (55 Hz - A1)
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(55, t);

      // Cryostat secondary overtone (110 Hz - A2)
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(110.5, t); // Slight detune for gentle acoustic beating

      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start(t);
      this.ambientOsc2.start(t);
    } catch (e) {
      console.warn("Could not start ambient drone", e);
    }
  }

  stopAmbient() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const t = this.ctx.currentTime;
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      setTimeout(() => {
        if (this.ambientOsc1) { try { this.ambientOsc1.stop(); this.ambientOsc1.disconnect(); } catch (e) {} }
        if (this.ambientOsc2) { try { this.ambientOsc2.stop(); this.ambientOsc2.disconnect(); } catch (e) {} }
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.ambientGain = null;
        this.ambientFilter = null;
      }, 550);
    } catch (e) {
      this.ambientGain = null;
    }
  }

  // ==========================================================================
  // REAL-TIME SPOKEN VOICE DESCRIPTIONS (Web Speech API)
  // ==========================================================================
  cleanForSpeech(text) {
    if (!text) return '';
    return text
      .replace(/\|0⟩/g, 'State Zero')
      .replace(/\|1⟩/g, 'State One')
      .replace(/\|00⟩/g, 'State Zero Zero')
      .replace(/\|01⟩/g, 'State Zero One')
      .replace(/\|10⟩/g, 'State One Zero')
      .replace(/\|11⟩/g, 'State One One')
      .replace(/\|\+⟩/g, 'Plus State')
      .replace(/\|\-⟩/g, 'Minus State')
      .replace(/\|\+i⟩/g, 'Plus I State')
      .replace(/\|\-i⟩/g, 'Minus I State')
      .replace(/\|ψ⟩/g, 'Psi')
      .replace(/\|\Phi\+⟩/g, 'Bell State Phi Plus')
      .replace(/\|\Psi\+⟩/g, 'Bell State Psi Plus')
      .replace(/θ/g, 'theta')
      .replace(/φ/g, 'phi')
      .replace(/μeV/g, 'micro electron volts')
      .replace(/μs/g, 'microseconds')
      .replace(/μ/g, 'mean')
      .replace(/nm/g, 'nanometers')
      .replace(/mK/g, 'millikelvin')
      .replace(/α/g, 'alpha')
      .replace(/β/g, 'beta')
      .replace(/γ[₁₂₃₄1234]/g, 'Majorana Mode')
      .replace(/H⊗4/g, 'Hadamard 4')
      .replace(/1\/√2/g, 'one over square root of two')
      .replace(/1\/16/g, 'one sixteenth')
      .replace(/CNOT/g, 'C-NOT')
      .replace(/MZMs/g, 'Majorana Zero Modes')
      .replace(/MZM/g, 'Majorana Zero Mode')
      .replace(/InAs/g, 'Indium Arsenide')
      .replace(/Pb/g, 'Lead')
      .replace(/Al/g, 'Aluminum')
      .replace(/[\*\_\[\]\{\}\#\>\~]/g, '')
      .replace(/[\n\r]+/g, ' ')
      .trim();
  }

  // Gentle soft cue before speech starts (warm pleasant ascending harmonic chime)
  playVoiceStartCue() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Soft warm fifth interval (D5 -> A5)
      osc1.frequency.setValueAtTime(587.33, t);
      osc2.frequency.setValueAtTime(880.00, t + 0.03);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.035, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc1.stop(t + 0.12);
      osc2.start(t + 0.03);
      osc2.stop(t + 0.16);
    } catch (e) {}
  }

  // Gentle soft cue after speech finishes (resolving warm chime)
  playVoiceEndCue() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, t); // E5
      osc.frequency.exponentialRampToValueAtTime(523.25, t + 0.12); // Resolves down to C5

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.025, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.22);
    } catch (e) {}
  }

  // Helper to pick the softest, most natural AI voice available
  getSoftestVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prioritize warm, soft, natural voices
    const softPreferences = [
      'jenny', 'aria', 'ava', 'sonia', 'natural', 'google us english', 'zira', 'samantha', 'victoria', 'karen', 'guy'
    ];

    for (const name of softPreferences) {
      const found = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes(name));
      if (found) return found;
    }

    // Otherwise any English voice that is NOT David (David is harsh/gritty)
    const nonDavid = voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('david'));
    if (nonDavid) return nonDavid;

    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  speak(text, onEndCallback = null) {
    if (this.muted || !this.voiceEnabled) {
      if (typeof onEndCallback === 'function') setTimeout(onEndCallback, 3000);
      return;
    }

    if (!('speechSynthesis' in window)) {
      if (typeof onEndCallback === 'function') setTimeout(onEndCallback, 3000);
      return;
    }

    const clean = this.cleanForSpeech(text);
    if (!clean) {
      if (typeof onEndCallback === 'function') onEndCallback();
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    // Play subtle soft start cue
    this.playVoiceStartCue();

    // Slight delay so the gentle start chime sounds before speech begins
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.90;   // Soft, relaxed, documentary pacing (not rushed)
      utterance.pitch = 0.98;  // Warm, rounded, gentle tone
      utterance.volume = 0.85; // Pleasant, gentle level

      const softVoice = this.getSoftestVoice();
      if (softVoice) {
        utterance.voice = softVoice;
      }

      utterance.onend = () => {
        // Play soft resolving end chime
        this.playVoiceEndCue();
        if (typeof onEndCallback === 'function') {
          setTimeout(onEndCallback, 250);
        }
      };

      utterance.onerror = () => {
        if (typeof onEndCallback === 'function') {
          onEndCallback();
        }
      };

      window.speechSynthesis.speak(utterance);
    }, 70);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Soft tactile UI click
  playClick() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  // Quantum gate actuation blip
  playGateFlip() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Quantum wave collapse measurement burst
  playCollapse(isZero = true) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Low rumble / white noise burst + tonal snap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const targetFreq = isZero ? 523.25 : 329.63; // C5 (|0>) or E4 (|1>)
    osc.frequency.setValueAtTime(isZero ? 1200 : 800, t);
    osc.frequency.exponentialRampToValueAtTime(targetFreq, t + 0.18);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Monte carlo rapid shot tick
  playShotTick() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, t);

    gain.gain.setValueAtTime(0.02, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.015);
  }

  // Laser lock puzzle success chime
  playLaserLockSuccess() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // Quantum tunneling barrier ghost sound
  playTunnel() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.linearRampToValueAtTime(480, t + 0.1);
    osc.frequency.linearRampToValueAtTime(360, t + 0.2);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Entangled tether burst
  playTetherPulse() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.15);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Hacker alert siren tone
  playHackerAlert() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(900, t + 0.1);
    osc.frequency.linearRampToValueAtTime(600, t + 0.2);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Grover wave equalizer reflection tone
  playGroverStep(stepNum) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    const baseFreq = 440 * Math.pow(1.25, stepNum);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.2);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Topological shield bounce ping (Majorana 2)
  playShieldDeflect() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(1900, t + 0.05);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Shield breach / quasiparticle poisoning
  playPoisoningBreach() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.2);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Atomic upgrade transformation chime (Majorana 2 switch)
  playUpgradeChime() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const freqs = [330, 440, 554, 659, 880];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  }
}

window.soundEngine = new SoundEngine();
