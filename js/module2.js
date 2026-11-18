/* ==========================================================================
   QuantumLab OS - Module 2: Entanglement, Tunneling & 2-Qubit Circuits
   Sub-Tab A: Transistor Barrier Tunneling Simulator
   Sub-Tab B: 2-Qubit Bell State Plasma Tether & Eavesdropper Detection
   ========================================================================== */

class Module2 {
  constructor() {
    this.currentSubTab = 'circuit'; // 'tunneling' or 'circuit'

    // Tunneling state
    this.gateWidthNm = 3.5; // 14 nm down to 1 nm
    this.electrons = [];
    this.electronSpawnTimer = 0;

    // 2-Qubit Circuit State
    this.hasHadamardA = true;
    this.hasCNOT = true;
    this.hasXB = false;

    // Measurement & Hacker State
    this.orbAState = null; // null (superposition), 0 (|0>), 1 (|1>)
    this.orbBState = null;
    this.isHackerCompromised = false;
    this.tetherParticles = [];

    // Canvases
    this.tunnelCanvas = null;
    this.tunnelCtx = null;
    this.circuitCanvas = null;
    this.circuitCtx = null;

    this.animTime = 0;
  }

  init() {
    this.tunnelCanvas = document.getElementById('tunneling-canvas');
    if (this.tunnelCanvas) {
      this.tunnelCtx = this.tunnelCanvas.getContext('2d');
    }

    this.circuitCanvas = document.getElementById('circuit-canvas');
    if (this.circuitCanvas) {
      this.circuitCtx = this.circuitCanvas.getContext('2d');
    }

    this.initTetherParticles();
    this.initElectrons();
    this.bindControls();
    this.updateMath();
    this.startLoop();
  }

  initTetherParticles() {
    this.tetherParticles = [];
    for (let i = 0; i < 28; i++) {
      this.tetherParticles.push({
        t: Math.random(),
        speed: 0.005 + Math.random() * 0.008,
        spread: (Math.random() - 0.5) * 14,
        size: 1.5 + Math.random() * 2
      });
    }
  }

  initElectrons() {
    this.electrons = [];
    for (let i = 0; i < 18; i++) {
      this.electrons.push({
        x: Math.random() * 200,
        y: 40 + Math.random() * 120,
        vx: 1.8 + Math.random() * 1.2,
        tunneled: false,
        phase: Math.random() * Math.PI * 2,
        state: 'approaching' // approaching, reflected, tunneled
      });
    }
  }

  bindControls() {
    // Sub-tab toggles
    const tabTunnel = document.getElementById('tab-btn-tunneling');
    const tabCircuit = document.getElementById('tab-btn-circuit');

    if (tabTunnel) {
      tabTunnel.addEventListener('click', () => this.switchSubTab('tunneling'));
    }
    if (tabCircuit) {
      tabCircuit.addEventListener('click', () => this.switchSubTab('circuit'));
    }

    // Tunneling Gate Width Slider
    const sliderWidth = document.getElementById('slider-gate-width');
    if (sliderWidth) {
      sliderWidth.addEventListener('input', (e) => {
        this.gateWidthNm = parseFloat(e.target.value);
        this.updateTunnelingUI();
      });
    }

    // Circuit Gate Click Toggles
    const btnToggleH = document.getElementById('btn-toggle-h');
    if (btnToggleH) {
      btnToggleH.addEventListener('click', () => {
        window.soundEngine.playGateFlip();
        this.hasHadamardA = !this.hasHadamardA;
        this.resetOrbStates();
        this.updateCircuitButtons();
        this.updateMath();
      });
    }

    const btnToggleCNOT = document.getElementById('btn-toggle-cnot');
    if (btnToggleCNOT) {
      btnToggleCNOT.addEventListener('click', () => {
        window.soundEngine.playGateFlip();
        this.hasCNOT = !this.hasCNOT;
        this.resetOrbStates();
        this.updateCircuitButtons();
        this.updateMath();
      });
    }

    // Measure Qubit A
    const btnMeasureA = document.getElementById('btn-measure-qubit-a');
    if (btnMeasureA) {
      btnMeasureA.addEventListener('click', () => {
        this.measureQubitA();
      });
    }

    // Hacker Interception Simulation
    const btnHacker = document.getElementById('btn-simulate-hacker');
    if (btnHacker) {
      btnHacker.addEventListener('click', () => {
        this.simulateHacker();
      });
    }

    // Reset circuit state
    const btnResetCircuit = document.getElementById('btn-reset-circuit');
    if (btnResetCircuit) {
      btnResetCircuit.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.resetOrbStates();
        this.isHackerCompromised = false;
        this.updateMath();
      });
    }
  }

  switchSubTab(tabName) {
    this.currentSubTab = tabName;
    const tabTunnel = document.getElementById('tab-btn-tunneling');
    const tabCircuit = document.getElementById('tab-btn-circuit');
    const secTunnel = document.getElementById('view-tunneling');
    const secCircuit = document.getElementById('view-circuit');

    if (tabTunnel) tabTunnel.classList.toggle('active', tabName === 'tunneling');
    if (tabCircuit) tabCircuit.classList.toggle('active', tabName === 'circuit');
    if (secTunnel) secTunnel.style.display = tabName === 'tunneling' ? 'block' : 'none';
    if (secCircuit) secCircuit.style.display = tabName === 'circuit' ? 'block' : 'none';

    window.soundEngine.playClick();
    this.updateMath();
  }

  setGateWidth(w) {
    this.gateWidthNm = w;
    const slider = document.getElementById('slider-gate-width');
    if (slider) slider.value = w;
    this.updateTunnelingUI();
  }

  animateGateWidth(targetW, durationMs = 1500) {
    const startW = this.gateWidthNm;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
      this.setGateWidth(startW + (targetW - startW) * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  setCircuitGates(hA, cnot) {
    this.hasHadamardA = hA;
    this.hasCNOT = cnot;
    this.resetOrbStates();
    this.updateCircuitButtons();
    this.updateMath();
  }

  resetOrbStates() {
    this.orbAState = null;
    this.orbBState = null;
  }

  updateCircuitButtons() {
    const btnH = document.getElementById('btn-toggle-h');
    const btnCNOT = document.getElementById('btn-toggle-cnot');
    if (btnH) btnH.classList.toggle('active', this.hasHadamardA);
    if (btnCNOT) btnCNOT.classList.toggle('active', this.hasCNOT);
  }

  updateTunnelingUI() {
    const valWidth = document.getElementById('val-gate-width');
    const alertBox = document.getElementById('tunneling-alert-banner');
    const mathData = window.MathEngine.computeTunnelingTransmission(this.gateWidthNm);

    if (valWidth) valWidth.textContent = `${this.gateWidthNm.toFixed(1)} nm`;

    if (alertBox) {
      if (mathData.isLeaking) {
        alertBox.style.display = 'flex';
        alertBox.innerHTML = `⚠️ <b>Classical Silicon Limit Reached!</b> Transistor gate width is ${this.gateWidthNm.toFixed(1)} nm (sub-2nm). Electrons are tunneling directly through the dielectric barrier (Leakage: ${mathData.leakPercentage}%)!`;
        if (!this.wasLeaking && window.soundEngine && !window.NarratorStory.isPlaying) {
          window.soundEngine.speak("Warning: Sub-two nanometer gate width. Electrons are tunneling through the silicon barrier!");
        }
      } else {
        alertBox.style.display = 'none';
      }
      this.wasLeaking = mathData.isLeaking;
    }

    if (window.app) {
      window.app.updateTelemetryModule2Tunneling(mathData);
    }
  }

  measureQubitA() {
    const circuit = window.MathEngine.compute2QubitCircuit(this.hasHadamardA, this.hasCNOT);
    
    // Choose outcome based on probabilities
    const roll = Math.random() * 100;
    if (circuit.isEntangled) {
      // 50% |00> or 50% |11>
      if (roll < 50) {
        this.orbAState = 0;
        this.orbBState = 0;
      } else {
        this.orbAState = 1;
        this.orbBState = 1;
      }
      window.soundEngine.playCollapse(this.orbAState === 0);
      window.soundEngine.playTetherPulse();

      if (window.soundEngine && !window.NarratorStory.isPlaying) {
        window.soundEngine.speak(`Bell state measured! Both Qubit A and Qubit B collapsed to State ${this.orbAState}`);
      }

      if (window.app) {
        window.app.showToast(`✨ Bell Measurement: Qubit A collapsed to |${this.orbAState}⟩ ➔ Qubit B instantaneously collapsed to |${this.orbBState}⟩!`);
        window.app.unlockAchievement('bell', 'Quantum Entanglement Tether');
      }
    } else {
      // Unentangled: measurement depends on active gates
      if (this.hasHadamardA) {
        this.orbAState = roll < 50 ? 0 : 1;
      } else {
        this.orbAState = 0;
      }
      this.orbBState = 0;
      window.soundEngine.playCollapse(this.orbAState === 0);
      if (window.soundEngine && !window.NarratorStory.isPlaying) {
        window.soundEngine.speak(`Qubit A collapsed to State ${this.orbAState}`);
      }
    }
    this.updateMath();
  }

  simulateHacker() {
    this.isHackerCompromised = true;
    window.soundEngine.playHackerAlert();

    if (window.soundEngine && !window.NarratorStory.isPlaying) {
      window.soundEngine.speak("Eavesdropper intercepted qubit! Superposition destroyed and Bell tether severed!");
    }

    // Measurement by hacker collapses the superposition randomly
    this.orbAState = Math.random() < 0.5 ? 0 : 1;
    this.orbBState = Math.random() < 0.5 ? 0 : 1; // correlation broken / eavesdropped

    if (window.app) {
      window.app.showToast(`🚨 EAVESDROPPER DETECTED! Quantum No-Cloning Theorem: Interception collapsed the superposition & produced a detectable 25%+ Quantum Bit Error Rate (QBER)!`);
    }
    this.updateMath();
  }

  updateMath() {
    if (this.currentSubTab === 'tunneling') {
      const data = window.MathEngine.computeTunnelingTransmission(this.gateWidthNm);
      if (window.app) window.app.updateTelemetryModule2Tunneling(data);
    } else {
      const data = window.MathEngine.compute2QubitCircuit(this.hasHadamardA, this.hasCNOT, this.hasXB);
      data.orbA = this.orbAState;
      data.orbB = this.orbBState;
      data.isHacker = this.isHackerCompromised;
      if (window.app) window.app.updateTelemetryModule2Circuit(data);
    }
  }

  startLoop() {
    const render = () => {
      this.animTime += 0.03;
      if (this.currentSubTab === 'tunneling') {
        this.drawTunneling();
      } else {
        this.drawCircuit();
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  // ==========================================================================
  // SILICON TUNNELING ANIMATION
  // ==========================================================================
  drawTunneling() {
    const canvas = this.tunnelCanvas;
    const ctx = this.tunnelCtx;
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

    // Barrier Geometry
    // Scale width in pixels based on gateWidthNm (1 nm = 8px, 14 nm = 70px)
    const barrierPx = Math.max(6, (this.gateWidthNm / 14) * 75);
    const barrierX = w * 0.52 - barrierPx / 2;

    // Draw Source Region (Left) & Drain Region (Right)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fillRect(0, 20, barrierX, h - 40);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fillRect(barrierX + barrierPx, 20, w - (barrierX + barrierPx), h - 40);

    // Draw Potential Barrier Wall (Gate Dielectric)
    const isLeaking = this.gateWidthNm <= 2.2;
    const barrierGrad = ctx.createLinearGradient(barrierX, 0, barrierX + barrierPx, 0);
    if (isLeaking) {
      barrierGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
      barrierGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.8)');
      barrierGrad.addColorStop(1, 'rgba(239, 68, 68, 0.7)');
    } else {
      barrierGrad.addColorStop(0, 'rgba(51, 65, 85, 0.8)');
      barrierGrad.addColorStop(0.5, 'rgba(71, 85, 105, 0.9)');
      barrierGrad.addColorStop(1, 'rgba(51, 65, 85, 0.8)');
    }
    ctx.fillStyle = barrierGrad;
    ctx.fillRect(barrierX, 15, barrierPx, h - 30);
    ctx.strokeStyle = isLeaking ? '#EF4444' : '#64748B';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(barrierX, 15, barrierPx, h - 30);

    // Labels
    ctx.font = 'bold 11px var(--font-mono)';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('SOURCE (e⁻)', 20, 36);
    ctx.fillText('DRAIN', w - 65, 36);

    ctx.fillStyle = isLeaking ? '#EF4444' : '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.fillText(`GATE BARRIER (${this.gateWidthNm.toFixed(1)} nm)`, barrierX + barrierPx / 2, h - 10);
    ctx.textAlign = 'left';

    // Math transmission probability
    const mathData = window.MathEngine.computeTunnelingTransmission(this.gateWidthNm);
    const transProb = mathData.transmissionCoeff;

    // Electron particle update & draw
    this.electrons.forEach(e => {
      // Wavepacket oscillatory motion
      e.phase += 0.1;
      const waveOsc = Math.sin(e.phase) * 3;

      if (e.state === 'approaching') {
        e.x += e.vx;
        if (e.x >= barrierX - 4) {
          // At barrier boundary: decide whether to bounce or tunnel
          if (Math.random() < transProb) {
            e.state = 'tunneling';
            e.tunneled = true;
          } else {
            e.state = 'reflected';
            e.vx = -Math.abs(e.vx);
          }
        }
      } else if (e.state === 'tunneling') {
        // Ghost through barrier with high speed & fading opacity
        e.x += e.vx * 1.5;
        if (e.x > barrierX + barrierPx) {
          e.state = 'tunneled';
        }
      } else if (e.state === 'tunneled') {
        e.x += e.vx;
        if (e.x > w + 20) {
          // Recycle
          e.x = -10;
          e.y = 40 + Math.random() * (h - 80);
          e.vx = 1.8 + Math.random() * 1.2;
          e.state = 'approaching';
          e.tunneled = false;
        }
      } else if (e.state === 'reflected') {
        e.x += e.vx;
        if (e.x < -20) {
          // Recycle
          e.x = -10;
          e.y = 40 + Math.random() * (h - 80);
          e.vx = 1.8 + Math.random() * 1.2;
          e.state = 'approaching';
          e.tunneled = false;
        }
      }

      // Draw electron as glowing quantum wavepacket
      const drawY = e.y + waveOsc;
      ctx.beginPath();
      ctx.arc(e.x, drawY, e.state === 'tunneling' ? 3 : 4, 0, Math.PI * 2);
      if (e.tunneled || e.state === 'tunneling') {
        ctx.fillStyle = isLeaking ? '#EF4444' : '#F59E0B';
        ctx.shadowBlur = 10;
        ctx.shadowColor = isLeaking ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)';
      } else {
        ctx.fillStyle = '#00F2FE';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.restore();
  }

  // ==========================================================================
  // 2-QUBIT CIRCUIT & BELL PLASMA TETHER
  // ==========================================================================
  drawCircuit() {
    const canvas = this.circuitCanvas;
    const ctx = this.circuitCtx;
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

    const wireY1 = h * 0.32;
    const wireY2 = h * 0.68;

    // Draw Quantum Wires
    ctx.beginPath();
    ctx.moveTo(30, wireY1);
    ctx.lineTo(w - 110, wireY1);
    ctx.moveTo(30, wireY2);
    ctx.lineTo(w - 110, wireY2);
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wire Labels
    ctx.font = 'bold 12px var(--font-mono)';
    ctx.fillStyle = '#00F2FE';
    ctx.fillText('|0⟩_A', 10, wireY1 + 4);
    ctx.fillStyle = '#9F7AEA';
    ctx.fillText('|0⟩_B', 10, wireY2 + 4);

    // Gate Slots Coordinates
    const gateHX = 110;
    const cnotX = 210;

    // Draw Hadamard Box on Wire A
    ctx.fillStyle = this.hasHadamardA ? 'rgba(0, 242, 254, 0.2)' : 'rgba(30, 41, 59, 0.4)';
    ctx.strokeStyle = this.hasHadamardA ? '#00F2FE' : '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(gateHX - 18, wireY1 - 18, 36, 36, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 13px var(--font-mono)';
    ctx.fillStyle = this.hasHadamardA ? '#00F2FE' : '#64748B';
    ctx.textAlign = 'center';
    ctx.fillText('H', gateHX, wireY1 + 5);

    // Draw CNOT Gate (Control on Wire A, Target on Wire B)
    if (this.hasCNOT) {
      // Control Dot on Wire A
      ctx.beginPath();
      ctx.arc(cnotX, wireY1, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#00F2FE';
      ctx.fill();

      // Vertical connecting line
      ctx.beginPath();
      ctx.moveTo(cnotX, wireY1);
      ctx.lineTo(cnotX, wireY2);
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Target Circle + Cross on Wire B
      ctx.beginPath();
      ctx.arc(cnotX, wireY2, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Plus sign inside circle
      ctx.beginPath();
      ctx.moveTo(cnotX - 9, wireY2);
      ctx.lineTo(cnotX + 9, wireY2);
      ctx.moveTo(cnotX, wireY2 - 9);
      ctx.lineTo(cnotX, wireY2 + 9);
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Inactive CNOT placeholder
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cnotX, wireY1);
      ctx.lineTo(cnotX, wireY2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Output Orbs Coordinates (Alice & Bob)
    const orbX = w - 55;
    const orbAY = wireY1;
    const orbBY = wireY2;

    const isBell = this.hasHadamardA && this.hasCNOT;

    // Glowing Plasma Tether between Orbs when Entangled
    if (isBell && !this.isHackerCompromised) {
      ctx.save();
      // Glowing plasma trunk
      ctx.beginPath();
      ctx.moveTo(orbX, orbAY);
      const ctrlX = orbX - 25 + Math.sin(this.animTime * 3) * 12;
      ctx.quadraticCurveTo(ctrlX, (orbAY + orbBY) / 2, orbX, orbBY);
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00F2FE';
      ctx.stroke();

      // Inner electric arc
      ctx.beginPath();
      ctx.moveTo(orbX, orbAY);
      ctx.quadraticCurveTo(ctrlX, (orbAY + orbBY) / 2, orbX, orbBY);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Swarming plasma particles
      this.tetherParticles.forEach(p => {
        p.t = (p.t + p.speed) % 1.0;
        const curY = orbAY + (orbBY - orbAY) * p.t;
        const waveX = Math.sin(p.t * Math.PI) * p.spread + Math.sin(this.animTime * 4 + p.t * 6) * 6;
        ctx.beginPath();
        ctx.arc(orbX + waveX, curY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.t < 0.5 ? '#00F2FE' : '#9F7AEA';
        ctx.fill();
      });
    }

    // Hacker Warning on Tether if Intercepted
    if (this.isHackerCompromised) {
      ctx.beginPath();
      ctx.moveTo(orbX - 10, (orbAY + orbBY) / 2);
      ctx.lineTo(orbX + 10, (orbAY + orbBY) / 2);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = 'bold 10px var(--font-mono)';
      ctx.fillStyle = '#EF4444';
      ctx.textAlign = 'right';
      ctx.fillText('⚡ TETHER BROKEN (EAVESDROPPER)', orbX - 18, (orbAY + orbBY) / 2 + 4);
    }

    // Draw Qubit Orb A
    this.drawQubitOrb(ctx, orbX, orbAY, this.orbAState, 'Qubit A (Alice)');

    // Draw Qubit Orb B
    this.drawQubitOrb(ctx, orbX, orbBY, this.orbBState, 'Qubit B (Bob)');

    ctx.textAlign = 'left';
    ctx.restore();
  }

  drawQubitOrb(ctx, x, y, state, label) {
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);

    if (state === null) {
      // Superposition / Entangled: animated gradient
      const orbGrad = ctx.createRadialGradient(x, y, 2, x, y, 18);
      orbGrad.addColorStop(0, '#FFFFFF');
      orbGrad.addColorStop(0.5, '#00F2FE');
      orbGrad.addColorStop(1, '#9F7AEA');
      ctx.fillStyle = orbGrad;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';
    } else if (state === 0) {
      // Collapsed |0>
      ctx.fillStyle = '#00F2FE';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(0, 242, 254, 0.9)';
    } else {
      // Collapsed |1>
      ctx.fillStyle = '#9F7AEA';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(159, 122, 234, 0.9)';
    }

    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Label
    ctx.font = 'bold 10px var(--font-mono)';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(state === null ? 'ψ' : `|${state}⟩`, x, y + 4);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px var(--font-ui)';
    ctx.fillText(label, x, y - 24);
  }
}

window.module2 = new Module2();
