/* ==========================================================================
   QuantumLab OS - Interactive Guided Story Narrator
   Step-by-step interactive walkthrough for all 4 modules.
   Auto-animates controls, highlights components, and explains the physics.
   ========================================================================== */

const NarratorStory = {
  currentModule: 1,
  currentBeat: 0,
  isPlaying: false,
  timerId: null,

  stories: {
    1: {
      title: "The Superposition Riddle & The 3D Bloch Sphere",
      beats: [
        {
          speaker: "Interactive Guide",
          caption: "Welcome to QuantumLab. Unlike a classical bit locked strictly at 0 or 1, a single qubit lives on the continuous surface of a 3D sphere—the Bloch Sphere.",
          action: () => {
            if (window.module1) {
              window.module1.setAngles(0, 0);
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Watch what happens when we apply a Hadamard gate. The vector rotates down to the equator (θ = 90°). Now the qubit is in a 50/50 superposition—both |0⟩ and |1⟩ at the same time!",
          action: () => {
            if (window.module1) {
              window.module1.animateToAngles(90, 0, 1000);
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Now observe the Azimuthal Phase (φ). Rotating around the equator changes the quantum phase angle without altering the 50/50 measurement odds. Look at the dual wave interference strip below!",
          action: () => {
            if (window.module1) {
              window.module1.animateToAngles(90, 180, 1500);
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "When we measure the qubit, nature collapses the wave! The vector snaps to either the North Pole (|0⟩) or South Pole (|1⟩). Notice how running 1,000 shots reveals the exact Born Rule probability.",
          action: () => {
            if (window.module1) {
              window.module1.measureSingle();
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Mission Time! Align your vector with the Quantum Laser Lock challenge below (75% |0⟩ and 25% |1⟩ with 90° phase shift: θ=60°, φ=90°) to crack the vault!",
          action: () => {
            if (window.module1) {
              window.module1.animateToAngles(60, 90, 1200);
            }
          }
        }
      ]
    },

    2: {
      title: "Tunneling Limits & The Spooky Entanglement Tether",
      beats: [
        {
          speaker: "Interactive Guide",
          caption: "Why are classical chips doomed? Look at Sub-Tab A. Modern transistors have shrunk to 3 nanometers. When barriers are that thin, electrons stop bouncing—they ghost through via Quantum Tunneling!",
          action: () => {
            if (window.module2) {
              window.module2.switchSubTab('tunneling');
              window.module2.setGateWidth(5);
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Watch this: drag the gate width below 2 nm. Red alert! Tunneling leakage shoots up exponentially. Moore's Law hits a quantum brick wall. To progress, we must harness quantum mechanics directly.",
          action: () => {
            if (window.module2) {
              window.module2.animateGateWidth(1.2, 1500);
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Switching to Sub-Tab B: Entanglement! We pass Qubit A through a Hadamard gate (superposition), then a CNOT gate linking it to Qubit B. Look at the glowing plasma tether linking the two orbs!",
          action: () => {
            if (window.module2) {
              window.module2.switchSubTab('circuit');
              window.module2.setCircuitGates(true, true);
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "This is the Bell State |Φ⁺⟩. Even if Qubit B is light-years away, measuring Qubit A instantly forces Qubit B to collapse into the exact identical state: both Cyan (|00⟩) or both Purple (|11⟩)!",
          action: () => {
            if (window.module2) {
              window.module2.measureQubitA();
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Now click 'Simulate Hacker Interception'. The Quantum No-Cloning Theorem dictates that intercepting the flying qubit destroys the delicate Bell entanglement, alerting Alice and Bob immediately!",
          action: () => {
            if (window.module2) {
              window.module2.simulateHacker();
            }
          }
        }
      ]
    },

    3: {
      title: "Wave Equalizer: Grover's Quadratic Speedup",
      beats: [
        {
          speaker: "Interactive Guide",
          caption: "Searching an unsorted database of 16 secret items classically takes up to 16 attempts. But quantum computing uses wave interference to pinpoint the secret in just 3 steps!",
          action: () => {
            if (window.module3) {
              window.module3.resetGrover();
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Step 1: Apply Hadamard gates (H⊗4). Every single one of the 16 states now shares an equal +0.25 positive wave amplitude (6.25% probability).",
          action: () => {
            if (window.module3) {
              window.module3.step1_Superposition();
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Step 2: The Quantum Oracle phase-tags our secret gold target. It flips the target bar upside down to -0.25! Note: its probability is still 6.25%, but its wave phase is now inverted.",
          action: () => {
            if (window.module3) {
              window.module3.step2_Oracle();
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Step 3: Grover Diffusion (Inversion About the Mean). We calculate the average amplitude μ (dashed line) and reflect all bars across it. The inverted target rebounds skyward, while wrong answers shrink!",
          action: () => {
            if (window.module3) {
              window.module3.step3_Diffusion();
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "After just 3 iterations (floor(π/4 * √16) = 3), the target probability surges to 96.1%! Classical search took 16 steps; quantum interference found it in 3.",
          action: () => {
            if (window.module3) {
              window.module3.runToCompletion();
            }
          }
        }
      ]
    },

    4: {
      title: "Microsoft Majorana 1 vs 2: The Topological Shield",
      beats: [
        {
          speaker: "Interactive Guide",
          caption: "Fragility is the Achilles' heel of quantum computers. Standard Transmon qubits decohere in microseconds when stray thermal photons hit them. Microsoft tackled this with Topological Hardware.",
          action: () => {
            if (window.module4) {
              window.module4.setArchitecture('transmon');
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Look at the H-shaped Tetron nanowire. In Majorana 1 (Feb 2025), an InAs core is clad in Aluminum. 4 Majorana Zero Modes live at the ends, protected by a 300 μeV topological energy gap.",
          action: () => {
            if (window.module4) {
              window.module4.setArchitecture('majorana1');
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Majorana 1 survived for 1 to 12 milliseconds before stray photons pierced the thin shield (quasiparticle poisoning). But in June 2026 came the Majorana 2 breakthrough: switching to Heavy Lead (Pb)!",
          action: () => {
            if (window.module4) {
              window.module4.setArchitecture('majorana2');
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "Watch the shield expand 4x thicker! The Lead bulk gap is 1,300 μeV. Incoming thermal noise bounces harmlessly away. Parity lifetime explodes by 1,000x—reaching ~20 Seconds!",
          action: () => {
            if (window.module4) {
              window.soundEngine.playShieldDeflect();
            }
          }
        },
        {
          speaker: "Interactive Guide",
          caption: "This 1,000x leap pulled Microsoft's roadmap for a commercial quantum computer forward from 2033 to 2029. Toggle 'Reality Check' to see the breakthrough data and the scientific tests ahead!",
          action: () => {
            // Keep on Majorana 2
          }
        }
      ]
    }
  },

  init() {
    this.updateUI();
  },

  setModule(moduleId) {
    this.stop();
    this.currentModule = moduleId;
    this.currentBeat = 0;
    this.updateUI();
  },

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    window.soundEngine.playClick();
    const topBtn = document.getElementById('btn-toggle-veritasium');
    if (topBtn) topBtn.classList.add('active');
    this.runBeat();
  },

  pause() {
    this.isPlaying = false;
    if (this.timerId) clearTimeout(this.timerId);
    if (window.soundEngine) window.soundEngine.stopSpeech();
    const topBtn = document.getElementById('btn-toggle-veritasium');
    if (topBtn) topBtn.classList.remove('active');
    this.updateUI();
  },

  stop() {
    this.isPlaying = false;
    if (this.timerId) clearTimeout(this.timerId);
    if (window.soundEngine) window.soundEngine.stopSpeech();
    this.currentBeat = 0;
    const topBtn = document.getElementById('btn-toggle-veritasium');
    if (topBtn) topBtn.classList.remove('active');
    this.updateUI();
  },

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },

  next() {
    const story = this.stories[this.currentModule];
    if (!story) return;
    if (this.timerId) clearTimeout(this.timerId);
    if (window.soundEngine) window.soundEngine.stopSpeech();
    if (this.currentBeat < story.beats.length - 1) {
      this.currentBeat++;
      this.runCurrentBeatAction();
      this.updateUI();
      if (this.isPlaying) this.runBeat();
    } else {
      this.stop();
    }
  },

  prev() {
    if (this.currentBeat > 0) {
      if (this.timerId) clearTimeout(this.timerId);
      if (window.soundEngine) window.soundEngine.stopSpeech();
      this.currentBeat--;
      this.runCurrentBeatAction();
      this.updateUI();
      if (this.isPlaying) this.runBeat();
    }
  },

  runBeat() {
    const story = this.stories[this.currentModule];
    if (!story || !this.isPlaying) return;

    if (this.timerId) clearTimeout(this.timerId);
    this.runCurrentBeatAction();
    this.updateUI();

    const beat = story.beats[this.currentBeat];

    // Background Audio Voice Description
    if (beat && window.soundEngine && window.soundEngine.voiceEnabled && !window.soundEngine.muted) {
      window.soundEngine.speak(beat.caption, () => {
        // When voice finishes reading, pause 1.2s then advance to next step
        if (this.isPlaying) {
          this.timerId = setTimeout(() => {
            if (this.currentBeat < story.beats.length - 1) {
              this.currentBeat++;
              this.runBeat();
            } else {
              this.stop();
            }
          }, 1200);
        }
      });
    } else {
      // Fallback timer if voice is muted or off
      this.timerId = setTimeout(() => {
        if (this.currentBeat < story.beats.length - 1) {
          this.currentBeat++;
          this.runBeat();
        } else {
          this.stop();
        }
      }, 5500);
    }
  },

  runCurrentBeatAction() {
    const story = this.stories[this.currentModule];
    if (!story) return;
    const beat = story.beats[this.currentBeat];
    if (beat && typeof beat.action === 'function') {
      beat.action();
    }
  },

  updateUI() {
    const story = this.stories[this.currentModule];
    if (!story) return;

    const beat = story.beats[this.currentBeat];
    const captionEl = document.getElementById('narrator-subtitles');
    const speakerEl = document.getElementById('narrator-speaker');
    const playBtn = document.getElementById('btn-narrator-play');
    const progressBar = document.getElementById('narrator-progress');
    const stepNumEl = document.getElementById('narrator-step-num');
    const stepTotalEl = document.getElementById('narrator-step-total');
    const storyTitleEl = document.getElementById('narrator-story-title');

    if (speakerEl) speakerEl.textContent = beat ? beat.speaker : "Interactive Guide";
    if (captionEl) captionEl.textContent = beat ? `"${beat.caption}"` : "...";
    if (storyTitleEl) storyTitleEl.textContent = `Module 0${this.currentModule}`;
    if (stepNumEl) stepNumEl.textContent = `${this.currentBeat + 1}`;
    if (stepTotalEl) stepTotalEl.textContent = `${story.beats.length}`;

    if (playBtn) {
      if (this.isPlaying) {
        playBtn.classList.add('playing');
        playBtn.innerHTML = `<span>⏸ Pause Guided Explainer</span>`;
      } else {
        playBtn.classList.remove('playing');
        playBtn.innerHTML = `<span>▶ Play Guided Explainer</span>`;
      }
    }

    const bannerBtns = document.querySelectorAll('.btn-banner-tour');
    bannerBtns.forEach(btn => {
      btn.innerHTML = this.isPlaying
        ? '<span>⏸</span> Pause Tour'
        : '<span>▶</span> Play Interactive Tour';
    });
    if (progressBar) {
      const pct = ((this.currentBeat + 1) / story.beats.length) * 100;
      progressBar.style.width = `${pct}%`;
    }
  }
};

window.NarratorStory = NarratorStory;
