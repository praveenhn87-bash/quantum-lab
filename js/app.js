/* ==========================================================================
   QuantumLab OS - Main Application Orchestrator & Telemetry Engine
   Manages module routing, audio state, live mathematical telemetry updates,
   gamification achievements, and toast notifications.
   ========================================================================== */

class QuantumLabApp {
  constructor() {
    this.currentModuleId = 1;
    this.achievements = {
      vault: false,
      bell: false,
      oracle: false,
      topological: false
    };
  }

  init() {
    this.bindGlobalNavigation();
    this.bindHeaderControls();
    
    // Initialize all modules
    if (window.module1) { window.module1.init(); window.module1.initialized = true; }
    if (window.module2) { window.module2.init(); window.module2.initialized = true; }
    if (window.module3) { window.module3.init(); window.module3.initialized = true; }
    if (window.module4) { window.module4.init(); window.module4.initialized = true; }

    this.switchModule(1);
    window.NarratorStory.init();

    // Welcome Toast
    setTimeout(() => {
      this.showToast("🚀 QuantumLab OS v2.6 Initialized. Welcome to the Steely Optics Lab!");
    }, 400);
  }

  bindGlobalNavigation() {
    const navItems = document.querySelectorAll('.module-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const modId = parseInt(item.getAttribute('data-module'), 10);
        this.switchModule(modId);
      });
    });

    // YouTube Guided Explainer button
    const btnPlayNarrator = document.getElementById('btn-narrator-play');
    if (btnPlayNarrator) {
      btnPlayNarrator.addEventListener('click', () => {
        window.NarratorStory.togglePlayPause();
      });
    }

    const btnNextNarrator = document.getElementById('btn-narrator-next');
    if (btnNextNarrator) {
      btnNextNarrator.addEventListener('click', () => {
        window.NarratorStory.next();
      });
    }

    const btnPrevNarrator = document.getElementById('btn-narrator-prev');
    if (btnPrevNarrator) {
      btnPrevNarrator.addEventListener('click', () => {
        window.NarratorStory.prev();
      });
    }
  }

  bindHeaderControls() {
    // Audio SFX Toggle
    const btnAudio = document.getElementById('btn-toggle-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        btnAudio.innerHTML = isMuted ? '🔇 SFX Muted' : '🔊 SFX Active';
        btnAudio.classList.toggle('active', !isMuted);
      });
    }

    // Voice Narration Toggle
    const btnVoice = document.getElementById('btn-toggle-voice');
    if (btnVoice) {
      btnVoice.addEventListener('click', () => {
        const isVoiceOn = window.soundEngine.toggleVoice();
        btnVoice.innerHTML = isVoiceOn ? '🎙️ Voice Narration: ON' : '🔇 Voice Narration: OFF';
        btnVoice.classList.toggle('active', isVoiceOn);
        window.soundEngine.playClick();
      });
    }

    // Ambient Cleanroom Drone Toggle
    const btnAmbient = document.getElementById('btn-toggle-ambient');
    if (btnAmbient) {
      btnAmbient.addEventListener('click', () => {
        const isAmbientOn = window.soundEngine.toggleAmbient();
        btnAmbient.innerHTML = isAmbientOn ? '🎧 Lab Ambient: ON' : '🎧 Lab Ambient: OFF';
        btnAmbient.classList.toggle('active', isAmbientOn);
        window.soundEngine.playClick();
      });
    }

    // Interactive Mode Toggle
    const btnVeritasium = document.getElementById('btn-toggle-veritasium');
    if (btnVeritasium) {
      btnVeritasium.addEventListener('click', () => {
        window.NarratorStory.togglePlayPause();
      });
    }
  }

  switchModule(modId) {
    if (this.currentModuleId === modId) return;
    this.currentModuleId = modId;
    window.soundEngine.playClick();

    // Update Nav UI
    document.querySelectorAll('.module-nav-item').forEach(item => {
      const id = parseInt(item.getAttribute('data-module'), 10);
      item.classList.toggle('active', id === modId);
    });

    // Update Viewport Sections
    for (let i = 1; i <= 4; i++) {
      const section = document.getElementById(`module-view-${i}`);
      if (section) {
        section.style.display = i === modId ? 'flex' : 'none';
      }
    }

    // Update Narrator to new story
    window.NarratorStory.setModule(modId);

    // Refresh telemetry immediately
    if (modId === 1 && window.module1) window.module1.updateMath();
    if (modId === 2 && window.module2) window.module2.updateMath();
    if (modId === 3 && window.module3) window.module3.updateMath();
    if (modId === 4 && window.module4) window.module4.updateMath();
  }

  initModule(modId) {
    if (modId === 1 && window.module1 && !window.module1.initialized) {
      window.module1.init();
      window.module1.initialized = true;
    } else if (modId === 2 && window.module2 && !window.module2.initialized) {
      window.module2.init();
      window.module2.initialized = true;
    } else if (modId === 3 && window.module3 && !window.module3.initialized) {
      window.module3.init();
      window.module3.initialized = true;
    } else if (modId === 4 && window.module4 && !window.module4.initialized) {
      window.module4.init();
      window.module4.initialized = true;
    }

    // Force telemetry refresh
    if (modId === 1 && window.module1) window.module1.updateMath();
    if (modId === 2 && window.module2) window.module2.updateMath();
    if (modId === 3 && window.module3) window.module3.updateMath();
    if (modId === 4 && window.module4) window.module4.updateMath();
  }

  // ==========================================================================
  // RIGHT PANEL: LIVE TELEMETRY UPDATERS (0ms Lag)
  // ==========================================================================

  // Module 1 Telemetry (Single Qubit)
  updateTelemetryModule1(data) {
    if (this.currentModuleId !== 1) return;

    // Dirac Ket Display
    const diracEl = document.getElementById('telemetry-dirac');
    if (diracEl) {
      diracEl.innerHTML = `
        <span class="math-highlight-cyan">${data.alpha.toFixed(3)}</span>|0⟩ + 
        <span class="math-highlight-purple">${data.beta.mag.toFixed(3)}</span>${data.phiDeg > 0 ? `e^{i ${data.phiDeg.toFixed(0)}°}` : ''}|1⟩
      `;
    }

    // Unitary Matrix (Current state representation: density matrix or coordinates)
    const matrixBox = document.getElementById('telemetry-matrix-box');
    if (matrixBox) {
      matrixBox.innerHTML = `
        <div class="matrix-bracket-wrapper">
          <div class="matrix-grid dim-2">
            <div class="matrix-cell math-highlight-cyan">${(data.p0 / 100).toFixed(3)}</div>
            <div class="matrix-cell">${(data.alpha * data.beta.re).toFixed(3)}</div>
            <div class="matrix-cell">${(data.alpha * data.beta.re).toFixed(3)}</div>
            <div class="matrix-cell math-highlight-purple">${(data.p1 / 100).toFixed(3)}</div>
          </div>
        </div>
        <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 0.3rem;">Density Matrix ρ = |ψ⟩⟨ψ|</div>
      `;
    }

    // Probability Bars
    const probBox = document.getElementById('telemetry-prob-box');
    if (probBox) {
      probBox.innerHTML = `
        <div class="prob-item">
          <div class="prob-meta">
            <span style="color: var(--accent-cyan);">P(|0⟩) = cos²(θ/2)</span>
            <span style="color: var(--accent-cyan); font-weight: 700;">${data.p0.toFixed(1)}%</span>
          </div>
          <div class="prob-bar-track">
            <div class="prob-bar-fill cyan" style="width: ${data.p0}%;"></div>
          </div>
        </div>
        <div class="prob-item">
          <div class="prob-meta">
            <span style="color: var(--accent-purple);">P(|1⟩) = sin²(θ/2)</span>
            <span style="color: var(--accent-purple); font-weight: 700;">${data.p1.toFixed(1)}%</span>
          </div>
          <div class="prob-bar-track">
            <div class="prob-bar-fill purple" style="width: ${data.p1}%;"></div>
          </div>
        </div>
      `;
    }

    // Stats Grid
    const statsBox = document.getElementById('telemetry-stats-box');
    if (statsBox) {
      statsBox.innerHTML = `
        <div class="stat-box">
          <span class="stat-label">Bloch Vector [x, y, z]</span>
          <span class="stat-value" style="font-size: 0.75rem;">[${data.bloch.x.toFixed(2)}, ${data.bloch.y.toFixed(2)}, ${data.bloch.z.toFixed(2)}]</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Complex Amplitude β</span>
          <span class="stat-value" style="font-size: 0.72rem; color: var(--accent-purple);">${data.beta.re.toFixed(2)} + ${data.beta.im.toFixed(2)}i</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Quantum Superposition</span>
          <span class="stat-value" style="color: var(--accent-cyan);">${(data.p0 > 5 && data.p1 > 5) ? 'ACTIVE' : 'COLLAPSED'}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Phase Coherence</span>
          <span class="stat-value" style="color: var(--accent-emerald);">100% PURE</span>
        </div>
      `;
    }
  }

  // Module 2 Telemetry (Silicon Tunneling)
  updateTelemetryModule2Tunneling(data) {
    if (this.currentModuleId !== 2 || window.module2.currentSubTab !== 'tunneling') return;

    const diracEl = document.getElementById('telemetry-dirac');
    if (diracEl) {
      diracEl.innerHTML = `
        <span>Wavefunction: ψ(x) ∝ e^{-κ x}</span>
      `;
    }

    const matrixBox = document.getElementById('telemetry-matrix-box');
    if (matrixBox) {
      matrixBox.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.5;">
          <div>Transmission Coeff: <b>T ≈ exp(-2κd)</b></div>
          <div style="color: var(--text-dim); margin-top: 0.25rem;">Barrier Width: <b>${data.barrierWidthNm.toFixed(1)} nm</b></div>
          <div style="color: ${data.isLeaking ? 'var(--accent-crimson)' : 'var(--accent-emerald)'}; font-weight: 700;">
            Tunneling Leakage: ${data.leakPercentage}%
          </div>
        </div>
      `;
    }

    const probBox = document.getElementById('telemetry-prob-box');
    if (probBox) {
      const leak = parseFloat(data.leakPercentage);
      const reflect = Math.max(0, 100 - leak);
      probBox.innerHTML = `
        <div class="prob-item">
          <div class="prob-meta">
            <span style="color: var(--accent-cyan);">Reflected (Classical)</span>
            <span style="color: var(--accent-cyan); font-weight: 700;">${reflect.toFixed(1)}%</span>
          </div>
          <div class="prob-bar-track">
            <div class="prob-bar-fill cyan" style="width: ${reflect}%;"></div>
          </div>
        </div>
        <div class="prob-item">
          <div class="prob-meta">
            <span style="color: var(--accent-crimson);">Tunneling Leakage</span>
            <span style="color: var(--accent-crimson); font-weight: 700;">${leak.toFixed(1)}%</span>
          </div>
          <div class="prob-bar-track">
            <div class="prob-bar-fill" style="width: ${leak}%; background: var(--accent-crimson);"></div>
          </div>
        </div>
      `;
    }

    const statsBox = document.getElementById('telemetry-stats-box');
    if (statsBox) {
      statsBox.innerHTML = `
        <div class="stat-box">
          <span class="stat-label">Classical Limit Status</span>
          <span class="stat-value" style="color: ${data.isLeaking ? 'var(--accent-crimson)' : 'var(--accent-emerald)'};">
            ${data.isLeaking ? 'BREACHED' : 'SAFE'}
          </span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Sub-3nm Moore's Wall</span>
          <span class="stat-value" style="color: var(--accent-amber);">QUANTUM REGIME</span>
        </div>
      `;
    }
  }

  // Module 2 Telemetry (2-Qubit Circuit)
  updateTelemetryModule2Circuit(data) {
    if (this.currentModuleId !== 2 || window.module2.currentSubTab !== 'circuit') return;

    const diracEl = document.getElementById('telemetry-dirac');
    if (diracEl) {
      diracEl.innerHTML = `<span class="math-highlight-cyan">${data.stateName}</span>`;
    }

    const matrixBox = document.getElementById('telemetry-matrix-box');
    if (matrixBox) {
      matrixBox.innerHTML = `
        <div style="font-size: 0.7rem; color: var(--text-dim); margin-bottom: 0.3rem;">CNOT Unitary Matrix U_CNOT (4x4):</div>
        <div class="matrix-bracket-wrapper">
          <div class="matrix-grid dim-4">
            <div class="matrix-cell math-highlight-cyan">1</div><div class="matrix-cell">0</div><div class="matrix-cell">0</div><div class="matrix-cell">0</div>
            <div class="matrix-cell">0</div><div class="matrix-cell math-highlight-cyan">1</div><div class="matrix-cell">0</div><div class="matrix-cell">0</div>
            <div class="matrix-cell">0</div><div class="matrix-cell">0</div><div class="matrix-cell">0</div><div class="matrix-cell math-highlight-purple">1</div>
            <div class="matrix-cell">0</div><div class="matrix-cell">0</div><div class="matrix-cell math-highlight-purple">1</div><div class="matrix-cell">0</div>
          </div>
        </div>
      `;
    }

    const probBox = document.getElementById('telemetry-prob-box');
    if (probBox) {
      const labels = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];
      const colors = ['cyan', 'purple', 'emerald', 'purple'];
      probBox.innerHTML = data.probabilities.map((p, i) => `
        <div class="prob-item">
          <div class="prob-meta">
            <span>P(${labels[i]})</span>
            <span style="font-weight: 700;">${p.toFixed(1)}%</span>
          </div>
          <div class="prob-bar-track">
            <div class="prob-bar-fill ${colors[i]}" style="width: ${p}%;"></div>
          </div>
        </div>
      `).join('');
    }

    const statsBox = document.getElementById('telemetry-stats-box');
    if (statsBox) {
      statsBox.innerHTML = `
        <div class="stat-box">
          <span class="stat-label">Bell Entanglement</span>
          <span class="stat-value" style="color: ${data.isEntangled ? 'var(--accent-cyan)' : 'var(--text-dim)'};">
            ${data.isEntangled ? 'MAXIMAL (1.00)' : 'NONE (0.00)'}
          </span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Security (QBER)</span>
          <span class="stat-value" style="color: ${data.isHacker ? 'var(--accent-crimson)' : 'var(--accent-emerald)'};">
            ${data.isHacker ? 'COMPROMISED (33%)' : 'SECURE (0.0%)'}
          </span>
        </div>
      `;
    }
  }

  // Module 3 Telemetry (Grover Wave Equalizer)
  updateTelemetryModule3(data) {
    if (this.currentModuleId !== 3) return;

    const diracEl = document.getElementById('telemetry-dirac');
    if (diracEl) {
      diracEl.innerHTML = `
        <span>Target: <b>|${data.targetBin}⟩</b> (α = <span class="math-highlight-amber">${data.targetAmp.toFixed(3)}</span>)</span>
      `;
    }

    const matrixBox = document.getElementById('telemetry-matrix-box');
    if (matrixBox) {
      matrixBox.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.5;">
          <div>Grover Diffusion: <b>D = 2|s⟩⟨s| - I</b></div>
          <div style="color: var(--accent-amber); margin-top: 0.2rem;">Mean Amplitude μ: <b>${data.mean.toFixed(3)}</b></div>
          <div style="color: var(--text-dim); margin-top: 0.2rem;">Reflection Formula: <b>α_i' = 2μ - α_i</b></div>
        </div>
      `;
    }

    const probBox = document.getElementById('telemetry-prob-box');
    if (probBox) {
      const targetP = Math.min(100, Math.max(0, data.targetProb));
      const otherP = Math.max(0, 100 - targetP);
      probBox.innerHTML = `
        <div class="prob-item">
          <div class="prob-meta">
            <span style="color: var(--accent-amber);">Target |${data.targetBin}⟩ Probability</span>
            <span style="color: var(--accent-amber); font-weight: 700;">${targetP.toFixed(1)}%</span>
          </div>
          <div class="prob-bar-track">
            <div class="prob-bar-fill amber" style="width: ${targetP}%;"></div>
          </div>
        </div>
        <div class="prob-item">
          <div class="prob-meta">
            <span style="color: var(--text-dim);">Remaining 15 Non-Targets</span>
            <span style="color: var(--text-dim); font-weight: 700;">${otherP.toFixed(1)}%</span>
          </div>
          <div class="prob-bar-track">
            <div class="prob-bar-fill" style="width: ${otherP}%; background: rgba(100, 116, 139, 0.5);"></div>
          </div>
        </div>
      `;
    }

    const statsBox = document.getElementById('telemetry-stats-box');
    if (statsBox) {
      statsBox.innerHTML = `
        <div class="stat-box">
          <span class="stat-label">Grover Iterations</span>
          <span class="stat-value" style="color: var(--accent-amber);">${data.iterations} / ${data.quantumOptimal}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Speedup Factor</span>
          <span class="stat-value" style="color: var(--accent-cyan); font-size: 0.8rem;">O(√N) vs O(N)</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Classical Search</span>
          <span class="stat-value" style="color: var(--text-dim);">Up to 16 Checks</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Quantum Search</span>
          <span class="stat-value" style="color: var(--accent-emerald);">3 Steps (96.1%)</span>
        </div>
      `;
    }
  }

  // Module 4 Telemetry (Majorana Hardware Simulator)
  updateTelemetryModule4(data) {
    if (this.currentModuleId !== 4) return;

    const diracEl = document.getElementById('telemetry-dirac');
    if (diracEl) {
      diracEl.innerHTML = `
        <span>MZM Operators: {γ_i, γ_j} = 2δ_ij, γ_i† = γ_i</span>
      `;
    }

    const matrixBox = document.getElementById('telemetry-matrix-box');
    if (matrixBox) {
      matrixBox.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.73rem; line-height: 1.5;">
          <div>Poisoning Rate: <b>Γ_p ∝ exp(-Δ / k_B T)</b></div>
          <div style="color: var(--text-dim); margin-top: 0.2rem;">Thermal Energy k_B T: <b>${data.thermalEnergy.toFixed(2)} μeV</b></div>
          <div style="color: ${data.spec.color}; margin-top: 0.2rem;">Bulk Gap Δ: <b>${data.spec.bulkGapMicroEv} μeV</b></div>
        </div>
      `;
    }

    const probBox = document.getElementById('telemetry-prob-box');
    if (probBox) {
      const survivalPct = (data.survivalProbability * 100).toFixed(1);
      const errorPct = (data.poisoningRate * 100).toFixed(1);
      probBox.innerHTML = `
        <div class="prob-item">
          <div class="prob-meta">
            <span style="color: ${data.spec.color};">Topological Parity Survival</span>
            <span style="color: ${data.spec.color}; font-weight: 700;">${survivalPct}%</span>
          </div>
          <div class="prob-bar-track">
            <div class="prob-bar-fill" style="width: ${survivalPct}%; background: ${data.spec.color};"></div>
          </div>
        </div>
        <div class="prob-item">
          <div class="prob-meta">
            <span style="color: var(--accent-crimson);">Quasiparticle Poisoning Rate</span>
            <span style="color: var(--accent-crimson); font-weight: 700;">${errorPct}%</span>
          </div>
          <div class="prob-bar-track">
            <div class="prob-bar-fill" style="width: ${errorPct}%; background: var(--accent-crimson);"></div>
          </div>
        </div>
      `;
    }

    // Side-by-Side Comparison Table
    const statsBox = document.getElementById('telemetry-stats-box');
    if (statsBox) {
      statsBox.innerHTML = `
        <div style="grid-column: span 2;">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Hardware Architecture</th>
                <th>Bulk Gap</th>
                <th>Coherence Lifetime</th>
              </tr>
            </thead>
            <tbody>
              <tr class="${data.architecture === 'transmon' ? 'active-row' : ''}">
                <td style="color: #94A3B8;">Standard Transmon</td>
                <td>0 μeV</td>
                <td>~50 μs</td>
              </tr>
              <tr class="${data.architecture === 'majorana1' ? 'active-row' : ''}">
                <td style="color: #38BDF8;">Majorana 1 (Al - 2025)</td>
                <td>300 μeV</td>
                <td>1 – 12 ms</td>
              </tr>
              <tr class="${data.architecture === 'majorana2' ? 'active-row' : ''}">
                <td style="color: #10B981; font-weight: 700;">Majorana 2 (Pb - 2026)</td>
                <td style="color: #10B981; font-weight: 700;">1,300 μeV</td>
                <td style="color: #10B981; font-weight: 700;">~20 Seconds (1000x)</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 0.6rem; font-size: 0.72rem; color: var(--accent-emerald);">
            Fault-Tolerant Commercial Target: <b>Accelerated 2033 ➔ 2029</b>
          </div>
        </div>
      `;
    }
  }

  // Gamification & Badges
  unlockAchievement(key, name) {
    if (this.achievements[key]) return;
    this.achievements[key] = true;

    const badgeSlot = document.getElementById(`badge-${key}`);
    if (badgeSlot) {
      badgeSlot.classList.add('achieved');
    }

    const modBadge = document.getElementById(`module-${key}-badge`);
    if (modBadge) {
      modBadge.classList.add('unlocked');
      modBadge.textContent = 'CLEARED';
    }

    this.showToast(`🏆 ACHIEVEMENT UNLOCKED: ${name}!`);
  }

  // Toast Notifications
  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }
}

window.app = new QuantumLabApp();

window.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
