/**
 * Level 3: The 16-Chest Treasure Hunt (Grover's Quantum Search)
 * 
 * Intuitive Concept:
 * "Normal computer has to open locked chests one by one (takes up to 16 tries).
 *  Quantum computer shoots a wave through all 16 at once, echoes the right one,
 *  and boosts its volume to 96% in just 3 clicks!"
 */

class Level3TreasureHunt {
  constructor() {
    this.canvas = document.getElementById('canvas-grover');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.numChests = 16;
    this.targetChest = 7; // Default secret chest
    this.amplitudes = new Array(16).fill(1 / 4); // Equal initial superposition 1/sqrt(16)
    this.groverStep = 0; // 0=Init, 1=Oracle, 2=Diffusion, 3=Target Found

    this.isClassicalSearching = false;
    this.classicalChecked = 0;
    this.classicalTimer = null;

    this.init();
  }

  init() {
    this.renderChestGrid();
    this.bindEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.draw();
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    if (rect.width > 50) {
      this.canvas.width = rect.width;
      this.canvas.height = 240;
      this.draw();
    }
  }

  renderChestGrid() {
    const grid = document.getElementById('chest-grid-container');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 0; i < this.numChests; i++) {
      const box = document.createElement('div');
      box.className = `chest-box ${i === this.targetChest ? 'selected' : ''}`;
      box.id = `chest-${i}`;
      box.innerHTML = `
        <div class="chest-icon">${i === this.targetChest ? '🗝️' : '📦'}</div>
        <div class="chest-label">Chest #${i}</div>
        <div class="chest-prob" id="prob-label-${i}">6.3%</div>
      `;

      box.addEventListener('click', () => {
        this.setTargetChest(i);
      });
      grid.appendChild(box);
    }
  }

  setTargetChest(index) {
    this.targetChest = index;
    this.resetQuantumState();
    
    // Update visual classes
    for (let i = 0; i < this.numChests; i++) {
      const b = document.getElementById(`chest-${i}`);
      if (b) {
        b.className = `chest-box ${i === this.targetChest ? 'selected' : ''}`;
        const icon = b.querySelector('.chest-icon');
        if (icon) icon.textContent = (i === this.targetChest) ? '🗝️' : '📦';
      }
    }

    window.labAudio.playCoinSpin();
    this.updateStatus(`🗝️ Golden Key hidden inside <strong>Chest #${index}</strong>! Now try finding it using Classical Search vs Quantum Search.`);
  }

  resetQuantumState() {
    this.groverStep = 0;
    this.amplitudes = new Array(16).fill(1 / 4);
    this.updateProbLabels();
    this.draw();
  }

  bindEvents() {
    // 1. Classical Search Button
    const btnClassic = document.getElementById('btn-classical-search');
    if (btnClassic) {
      btnClassic.addEventListener('click', () => {
        this.runClassicalSearch();
      });
    }

    // 2. Quantum Step 1: Broadcast Equal Wave
    const btnStep1 = document.getElementById('btn-grover-step1');
    if (btnStep1) {
      btnStep1.addEventListener('click', () => {
        this.resetQuantumState();
        window.labAudio.playCoinSpin();
        this.updateStatus("🔊 Step 1: Equal soundwave broadcasted across all 16 chests! Every chest has a 6.25% chance.");
      });
    }

    // 3. Quantum Step 2: Flip Target Echo (Oracle)
    const btnStep2 = document.getElementById('btn-grover-step2');
    if (btnStep2) {
      btnStep2.addEventListener('click', () => {
        // Negate target amplitude
        this.amplitudes[this.targetChest] = -this.amplitudes[this.targetChest];
        this.groverStep = 1;
        window.labAudio.playSlapDown();
        this.updateStatus(`🔄 Step 2: The echo hit <strong>Chest #${this.targetChest}</strong> and flipped upside down! (Phase inverted)`);
        this.updateProbLabels();
        this.draw();
      });
    }

    // 4. Quantum Step 3: Amplify Wave (Inversion about mean)
    const btnStep3 = document.getElementById('btn-grover-step3');
    if (btnStep3) {
      btnStep3.addEventListener('click', () => {
        // Calculate mean amplitude
        const mean = this.amplitudes.reduce((a, b) => a + b, 0) / this.numChests;
        // Invert about mean: A_new = 2 * mean - A_old
        for (let i = 0; i < this.numChests; i++) {
          this.amplitudes[i] = 2 * mean - this.amplitudes[i];
        }
        this.groverStep = 2;
        window.labAudio.playDiceSync();

        const targetProb = (this.amplitudes[this.targetChest] ** 2 * 100).toFixed(1);
        this.updateStatus(`🚀 Step 3: Wave Amplified! The wave for <strong>Chest #${this.targetChest}</strong> skyrocketed to <strong>${targetProb}%</strong>!`);
        this.updateProbLabels();
        this.draw();
      });
    }

    // 5. Open Winning Chest
    const btnOpen = document.getElementById('btn-open-chest');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        window.labAudio.playChestOpen();
        const winningBox = document.getElementById(`chest-${this.targetChest}`);
        if (winningBox) {
          winningBox.classList.add('revealed-target');
          const icon = winningBox.querySelector('.chest-icon');
          if (icon) icon.textContent = '🏆';
        }
        this.updateStatus(`🎉 SUCCESS! Chest #${this.targetChest} opened! You found the Golden Key in just 3 quantum steps!`);
        if (window.labApp) window.labApp.unlockBadge('badge-hunter');
      });
    }
  }

  runClassicalSearch() {
    if (this.isClassicalSearching) return;
    this.isClassicalSearching = true;
    this.classicalChecked = 0;

    this.updateStatus("⏳ Normal Computer is checking chests one by one...");

    this.classicalTimer = setInterval(() => {
      const current = this.classicalChecked;
      const b = document.getElementById(`chest-${current}`);
      if (b) {
        b.style.borderColor = '#f59e0b';
        setTimeout(() => { b.style.borderColor = ''; }, 200);
      }

      window.labAudio.playSlapDown();

      if (current === this.targetChest) {
        clearInterval(this.classicalTimer);
        this.isClassicalSearching = false;
        window.labAudio.playChestOpen();
        this.updateStatus(`😅 Normal computer finally found it at Chest #${current} after <strong>${current + 1} slow checks</strong>! Quantum did it in 3 steps.`);
      } else {
        this.classicalChecked++;
        if (this.classicalChecked >= this.numChests) {
          clearInterval(this.classicalTimer);
          this.isClassicalSearching = false;
        }
      }
    }, 280);
  }

  updateProbLabels() {
    for (let i = 0; i < this.numChests; i++) {
      const prob = (this.amplitudes[i] ** 2 * 100).toFixed(1);
      const label = document.getElementById(`prob-label-${i}`);
      if (label) {
        label.textContent = `${prob}%`;
        label.style.color = (i === this.targetChest && parseFloat(prob) > 20) ? '#34d399' : '#38bdf8';
      }
    }
  }

  updateStatus(html) {
    const el = document.getElementById('grover-status-msg');
    if (el) el.innerHTML = html;
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    const barWidth = (w - 60) / this.numChests;
    const zeroY = h * 0.65;

    // Draw Zero line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, zeroY);
    ctx.lineTo(w - 30, zeroY);
    ctx.stroke();

    // Draw 16 Wave Amplitude Bars
    for (let i = 0; i < this.numChests; i++) {
      const amp = this.amplitudes[i];
      const barHeight = amp * 180; // Scale height
      const x = 30 + i * barWidth;
      const y = zeroY - barHeight;

      // Color
      if (i === this.targetChest) {
        ctx.fillStyle = (amp > 0.4) ? '#10b981' : (amp < 0 ? '#f43f5e' : '#00f0ff');
      } else {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      }

      ctx.fillRect(x + 4, Math.min(zeroY, y), barWidth - 8, Math.abs(barHeight));

      // Bar number
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(i, x + barWidth / 2, zeroY + 14);
    }

    // Title inside canvas
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('📊 Quantum Wave Height (Equalizer Display)', 30, 20);
  }
}

window.Level3TreasureHunt = Level3TreasureHunt;
