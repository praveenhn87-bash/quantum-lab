/**
 * QuantumQuest: Friendly Science Guide (Narrator)
 * Conversational, encouraging, YouTube-style science teacher.
 */

class StudentNarrator {
  constructor() {
    this.currentLevel = 1;
    this.currentStep = 0;
    this.isPlaying = false;

    // Tour scripts for each level
    this.scripts = {
      1: [
        {
          title: "The Spinning Coin Analogy",
          text: "Hey there! Welcome to the lab. Think of a regular computer bit like a light switch—it's either ON or OFF. But in the quantum world, it's like a coin spinning in mid-air!",
          action: () => {
            if (window.level1) {
              window.level1.isSpinning = true;
              window.level1.measurementResult = null;
            }
          }
        },
        {
          title: "Both At Once (Superposition)",
          text: "While the coin is spinning, is it Heads or Tails? It is BOTH at the same time! That is Superposition. You can drag your mouse on the 3D globe to tilt its angle.",
          action: () => {
            if (window.level1) {
              window.level1.theta = Math.PI / 2;
              window.level1.updateTelemetry();
            }
          }
        },
        {
          title: "Slapping Your Hand Down (Measurement)",
          text: "The moment you look or touch, the magic freezes! Go ahead, click the green 'Slap Hand Down' button to force the coin to pick Heads or Tails.",
          action: () => {
            if (window.level1) {
              window.level1.measureCoin();
            }
          }
        }
      ],
      2: [
        {
          title: "The Ghost Electron (Tunneling)",
          text: "In classical physics, if you throw a tennis ball at a brick wall, it bounces back. But electrons are tiny waves! If the wall is wafer-thin, the electron leaks through like a ghost.",
          action: () => {
            const tab = document.getElementById('tab-btn-tunnel');
            if (tab) tab.click();
          }
        },
        {
          title: "Why Laptops Get Hot",
          text: "Inside your smartphone or laptop, transistors are only a few nanometers wide. When electrons ghost-leak through the thin walls, they waste electricity and create heat!",
          action: () => {
            const slider = document.getElementById('barrier-slider');
            if (slider && window.level2) {
              slider.value = 2;
              window.level2.barrierThicknessNm = 2;
              window.level2.updateTunnelTelemetry();
              window.level2.fireElectronPacket();
            }
          }
        },
        {
          title: "Telepathic Magic Dice (Entanglement)",
          text: "Now switch to the Magic Dice tab! When two quantum particles become entangled, they share a single destiny. Roll them, and they always land on the exact same number!",
          action: () => {
            const tab = document.getElementById('tab-btn-dice');
            if (tab) tab.click();
            if (window.level2) window.level2.rollEntangledDice();
          }
        }
      ],
      3: [
        {
          title: "The 16 Locked Chests",
          text: "Imagine you are searching for a hidden golden key inside 16 locked chests. A standard computer has to open them one by one—taking up to 16 tries!",
          action: () => {
            if (window.level3) window.level3.resetQuantumState();
          }
        },
        {
          title: "Grover's Wave Echo",
          text: "A quantum computer blasts a soundwave through all 16 chests at once. The secret chest with the key reflects an inverted echo.",
          action: () => {
            const btn2 = document.getElementById('btn-grover-step2');
            if (btn2) btn2.click();
          }
        },
        {
          title: "Pumping Up The Volume",
          text: "Finally, wave interference cancels out the 15 wrong chests and skyrockets the winning chest's wave to 96%! Click 'Amplify Wave' and open your prize!",
          action: () => {
            const btn3 = document.getElementById('btn-grover-step3');
            if (btn3) btn3.click();
          }
        }
      ],
      4: [
        {
          title: "The Fragile Egg vs The Rope Knot",
          text: "Regular qubits are like balancing an egg on a spoon. The slightest heat or vibration breaks them within microseconds! That's decoherence.",
          action: () => {}
        },
        {
          title: "Majorana's Topological Secret",
          text: "Majorana qubits split the secret in half and store the information as a braided knot at opposite ends of a nanowire. Shaking the wire cannot untie the knot!",
          action: () => {
            const btn = document.getElementById('btn-toggle-shield');
            if (btn && window.level4 && !window.level4.isShieldActive) btn.click();
          }
        },
        {
          title: "The 30-Second Survival Run",
          text: "Click 'Start Survival Run'! Even when stray thermal particles bombard the wire, the Majorana topological knot remains protected!",
          action: () => {
            const runBtn = document.getElementById('btn-start-survival');
            if (runBtn) runBtn.click();
          }
        }
      ]
    };

    this.bindEvents();
  }

  bindEvents() {
    const playBtn = document.getElementById('guide-play-btn');
    const nextBtn = document.getElementById('guide-next-btn');
    const prevBtn = document.getElementById('guide-prev-btn');

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.togglePlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextStep();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.prevStep();
      });
    }
  }

  setLevel(lvl) {
    this.currentLevel = lvl;
    this.currentStep = 0;
    this.isPlaying = false;
    window.labAudio.stopVoice();
    this.renderCurrentStep();
  }

  renderCurrentStep() {
    const list = this.scripts[this.currentLevel] || [];
    const step = list[this.currentStep] || list[0];
    if (!step) return;

    const titleEl = document.getElementById('guide-step-title');
    const textEl = document.getElementById('guide-step-text');
    const playBtn = document.getElementById('guide-play-btn');

    if (titleEl) titleEl.textContent = `Step ${this.currentStep + 1}/${list.length}: ${step.title}`;
    if (textEl) textEl.textContent = step.text;
    if (playBtn) {
      playBtn.innerHTML = this.isPlaying ? '⏸️ Pause Guide' : '▶️ Play Voice';
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.isPlaying = false;
      window.labAudio.stopVoice();
      this.renderCurrentStep();
    } else {
      this.isPlaying = true;
      this.playCurrentStep();
    }
  }

  playCurrentStep() {
    const list = this.scripts[this.currentLevel] || [];
    const step = list[this.currentStep];
    if (!step) {
      this.isPlaying = false;
      this.renderCurrentStep();
      return;
    }

    this.renderCurrentStep();

    // Trigger visual demonstration action
    if (step.action) {
      try { step.action(); } catch (e) { console.warn(e); }
    }

    // Speak text
    window.labAudio.speak(step.text, () => {
      if (this.isPlaying) {
        if (this.currentStep < list.length - 1) {
          setTimeout(() => {
            if (this.isPlaying) {
              this.currentStep++;
              this.playCurrentStep();
            }
          }, 900);
        } else {
          this.isPlaying = false;
          this.renderCurrentStep();
        }
      }
    });
  }

  nextStep() {
    const list = this.scripts[this.currentLevel] || [];
    if (this.currentStep < list.length - 1) {
      this.currentStep++;
      if (this.isPlaying) {
        this.playCurrentStep();
      } else {
        this.renderCurrentStep();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      if (this.isPlaying) {
        this.playCurrentStep();
      } else {
        this.renderCurrentStep();
      }
    }
  }
}

window.StudentNarrator = StudentNarrator;
