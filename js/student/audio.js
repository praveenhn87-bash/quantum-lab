/**
 * QuantumQuest: 10th-Class Explorer & Game Lab
 * Audio & Voice Synthesizer Engine (Web Audio API + Web Speech API)
 * 100% self-contained, zero external asset dependencies.
 */

class LabAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isSFXEnabled = true;
    this.isVoiceEnabled = true;
    this.isAmbientEnabled = false;
    
    this.ambientNode = null;
    this.synth = window.speechSynthesis || null;
    this.selectedVoice = null;
    
    // Init speech voices
    if (this.synth) {
      this.initVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize warm, friendly, natural voices
    const preferred = [
      'Microsoft Jenny Online (Natural)',
      'Google UK English Female',
      'Google US English',
      'Microsoft Aria Online (Natural)',
      'Microsoft Zira',
      'Samantha'
    ];
    for (const name of preferred) {
      const found = voices.find(v => v.name.includes(name) || v.name === name);
      if (found) {
        this.selectedVoice = found;
        break;
      }
    }
    if (!this.selectedVoice && voices.length > 0) {
      this.selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    }
  }

  // --- Sound Effects ---

  // 1. Spinning Coin Sound (Rising whirling tone)
  playCoinSpin() {
    if (!this.isSFXEnabled) return;
    this.ensureContext();
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  }

  // 2. Hand Slap / Measurement Drop (Crisp thud + metallic ring)
  playSlapDown() {
    if (!this.isSFXEnabled) return;
    this.ensureContext();
    const ctx = this.audioCtx;

    // Transient thud
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(140, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);

    gain1.gain.setValueAtTime(0.4, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.16);

    // Coin ring
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1200, ctx.currentTime);
    gain2.gain.setValueAtTime(0.12, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.41);
  }

  // 3. Ghost Electron Teleport (Ethereal swoosh)
  playGhostSwoosh() {
    if (!this.isSFXEnabled) return;
    this.ensureContext();
    const ctx = this.audioCtx;

    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.35);
    filter.Q.value = 4.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  // 4. Telepathic Dice Link Sync
  playDiceSync() {
    if (!this.isSFXEnabled) return;
    this.ensureContext();
    const ctx = this.audioCtx;

    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = ctx.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0.01, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.32);
    });
  }

  // 5. Hacker Interception Alarm (Sci-Fi Alert)
  playHackerAlarm() {
    if (!this.isSFXEnabled) return;
    this.ensureContext();
    const ctx = this.audioCtx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.45);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.51);
  }

  // 6. Treasure Chest Unlocked Fanfare
  playChestOpen() {
    if (!this.isSFXEnabled) return;
    this.ensureContext();
    const ctx = this.audioCtx;

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const t = ctx.currentTime + idx * 0.08;
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.62);
    });
  }

  // 7. Topological Shield Hum
  playShieldOn() {
    if (!this.isSFXEnabled) return;
    this.ensureContext();
    const ctx = this.audioCtx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.52);
  }

  // Voice start/stop chime cue
  playVoiceCue(start = true) {
    if (!this.isSFXEnabled) return;
    this.ensureContext();
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    if (start) {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12);
    } else {
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440.00, ctx.currentTime + 0.12);
    }

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  // --- Voice Narration Engine ---
  speak(text, onComplete) {
    if (!this.synth || !this.isVoiceEnabled) {
      if (onComplete) onComplete();
      return;
    }

    this.synth.cancel(); // Cancel active speech
    this.playVoiceCue(true);

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = 0.92;   // Gentle, clear pace
    utterance.pitch = 1.02;  // Warm, enthusiastic tone

    utterance.onend = () => {
      this.playVoiceCue(false);
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      if (onComplete) onComplete();
    };

    // Small delay for the start chime
    setTimeout(() => {
      this.synth.speak(utterance);
    }, 120);
  }

  stopVoice() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // --- Ambient Cryogenic Drone ---
  toggleAmbient(enable) {
    this.isAmbientEnabled = (enable !== undefined) ? enable : !this.isAmbientEnabled;
    this.ensureContext();
    const ctx = this.audioCtx;

    if (this.isAmbientEnabled) {
      if (this.ambientNode) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 65; // Deep cryogenic cooling hum
      gain.gain.value = 0.035;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      this.ambientNode = { osc, gain };
    } else {
      if (this.ambientNode) {
        this.ambientNode.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.ambientNode) {
            this.ambientNode.osc.stop();
            this.ambientNode = null;
          }
        }, 550);
      }
    }
  }
}

// Global Audio Instance
window.labAudio = new LabAudioEngine();
