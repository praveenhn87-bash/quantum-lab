# QuantumLab OS & QuantumQuest: Dual-Edition Learning & Research Lab

> **Dual-Mode Interactive Quantum Computing Explorer**  
> Features both the **Easy Mode (Interactive & Gamified)** (everyday metaphors, coin spins, ghost walls, telepathic dice, 16-chest treasure hunts, and badges) and the **University Scientific Research Edition** (3D Bloch Sphere, Dirac bra-kets, Bell state circuits, 16-state Grover oracle, and Microsoft Majorana 1 & 2 topological nanowires).

---

## 🌟 Dual-Edition Switcher (Available at the Top of the Page)

Visitors can toggle between two tailored learning experiences at any time with a single click:

* 🎓 **Easy Mode (Easy / Gamified):**
  - **Level 1 (The Spinning Coin):** A coin in mid-air is in Superposition (Heads & Tails at once!). Slap hand down to measure it.
  - **Level 2 (Ghost Electron & Magic Dice):** Why laptops heat up from 1nm ghost electron tunneling; roll telepathic dice linked between Delhi and London that catch eavesdroppers.
  - **Level 3 (16-Chest Treasure Hunt):** Grover's search algorithm that finds the golden key in 3 clicks instead of 16 tries.
  - **Level 4 (The Unbreakable Knot):** 30-second survival challenge comparing fragile regular qubits vs braided Majorana topological knots.
  - **Audio & Trophies:** Dr. Maya's friendly spoken science teacher voice, synthesized sound effects, step-by-step guides, and 7 unlockable badges!

* 🔬 **QuantumLab OS (Scientific / University Research Edition):**
  - **Module 1:** 3D Bloch Sphere orbit, polar angles $(\theta, \phi)$, dual sine wave interference, Monte Carlo 1,000-shot Born rule histogram, Quantum Laser Lock game.
  - **Module 2:** Silicon transistor tunneling barrier Hamiltonian calculation, 2-qubit Bell circuit $|\Phi^+\rangle$, density matrix $\rho$, entanglement fidelity, and eavesdropper interception.
  - **Module 3:** 16-state Grover quantum oracle with diffusion operator $D = 2|s\rangle\langle s| - I$ and phase inversion about the mean.
  - **Module 4:** Microsoft Majorana 1 (2025) & Majorana 2 (2026) H-shaped Tetron topological nanowire canvas with 4 MZMs, parity check, quasiparticle poisoning rate $\Gamma \propto \exp(-\Delta/k_BT)$, and materials science deep dive.


### 🎨 Design System: "Steely Optics Lab / Cleanroom Dark Mode"
- **Backgrounds:** Deep Obsidian (`#090D16`), Frosted Slate Cards (`rgba(21, 29, 42, 0.85)`) with `backdrop-filter: blur(12px)` and subtle `1px solid #1E293B` borders.
- **Accents:** Laser Cyan (`#00F2FE`) for $|0\rangle$ and constructive interference waves, Photon Purple (`#9F7AEA`) for $|1\rangle$ and phase, Emerald Green (`#10B981`) for Topological Protection, Crimson (`#EF4444`) for Decoherence/Noise, and Gold/Amber (`#F59E0B`) for Target States.
- **Typography:** Geometric Sans-Serif (`Inter`) for crisp UI controls and `JetBrains Mono` for live Dirac ket notation and mathematical matrices.
- **Sound Design:** Built-in Web Audio API synthesizer for tactile UI clicks, wave collapse snaps, laser lock chimes, tunneling sweeps, and topological shield deflection pings—with zero external audio file dependencies.

---

## 🏛 3-Pane Mission Control Layout

```
+--------------------------------------------------------------------------------------------------+
| TOP HEADER: Brand Logo | Version v2.6 Topological | Status Dot | Audio Toggle | Veritasium Tour   |
+----------------------+----------------------------------------------------+----------------------+
| LEFT SIDEBAR (20%)   | CENTER VIEWPORT (50%)                              | RIGHT PANEL (30%)    |
|                      |                                                    |                      |
| • Story Narrator Bar | • Active Module Canvas                             | • 0ms Lag Telemetry  |
|   (Veritasium Mode)  |   - 3D Bloch Sphere & Drag Orbit Controls          | • Active Dirac Ket   |
| • 4 Simulation Tabs  |   - Dual Wave Interference Strip                   | • Unitary Matrices   |
| • Gamification       |   - Transistor Barrier Tunneling                   | • Probability Bars   |
|   Achievement Badges |   - Bell State Plasma Tether                       | • Hardware Metrics   |
|                      |   - 16-State Grover Wave Equalizer                 | • Comparison Tables  |
|                      |   - Tetron Nanowire Topological Shield             |                      |
+----------------------+----------------------------------------------------+----------------------+
```

---

## 🔬 The 4 Interactive Modules

### Module 1: Superposition, Phase & The Bloch Sphere ("The Quantum Vault Game")
- **3D Wireframe Bloch Sphere:** Interactive Canvas 3D projection engine with click-and-drag mouse orbit rotation. Displays axes $X, Y, Z$, state poles $|0\rangle, |1\rangle, |+\rangle, |-\rangle$, and a glowing state vector pointing to $(\theta, \phi)$ with planar drop-lines.
- **Dual Wave Interference Strip:** Plots real-time sine waves for $\alpha(t)$ and $\beta(t)$, illustrating how the azimuthal phase $\phi$ alters the phase shift between waves without altering measurement probabilities.
- **Continuous Sliders & Gates:** Sliders for Polar Angle $\theta$ ($0^\circ - 180^\circ$) and Phase $\phi$ ($0^\circ - 360^\circ$); Quick Gate buttons for `Pauli-X`, `Hadamard`, `Pauli-Z`, and `Reset |0⟩`.
- **Measurement Engine:** `Measure 1x` performs instantaneous wavefunction collapse to $|0\rangle$ or $|1\rangle$; `Run 1,000 Quantum Shots` animates a live Monte Carlo histogram converging on Born Rule theoretical odds.
- **Mini-Game ("Quantum Laser Lock"):** Align the qubit state vector to 75% $|0\rangle$ and 25% $|1\rangle$ with a $90^\circ$ phase shift ($\theta = 60^\circ, \phi = 90^\circ$) to unlock the security vault and earn the **Keymaster Badge**.

### Module 2: Entanglement, Tunneling & 2-Qubit Circuits ("Spooky Tether Lab")
- **Sub-Tab A: Silicon Transistor Barrier Tunneling (Why We Need Quantum):**
  - Continuous slider for `Transistor Gate Width` from 14 nm down to 1 nm.
  - Animated Schrödinger wavepackets (electrons) approaching the gate dielectric. Above 3 nm, electrons bounce back cleanly. Below 2 nm, electrons ghost/tunnel through the solid barrier ($T \approx e^{-2\kappa d}$), triggering the alarm: *"Classical Silicon Limit Reached: Electrons are Tunneling!"*
- **Sub-Tab B: 2-Qubit Entanglement Circuit & Eavesdropper Defense:**
  - Interactive 2-wire circuit with toggleable Hadamard gate on Qubit A and CNOT gate between Qubit A and B.
  - When entangled in the Bell State $|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$, a glowing plasma tether with swarming quantum particles links Alice and Bob.
  - `Measure Qubit A` demonstrates instantaneous correlated collapse of Qubit B across any distance.
  - `Simulate Hacker Interception (No-Cloning Test)` reveals how intercepting the state in transit breaks the superposition and causes a detectable $>25\%$ Quantum Bit Error Rate (QBER).

### Module 3: Quantum Interference & Grover's Algorithm ("Wave Equalizer")
- **16-State Bar Chart Canvas:** Displays basis states $|0000\rangle$ through $|1111\rangle$ with a central zero-axis, allowing amplitudes to grow upward (positive phase) or downward (negative phase).
- **Interactive Target Selection:** Click any bar to designate it as the secret gold target state.
- **Interactive 3-Step Execution:**
  1. `1. Initialize Uniform Superposition (H⊗4)`: Sets all 16 states to equal amplitude $\alpha_i = +0.25$ ($6.25\%$ probability each).
  2. `2. Apply Quantum Oracle (Phase Flip)`: Inverts *only* the secret target bar upside down to $-0.25$ without revealing it.
  3. `3. Apply Grover Diffusion (Invert About Mean)`: Computes the mean amplitude $\mu$, reflects all bars across $\mu$ ($\alpha_i' = 2\mu - \alpha_i$), causing the inverted target to rebound skyward while wrong states shrink.
- **Quadratic Speedup:** Demonstrates how Grover's algorithm finds the target in only $\lfloor \frac{\pi}{4}\sqrt{16} \rfloor = 3$ iterations ($96.1\%$ probability) versus up to 16 classical checks.

### Module 4: Microsoft Majorana 1 vs. Majorana 2 Hardware Simulator ("Topological Shield")
- **The "H-Shaped" Tetron Topological Nanowire:** Microscopic schematic showing Microsoft's Indium Arsenide (InAs) semiconductor core clad in a superconductor shell, with 4 glowing Majorana Zero Modes (MZMs: $\gamma_1, \gamma_2, \gamma_3, \gamma_4$) pinned at the corners.
- **Quasiparticle Poisoning Collision Dynamics:** Red stray thermal noise particles fly in from the edges trying to break Cooper pairs.
- **Hardware Architecture Selector:**
  1. `Standard Transmon`: No topological gap protection, rapid microsecond decoherence.
  2. `Microsoft Majorana 1 (Feb 2025 - Aluminum)`: Thin $300\ \mu\text{eV}$ bulk gap, occasional shield breaches, coherence/parity lifetime of 1–12 milliseconds.
  3. `Microsoft Majorana 2 (June 2026 - Lead Upgrade)`: Atomic upgrade animation swaps Aluminum to Heavy Lead (Pb). Bulk energy gap expands 4x to $1,300\ \mu\text{eV}$; incoming thermal noise bounces harmlessly away! Live survival stopwatch jumps $1,000\times$ to **~20 Seconds**, accelerating Microsoft's fault-tolerant commercial roadmap from **2033 to 2029**.
- **Deep Dive Reality Check Modal:** In-depth breakdown comparing the materials breakthrough (AI-accelerated epitaxial Lead growth via Microsoft Discovery AI) against the scientific standard (why non-Abelian braiding validation remains the ultimate benchmark).

---

## 🚀 Running the Application

This is a 100% self-contained web application with zero external runtime dependencies:
1. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).
2. Or serve it via any static file server:
   ```bash
   # Windows PowerShell simple server or any static server
   npx serve .
   ```
3. Click the top header **🎓 Veritasium Mode** or the **▶ Play Guided Explainer** button to experience the automated documentary walkthrough!
