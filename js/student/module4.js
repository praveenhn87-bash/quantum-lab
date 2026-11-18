/**
 * Level 4: The Unbreakable Knot (Majorana Topological Qubit)
 * 
 * Intuitive Concept:
 * "A regular qubit is like balancing an egg on a spoon—a sneeze or warm breeze smashes it.
 *  Majorana splits the quantum info into TWO halves at opposite ends of a braided wire,
 *  like a knot in a rope. Shaking the rope doesn't untie the knot!"
 */

class Level4TopologicalShield {
  constructor() {
    this.canvas = document.getElementById('canvas-majorana');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // Simulation parameters
    this.temperatureMK = 50; // 20mK to 300K
    this.noiseLevel = 3;     // 1 to 5
    this.isShieldActive = false;

    // Health & Survival Game State
    this.isSurvivalRunning = false;
    this.survivalSeconds = 0;
    this.survivalTimer = null;
    this.standardHealth = 100;
    this.majoranaHealth = 100;

    // Stray noise particles
    this.noiseParticles = [];
    this.animId = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initParticles();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.startLoop();
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    if (rect.width > 50) {
      this.canvas.width = rect.width;
      this.canvas.height = 360;
    }
  }

  initParticles() {
    this.noiseParticles = [];
    for (let i = 0; i < 35; i++) {
      this.noiseParticles.push({
        x: Math.random() * 800,
        y: Math.random() * 360,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 2 + Math.random() * 3,
        color: '#f43f5e'
      });
    }
  }

  bindEvents() {
    // Temperature Slider
    const tempSlider = document.getElementById('temp-slider');
    if (tempSlider) {
      tempSlider.addEventListener('input', (e) => {
        this.temperatureMK = parseFloat(e.target.value);
        this.updateTelemetry();
      });
    }

    // Shield Toggle Button
    const shieldBtn = document.getElementById('btn-toggle-shield');
    if (shieldBtn) {
      shieldBtn.addEventListener('click', () => {
        this.isShieldActive = !this.isShieldActive;
        shieldBtn.textContent = this.isShieldActive ? '🛡️ Shield: ACTIVE (Braided)' : '🛡️ Activate Topological Shield';
        shieldBtn.classList.toggle('active', this.isShieldActive);
        window.labAudio.playShieldOn();

        this.updateStatus(this.isShieldActive 
          ? "✨ Topological Shield Active! The quantum info is now braided across both wire ends."
          : "⚠️ Shield OFF: Nanowire is vulnerable to extreme heat.");
      });
    }

    // Start Survival Run Button
    const runBtn = document.getElementById('btn-start-survival');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        this.startSurvivalRun();
      });
    }
  }

  startSurvivalRun() {
    if (this.isSurvivalRunning) return;
    this.isSurvivalRunning = true;
    this.survivalSeconds = 0;
    this.standardHealth = 100;
    this.majoranaHealth = 100;
    window.labAudio.playCoinSpin();

    this.updateStatus("⏱️ Survival Challenge Started! Watch how quickly the standard qubit dies vs the Majorana wire!");

    if (this.survivalTimer) clearInterval(this.survivalTimer);

    this.survivalTimer = setInterval(() => {
      this.survivalSeconds++;
      const timerEl = document.getElementById('survival-timer-val');
      if (timerEl) timerEl.textContent = `${this.survivalSeconds}s`;

      // Standard qubit health decay (very sensitive to noise and temperature)
      // At room temp or even mild noise, standard qubit dies within 3-5 seconds
      const tempFactor = this.temperatureMK / 30;
      const stdDamage = 18 * (tempFactor * 0.8 + this.noiseLevel * 0.5);
      this.standardHealth = Math.max(0, this.standardHealth - stdDamage);

      // Majorana health decay: protected by topological gap!
      // Immune to local noise; only slowly damaged if temp is super high and shield is off
      let majDamage = 1.0;
      if (this.isShieldActive) {
        majDamage = (this.temperatureMK > 150) ? 2.5 : 0.2; // Virtually indestructible!
      } else {
        majDamage = (this.temperatureMK > 80) ? 6.0 : 1.5;
      }
      this.majoranaHealth = Math.max(0, this.majoranaHealth - majDamage);

      this.updateHealthBars();

      // Check end condition
      if (this.standardHealth <= 0 && this.majoranaHealth > 0) {
        this.updateStatus(`💀 Standard Qubit DIED at second ${this.survivalSeconds}! But the Majorana wire is STILL ALIVE thanks to its braided knot!`);
      }

      if (this.survivalSeconds >= 30) {
        clearInterval(this.survivalTimer);
        this.isSurvivalRunning = false;
        window.labAudio.playChestOpen();
        this.updateStatus("🏆 CHALLENGE COMPLETED! You kept the Majorana qubit alive for a full 30 seconds! Unlocked Topological Defender badge!");
        if (window.labApp) window.labApp.unlockBadge('badge-majorana');
      }
    }, 1000);
  }

  updateHealthBars() {
    const stdFill = document.getElementById('std-health-fill');
    const majFill = document.getElementById('maj-health-fill');
    const stdPct = document.getElementById('std-health-pct');
    const majPct = document.getElementById('maj-health-pct');

    if (stdFill) {
      stdFill.style.width = `${this.standardHealth}%`;
      stdFill.className = `health-fill ${this.standardHealth > 50 ? 'green' : (this.standardHealth > 20 ? 'yellow' : 'red')}`;
    }
    if (majFill) {
      majFill.style.width = `${this.majoranaHealth}%`;
      majFill.className = `health-fill ${this.majoranaHealth > 50 ? 'green' : (this.majoranaHealth > 20 ? 'yellow' : 'red')}`;
    }

    if (stdPct) stdPct.textContent = `${Math.round(this.standardHealth)}%`;
    if (majPct) majPct.textContent = `${Math.round(this.majoranaHealth)}%`;
  }

  updateTelemetry() {
    const tempEl = document.getElementById('temp-val-display');
    if (tempEl) {
      if (this.temperatureMK < 1) {
        tempEl.textContent = `${(this.temperatureMK * 1000).toFixed(0)} μK`;
      } else {
        tempEl.textContent = `${this.temperatureMK.toFixed(0)} mK (${(this.temperatureMK - 273.15).toFixed(1)}°C)`;
      }
    }
  }

  updateStatus(html) {
    const el = document.getElementById('majorana-status-msg');
    if (el) el.innerHTML = html;
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
    ctx.clearRect(0, 0, w, h);

    const midX = w * 0.5;

    // 1. Divider line between the two contenders
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(midX, 20);
    ctx.lineTo(midX, h - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Contender Titles
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('🥊 Regular Fragile Qubit (Transmon)', midX * 0.5, 30);

    ctx.fillStyle = '#10b981';
    ctx.fillText('🛡️ Majorana Braided Wire (Topological)', midX + midX * 0.5, 30);

    // 3. Draw Regular Qubit (Single fragile loop on the left)
    const qx = midX * 0.5;
    const qy = h * 0.5;
    ctx.save();
    ctx.strokeStyle = (this.standardHealth > 0) ? '#f59e0b' : '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(qx, qy, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Fragile core
    if (this.standardHealth > 0) {
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(qx, qy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 16px system-ui';
      ctx.fillText('💥 BROKEN', qx, qy + 6);
    }
    ctx.restore();

    // 4. Draw Majorana Nanowire on the right (Braided ends)
    const mx = midX + midX * 0.5;
    const my = h * 0.5;
    const wireLength = 160;

    ctx.save();
    // Shield Aura if active
    if (this.isShieldActive) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.roundRect(mx - wireLength / 2 - 20, my - 30, wireLength + 40, 60, 20);
      ctx.stroke();
    }

    // Nanowire bar
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(mx - wireLength / 2, my - 10, wireLength, 20, 10);
    ctx.fill();
    ctx.stroke();

    // Braided Majorana Knot A (Left end)
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(mx - wireLength / 2, my, 12, 0, Math.PI * 2);
    ctx.fill();

    // Braided Majorana Knot B (Right end)
    ctx.fillStyle = '#a855f7';
    ctx.shadowColor = '#a855f7';
    ctx.beginPath();
    ctx.arc(mx + wireLength / 2, my, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Knot Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px system-ui';
    ctx.fillText('½ Knot A', mx - wireLength / 2, my + 26);
    ctx.fillText('½ Knot B', mx + wireLength / 2, my + 26);

    ctx.restore();

    // 5. Draw and Animate Stray Heat & Noise Particles
    ctx.save();
    for (const p of this.noiseParticles) {
      p.x += p.vx * (1 + this.noiseLevel * 0.4);
      p.y += p.vy * (1 + this.noiseLevel * 0.4);

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

window.Level4TopologicalShield = Level4TopologicalShield;
