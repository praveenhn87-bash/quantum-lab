/* ==========================================================================
   QuantumLab OS - Quantum Mathematical Physics Engine
   Strict numerical evaluation for single & multi-qubit states, Grover search,
   and Majorana quasiparticle poisoning rates.
   ========================================================================== */

// Polyfill for CanvasRenderingContext2D.prototype.roundRect for cross-browser reliability
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    if (!radii) radii = 0;
    if (typeof radii === 'number') radii = [radii, radii, radii, radii];
    if (Array.isArray(radii)) {
      while (radii.length < 4) radii.push(radii[0] || 0);
    }
    const r0 = radii[0] || 0;
    const r1 = radii[1] || 0;
    const r2 = radii[2] || 0;
    const r3 = radii[3] || 0;

    this.moveTo(x + r0, y);
    this.lineTo(x + w - r1, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r1);
    this.lineTo(x + w, y + h - r2);
    this.quadraticCurveTo(x + w, y + h, x + w - r2, y + h);
    this.lineTo(x + r3, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r3);
    this.lineTo(x, y + r0);
    this.quadraticCurveTo(x, y, x + r0, y);
    this.closePath();
    return this;
  };
}

const MathEngine = {
  // Complex number helper
  complex: (re = 0, im = 0) => ({
    re,
    im,
    mag() { return Math.sqrt(this.re * this.re + this.im * this.im); },
    magSq() { return this.re * this.re + this.im * this.im; },
    phase() { return Math.atan2(this.im, this.re); },
    format(digits = 3) {
      const sign = this.im >= 0 ? '+' : '-';
      return `${this.re.toFixed(digits)} ${sign} ${Math.abs(this.im).toFixed(digits)}i`;
    }
  }),

  // Convert degrees to radians
  degToRad: (deg) => (deg * Math.PI) / 180,
  radToDeg: (rad) => (rad * 180) / Math.PI,

  // ==========================================================================
  // MODULE 1: SINGLE QUBIT & BLOCH SPHERE
  // ==========================================================================
  computeSingleQubit(thetaDeg, phiDeg) {
    const thetaRad = this.degToRad(thetaDeg);
    const phiRad = this.degToRad(phiDeg);

    // Amplitudes
    const alpha = Math.cos(thetaRad / 2);
    const betaReal = Math.cos(phiRad) * Math.sin(thetaRad / 2);
    const betaImag = Math.sin(phiRad) * Math.sin(thetaRad / 2);
    const betaMag = Math.sin(thetaRad / 2);

    // Probabilities
    const p0 = Math.pow(Math.cos(thetaRad / 2), 2);
    const p1 = Math.pow(Math.sin(thetaRad / 2), 2);

    // Cartesian Bloch Coordinates: (x, y, z)
    const x = Math.sin(thetaRad) * Math.cos(phiRad);
    const y = Math.sin(thetaRad) * Math.sin(phiRad);
    const z = Math.cos(thetaRad);

    // Dirac Ket string representation
    let diracKet = '';
    const alphaStr = Math.abs(alpha).toFixed(3);
    const betaStr = Math.abs(betaMag).toFixed(3);
    
    // Phase string
    let phaseStr = '';
    const phiNorm = ((phiDeg % 360) + 360) % 360;
    if (phiNorm > 1 && phiNorm < 359 && betaMag > 0.01) {
      phaseStr = `e^{i ${phiNorm.toFixed(0)}°}`;
    }

    if (Math.abs(alpha) < 0.001) {
      diracKet = `|ψ⟩ = ${phaseStr}|1⟩`;
    } else if (Math.abs(betaMag) < 0.001) {
      diracKet = `|ψ⟩ = |0⟩`;
    } else {
      diracKet = `|ψ⟩ = ${alphaStr}|0⟩ + ${betaStr}${phaseStr}|1⟩`;
    }

    return {
      thetaDeg,
      phiDeg,
      thetaRad,
      phiRad,
      alpha,
      beta: { re: betaReal, im: betaImag, mag: betaMag },
      p0: p0 * 100, // percentage
      p1: p1 * 100,
      bloch: { x, y, z },
      diracKet
    };
  },

  // Perform single quantum measurement collapse
  measureSingleQubit(thetaDeg, phiDeg) {
    const state = this.computeSingleQubit(thetaDeg, phiDeg);
    const roll = Math.random() * 100;
    const collapsedToZero = roll < state.p0;
    return {
      result: collapsedToZero ? 0 : 1,
      collapsedTheta: collapsedToZero ? 0 : 180,
      collapsedPhi: 0,
      p0: state.p0,
      p1: state.p1
    };
  },

  // Monte Carlo simulation: N shots
  runMonteCarloShots(thetaDeg, phiDeg, shots = 1000) {
    const state = this.computeSingleQubit(thetaDeg, phiDeg);
    let count0 = 0;
    let count1 = 0;
    for (let i = 0; i < shots; i++) {
      if (Math.random() * 100 < state.p0) {
        count0++;
      } else {
        count1++;
      }
    }
    return {
      shots,
      count0,
      count1,
      freq0: (count0 / shots) * 100,
      freq1: (count1 / shots) * 100,
      theoP0: state.p0,
      theoP1: state.p1
    };
  },

  // ==========================================================================
  // MODULE 2: TUNNELING & 2-QUBIT CIRCUITS
  // ==========================================================================
  // Quantum tunneling transmission coefficient through potential barrier
  computeTunnelingTransmission(barrierWidthNm) {
    // Physical approximation: T ~ exp(-2 * kappa * d)
    // For an electron with energy E ~ 0.2 eV in silicon with barrier V0 ~ 3.1 eV (SiO2)
    // kappa ~ sqrt(2 * m_eff * (V0 - E)) / hbar ~ 8.5 nm^-1
    // Below 2 nm, tunneling rises exponentially
    const kappa = 2.4; // scaled for educational visual dynamics
    const d = Math.max(0.5, barrierWidthNm);
    const transmission = Math.exp(-kappa * (d - 1.2));
    const clampedTrans = Math.min(1.0, Math.max(0.0001, transmission));

    const isLeaking = barrierWidthNm <= 2.2;
    return {
      barrierWidthNm,
      transmissionCoeff: clampedTrans,
      leakPercentage: (clampedTrans * 100).toFixed(2),
      isLeaking
    };
  },

  // 2-Qubit State Evaluation
  // Basis states: |00>, |01>, |10>, |11>
  compute2QubitCircuit(hasHadamardA, hasCNOT, hasXB = false) {
    // Initial state: |00> => [1, 0, 0, 0]
    let state = [1, 0, 0, 0]; // [c00, c01, c10, c11]

    if (hasXB) {
      // Apply X on Qubit B: |00> -> |01>, |10> -> |11>
      state = [state[1], state[0], state[3], state[2]];
    }

    if (hasHadamardA) {
      // H on Qubit A: H (x) I
      // |00> -> 1/sqrt(2)(|00> + |10>)
      // |01> -> 1/sqrt(2)(|01> + |11>)
      const invSqrt2 = 1 / Math.SQRT2;
      const c00 = state[0];
      const c01 = state[1];
      const c10 = state[2];
      const c11 = state[3];

      state = [
        invSqrt2 * (c00 + c10),
        invSqrt2 * (c01 + c11),
        invSqrt2 * (c00 - c10),
        invSqrt2 * (c01 - c11)
      ];
    }

    if (hasCNOT) {
      // CNOT: flips target (B) when control (A) is |1>
      // |00> -> |00>, |01> -> |01>, |10> -> |11>, |11> -> |10>
      const c10 = state[2];
      const c11 = state[3];
      state[2] = c11;
      state[3] = c10;
    }

    // Probabilities
    const probs = state.map(amp => Math.pow(amp, 2) * 100);

    // Is it a Bell State?
    const isBellState = hasHadamardA && hasCNOT;
    let stateName = '|00⟩';
    if (isBellState) {
      stateName = hasXB ? '|Ψ⁺⟩ = 1/√2(|01⟩ + |10⟩)' : '|Φ⁺⟩ = 1/√2(|00⟩ + |11⟩)';
    } else if (hasHadamardA) {
      stateName = '1/√2(|00⟩ + |10⟩)';
    }

    return {
      amplitudes: state,
      probabilities: probs, // [p00, p01, p10, p11]
      isEntangled: isBellState,
      stateName
    };
  },

  // ==========================================================================
  // MODULE 3: GROVER SEARCH ALGORITHM (16 BASIS STATES)
  // ==========================================================================
  initGroverAmplitudes(n = 16) {
    const uniform = 1 / Math.sqrt(n);
    return new Array(n).fill(uniform);
  },

  applyGroverOracle(amplitudes, targetIndex) {
    return amplitudes.map((amp, idx) => (idx === targetIndex ? -amp : amp));
  },

  applyGroverDiffusion(amplitudes) {
    const n = amplitudes.length;
    // Mean of amplitudes: mu = (1/N) * sum(alpha_i)
    const sum = amplitudes.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;
    // Reflection about the mean: alpha_i' = 2*mu - alpha_i
    const reflected = amplitudes.map(amp => 2 * mean - amp);
    return {
      newAmplitudes: reflected,
      mean
    };
  },

  // ==========================================================================
  // MODULE 4: MAJORANA HARDWARE & QUASIPARTICLE POISONING
  // ==========================================================================
  // Physical parameters for architectures:
  hardwareSpecs: {
    transmon: {
      name: "Standard Transmon (Superconducting)",
      material: "Aluminum / AlOx Josephson Junction",
      bulkGapMicroEv: 0, // No topological gap
      topologicalGapMicroEv: 0,
      coherenceMs: 0.05, // ~50 microseconds
      protectionType: "None (Global Decoherence)",
      shieldThicknessPx: 0,
      color: "#94A3B8"
    },
    majorana1: {
      name: "Microsoft Majorana 1 (Feb 2025)",
      material: "InAs Nanowire + Aluminum Shell (Al)",
      bulkGapMicroEv: 300,
      topologicalGapMicroEv: 40,
      coherenceMs: 8, // 1 to 12 ms
      protectionType: "Topological Parity Protection (Thin Gap)",
      shieldThicknessPx: 8,
      color: "#38BDF8"
    },
    majorana2: {
      name: "Microsoft Majorana 2 (June 2026)",
      material: "InAs/InAsSb + Heavy Lead Shell (Pb)",
      bulkGapMicroEv: 1300, // 4x increase
      topologicalGapMicroEv: 100, // >2x increase
      coherenceMs: 20000, // ~20 seconds (1000x gain!)
      protectionType: "High-Gap Lead Topological Shielding",
      shieldThicknessPx: 26,
      color: "#10B981"
    }
  },

  // Calculate Quasiparticle Poisoning Rate: Gamma ~ Gamma0 * exp(-Delta / (k_B * T))
  computeMajoranaPoisoningRate(architectureKey, temperatureMK) {
    const spec = this.hardwareSpecs[architectureKey];
    // Boltzmann constant in micro-eV / mK:
    // kB = 8.617333e-5 eV/K = 86.173 micro-eV / K = 0.08617 micro-eV / mK
    const kB = 0.08617;
    const thermalEnergy = kB * Math.max(1, temperatureMK); // in micro-eV

    if (architectureKey === 'transmon') {
      // Transmon lacks gap protection, scales directly with temp
      const errorRate = 0.15 + (temperatureMK / 150) * 0.8;
      const expectedLifetimeMs = 0.05 * Math.exp(-temperatureMK / 40);
      return {
        thermalEnergy,
        gapMicroEv: 0,
        poisoningRate: errorRate,
        expectedLifetimeMs,
        survivalProbability: Math.max(0.01, 1 - errorRate)
      };
    }

    const gap = spec.bulkGapMicroEv;
    // Poisoning rate exponential suppression:
    // Gamma = Gamma0 * exp(-Delta / (kB * T))
    // Scale Gamma0 for interactive display:
    const exponent = -gap / thermalEnergy;
    // Cap to prevent Math.exp underflow
    const rawExp = Math.exp(Math.max(-50, exponent));
    
    // Relative error rate normalized for gameplay/display
    let errorRate = 0;
    if (architectureKey === 'majorana1') {
      errorRate = Math.min(1.0, rawExp * 1e4 + (temperatureMK > 80 ? 0.3 : 0.05));
    } else {
      // Majorana 2: massive gap suppresses error by orders of magnitude
      errorRate = Math.min(1.0, rawExp * 1e2 + (temperatureMK > 120 ? 0.05 : 0.001));
    }

    // Expected survival lifetime
    const expectedLifetimeMs = spec.coherenceMs * Math.exp(-temperatureMK / (architectureKey === 'majorana2' ? 200 : 70));

    return {
      thermalEnergy,
      gapMicroEv: gap,
      poisoningRate: errorRate,
      expectedLifetimeMs,
      survivalProbability: Math.max(0.001, 1 - errorRate)
    };
  }
};

window.MathEngine = MathEngine;
