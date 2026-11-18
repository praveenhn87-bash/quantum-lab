/**
 * QuantumQuest: 10th-Class Explorer & Game Lab
 * Main Application Coordinator
 */

class StudentLabApp {
  constructor() {
    this.currentLevel = 1;
    this.isStudentMode = true; // Default true!
    this.unlockedBadges = new Set();

    this.init();
  }

  init() {
    // 1. Initialize Sub-modules
    window.level1 = new window.Level1SpinningCoin();
    window.level2 = new window.Level2GhostAndDice();
    window.level3 = new window.Level3TreasureHunt();
    window.level4 = new window.Level4TopologicalShield();
    window.narrator = new window.StudentNarrator();

    // 2. Bind Header Controls
    this.bindGlobalControls();
    this.bindLevelTabs();

    // 3. Set Initial View
    this.switchLevel(1);
    this.setMode(true);
  }

  bindGlobalControls() {
    // Mode Switch: Student vs Scientist
    const btnStudent = document.getElementById('mode-btn-student');
    const btnScientist = document.getElementById('mode-btn-scientist');

    if (btnStudent && btnScientist) {
      btnStudent.addEventListener('click', () => {
        this.setMode(true);
      });
      btnScientist.addEventListener('click', () => {
        this.setMode(false);
      });
    }

    // Audio Buttons
    const btnSFX = document.getElementById('btn-toggle-sfx');
    const btnVoice = document.getElementById('btn-toggle-voice');
    const btnAmbient = document.getElementById('btn-toggle-ambient');

    if (btnSFX) {
      btnSFX.addEventListener('click', () => {
        window.labAudio.isSFXEnabled = !window.labAudio.isSFXEnabled;
        btnSFX.classList.toggle('active', window.labAudio.isSFXEnabled);
        btnSFX.innerHTML = window.labAudio.isSFXEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
      });
    }

    if (btnVoice) {
      btnVoice.addEventListener('click', () => {
        window.labAudio.isVoiceEnabled = !window.labAudio.isVoiceEnabled;
        btnVoice.classList.toggle('active', window.labAudio.isVoiceEnabled);
        btnVoice.innerHTML = window.labAudio.isVoiceEnabled ? '🎙️ Teacher Voice: ON' : '🔇 Voice: OFF';
        if (!window.labAudio.isVoiceEnabled) window.labAudio.stopVoice();
      });
    }

    if (btnAmbient) {
      btnAmbient.addEventListener('click', () => {
        window.labAudio.toggleAmbient();
        btnAmbient.classList.toggle('active', window.labAudio.isAmbientEnabled);
        btnAmbient.innerHTML = window.labAudio.isAmbientEnabled ? '🎧 Lab Hum: ON' : '🎧 Lab Hum: OFF';
      });
    }

    // Banner Play Tour button
    const bannerTourBtn = document.getElementById('banner-play-tour-btn');
    if (bannerTourBtn) {
      bannerTourBtn.addEventListener('click', () => {
        if (window.narrator) window.narrator.togglePlay();
      });
    }
  }

  setMode(isStudent) {
    this.isStudentMode = isStudent;
    const btnStudent = document.getElementById('mode-btn-student');
    const btnScientist = document.getElementById('mode-btn-scientist');

    if (btnStudent && btnScientist) {
      btnStudent.classList.toggle('active', isStudent);
      btnScientist.classList.toggle('active', !isStudent);
    }

    // Toggle advanced math views
    const scienceElems = document.querySelectorAll('.science-mode-only');
    scienceElems.forEach(el => {
      el.style.display = isStudent ? 'none' : 'block';
    });

    const studentElems = document.querySelectorAll('.student-mode-only');
    studentElems.forEach(el => {
      el.style.display = isStudent ? 'block' : 'none';
    });

    window.labAudio.playCoinSpin();
  }

  bindLevelTabs() {
    const tabs = document.querySelectorAll('.level-nav-ribbon .level-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const lvlStr = tab.getAttribute('data-level');
        if (!lvlStr) return;
        const lvl = parseInt(lvlStr, 10);
        if (!isNaN(lvl)) {
          this.switchLevel(lvl);
        }
      });
    });
  }

  switchLevel(lvl) {
    if (isNaN(lvl) || lvl < 1 || lvl > 4) return;
    this.currentLevel = lvl;

    // Update Tab Styles
    const tabs = document.querySelectorAll('.level-nav-ribbon .level-tab');
    tabs.forEach(tab => {
      const tabLvl = parseInt(tab.getAttribute('data-level'), 10);
      tab.classList.toggle('active', tabLvl === lvl);
    });

    // Toggle Level Views
    for (let i = 1; i <= 4; i++) {
      const view = document.getElementById(`level-view-${i}`);
      if (view) {
        view.style.display = (i === lvl) ? 'flex' : 'none';
      }
    }

    // Update Banner Titles
    this.updateBannerForLevel(lvl);

    // Update Narrator
    if (window.narrator) {
      window.narrator.setLevel(lvl);
    }

    // Trigger canvas resizing for new active tab
    setTimeout(() => {
      if (lvl === 1 && window.level1) window.level1.resize();
      if (lvl === 2 && window.level2) window.level2.resize();
      if (lvl === 3 && window.level3) window.level3.resize();
      if (lvl === 4 && window.level4) window.level4.resize();
    }, 50);
  }

  updateBannerForLevel(lvl) {
    const titleEl = document.getElementById('banner-level-title');
    const descEl = document.getElementById('banner-level-desc');

    const meta = {
      1: {
        title: "🪙 Level 1: The Spinning Coin (Superposition & Measurement)",
        desc: "Learn why a quantum particle is like a spinning coin—it holds both Heads (0) and Tails (1) at the same time until you slap your hand down!"
      },
      2: {
        title: "👻 Level 2: The Ghost Electron & Telepathic Magic Dice",
        desc: "Watch electrons leak through wafer-thin barriers like ghosts (Tunneling), and roll magic dice linked across the globe that detect spies instantly (Entanglement)!"
      },
      3: {
        title: "🗝️ Level 3: The 16-Chest Treasure Hunt (Grover's Quantum Search)",
        desc: "A normal computer checks locked chests one by one. Watch Grover's algorithm echo and amplify the winning chest to 96% in only 3 quantum steps!"
      },
      4: {
        title: "🛡️ Level 4: The Unbreakable Knot (Majorana Topological Qubit)",
        desc: "Normal qubits die in seconds from heat. See how splitting a quantum particle into a braided rope knot creates an unbreakable shield against noise!"
      }
    };

    if (titleEl && meta[lvl]) titleEl.innerHTML = meta[lvl].title;
    if (descEl && meta[lvl]) descEl.innerHTML = meta[lvl].desc;
  }

  unlockBadge(badgeId) {
    if (this.unlockedBadges.has(badgeId)) return;
    this.unlockedBadges.add(badgeId);

    const badgeElem = document.getElementById(badgeId);
    if (badgeElem) {
      badgeElem.classList.add('unlocked');
      window.labAudio.playChestOpen();
    }
  }
}

// Boot application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.studentApp = new StudentLabApp();
  window.labApp = window.studentApp;
});
