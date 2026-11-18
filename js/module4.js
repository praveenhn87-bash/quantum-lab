/* ==========================================================================
   QuantumLab OS - Module 4: Microsoft Majorana 1 vs. Majorana 2 Simulator
   "Topological Shield" - H-Shaped Tetron Nanowire + 4 MZMs + Superconductor
   Shell Upgrade (Al -> Pb) + Stray Noise Photon Deflections + Survival Stopwatch.
   ========================================================================== */

class Module4 {
  constructor() {
    this.architecture = 'majorana2'; // 'transmon', 'majorana1', 'majorana2'
    this.temperatureMK = 30; // Cryogenic temperature in mK (20 to 150 mK)

    // Canvas
    this.canvas = null;
    this.ctx = null;

    // Simulation particles: stray thermal photons & noise flux
    this.photons = [];
    this.mzmPulse = 0;
    this.shieldGlow = 0;
    this.upgradeFlash = 0; // Triggered when upgrading to Majorana 2

    // Live Survival Stopwatch
    this.survivalTimeMs = 0;
    this.lastTickTime = performance.now();
    this.bestSurvivalMs = 0;

    this.animTime = 0;
  }

  init() {
    this.canvas = document.getElementById('majorana-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }

    this.initPhotons();
    this.bindControls();
    this.updateMath();
    this.startLoop();
  }

  initPhotons() {
    this.photons = [];
    for (let i = 0; i < 22; i++) {
      this.spawnPhoton();
    }
  }

  spawnPhoton() {
    // Spawn from perimeter toward center H-nanowire
    const edge = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    const w = this.canvas ? this.canvas.width / (window.devicePixelRatio || 1) : 400;
    const h = this.canvas ? this.canvas.height / (window.devicePixelRatio || 1) : 260;

    if (edge === 0) { x = Math.random() * w; y = -10; }
    else if (edge === 1) { x = w + 10; y = Math.random() * h; }
    else if (edge === 2) { x = Math.random() * w; y = h + 10; }
    else { x = -10; y = Math.random() * h; }

    const targetX = w / 2 + (Math.random() - 0.5) * 80;
    const targetY = h / 2 + (Math.random() - 0.5) * 60;
    const angle = Math.atan2(targetY - y, targetX - x);
    const speed = 1.2 + (this.temperatureMK / 150) * 2.2;

    this.photons.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      targetX, targetY,
      deflected: false,
      absorbed: false,
      alpha: 1.0
    });
  }

  bindControls() {
    // Mode Buttons
    const btnTransmon = document.getElementById('btn-arch-transmon');
    const btnM1 = document.getElementById('btn-arch-majorana1');
    const btnM2 = document.getElementById('btn-arch-majorana2');

    if (btnTransmon) {
      btnTransmon.addEventListener('click', () => this.setArchitecture('transmon'));
    }
    if (btnM1) {
      btnM1.addEventListener('click', () => this.setArchitecture('majorana1'));
    }
    if (btnM2) {
      btnM2.addEventListener('click', () => this.setArchitecture('majorana2'));
    }

    // Cryogenic Temperature Slider
    const sliderTemp = document.getElementById('slider-cryo-temp');
    if (sliderTemp) {
      sliderTemp.addEventListener('input', (e) => {
        this.temperatureMK = parseFloat(e.target.value);
        this.updateTempUI();
      });
    }

    // Reality Check Modal Toggle
    const btnReality = document.getElementById('btn-open-reality-check');
    if (btnReality) {
      btnReality.addEventListener('click', () => {
        this.openRealityCheckModal();
      });
    }

    const btnCloseModal = document.getElementById('btn-close-modal');
    const modalBackdrop = document.getElementById('reality-check-modal');
    if (btnCloseModal && modalBackdrop) {
      btnCloseModal.addEventListener('click', () => {
        modalBackdrop.classList.remove('open');
      });
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
      });
    }
  }

  setArchitecture(archKey) {
    if (this.architecture === archKey) return;
    this.architecture = archKey;
    this.survivalTimeMs = 0; // Reset stopwatch

    // Audio & Visual Effects
    if (archKey === 'majorana2') {
      window.soundEngine.playUpgradeChime();
      this.upgradeFlash = 1.0;
      if (window.soundEngine && !window.NarratorStory.isPlaying) {
        window.soundEngine.speak("Majorana two upgrade activated! Heavy lead shell with thirteen hundred micro electron volts bulk gap. Lifetime extended to twenty seconds!");
      }
      if (window.app) {
        window.app.showToast("🚀 MAJORANA 2 UPGRADE: Atomic swap to Heavy Lead (Pb)! Bulk Gap surges to 1,300 μeV (1,000x lifetime gain)!");
        window.app.unlockAchievement('topological', 'Topological Lead Shield Pioneer');
      }
    } else {
      window.soundEngine.playClick();
      if (window.soundEngine && !window.NarratorStory.isPlaying) {
        if (archKey === 'transmon') {
          window.soundEngine.speak("Standard Transmon active. High decoherence rate with no topological gap.");
        } else if (archKey === 'majorana1') {
          window.soundEngine.speak("Majorana one active with aluminum shell. Topological gap three hundred micro electron volts.");
        }
      }
    }

    this.updateModeButtons();
    this.updateMath();
  }

  updateModeButtons() {
    const btnTransmon = document.getElementById('btn-arch-transmon');
    const btnM1 = document.getElementById('btn-arch-majorana1');
    const btnM2 = document.getElementById('btn-arch-majorana2');

    if (btnTransmon) btnTransmon.classList.toggle('active', this.architecture === 'transmon');
    if (btnM1) btnM1.classList.toggle('active', this.architecture === 'majorana1');
    if (btnM2) btnM2.classList.toggle('active', this.architecture === 'majorana2');
  }

  updateTempUI() {
    const valTemp = document.getElementById('val-cryo-temp');
    if (valTemp) valTemp.textContent = `${this.temperatureMK} mK`;
    this.updateMath();
  }

  openRealityCheckModal() {
    const modal = document.getElementById('reality-check-modal');
    if (modal) {
      modal.classList.add('open');
      window.soundEngine.playClick();
    }
  }

  updateMath() {
    const mathData = window.MathEngine.computeMajoranaPoisoningRate(this.architecture, this.temperatureMK);
    mathData.architecture = this.architecture;
    mathData.temperatureMK = this.temperatureMK;
    mathData.survivalTimeMs = this.survivalTimeMs;
    mathData.spec = window.MathEngine.hardwareSpecs[this.architecture];

    if (window.app) {
      window.app.updateTelemetryModule4(mathData);
    }
  }

  startLoop() {
    const render = (now) => {
      this.animTime += 0.03;
      const dt = now - this.lastTickTime;
      this.lastTickTime = now;

      // Update Survival Stopwatch
      if (this.architecture === 'transmon') {
        // Transmon resets very frequently
        if (Math.random() < 0.08) {
          this.survivalTimeMs = 0;
        } else {
          this.survivalTimeMs += dt * 0.001; // tiny
        }
      } else if (this.architecture === 'majorana1') {
        // Resets periodically (1 - 12 ms)
        const resetChance = 0.008 + (this.temperatureMK / 150) * 0.03;
        if (Math.random() < resetChance) {
          this.survivalTimeMs = 0;
        } else {
          this.survivalTimeMs += dt;
        }
      } else if (this.architecture === 'majorana2') {
        // Survives up to 20,000 ms (20s)
        const resetChance = 0.0001 + (this.temperatureMK > 120 ? 0.002 : 0);
        if (Math.random() < resetChance) {
          this.survivalTimeMs = 0;
        } else {
          this.survivalTimeMs += dt;
        }
      }

      if (this.survivalTimeMs > this.bestSurvivalMs) {
        this.bestSurvivalMs = this.survivalTimeMs;
      }

      // Live stopwatch DOM update
      const timerEl = document.getElementById('majorana-stopwatch');
      if (timerEl) {
        if (this.architecture === 'transmon') {
          timerEl.textContent = `${(this.survivalTimeMs * 1000).toFixed(0)} μs`;
          timerEl.style.color = '#EF4444';
        } else if (this.architecture === 'majorana1') {
          timerEl.textContent = `${this.survivalTimeMs.toFixed(1)} ms`;
          timerEl.style.color = '#38BDF8';
        } else {
          timerEl.textContent = `${(this.survivalTimeMs / 1000).toFixed(2)} s`;
          timerEl.style.color = '#10B981';
        }
      }

      // Upgrade flash decay
      if (this.upgradeFlash > 0) {
        this.upgradeFlash = Math.max(0, this.upgradeFlash - 0.03);
      }

      this.drawTetronSimulation();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  // ==========================================================================
  // H-SHAPED TETRON TOPOLOGICAL NANOWIRE CANVAS RENDERING
  // ==========================================================================
  drawTetronSimulation() {
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

    const cx = w / 2;
    const cy = h / 2;

    // Upgrade flash effect
    if (this.upgradeFlash > 0) {
      ctx.fillStyle = `rgba(16, 185, 129, ${this.upgradeFlash * 0.3})`;
      ctx.fillRect(0, 0, w, h);
    }

    // Geometry of the H-Shaped Tetron Nanowire
    const armW = 20; // thickness of wire arms
    const wireLength = 85; // vertical arm length from center
    const crossBarLength = 65; // horizontal bridge half-length

    // Coordinates of 4 MZM endpoints (corners of "H"):
    const mzm1 = { x: cx - crossBarLength, y: cy - wireLength, name: 'γ₁' }; // Top-left
    const mzm2 = { x: cx + crossBarLength, y: cy - wireLength, name: 'γ₂' }; // Top-right
    const mzm3 = { x: cx - crossBarLength, y: cy + wireLength, name: 'γ₃' }; // Bottom-left
    const mzm4 = { x: cx + crossBarLength, y: cy + wireLength, name: 'γ₄' }; // Bottom-right

    // Shield configuration
    const isTransmon = this.architecture === 'transmon';
    const isM1 = this.architecture === 'majorana1';
    const isM2 = this.architecture === 'majorana2';
    const shieldThickness = isTransmon ? 0 : (isM1 ? 10 : 28);
    const shieldColor = isM2 ? '#10B981' : '#00F2FE';

    // ========================================================================
    // 1. DRAW TOPOLOGICAL ENERGY GAP SHIELD
    // ========================================================================
    if (!isTransmon) {
      ctx.save();
      const pulse = Math.sin(this.animTime * 3) * (isM2 ? 4 : 2);
      ctx.lineWidth = shieldThickness + pulse;
      ctx.strokeStyle = isM2 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 242, 254, 0.18)';
      ctx.shadowBlur = isM2 ? 20 : 10;
      ctx.shadowColor = shieldColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw H-outline for shield
      ctx.beginPath();
      // Left vertical wire
      ctx.moveTo(cx - crossBarLength, cy - wireLength);
      ctx.lineTo(cx - crossBarLength, cy + wireLength);
      // Horizontal bridge
      ctx.moveTo(cx - crossBarLength, cy);
      ctx.lineTo(cx + crossBarLength, cy);
      // Right vertical wire
      ctx.moveTo(cx + crossBarLength, cy - wireLength);
      ctx.lineTo(cx + crossBarLength, cy + wireLength);
      ctx.stroke();

      // Outer boundary glow line
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isM2 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(0, 242, 254, 0.5)';
      ctx.stroke();
      ctx.restore();
    }

    // ========================================================================
    // 2. DRAW SUPERCONDUCTOR SHELL (Al vs Pb) & SEMICONDUCTOR CORE (InAs)
    // ========================================================================
    // Superconductor Outer Shell
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    ctx.lineWidth = isTransmon ? 14 : armW;
    
    // Coating colors:
    // Transmon: generic dull slate
    // Majorana 1: Aluminum metallic silver/cyan
    // Majorana 2: Heavy Lead (Pb) rich deep titanium luster + emerald trim
    if (isTransmon) {
      ctx.strokeStyle = '#64748B';
    } else if (isM1) {
      ctx.strokeStyle = '#94A3B8'; // Aluminum silver
    } else {
      ctx.strokeStyle = '#334155'; // Heavy Lead core
    }

    ctx.beginPath();
    ctx.moveTo(cx - crossBarLength, cy - wireLength);
    ctx.lineTo(cx - crossBarLength, cy + wireLength);
    ctx.moveTo(cx - crossBarLength, cy);
    ctx.lineTo(cx + crossBarLength, cy);
    ctx.moveTo(cx + crossBarLength, cy - wireLength);
    ctx.lineTo(cx + crossBarLength, cy + wireLength);
    ctx.stroke();

    // InAs Semiconductor Core (Thin Glowing Red/Amber stripe down center)
    if (!isTransmon) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = isM2 ? '#F59E0B' : '#E2E8F0';
      ctx.stroke();
    }

    // ========================================================================
    // 3. DRAW 4 MAJORANA ZERO MODES (MZMs) AT THE CORNERS
    // ========================================================================
    if (!isTransmon) {
      const mzms = [mzm1, mzm2, mzm3, mzm4];
      const mzmPulseR = 7 + Math.sin(this.animTime * 5) * 1.5;

      mzms.forEach(m => {
        // Glowing halo
        ctx.beginPath();
        ctx.arc(m.x, m.y, mzmPulseR + 4, 0, Math.PI * 2);
        ctx.fillStyle = isM2 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 242, 254, 0.3)';
        ctx.fill();

        // Core orb
        ctx.beginPath();
        ctx.arc(m.x, m.y, mzmPulseR, 0, Math.PI * 2);
        ctx.fillStyle = isM2 ? '#10B981' : '#00F2FE';
        ctx.shadowBlur = 12;
        ctx.shadowColor = isM2 ? '#10B981' : '#00F2FE';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = 'bold 11px var(--font-mono)';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(m.name, m.x + (m.x < cx ? -14 : 14), m.y + (m.y < cy ? -6 : 14));
      });
    }

    // ========================================================================
    // 4. STRAY THERMAL PHOTON / NOISE PARTICLES & COLLISION DYNAMICS
    // ========================================================================
    // Maintain particle count
    while (this.photons.length < 24) {
      this.spawnPhoton();
    }

    const shieldR = crossBarLength + shieldThickness;

    this.photons.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;

      // Distance to center of H-nanowire
      const dist = Math.hypot(p.x - cx, p.y - cy);

      // Check collision with topological shield boundary
      if (!p.deflected && !p.absorbed && dist < shieldR) {
        if (isTransmon) {
          // Hits directly -> Quasiparticle poisoning / decoherence
          p.absorbed = true;
          this.survivalTimeMs = 0; // reset
        } else if (isM1) {
          // Majorana 1: thin gap. 30% chance to pierce shield at elevated temp!
          const pierceChance = 0.25 + (this.temperatureMK / 150) * 0.45;
          if (Math.random() < pierceChance) {
            p.absorbed = true;
            this.survivalTimeMs = 0; // shield breach!
            window.soundEngine.playPoisoningBreach();
          } else {
            // Deflected
            p.deflected = true;
            p.vx = -p.vx * 1.2;
            p.vy = -p.vy * 1.2;
            window.soundEngine.playShieldDeflect();
          }
        } else {
          // Majorana 2: Heavy Lead 1,300 ueV gap -> BOUNCES HARMLESSLY!
          p.deflected = true;
          p.vx = -p.vx * 1.4;
          p.vy = -p.vy * 1.4;
          window.soundEngine.playShieldDeflect();
        }
      }

      // Draw photon particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.deflected ? 2.5 : 3.5, 0, Math.PI * 2);
      if (p.absorbed) {
        ctx.fillStyle = '#EF4444';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#EF4444';
      } else if (p.deflected) {
        ctx.fillStyle = '#10B981'; // Turned green upon deflection!
      } else {
        ctx.fillStyle = '#EF4444'; // Stray thermal photon
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Recycle out of bounds particles
      if (p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30 || p.absorbed) {
        this.photons.splice(idx, 1);
      }
    });

    // Architecture badge in corner
    ctx.font = 'bold 11px var(--font-mono)';
    ctx.textAlign = 'left';
    if (isTransmon) {
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('⚡ STANDARD TRANSMON (NO TOPOLOGICAL GAP)', 14, 20);
    } else if (isM1) {
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('🛡️ MAJORANA 1 (Al SHELL) - BULK GAP: 300 μeV', 14, 20);
    } else {
      ctx.fillStyle = '#10B981';
      ctx.fillText('🛡️ MAJORANA 2 (HEAVY LEAD Pb) - BULK GAP: 1,300 μeV (4x GAP)', 14, 20);
    }

    ctx.restore();
  }
}

window.module4 = new Module4();
