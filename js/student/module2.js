/**
 * Level 2: The Ghost Electron & Magic Telepathic Dice
 * (Quantum Tunneling & Entanglement)
 * 
 * Sub-Game A: Why electrons leak through walls & make laptops warm!
 * Sub-Game B: Magic dice linked across space & the unhackable quantum internet!
 */

class Level2GhostAndDice {
  constructor() {
    this.canvasTunnel = document.getElementById('canvas-tunneling');
    this.ctxTunnel = this.canvasTunnel ? this.canvasTunnel.getContext('2d') : null;

    this.canvasDice = document.getElementById('canvas-entangle');
    this.ctxDice = this.canvasDice ? this.canvasDice.getContext('2d') : null;

    this.activeSubTab = 'tunnel'; // 'tunnel' or 'dice'
    
    // Tunneling state
    this.barrierThicknessNm = 7; // 1nm to 14nm
    this.electrons = [];
    this.tunnelLoopId = null;

    // Entanglement state
    this.dieAValue = 1;
    this.dieBValue = 1;
    this.isRolling = false;
    this.isEntangled = true;
    this.hackerIntercepted = false;
    this.plasmaPulse = 0;
    this.diceLoopId = null;

    this.init();
  }

  init() {
    this.bindEvents();
    const viewTunnel = document.getElementById('subview-tunnel');
    const viewDice = document.getElementById('subview-dice');
    if (viewTunnel) viewTunnel.style.display = 'flex';
    if (viewDice) viewDice.style.display = 'none';
    this.startTunnelLoop();
    this.startDiceLoop();
  }

  bindEvents() {
    // Sub-tab toggles
    const tabTunnel = document.getElementById('tab-btn-tunnel');
    const tabDice = document.getElementById('tab-btn-dice');
    const viewTunnel = document.getElementById('subview-tunnel');
    const viewDice = document.getElementById('subview-dice');

    if (tabTunnel && tabDice) {
      tabTunnel.addEventListener('click', () => {
        this.activeSubTab = 'tunnel';
        tabTunnel.classList.add('active');
        tabDice.classList.remove('active');
        if (viewTunnel) viewTunnel.style.display = 'flex';
        if (viewDice) viewDice.style.display = 'none';
        this.resize();
      });

      tabDice.addEventListener('click', () => {
        this.activeSubTab = 'dice';
        tabDice.classList.add('active');
        tabTunnel.classList.remove('active');
        if (viewTunnel) viewTunnel.style.display = 'none';
        if (viewDice) viewDice.style.display = 'flex';
        this.resize();
      });
    }

    // Tunnel Barrier Slider
    const barrierSlider = document.getElementById('barrier-slider');
    if (barrierSlider) {
      barrierSlider.addEventListener('input', (e) => {
        this.barrierThicknessNm = parseFloat(e.target.value);
        this.updateTunnelTelemetry();
      });
    }

    // Fire Electron Button
    const fireBtn = document.getElementById('btn-fire-electron');
    if (fireBtn) {
      fireBtn.addEventListener('click', () => {
        this.fireElectronPacket();
      });
    }

    // Dice Roll Button
    const rollBtn = document.getElementById('btn-roll-dice');
    if (rollBtn) {
      rollBtn.addEventListener('click', () => {
        this.rollEntangledDice();
      });
    }

    // Hacker Intercept Button
    const hackerBtn = document.getElementById('btn-hacker-intercept');
    if (hackerBtn) {
      hackerBtn.addEventListener('click', () => {
        this.triggerHackerAttack();
      });
    }

    // Reset Link Button
    const resetLinkBtn = document.getElementById('btn-reset-link');
    if (resetLinkBtn) {
      resetLinkBtn.addEventListener('click', () => {
        this.isEntangled = true;
        this.hackerIntercepted = false;
        window.labAudio.playDiceSync();
        this.updateDiceStatus("✨ Quantum Magic Link Restored! Dice are telepathically connected again.");
      });
    }

    window.addEventListener('resize', () => this.resize());
    setTimeout(() => this.resize(), 100);
  }

  resize() {
    if (this.canvasTunnel && this.canvasTunnel.parentElement) {
      const rect = this.canvasTunnel.parentElement.getBoundingClientRect();
      if (rect.width > 50) {
        this.canvasTunnel.width = rect.width;
        this.canvasTunnel.height = 360;
      }
    }
    if (this.canvasDice && this.canvasDice.parentElement) {
      const rect = this.canvasDice.parentElement.getBoundingClientRect();
      if (rect.width > 50) {
        this.canvasDice.width = rect.width;
        this.canvasDice.height = 360;
      }
    }
  }

  // --- Tunneling Simulation ---
  updateTunnelTelemetry() {
    const valElem = document.getElementById('barrier-val-nm');
    const leakElem = document.getElementById('leakage-percent-val');
    if (valElem) valElem.textContent = `${this.barrierThicknessNm.toFixed(1)} nm`;

    // Quantum tunneling formula: T ~ exp(-2 * kappa * d)
    // At 1nm -> 85% leakage, At 14nm -> 0.01% leakage
    const leakageProb = Math.min(100, Math.max(0.01, 100 * Math.exp(-0.45 * (this.barrierThicknessNm - 1))));
    if (leakElem) leakElem.textContent = `${leakageProb.toFixed(1)}%`;

    const statusElem = document.getElementById('tunnel-status-msg');
    if (statusElem) {
      if (this.barrierThicknessNm <= 3) {
        statusElem.innerHTML = `<span style="color:#f43f5e;">⚠️ GHOST LEAK DETECTED! Barrier is so thin that electrons slip through like ghosts. This causes heat!</span>`;
      } else {
        statusElem.innerHTML = `<span style="color:#34d399;">🛡️ SOLID BARRIER: Barrier is thick enough. Most electrons bounce right off.</span>`;
      }
    }
  }

  fireElectronPacket() {
    window.labAudio.playGhostSwoosh();
    // Compute transmission chance
    const leakProb = Math.exp(-0.45 * (this.barrierThicknessNm - 1));
    const willTunnel = Math.random() < leakProb;

    this.electrons.push({
      x: 30,
      y: 180 + (Math.random() * 40 - 20),
      vx: 6,
      phase: 0,
      willTunnel: willTunnel,
      tunneled: false,
      bounced: false,
      alpha: 1.0
    });

    if (window.labApp && willTunnel) {
      window.labApp.unlockBadge('badge-ghost');
    }
  }

  startTunnelLoop() {
    const render = () => {
      this.drawTunnel();
      this.tunnelLoopId = requestAnimationFrame(render);
    };
    this.tunnelLoopId = requestAnimationFrame(render);
  }

  drawTunnel() {
    if (!this.ctxTunnel || !this.canvasTunnel) return;
    const ctx = this.ctxTunnel;
    const w = this.canvasTunnel.width;
    const h = this.canvasTunnel.height;
    ctx.clearRect(0, 0, w, h);

    const barrierX = w * 0.5;
    // Barrier width on screen scaled to thickness
    const barrierW = Math.max(12, (this.barrierThicknessNm / 14) * 120);

    // 1. Draw Silicon Barrier Wall
    const grad = ctx.createLinearGradient(barrierX - barrierW / 2, 0, barrierX + barrierW / 2, 0);
    grad.addColorStop(0, 'rgba(244, 63, 94, 0.4)');
    grad.addColorStop(0.5, 'rgba(244, 63, 94, 0.8)');
    grad.addColorStop(1, 'rgba(244, 63, 94, 0.4)');

    ctx.fillStyle = grad;
    ctx.fillRect(barrierX - barrierW / 2, 40, barrierW, h - 80);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.strokeRect(barrierX - barrierW / 2, 40, barrierW, h - 80);

    // Wall Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`🧱 Barrier Wall (${this.barrierThicknessNm.toFixed(1)} nm)`, barrierX, 30);

    // Zone labels
    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('📥 Input Source (Left)', 20, h - 20);
    ctx.textAlign = 'right';
    ctx.fillText('📤 Output Drain (Right)', w - 20, h - 20);

    // 2. Animate and Draw Electron Wave Packets
    for (let i = this.electrons.length - 1; i >= 0; i--) {
      const e = this.electrons[i];
      e.phase += 0.2;
      e.x += e.vx;

      // Interaction with barrier
      const leftEdge = barrierX - barrierW / 2;
      const rightEdge = barrierX + barrierW / 2;

      if (!e.bounced && !e.tunneled) {
        if (e.x >= leftEdge) {
          if (e.willTunnel) {
            e.tunneled = true;
            e.x = rightEdge + 5; // Teleported through!
          } else {
            e.bounced = true;
            e.vx = -4; // Bounced back
          }
        }
      }

      // Draw electron wave packet
      ctx.save();
      ctx.globalAlpha = e.alpha;

      // Sine wave ripples
      ctx.strokeStyle = e.tunneled ? '#a855f7' : '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let rx = -24; rx <= 24; rx += 2) {
        const waveY = Math.sin(rx * 0.35 + e.phase) * 12 * Math.exp(- (rx * rx) / 160);
        if (rx === -24) ctx.moveTo(e.x + rx, e.y + waveY);
        else ctx.lineTo(e.x + rx, e.y + waveY);
      }
      ctx.stroke();

      // Glowing core
      ctx.fillStyle = e.tunneled ? '#c084fc' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(e.x, e.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Ghost label if tunneled
      if (e.tunneled) {
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText('👻 Ghost!', e.x, e.y - 14);
      }

      ctx.restore();

      // Clean up off-screen
      if (e.x < 0 || e.x > w) {
        this.electrons.splice(i, 1);
      }
    }
  }

  // --- Entanglement Simulation ---
  rollEntangledDice() {
    if (this.isRolling) return;
    this.isRolling = true;
    window.labAudio.playCoinSpin();
    this.updateDiceStatus("🎲 Rolling both dice at the same time...");

    let counter = 0;
    const rollInterval = setInterval(() => {
      counter++;
      this.dieAValue = Math.floor(Math.random() * 6) + 1;
      if (this.isEntangled && !this.hackerIntercepted) {
        this.dieBValue = this.dieAValue; // Always identical!
      } else {
        this.dieBValue = Math.floor(Math.random() * 6) + 1; // Scrambled!
      }

      if (counter >= 15) {
        clearInterval(rollInterval);
        this.isRolling = false;
        window.labAudio.playDiceSync();

        if (this.isEntangled && !this.hackerIntercepted) {
          this.updateDiceStatus(`🎉 WOW! Both dice landed on <strong>[ ${this.dieAValue} ]</strong>! 100% matched across space!`);
          if (window.labApp) window.labApp.unlockBadge('badge-entangle');
        } else {
          this.updateDiceStatus(`⚠️ Disconnected! Die A = [ ${this.dieAValue} ], Die B = [ ${this.dieBValue} ]. The link was broken!`);
        }
      }
    }, 60);
  }

  triggerHackerAttack() {
    this.hackerIntercepted = true;
    this.isEntangled = false;
    window.labAudio.playHackerAlarm();
    this.updateDiceStatus(`<span style="color:#f43f5e;">🚨 HACKER CAUGHT! A spy tried to measure the quantum particle. The magic wave collapsed into noise instantly! Secret is safe!</span>`);
    if (window.labApp) window.labApp.unlockBadge('badge-hacker');
  }

  updateDiceStatus(html) {
    const statusElem = document.getElementById('dice-status-msg');
    if (statusElem) statusElem.innerHTML = html;
  }

  startDiceLoop() {
    const render = () => {
      this.drawDice();
      this.diceLoopId = requestAnimationFrame(render);
    };
    this.diceLoopId = requestAnimationFrame(render);
  }

  drawDice() {
    if (!this.ctxDice || !this.canvasDice) return;
    const ctx = this.ctxDice;
    const w = this.canvasDice.width;
    const h = this.canvasDice.height;
    ctx.clearRect(0, 0, w, h);

    this.plasmaPulse += 0.05;

    const diceSize = 80;
    const dieAx = w * 0.22;
    const dieAy = h * 0.5;
    const dieBx = w * 0.78;
    const dieBy = h * 0.5;

    // 1. Draw Quantum Tether / Plasma Rope
    ctx.save();
    if (this.isEntangled && !this.hackerIntercepted) {
      // Glowing Cyan/Purple Plasma
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.moveTo(dieAx + diceSize / 2, dieAy);
      for (let x = dieAx + diceSize / 2; x <= dieBx - diceSize / 2; x += 10) {
        const offset = Math.sin((x * 0.03) + this.plasmaPulse) * 12;
        ctx.lineTo(x, dieAy + offset);
      }
      ctx.stroke();

      // Tether Label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ Quantum Entangled Plasma Bridge (0ms Delay)', w * 0.5, dieAy - 25);
    } else {
      // Broken Red Tether
      ctx.strokeStyle = '#f43f5e';
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(dieAx + diceSize / 2, dieAy);
      ctx.lineTo(w * 0.45, dieAy + 20);
      ctx.moveTo(w * 0.55, dieAy - 20);
      ctx.lineTo(dieBx - diceSize / 2, dieBy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 13px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('❌ LINK BROKEN BY OBSERVER / HACKER', w * 0.5, dieAy - 25);
    }
    ctx.restore();

    // 2. Draw Die A
    this.renderDieBox(ctx, dieAx - diceSize / 2, dieAy - diceSize / 2, diceSize, this.dieAValue, '📍 Your Desk (Delhi)', '#00f0ff');

    // 3. Draw Die B
    this.renderDieBox(ctx, dieBx - diceSize / 2, dieBy - diceSize / 2, diceSize, this.dieBValue, '📍 Friend (London)', '#a855f7');
  }

  renderDieBox(ctx, x, y, size, val, label, glowColor) {
    ctx.save();
    // Rounded box
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 12);
    ctx.fill();
    ctx.stroke();

    // Pip dots for dice value
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 0;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const o = 18;

    const pips = {
      1: [[0, 0]],
      2: [[-o, -o], [o, o]],
      3: [[-o, -o], [0, 0], [o, o]],
      4: [[-o, -o], [o, -o], [-o, o], [o, o]],
      5: [[-o, -o], [o, -o], [0, 0], [-o, o], [o, o]],
      6: [[-o, -o], [o, -o], [-o, 0], [o, 0], [-o, o], [o, o]]
    };

    const dotCoords = pips[val] || pips[1];
    dotCoords.forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Label below
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, y + size + 20);

    ctx.restore();
  }
}

window.Level2GhostAndDice = Level2GhostAndDice;
