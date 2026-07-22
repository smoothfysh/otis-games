/* kidsgames/scripts/shared.js — Otis Games Shared Utilities */

// === Audio Engine (Web Audio API) ===
const OtisAudio = (() => {
  let ctx = null;

  function getContext() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playNote(freq, duration, type = 'sine', gainVal = 0.3) {
    const c = getContext();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainVal, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  }

  return {
    playChime() {
      const c = getContext();
      const t = c.currentTime;
      [523, 659, 784].forEach((f, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.25, t + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(t + i * 0.12);
        osc.stop(t + i * 0.12 + 0.4);
      });
    },
    playPop() {
      const c = getContext();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.15);
    },
    playWobble() {
      const c = getContext();
      const t = c.currentTime;
      [200, 160].forEach((f, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.15, t + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.15 + 0.3);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(t + i * 0.15);
        osc.stop(t + i * 0.15 + 0.3);
      });
    },
    playFanfare() {
      const c = getContext();
      const t = c.currentTime;
      [523, 659, 784, 1047, 1319].forEach((f, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.25, t + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.15 + 0.5);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(t + i * 0.15);
        osc.stop(t + i * 0.15 + 0.5);
      });
    },
    playSparkle() {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => playNote(1200 + Math.random() * 800, 0.1, 'sine', 0.1), i * 50);
      }
    }
  };
})();

// === Particle System ===
const OtisParticles = (() => {
  function burst(x, y, color = '#FFD700', count = 12) {
    const container = document.body;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const size = 6 + Math.random() * 10;
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const velocity = 60 + Math.random() * 80;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity;
      el.style.cssText = `
        position: fixed; left: ${x}px; top: ${y}px; width: ${size}px;
        height: ${size}px; border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        background: ${color}; pointer-events: none; z-index: 200;
      `;
      container.appendChild(el);
      const start = performance.now();
      const duration = 600 + Math.random() * 400;

      function animate(now) {
        const elapsed = now - start;
        const progress = elapsed / duration;
        if (progress >= 1) { el.remove(); return; }
        const xPos = dx * progress;
        const yPos = dy * progress + 200 * progress * progress;
        el.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${progress * 360}deg)`;
        el.style.opacity = 1 - progress;
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  }
  return { burst };
})();

// === Speech (optional, Web Speech API) ===
const OtisSpeech = (() => {
  const supportsEnglish = 'speechSynthesis' in window;
  let enabled = supportsEnglish;

  function speak(text) {
    if (!enabled || !supportsEnglish) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.2;
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  }

  return {
    get enabled() { return enabled; },
    set enabled(v) { enabled = v; },
    supportsEnglish,
    speak
  };
})();

// === Utility Functions ===
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCelebration(container, message, emoji = '⭐', onPlayAgain) {
  const overlay = document.createElement('div');
  overlay.className = 'celebration';
  overlay.innerHTML = `
    <div class="celebration-card">
      <div class="star">${emoji}</div>
      <h2>${message}</h2>
      <button class="btn" style="background:var(--coral);color:white;margin-top:16px;">
        Play Again
      </button>
    </div>
  `;
  container.appendChild(overlay);
  OtisAudio.playFanfare();
  overlay.querySelector('.star').style.animation = 'bounce 0.6s ease infinite';

  overlay.querySelector('button').addEventListener('click', () => {
    overlay.remove();
    if (onPlayAgain) onPlayAgain();
  });
  return overlay;
}
