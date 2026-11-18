/**
 * Level 1: The Spinning Coin (Superposition & Measurement)
 * Designed for 10th-grade intuition:
 * "A coin resting on the desk is Heads or Tails.
 *  While spinning in mid-air, it is BOTH at the same time!"
 */

class Level1SpinningCoin {
  constructor() {
    this.canvas = document.getElementById('canvas-level1');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    // Quantum angles
    this.theta = Math.PI / 2; // Default 90 deg = 50/50
    this.phi = 0;
    
    // Coin animation state
    this.isSpinning = true;
    this.spinRotation = 0;
    this.measurementResult = null; // '0' or '1'
    this.animId = null;

    // Mini-challenge tracking
    this.flipsCount = 0;
    this.headsCount = 0;
    this.tailsCount = 0;

    // Mouse drag for 3D rotation
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.init();
  }

  init() {
    if (!this.canvas) return;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.bindEvents();
    this.startLoop();
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    if (rect.width > 50 && rect.height > 50) {
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }
  }

  bindEvents() {
    // 3D Mouse Drag
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      this.phi += dx * 0.01;
      this.theta = Math.max(0.01, Math.min(Math.PI - 0.01, this.theta + dy * 0.01));
      
      const slider = document.getElementById('coin-tilt-slider');
      if (slider) slider.value = Math.round((this.theta / Math.PI) * 180);
      this.updateTelemetry();
    });

    window.addEventListener('mouseup', () => { this.isDragging = false; });

    // Slider
    const slider = document.getElementById('coin-tilt-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const deg = parseFloat(e.target.value);
        this.theta = (deg / 180) * Math.PI;
        this.updateTelemetry();
      });
    }

    // Spin Button
    const spinBtn = document.getElementById('btn-spin-coin');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => {
        this.isSpinning = true;
        this.measurementResult = null;
        window.labAudio.playCoinSpin();
        this.updateStatusBanner("🌪️ Coin is spinning in mid-air! It is in SUPERPOSITION (Both 0 & 1)!");
      });
    }

    // Slap / Measure Button
    const slapBtn = document.getElementById('btn-slap-coin');
    if (slapBtn) {
      slapBtn.addEventListener('click', () => {
        this.measureCoin();
      });
    }

    // 100-Flips Rapid Fire Button
    const rapidBtn = document.getElementById('btn-rapid-flips');
    if (rapidBtn) {
      rapidBtn.addEventListener('click', () => {
        this.runRapidFlips(100);
      });
    }
  }

  measureCoin() {
    this.isSpinning = false;
    window.labAudio.playSlapDown();

    // Quantum probability Born Rule: P(0) = cos^2(theta / 2)
    const prob0 = Math.cos(this.theta / 2) ** 2;
    const rand = Math.random();
    this.measurementResult = (rand < prob0) ? '0' : '1';

    this.flipsCount++;
    if (this.measurementResult === '0') this.headsCount++;
    else this.tailsCount++;

    const sideName = (this.measurementResult === '0') ? "HEADS (State |0⟩)" : "TAILS (State |1⟩)";
    this.updateStatusBanner(`✋ SLAP! The coin collapsed to: <strong>${sideName}</strong>!`);

    // Check Badge
    if (window.labApp) {
      window.labApp.unlockBadge('badge-coin');
      // If student balanced at 50/50 (+/- 5%) after at least 10 flips
      if (this.flipsCount >= 10) {
        const ratio = this.headsCount / this.flipsCount;
        if (ratio >= 0.45 && ratio <= 0.55) {
          window.labApp.unlockBadge('badge-balance');
        }
      }
    }
  }

  runRapidFlips(n = 100) {
    const prob0 = Math.cos(this.theta / 2) ** 2;
    let local0 = 0;
    for (let i = 0; i < n; i++) {
      if (Math.random() < prob0) local0++;
    }
    const local1 = n - local0;
    this.flipsCount += n;
    this.headsCount += local0;
    this.tailsCount += local1;

    window.labAudio.playSlapDown();
    this.updateStatusBanner(`⚡ Rapid 100 Flips Done! Heads: ${local0} | Tails: ${local1}. Look at how close it matches the math!`);
    this.updateTelemetry();
  }

  updateTelemetry() {
    const prob0 = Math.cos(this.theta / 2) ** 2;
    const prob1 = 1 - prob0;

    const p0Elem = document.getElementById('coin-prob0-val');
    const p1Elem = document.getElementById('coin-prob1-val');
    const degElem = document.getElementById('coin-tilt-val');

    if (p0Elem) p0Elem.textContent = `${(prob0 * 100).toFixed(1)}%`;
    if (p1Elem) p1Elem.textContent = `${(prob1 * 100).toFixed(1)}%`;
    if (degElem) degElem.textContent = `${Math.round((this.theta / Math.PI) * 180)}°`;

    // Update progress bars
    const bar0 = document.getElementById('bar-heads-fill');
    const bar1 = document.getElementById('bar-tails-fill');
    if (bar0) bar0.style.width = `${(prob0 * 100).toFixed(1)}%`;
    if (bar1) bar1.style.width = `${(prob1 * 100).toFixed(1)}%`;

    // Advanced Scientist Mode fields
    const diracElem = document.getElementById('dirac-formula-display');
    if (diracElem) {
      const alpha = Math.cos(this.theta / 2).toFixed(3);
      const beta = Math.sin(this.theta / 2).toFixed(3);
      diracElem.textContent = `|ψ⟩ = ${alpha}|0⟩ + ${beta}e^{i${this.phi.toFixed(2)}}|1⟩`;
    }
  }

  updateStatusBanner(html) {
    const banner = document.getElementById('level1-action-status');
    if (banner) banner.innerHTML = html;
  }

  startLoop() {
    const render = () => {
      this.draw();
      this.animId = requestAnimationFrame(render);
    };
    this.animId = requestAnimationFrame(render);
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.35;

    ctx.clearRect(0, 0, w, h);

    // Update rotation
    if (this.isSpinning) {
      this.spinRotation += 0.08;
    }

    // 1. Draw 3D Bloch Orbit Globe (wireframe background)
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1.5;

    // Outer boundary circle
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    // Equator ellipse
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Z-Axis (North pole = |0> Heads, South pole = |1> Tails)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - R - 20);
    ctx.lineTo(cx, cy + R + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pole labels
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('🪙 HEADS |0⟩ (100% Top)', cx, cy - R - 26);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText('🪙 TAILS |1⟩ (100% Bottom)', cx, cy + R + 36);

    // 2. Draw the Interactive Coin in Center
    ctx.save();
    ctx.translate(cx, cy);

    if (this.isSpinning) {
      // Spinning state: glowing pulsing disc
      const spinScale = Math.cos(this.spinRotation);
      ctx.scale(1, Math.abs(spinScale) > 0.05 ? spinScale : 0.05);

      const coinGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, R * 0.6);
      coinGrad.addColorStop(0, '#fef08a');
      coinGrad.addColorStop(0.5, '#f59e0b');
      coinGrad.addColorStop(1, '#b45309');

      ctx.fillStyle = coinGrad;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Spinning mystery label
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px system-ui';
      ctx.fillText('? 0 & 1 ?', 0, 8);
    } else {
      // Measured State: solid landed coin
      const isHeads = (this.measurementResult === '0');
      const coinGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, R * 0.6);
      if (isHeads) {
        coinGrad.addColorStop(0, '#6ee7b7');
        coinGrad.addColorStop(1, '#059669');
      } else {
        coinGrad.addColorStop(0, '#fcd34d');
        coinGrad.addColorStop(1, '#d97706');
      }

      ctx.fillStyle = coinGrad;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px system-ui';
      ctx.fillText(isHeads ? '🪙 HEADS' : '🪙 TAILS', 0, 10);
    }

    ctx.restore();

    // 3. Draw Vector Arrow pointing along Theta & Phi
    const vx = Math.sin(this.theta) * Math.cos(this.phi) * R;
    const vy = -Math.cos(this.theta) * R; // negative y is up
    const vz = Math.sin(this.theta) * Math.sin(this.phi);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + vx, cy + vy);
    ctx.stroke();

    // Arrow tip
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(cx + vx, cy + vy, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

window.Level1SpinningCoin = Level1SpinningCoin;
