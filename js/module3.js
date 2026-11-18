/* ==========================================================================
   QuantumLab OS - Module 3: Quantum Interference & Grover's Algorithm
   "Wave Equalizer" - 16-State Bar Canvas + Oracle Phase Inversion +
   Grover Inversion About the Mean.
   ========================================================================== */

class Module3 {
  constructor() {
    this.nStates = 16;
    this.targetState = 5; // Default secret state: |0101> (State 5)
    this.amplitudes = new Array(16).fill(0);
    this.mean = 0;
    this.currentStep = 0; // 0: uninitialized, 1: Superposition, 2: Oracle, 3: Diffusion, etc.
    this.groverIterations = 0;
    this.maxRecommendedIterations = 3; // floor(pi/4 * sqrt(16)) = 3

    this.canvas = null;
    this.ctx = null;
    this.animProgress = 1.0;
    this.prevAmplitudes = new Array(16).fill(0);
    this.targetAmplitudes = new Array(16).fill(0);
  }

  init() {
    this.canvas = document.getElementById('grover-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.setupCanvasClicks();
    }

    this.bindControls();
    this.step1_Superposition(false);
    this.startLoop();
  }

  setupCanvasClicks() {
    const c = this.canvas;
    if (!c) return;

    c.addEventListener('click', (e) => {
      const rect = c.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const barWidth = rect.width / this.nStates;
      const clickedIdx = Math.floor(clickX / barWidth);

      if (clickedIdx >= 0 && clickedIdx < this.nStates) {
        this.targetState = clickedIdx;
        window.soundEngine.playClick();
        if (window.app) {
          const binStr = clickedIdx.toString(2).padStart(4, '0');
          window.app.showToast(`🎯 Secret Target Set to State |${binStr}⟩ (Dec: ${clickedIdx})`);
        }
        this.resetGrover();
      }
    });
  }

  bindControls() {
    const btnStep1 = document.getElementById('btn-grover-step1');
    const btnStep2 = document.getElementById('btn-grover-step2');
    const btnStep3 = document.getElementById('btn-grover-step3');
    const btnReset = document.getElementById('btn-grover-reset');

    if (btnStep1) {
      btnStep1.addEventListener('click', () => this.step1_Superposition(true));
    }
    if (btnStep2) {
      btnStep2.addEventListener('click', () => this.step2_Oracle(true));
    }
    if (btnStep3) {
      btnStep3.addEventListener('click', () => this.step3_Diffusion(true));
    }
    if (btnReset) {
      btnReset.addEventListener('click', () => this.resetGrover());
    }
  }

  resetGrover() {
    this.currentStep = 0;
    this.groverIterations = 0;
    this.step1_Superposition(false);
    window.soundEngine.playClick();
  }

  // Step 1: Initialize uniform superposition (H^4)
  step1_Superposition(playSound = true) {
    this.savePrevious();
    this.targetAmplitudes = window.MathEngine.initGroverAmplitudes(this.nStates);
    this.mean = 1 / Math.sqrt(this.nStates);
    this.currentStep = 1;
    this.groverIterations = 0;
    this.animProgress = 0;

    if (playSound) {
      window.soundEngine.playGateFlip();
      if (window.soundEngine && !window.NarratorStory.isPlaying) {
        window.soundEngine.speak("Uniform superposition initialized across sixteen states.");
      }
      if (window.app) {
        window.app.showToast("⚡ Step 1: Initialized uniform superposition across all 16 states (α = +0.25 each).");
      }
    }
    this.updateMath();
  }

  // Step 2: Apply Quantum Oracle (phase flip target state)
  step2_Oracle(playSound = true) {
    this.savePrevious();
    this.targetAmplitudes = window.MathEngine.applyGroverOracle(this.amplitudes, this.targetState);
    // Recalculate mean
    const sum = this.targetAmplitudes.reduce((a, b) => a + b, 0);
    this.mean = sum / this.nStates;
    this.currentStep = 2;
    this.animProgress = 0;

    if (playSound) {
      window.soundEngine.playGateFlip();
      if (window.soundEngine && !window.NarratorStory.isPlaying) {
        window.soundEngine.speak("Quantum Oracle applied. Target state phase inverted.");
      }
      const bin = this.targetState.toString(2).padStart(4, '0');
      if (window.app) {
        window.app.showToast(`🎯 Step 2: Oracle flipped phase of target |${bin}⟩ to negative amplitude (-α)!`);
      }
    }
    this.updateMath();
  }

  // Step 3: Grover Diffusion (Invert about mean)
  step3_Diffusion(playSound = true) {
    this.savePrevious();
    const res = window.MathEngine.applyGroverDiffusion(this.amplitudes);
    this.targetAmplitudes = res.newAmplitudes;
    this.mean = res.mean;
    this.groverIterations++;
    this.currentStep = 3;
    this.animProgress = 0;

    if (playSound) {
      window.soundEngine.playGroverStep(this.groverIterations);
      const targetProb = Math.pow(this.targetAmplitudes[this.targetState], 2) * 100;
      if (window.soundEngine && !window.NarratorStory.isPlaying) {
        window.soundEngine.speak(`Grover diffusion applied. Target probability surged to ${targetProb.toFixed(0)} percent.`);
      }
      if (window.app) {
        window.app.showToast(`📈 Step 3: Inversion about mean applied! Target probability surged to ${targetProb.toFixed(1)}%!`);
        if (this.groverIterations >= 3) {
          window.app.unlockAchievement('oracle', 'Grover Quantum Oracle Master');
        }
      }
    }
    this.updateMath();
  }

  runToCompletion() {
    this.step1_Superposition(false);
    setTimeout(() => {
      this.step2_Oracle(false);
      setTimeout(() => {
        this.step3_Diffusion(false);
        setTimeout(() => {
          this.step2_Oracle(false);
          setTimeout(() => {
            this.step3_Diffusion(true);
          }, 400);
        }, 400);
      }, 400);
    }, 300);
  }

  savePrevious() {
    this.prevAmplitudes = [...this.amplitudes];
  }

  updateMath() {
    const targetAmp = this.targetAmplitudes[this.targetState];
    const targetProb = Math.pow(targetAmp, 2) * 100;
    const classicalWorst = 16;
    const quantumOptimal = 3;

    if (window.app) {
      window.app.updateTelemetryModule3({
        targetState: this.targetState,
        targetBin: this.targetState.toString(2).padStart(4, '0'),
        targetAmp,
        targetProb,
        mean: this.mean,
        iterations: this.groverIterations,
        classicalWorst,
        quantumOptimal,
        amplitudes: this.amplitudes
      });
    }
  }

  startLoop() {
    const render = () => {
      // Animate bar transition smoothly
      if (this.animProgress < 1.0) {
        this.animProgress = Math.min(1.0, this.animProgress + 0.08);
        for (let i = 0; i < this.nStates; i++) {
          this.amplitudes[i] = this.prevAmplitudes[i] + (this.targetAmplitudes[i] - this.prevAmplitudes[i]) * this.animProgress;
        }
      } else {
        this.amplitudes = [...this.targetAmplitudes];
      }

      this.drawBarChart();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  // ==========================================================================
  // 16-STATE BAR EQUALIZER CANVAS RENDERING
  // ==========================================================================
  drawBarChart() {
    const canvas = this.canvas;
    const ctx = this.ctx;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const midY = h * 0.52; // Zero axis line
    const maxAmplitudeHeight = h * 0.42;

    // Draw Zero-Axis Line
    ctx.beginPath();
    ctx.moveTo(10, midY);
    ctx.lineTo(w - 10, midY);
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Axis label
    ctx.font = '10px var(--font-mono)';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.fillText('α = 0', 12, midY - 6);

    // Draw Mean Line (μ) if initialized
    if (this.currentStep > 0) {
      const meanY = midY - this.mean * maxAmplitudeHeight;
      ctx.beginPath();
      ctx.moveTo(10, meanY);
      ctx.lineTo(w - 10, meanY);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#F59E0B';
      ctx.fillText(`Mean μ: ${this.mean.toFixed(3)}`, w - 105, meanY - 4);
    }

    // Draw 16 Bars
    const totalPadding = 40;
    const barSlotWidth = (w - totalPadding) / this.nStates;
    const barWidth = Math.max(8, barSlotWidth * 0.68);

    for (let i = 0; i < this.nStates; i++) {
      const amp = this.amplitudes[i] || 0;
      const barH = amp * maxAmplitudeHeight;
      const x = totalPadding / 2 + i * barSlotWidth + (barSlotWidth - barWidth) / 2;
      const isTarget = i === this.targetState;

      // Draw Bar
      ctx.beginPath();
      if (barH >= 0) {
        // Positive amplitude (extends upward from midY)
        ctx.roundRect(x, midY - barH, barWidth, Math.max(2, barH), [4, 4, 0, 0]);
      } else {
        // Negative amplitude (extends downward from midY)
        ctx.roundRect(x, midY, barWidth, Math.max(2, -barH), [0, 0, 4, 4]);
      }

      // Bar Fill Colors
      if (isTarget) {
        const goldGrad = ctx.createLinearGradient(x, midY - barH, x, midY);
        goldGrad.addColorStop(0, '#F59E0B');
        goldGrad.addColorStop(1, '#D97706');
        ctx.fillStyle = goldGrad;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
      } else {
        const cyanGrad = ctx.createLinearGradient(x, midY - barH, x, midY);
        cyanGrad.addColorStop(0, '#00F2FE');
        cyanGrad.addColorStop(1, '#0284C7');
        ctx.fillStyle = cyanGrad;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0, 242, 254, 0.3)';
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Target Golden Crown / Lock Indicator
      if (isTarget) {
        ctx.fillStyle = '#F59E0B';
        ctx.font = '10px var(--font-ui)';
        ctx.textAlign = 'center';
        ctx.fillText('★', x + barWidth / 2, barH >= 0 ? midY - barH - 6 : midY - 6);
      }

      // Basis state binary label below bar
      const binStr = i.toString(2).padStart(4, '0');
      ctx.font = '8px var(--font-mono)';
      ctx.fillStyle = isTarget ? '#F59E0B' : '#64748B';
      ctx.textAlign = 'center';
      ctx.fillText(binStr, x + barWidth / 2, h - 8);

      // Amplitude value above/below bar
      if (Math.abs(amp) > 0.05) {
        ctx.font = '8px var(--font-mono)';
        ctx.fillStyle = isTarget ? '#FFFFFF' : '#94A3B8';
        const ampY = barH >= 0 ? midY - barH - 4 : midY - barH + 10;
        ctx.fillText(amp.toFixed(2), x + barWidth / 2, ampY);
      }
    }

    ctx.textAlign = 'left';
    ctx.restore();
  }
}

window.module3 = new Module3();
