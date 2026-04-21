// admin.js — shell commun : sidebar render, theme, api, toasts

// ===== Theme =====
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (systemDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initial);
})();

function bindThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ===== API helpers =====
window.api = {
  async get(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`GET ${url} · HTTP ${r.status}`);
    return r.json();
  },
  async post(url, body) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : '{}',
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: r.statusText }));
      throw new Error(err.error || `POST ${url} · HTTP ${r.status}`);
    }
    return r.json();
  },
  async put(url, body) {
    const r = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: r.statusText }));
      throw new Error(err.error || `PUT ${url} · HTTP ${r.status}`);
    }
    return r.json();
  },
  async del(url) {
    const r = await fetch(url, { method: 'DELETE' });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: r.statusText }));
      throw new Error(err.error || `DELETE ${url} · HTTP ${r.status}`);
    }
    return r.json();
  },
};

// ===== Toasts =====
(function initToasts() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  window.toast = (msg, kind = 'info', ms = 3200) => {
    const el = document.createElement('div');
    el.className = `toast ${kind}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(40px)';
      setTimeout(() => el.remove(), 250);
    }, ms);
  };
})();

// ===== Formatters =====
window.fmtDate = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return '—'; }
};
window.fmtRelative = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `il y a ${Math.floor(diff / 86400)} j`;
    return window.fmtDate(iso);
  } catch { return '—'; }
};
window.nextWeekday = (targetDay) => {
  const now = new Date();
  const cur = now.getDay();
  let diff = (targetDay - cur + 7) % 7;
  if (diff === 0) diff = 7;
  const n = new Date(now);
  n.setDate(now.getDate() + diff);
  return n;
};
window.escapeHtml = (s) =>
  String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ===== Sidebar renderer =====
// Appelé par chaque page module au load. Exemple : renderShell('backlog')
async function renderShell(activeModuleId) {
  // Inject la structure si pas déjà là
  let sidebar = document.getElementById('sidebar');
  const main = document.getElementById('mainArea');
  if (!sidebar || !main) {
    console.error('renderShell : markup app manquant (sidebar + mainArea)');
    return;
  }

  // Charge modules + counts en parallèle
  let modules, counts;
  try {
    [modules, counts] = await Promise.all([
      api.get('/api/modules'),
      api.get('/api/stats').catch(() => null),
    ]);
  } catch (e) {
    console.error('sidebar load', e);
    return;
  }

  // Compteurs
  const badges = {};
  if (counts) {
    badges.backlog = counts.backlog?.proposed || 0;
    badges.drafts = counts.drafts || 0;
    badges.articles = counts.articles || 0;
    badges.newsletter = counts.newsletter?.total || 0;
  }

  // Build sidebar HTML
  let html = `
    <div class="sb-head">
      <a href="/admin/modules/dashboard/" class="sb-brand">
        <span class="sb-brand-dot"></span>
        Jérémy Sagnier
        <span class="sb-brand-tag">Admin</span>
        <button class="sb-close" type="button" aria-label="Fermer le menu" onclick="document.getElementById('sidebar').classList.remove('is-open')">×</button>
      </a>
      <div class="sb-tagline">Ton cockpit · chez toi</div>
    </div>
    <div class="sb-body">
  `;

  for (const section of modules.sections) {
    html += `<div class="sb-section">${escapeHtml(section.label)}</div>`;
    for (const m of section.modules) {
      const isActive = m.id === activeModuleId ? 'active' : '';
      const badge = badges[m.id] !== undefined && badges[m.id] > 0
        ? `<span class="sb-item-badge">${badges[m.id]}</span>` : '';
      const tag = m.status === 'stub' ? `<span class="sb-item-tag">Soon</span>` : '';
      html += `
        <a href="/admin/modules/${m.id}/" class="sb-item ${isActive}" data-module="${m.id}">
          <span class="sb-item-icon">${m.icon}</span>
          <span class="sb-item-label">${escapeHtml(m.name)}</span>
          ${tag || badge}
        </a>
      `;
    }
  }

  html += `
    </div>
    <div class="sb-foot">
      <a href="/" target="_blank" class="btn btn-ghost">Voir mon site ↗</a>
      <button id="themeToggle" class="sb-foot-theme" aria-label="Changer de thème">
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z"/></svg>
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      </button>
    </div>
  `;

  sidebar.innerHTML = html;
  bindThemeToggle();

  // Topbar toggle (mobile)
  const topbarMenu = document.getElementById('topbarMenu');
  if (topbarMenu) {
    topbarMenu.addEventListener('click', () => sidebar.classList.toggle('is-open'));
  }
}

window.renderShell = renderShell;
