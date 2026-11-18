/* ==========================================================================
   QuantumLab OS - Module 1: Superposition, Phase & The Bloch Sphere
   Interactive 3D Bloch Sphere Canvas + Dual Wave Interference Strip +
   Quantum Vault Laser Lock Mini-Game + 1,000 Shots Monte Carlo.
   ========================================================================== */

class Module1 {
  constructor() {
    this.theta = 45; // Degrees
    this.phi = 60;   // Degrees

    // Target challenge: 75% |0> and 25% |1> with 90 deg phase: theta=60 deg, phi=90 deg
    this.targetTheta = 60;
    this.targetPhi = 90;
    this.isUnlocked = false;

    // Viewport 3D rotation angles for Bloch sphere
    this.rotX = 0.35; // Pitch
    this.rotY = -0.55; // Yaw
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    // Canvases
    this.blochCanvas = null;
    this.blochCtx = null;
    this.waveCanvas = null;
    this.waveCtx = null;

    this.animTime = 0;
    this.collapseFlash = 0; // Flash intensity after measurement
    this.animatingTarget = null;

    // Monte Carlo histogram state
    this.monteCarloActive = false;
    this.mcData = null;
  }

  init() {
    this.blochCanvas = document.getElementById('bloch-canvas');
    if (this.blochCanvas) {
      this.blochCtx = this.blochCanvas.getContext('2d');
      this.setupBlochInteraction();
    }

    this.waveCanvas = document.getElementById('wave-canvas');
    if (this.waveCanvas) {
      this.waveCtx = this.waveCanvas.getContext('2d');
    }

    this.bindControls();
    this.updateMath();
    this.startLoop();
  }

  setupBlochInteraction() {
    const c = this.blochCanvas;
    if (!c) return;

    c.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.rotY += dx * 0.008;
      this.rotX += dy * 0.008;
      // Clamp pitch to avoid gimbal flipping
      this.rotX = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, this.rotX));
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch support for mobile / tablets
    c.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.lastMouseX;
      const dy = e.touches[0].clientY - this.lastMouseY;
      this.rotY += dx * 0.008;
      this.rotX += dy * 0.008;
      this.rotX = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, this.rotX));
      this.lastMouseX = e.touches[0].clientX;
      this.lastMouseY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  bindControls() {
    const sliderTheta = document.getElementById('slider-theta');
    const sliderPhi = document.getElementById('slider-phi');

    if (sliderTheta) {
      sliderTheta.addEventListener('input', (e) => {
        this.theta = parseFloat(e.target.value);
        this.updateMath();
      });
    }

    if (sliderPhi) {
      sliderPhi.addEventListener('input', (e) => {
        this.phi = parseFloat(e.target.value);
        this.updateMath();
      });
    }

    // Gate Buttons
    const btnPauliX = document.getElementById('btn-pauli-x');
    if (btnPauliX) {
      btnPauliX.addEventListener('click', () => {
        window.soundEngine.playGateFlip();
        this.theta = 180 - this.theta;
        this.updateSliders();
        this.updateMath();
      });
    }

    const btnHadamard = document.getElementById('btn-hadamard');
    if (btnHadamard) {
      btnHadamard.addEventListener('click', () => {
        window.soundEngine.playGateFlip();
        this.theta = 90;
        this.phi = 0;
        this.updateSliders();
        this.updateMath();
      });
    }

    const btnPauliZ = document.getElementById('btn-pauli-z');
    if (btnPauliZ) {
      btnPauliZ.addEventListener('click', () => {
        window.soundEngine.playGateFlip();
        this.phi = (this.phi + 180) % 360;
        this.updateSliders();
        this.updateMath();
      });
    }

    const btnReset = document.getElementById('btn-reset-q');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.theta = 0;
        this.phi = 0;
        this.updateSliders();
        this.updateMath();
      });
    }

    // Measurement Action
    const btnMeasure = document.getElementById('btn-measure-single');
    if (btnMeasure) {
      btnMeasure.addEventListener('click', () => {
        this.measureSingle();
      });
    }

    // Monte Carlo 1,000 shots
    const btnShots = document.getElementById('btn-run-shots');
    if (btnShots) {
      btnShots.addEventListener('click', () => {
        this.runMonteCarlo();
      });
    }
  }

  setAngles(theta, phi) {
    this.theta = Math.max(0, Math.min(180, theta));
    this.phi = ((phi % 360) + 360) % 360;
    this.updateSliders();
    this.updateMath();
  }

  animateToAngles(targetTheta, targetPhi, durationMs = 1000) {
    const startTheta = this.theta;
    const startPhi = this.phi;
    const startTime = performance.now();

    const animateStep = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // Smooth cosine ease

      this.theta = startTheta + (targetTheta - startTheta) * ease;
      this.phi = startPhi + (targetPhi - startPhi) * ease;
      this.updateSliders();
      this.updateMath();

      if (progress < 1) {
        requestAnimationFrame(animateStep);
      }
    };
    requestAnimationFrame(animateStep);
  }

  updateSliders() {
    const sliderTheta = document.getElementById('slider-theta');
    const sliderPhi = document.getElementById('slider-phi');
    const valTheta = document.getElementById('val-theta');
    const valPhi = document.getElementById('val-phi');

    if (sliderTheta) sliderTheta.value = this.theta.toFixed(1);
    if (sliderPhi) sliderPhi.value = this.phi.toFixed(1);
    if (valTheta) valTheta.textContent = `${this.theta.toFixed(1)}°`;
    if (valPhi) valPhi.textContent = `${this.phi.toFixed(1)}°`;
  }

  measureSingle() {
    const collapse = window.MathEngine.measureSingleQubit(this.theta, this.phi);
    window.soundEngine.playCollapse(collapse.result === 0);
    this.collapseFlash = 1.0;

    if (window.soundEngine && !window.NarratorStory.isPlaying) {
      window.soundEngine.speak(collapse.result === 0 ? "Wave collapsed to State Zero" : "Wave collapsed to State One");
    }

    // Snap to pole
    this.animateToAngles(collapse.collapsedTheta, 0, 300);

    if (window.app) {
      window.app.showToast(
        collapse.result === 0 
          ? "💥 Collapsed to State |0⟩ (Probability was " + collapse.p0.toFixed(1) + "%)" 
          : "💥 Collapsed to State |1⟩ (Probability was " + collapse.p1.toFixed(1) + "%)"
      );
    }
  }

  runMonteCarlo() {
    const res = window.MathEngine.runMonteCarloShots(this.theta, this.phi, 1000);
    this.mcData = res;
    this.monteCarloActive = true;
    window.soundEngine.playShotTick();

    // Trigger visual histogram update
    const modalHist = document.getElementById('mc-histogram-box');
    if (modalHist) {
      modalHist.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.75rem; display: flex; flex-direction: column; gap: 0.35rem;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--accent-cyan);">|0⟩: ${res.count0} shots (${res.freq0.toFixed(1)}%)</span>
            <span style="color: var(--text-dim);">Theory: ${res.theoP0.toFixed(1)}%</span>
          </div>
          <div style="height: 6px; background: rgba(30,41,59,0.8); border-radius: 3px; overflow: hidden;">
            <div style="width: ${res.freq0}%; height: 100%; background: var(--accent-cyan);"></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.2rem;">
            <span style="color: var(--accent-purple);">|1⟩: ${res.count1} shots (${res.freq1.toFixed(1)}%)</span>
            <span style="color: var(--text-dim);">Theory: ${res.theoP1.toFixed(1)}%</span>
          </div>
          <div style="height: 6px; background: rgba(30,41,59,0.8); border-radius: 3px; overflow: hidden;">
            <div style="width: ${res.freq1}%; height: 100%; background: var(--accent-purple);"></div>
          </div>
        </div>
      `;
    }

    if (window.app) {
      window.app.showToast(`📊 1,000 Quantum Shots Simulated! N(|0⟩)=${res.count0}, N(|1⟩)=${res.count1}`);
    }
  }

  updateMath() {
    const mathData = window.MathEngine.computeSingleQubit(this.theta, this.phi);
    
    // Check Mini-game Laser Lock condition
    // Target: theta = 60 (+/- 3 deg), phi = 90 (+/- 5 deg)
    const dTheta = Math.abs(this.theta - this.targetTheta);
    const dPhi = Math.abs(((this.phi - this.targetPhi + 180) % 360) - 180);
    const aligned = dTheta <= 3 && dPhi <= 6;

    const lockBadge = document.getElementById('vault-lock-badge');
    if (lockBadge) {
      if (aligned) {
        lockBadge.className = 'mission-status-pill success';
        lockBadge.innerHTML = '✔ VAULT UNLOCKED (ALIGNED)';
        if (!this.isUnlocked) {
          this.isUnlocked = true;
          window.soundEngine.playLaserLockSuccess();
          if (window.soundEngine && !window.NarratorStory.isPlaying) {
            window.soundEngine.speak("Quantum Laser Lock aligned! Security Vault unlocked!");
          }
          if (window.app) {
            window.app.unlockAchievement('vault', 'Quantum Vault Keymaster');
          }
        }
      } else {
        lockBadge.className = 'mission-status-pill';
        lockBadge.innerHTML = '🔒 LOCKED (ALIGN θ=60°, φ=90°)';
      }
    }

    // Send math update to global telemetry panel
    if (window.app) {
      window.app.updateTelemetryModule1(mathData);
    }
  }

  startLoop() {
    const render = () => {
      this.animTime += 0.03;
      if (this.collapseFlash > 0) {
        this.collapseFlash = Math.max(0, this.collapseFlash - 0.05);
      }
      this.drawBlochSphere();
      this.drawWaveInterference();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  // ==========================================================================
  // 3D BLOCH SPHERE CANVAS RENDERING
  // ==========================================================================
  drawBlochSphere() {
    const canvas = this.blochCanvas;
    const ctx = this.blochCtx;
    if (!canvas || !ctx) return;

    // Handle high DPI
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
    const radius = Math.min(w, h) * 0.36;

    // Collapse flash overlay
    if (this.collapseFlash > 0) {
      ctx.fillStyle = `rgba(0, 242, 254, ${this.collapseFlash * 0.25})`;
      ctx.fillRect(0, 0, w, h);
    }

    // 3D Projection Engine
    // Coordinate system: X points forward/right, Y points right/back, Z points up
    const project = (x, y, z) => {
      // Rotate around Y axis (yaw)
      const cosY = Math.cos(this.rotY);
      const sinY = Math.sin(this.rotY);
      const x1 = x * cosY - y * sinY;
      const y1 = x * sinY + y * cosY;
      const z1 = z;

      // Rotate around X axis (pitch)
      const cosX = Math.cos(this.rotX);
      const sinX = Math.sin(this.rotX);
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      // Simple orthographic / weak perspective projection
      const scale = radius;
      return {
        px: cx + x2 * scale,
        py: cy - z2 * scale, // invert Z for screen Y
        depth: y2
      };
    };

    // Draw ambient background glow inside sphere
    const bgGrad = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
    bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.4)');
    bgGrad.addColorStop(0.85, 'rgba(10, 16, 28, 0.7)');
    bgGrad.addColorStop(1, 'rgba(0, 242, 254, 0.08)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Latitude Rings (horizontal circles)
    const latitudes = [-0.707, 0, 0.707];
    latitudes.forEach(latZ => {
      const ringRadius = Math.sqrt(Math.max(0, 1 - latZ * latZ));
      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        const rx = ringRadius * Math.cos(angle);
        const ry = ringRadius * Math.sin(angle);
        const pt = project(rx, ry, latZ);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.strokeStyle = latZ === 0 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = latZ === 0 ? 1.5 : 1;
      if (latZ === 0) ctx.setLineDash([4, 3]);
      else ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Longitude Meridian Rings (vertical circles)
    const meridians = [0, Math.PI / 2];
    meridians.forEach(mAngle => {
      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const phi = (i / steps) * Math.PI * 2;
        const rx = Math.sin(phi) * Math.cos(mAngle);
        const ry = Math.sin(phi) * Math.sin(mAngle);
        const rz = Math.cos(phi);
        const pt = project(rx, ry, rz);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Main Axes X, Y, Z with glowing tips
    const drawAxis = (x, y, z, label, color, negLabel = '') => {
      const p0 = project(0, 0, 0);
      const p1 = project(x, y, z);
      const pNeg = project(-x, -y, -z);

      // Negative axis dash
      ctx.beginPath();
      ctx.moveTo(p0.px, p0.py);
      ctx.lineTo(pNeg.px, pNeg.py);
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Positive axis solid
      ctx.beginPath();
      ctx.moveTo(p0.px, p0.py);
      ctx.lineTo(p1.px, p1.py);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.font = 'bold 11px var(--font-mono)';
      ctx.fillStyle = color;
      ctx.fillText(label, p1.px + 6, p1.py + 4);

      if (negLabel) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.fillText(negLabel, pNeg.px - 14, pNeg.py + 4);
      }
    };

    // Axes
    drawAxis(1.2, 0, 0, '+X (|+⟩)', '#F59E0B', '|-⟩');
    drawAxis(0, 1.2, 0, '+Y (|+i⟩)', '#10B981', '|-i⟩');
    drawAxis(0, 0, 1.2, '+Z (|0⟩)', '#00F2FE', '|1⟩');

    // Sphere Outer Boundary Ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ========================================================================
    // STATE VECTOR ARROW (THETA, PHI)
    // ========================================================================
    const math = window.MathEngine.computeSingleQubit(this.theta, this.phi);
    const vx = math.bloch.x;
    const vy = math.bloch.y;
    const vz = math.bloch.z;

    const pCenter = project(0, 0, 0);
    const pVector = project(vx, vy, vz);
    const pXYProjection = project(vx, vy, 0);

    // Drop line to XY plane (for geometric clarity)
    ctx.beginPath();
    ctx.moveTo(pVector.px, pVector.py);
    ctx.lineTo(pXYProjection.px, pXYProjection.py);
    ctx.strokeStyle = 'rgba(159, 122, 234, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 2]);
    ctx.stroke();

    // Line from center to XY projection
    ctx.beginPath();
    ctx.moveTo(pCenter.px, pCenter.py);
    ctx.lineTo(pXYProjection.px, pXYProjection.py);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Glow effect for State Vector
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';

    // Main Vector Arrow Line
    ctx.beginPath();
    ctx.moveTo(pCenter.px, pCenter.py);
    ctx.lineTo(pVector.px, pVector.py);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.shadowBlur = 0; // reset

    // Vector Tip Cone / Glowing Sphere
    ctx.beginPath();
    ctx.arc(pVector.px, pVector.py, 5, 0, Math.PI * 2);
    const tipGrad = ctx.createRadialGradient(pVector.px, pVector.py, 1, pVector.px, pVector.py, 6);
    tipGrad.addColorStop(0, '#FFFFFF');
    tipGrad.addColorStop(0.6, '#00F2FE');
    tipGrad.addColorStop(1, '#9F7AEA');
    ctx.fillStyle = tipGrad;
    ctx.fill();

    // State Vector Label
    ctx.font = 'bold 12px var(--font-mono)';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('|ψ⟩', pVector.px + 10, pVector.py - 6);

    ctx.restore();
  }

  // ==========================================================================
  // DUAL WAVE INTERFERENCE STRIP RENDERING
  // ==========================================================================
  drawWaveInterference() {
    const canvas = this.waveCanvas;
    const ctx = this.waveCtx;
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

    const midY = h / 2;
    const math = window.MathEngine.computeSingleQubit(this.theta, this.phi);

    // Draw central zero-axis line
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Wave 1: Alpha Component (|0> wave) - Cyan
    // Amplitude = alpha = cos(theta/2), baseline frequency
    const amp0 = Math.abs(math.alpha) * (h * 0.38);
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const k = (x / w) * Math.PI * 4; // 2 cycles across width
      const y = midY - amp0 * Math.sin(k - this.animTime * 2);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#00F2FE';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wave 2: Beta Component (|1> wave with phase phi) - Purple
    // Amplitude = sin(theta/2), phase shifted by phi_rad
    const amp1 = math.beta.mag * (h * 0.38);
    const phaseShift = math.phiRad;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const k = (x / w) * Math.PI * 4;
      const y = midY - amp1 * Math.sin(k - this.animTime * 2 + phaseShift);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#9F7AEA';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Wave Labels
    ctx.font = '10px var(--font-mono)';
    ctx.fillStyle = '#00F2FE';
    ctx.fillText(`α|0⟩: ${(math.alpha).toFixed(2)}`, 10, 16);

    ctx.fillStyle = '#9F7AEA';
    ctx.fillText(`β|1⟩: ${(math.beta.mag).toFixed(2)} ∠ ${(this.phi).toFixed(0)}°`, 10, h - 8);

    ctx.restore();
  }
}

window.module1 = new Module1();
