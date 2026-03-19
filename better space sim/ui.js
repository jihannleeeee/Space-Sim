// ═══════════════════════════════════════════════════════════════════
//  UI MODULE  –  info panel, time controls, search, quiz mode
// ═══════════════════════════════════════════════════════════════════

import { BODIES } from './data.js';

// ── Info Panel ─────────────────────────────────────────────────────
export function showInfo(name) {
  const panel = document.getElementById('infoPanel');
  const d = BODIES[name];
  if (!d) {
    panel.innerHTML = `<div class="placeholder">[ No data for ${name} ]</div>`;
    return;
  }

  const statsHTML = d.stats.map(s => `
    <div class="stat-box">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
    </div>`).join('');

  const factsHTML = d.facts.map(f => `
    <div class="fact-item">${f}</div>`).join('');

  panel.innerHTML = `
    <div class="panel-header">
      <div class="panel-title">${name}</div>
      <div class="panel-subtitle">${d.subtitle}</div>
    </div>
    <div class="panel-body">
      <div class="info-blurb">${d.blurb}</div>
      <div class="stat-grid">${statsHTML}</div>
      <div class="fact-section">
        <div class="section-label">Key facts</div>
        ${factsHTML}
      </div>
    </div>`;
}

export function clearInfo() {
  document.getElementById('infoPanel').innerHTML =
    `<div class="placeholder">[ Select a body to scan ]</div>`;
}

// ── Time Controls ─────────────────────────────────────────────────
export class TimeController {
  constructor() {
    this.speed = 1;
    this.paused = false;
    this._buildDOM();
  }

  _buildDOM() {
    const bar = document.getElementById('timeBar');

    bar.innerHTML = `
      <button id="btnRev" class="tc-btn" title="Reverse">◂◂</button>
      <button id="btnPause" class="tc-btn" title="Pause/Play">⏸</button>
      <button id="btnFwd" class="tc-btn" title="Fast Forward">▸▸</button>
      <div class="tc-speed" id="speedLabel">1×</div>
      <input type="range" id="speedSlider" min="-3" max="3" step="1" value="0" class="tc-slider">
      <button id="btnReset" class="tc-btn" title="Reset speed">↺</button>
    `;

    const SPEEDS = [-8, -4, -2, -1, 1, 2, 4, 8];
    // slider maps 0..6 → speeds array index, centre=3 → 1×

    document.getElementById('btnPause').addEventListener('click', () => {
      this.paused = !this.paused;
      document.getElementById('btnPause').textContent = this.paused ? '▶' : '⏸';
    });

    document.getElementById('btnFwd').addEventListener('click', () => {
      const sl = document.getElementById('speedSlider');
      sl.value = Math.min(3, parseInt(sl.value) + 1);
      this._applySlider(sl.value);
    });

    document.getElementById('btnRev').addEventListener('click', () => {
      const sl = document.getElementById('speedSlider');
      sl.value = Math.max(-3, parseInt(sl.value) - 1);
      this._applySlider(sl.value);
    });

    document.getElementById('speedSlider').addEventListener('input', (e) => {
      this._applySlider(e.target.value);
    });

    document.getElementById('btnReset').addEventListener('click', () => {
      document.getElementById('speedSlider').value = 0;
      this._applySlider(0);
      this.paused = false;
      document.getElementById('btnPause').textContent = '⏸';
    });
  }

  _applySlider(val) {
    const v = parseInt(val);
    // -3..3  →  speed multiplier
    const map = { '-3': -8, '-2': -4, '-1': -2, '0': 1, '1': 2, '2': 4, '3': 8 };
    this.speed = map[v] ?? 1;
    document.getElementById('speedLabel').textContent =
      (this.speed < 0 ? '−' : '') + Math.abs(this.speed) + '×';
  }

  get multiplier() {
    return this.paused ? 0 : this.speed;
  }
}

// ── Search Bar ────────────────────────────────────────────────────
export class SearchBar {
  constructor(onSelect) {
    this.onSelect = onSelect;
    this._buildDOM();
  }

  setTargets(names) {
    this.targets = names;
  }

  _buildDOM() {
    const wrap = document.getElementById('searchWrap');
    wrap.innerHTML = `
      <div class="search-inner">
        <span class="search-icon">⌕</span>
        <input id="searchInput" type="text" placeholder="Search bodies..." autocomplete="off" spellcheck="false">
        <div id="searchDropdown" class="search-dropdown hidden"></div>
      </div>`;

    const input = document.getElementById('searchInput');
    const dd = document.getElementById('searchDropdown');

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q || !this.targets) { dd.classList.add('hidden'); return; }
      const matches = this.targets.filter(n => n.toLowerCase().includes(q)).slice(0, 8);
      if (!matches.length) { dd.classList.add('hidden'); return; }
      dd.innerHTML = matches.map(m =>
        `<div class="dd-item" data-name="${m}">${m}</div>`).join('');
      dd.classList.remove('hidden');
      dd.querySelectorAll('.dd-item').forEach(el => {
        el.addEventListener('click', () => {
          this.onSelect(el.dataset.name);
          input.value = '';
          dd.classList.add('hidden');
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) dd.classList.add('hidden');
    });
  }
}

// ── Quiz Mode ─────────────────────────────────────────────────────
export class QuizMode {
  constructor(getAllNames) {
    this.getAllNames = getAllNames;
    this.active = false;
    this.currentTarget = null;
    this.score = { correct: 0, total: 0 };
    this._buildDOM();
  }

  _buildDOM() {
    const btn = document.getElementById('btnQuiz');
    btn.addEventListener('click', () => this.toggle());
  }

  toggle() {
    this.active = !this.active;
    const overlay = document.getElementById('quizOverlay');
    const btn = document.getElementById('btnQuiz');
    if (this.active) {
      btn.classList.add('active');
      this._nextQuestion();
      overlay.classList.remove('hidden');
    } else {
      btn.classList.remove('active');
      overlay.classList.add('hidden');
      this.currentTarget = null;
      document.getElementById('infoPanel').style.filter = '';
    }
  }

  _nextQuestion() {
    const names = this.getAllNames().filter(n => BODIES[n]);
    this.currentTarget = names[Math.floor(Math.random() * names.length)];
    const d = BODIES[this.currentTarget];
    const overlay = document.getElementById('quizOverlay');
    overlay.innerHTML = `
      <div class="quiz-box">
        <div class="quiz-label">IDENTIFY THIS BODY</div>
        <div class="quiz-clue">${d.subtitle}</div>
        <div class="quiz-clue-2">${d.stats[0]?.label}: ${d.stats[0]?.value}</div>
        <div class="quiz-score">${this.score.correct}/${this.score.total} correct</div>
        <div class="quiz-hint">Click the correct body in the simulation</div>
      </div>`;
    // hide info panel to not give it away
    document.getElementById('infoPanel').style.filter = 'blur(6px)';
  }

  checkAnswer(name) {
    if (!this.active) return false;
    this.score.total++;
    const overlay = document.getElementById('quizOverlay');
    const correct = name === this.currentTarget;
    if (correct) this.score.correct++;
    overlay.innerHTML = `
      <div class="quiz-box ${correct ? 'correct' : 'wrong'}">
        <div class="quiz-result">${correct ? '✓ CORRECT' : '✗ WRONG'}</div>
        <div class="quiz-answer">It was: <strong>${this.currentTarget}</strong></div>
        <div class="quiz-score">${this.score.correct}/${this.score.total} correct</div>
        <button class="quiz-next-btn" id="quizNextBtn">Next →</button>
      </div>`;
    document.getElementById('infoPanel').style.filter = '';
    document.getElementById('quizNextBtn').addEventListener('click', () => {
      this._nextQuestion();
    });
    return true;
  }

  get target() { return this.currentTarget; }
}

// ── Scale Toggle ──────────────────────────────────────────────────
export function buildScaleToggle(onToggle) {
  const btn = document.getElementById('btnScale');
  let dramatic = true;
  btn.addEventListener('click', () => {
    dramatic = !dramatic;
    btn.textContent = dramatic ? 'True Scale' : 'Dramatic Scale';
    onToggle(dramatic);
  });
}

// ── Tooltip ───────────────────────────────────────────────────────
export function showTooltip(text, x, y) {
  let tip = document.getElementById('tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'tooltip';
    document.body.appendChild(tip);
  }
  tip.textContent = text;
  tip.style.left = (x + 14) + 'px';
  tip.style.top  = (y - 6)  + 'px';
  tip.style.opacity = '1';
}

export function hideTooltip() {
  const tip = document.getElementById('tooltip');
  if (tip) tip.style.opacity = '0';
}
