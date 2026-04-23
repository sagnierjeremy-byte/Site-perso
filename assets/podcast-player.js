// Lecteur podcast HTML5 custom · zéro dépendance · ~200 lignes
// Attache un player à chaque <div data-podcast-player data-src="..." data-ep="XX">.
// Style Direction 4 : pilule noire + play fuchsia + timeline teal.
// Features : play/pause, seek, vitesse 1/1.25/1.5/2, persistance position localStorage,
// 1 seul player à la fois, raccourcis clavier, ARIA.

(function() {
  if (typeof window === 'undefined') return;

  // Singleton pour garantir 1 player actif à la fois
  let currentPlaying = null;

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function initPlayer(container) {
    const src = container.dataset.src;
    const epId = container.dataset.ep || '';
    const storageKey = `podcast-ep-${epId}-position`;

    if (!src) {
      console.warn('[podcast-player] missing data-src on', container);
      return;
    }

    // HTML structure
    container.innerHTML = `
      <button class="pp-play" aria-label="Lire l'épisode" type="button">
        <svg class="pp-icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        <svg class="pp-icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
      </button>
      <div class="pp-timeline" role="slider" aria-label="Progression" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
        <div class="pp-timeline-fill"></div>
      </div>
      <div class="pp-time"><span class="pp-current">0:00</span> / <span class="pp-total">--:--</span></div>
      <button class="pp-speed" aria-label="Vitesse de lecture" type="button">1×</button>
      <audio preload="metadata" src="${src}"></audio>
    `;

    const audio = container.querySelector('audio');
    const playBtn = container.querySelector('.pp-play');
    const timeline = container.querySelector('.pp-timeline');
    const fill = container.querySelector('.pp-timeline-fill');
    const currentEl = container.querySelector('.pp-current');
    const totalEl = container.querySelector('.pp-total');
    const speedBtn = container.querySelector('.pp-speed');

    const SPEEDS = [1, 1.25, 1.5, 2];
    let speedIdx = 0;

    // Restore position
    const saved = Number(localStorage.getItem(storageKey) || 0);
    if (saved > 0) {
      audio.addEventListener('loadedmetadata', () => {
        if (saved < audio.duration - 5) audio.currentTime = saved;
      }, { once: true });
    }

    audio.addEventListener('loadedmetadata', () => {
      totalEl.textContent = fmt(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      fill.style.width = pct + '%';
      currentEl.textContent = fmt(audio.currentTime);
      timeline.setAttribute('aria-valuenow', Math.round(pct));
      // Save every 5s
      if (Math.floor(audio.currentTime) % 5 === 0) {
        localStorage.setItem(storageKey, String(audio.currentTime));
      }
    });

    audio.addEventListener('ended', () => {
      container.dataset.state = 'idle';
      localStorage.removeItem(storageKey);
      currentPlaying = null;
    });

    audio.addEventListener('play', () => {
      if (currentPlaying && currentPlaying !== audio) {
        currentPlaying.pause();
      }
      currentPlaying = audio;
      container.dataset.state = 'playing';
    });

    audio.addEventListener('pause', () => {
      if (!audio.ended) container.dataset.state = 'paused';
    });

    playBtn.addEventListener('click', () => {
      if (audio.paused) audio.play();
      else audio.pause();
    });

    timeline.addEventListener('click', (e) => {
      const rect = timeline.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = pct * audio.duration;
    });

    timeline.addEventListener('keydown', (e) => {
      if (!audio.duration) return;
      if (e.key === 'ArrowLeft') {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        e.preventDefault();
      }
    });

    speedBtn.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % SPEEDS.length;
      audio.playbackRate = SPEEDS[speedIdx];
      speedBtn.textContent = SPEEDS[speedIdx] + '×';
    });

    container.dataset.state = 'idle';
  }

  function initAll() {
    document.querySelectorAll('[data-podcast-player]').forEach(initPlayer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
