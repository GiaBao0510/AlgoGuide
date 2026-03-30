/* ============================================
   main.js — App initialization, theme toggle,
   sidebar rendering, tab switching, visualizer
   engine, and algorithm registry
   ============================================ */

/* Registry: all algorithms register here */
window.AlgoRegistry = window.AlgoRegistry || {};

/* ===== Algorithm Group Definitions ===== */
const ALGO_GROUPS = [
  { id: 'sorting',   icon: '📊', name: 'Sắp xếp (Sorting)' },
  { id: 'searching', icon: '🔍', name: 'Tìm kiếm (Searching)' },
  { id: 'graph',     icon: '🕸️', name: 'Đồ thị (Graph)' },
  { id: 'tree',      icon: '🌳', name: 'Cây (Tree)' },
  { id: 'two-pointers', icon: '👉', name: 'Hai con trỏ / Cửa sổ trượt' },
  { id: 'divide-conquer', icon: '✂️', name: 'Chia để trị (Divide & Conquer)' },
  { id: 'hashing',   icon: '#️⃣', name: 'Hashing' },
  { id: 'greedy',    icon: '💰', name: 'Tham lam (Greedy)' },
  { id: 'backtracking', icon: '🔙', name: 'Quay lui (Backtracking)' },
  { id: 'math',      icon: '🔢', name: 'Toán học (Math)' }
];

/* ===== App State ===== */
const AppState = {
  currentAlgo: null,
  currentTab: 'description',
  currentLang: 'javascript',
  isPlaying: false,
  currentStep: 0,
  steps: [],
  animationTimer: null,
  speed: 5
};

/* ===== Theme Management ===== */
function initTheme() {
  const saved = localStorage.getItem('algoguide-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcons(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('algoguide-theme', next);
  updateThemeIcons(next);
}

function updateThemeIcons(theme) {
  const icon = theme === 'dark' ? '🌙' : '☀️';
  document.querySelectorAll('.theme-icon').forEach(el => el.textContent = icon);
}

/* ===== Sidebar ===== */
function buildSidebar() {
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;
  let totalAlgorithms = 0;
  let html = '';

  ALGO_GROUPS.forEach(group => {
    const algos = Object.keys(window.AlgoRegistry)
      .filter(key => window.AlgoRegistry[key].group === group.id)
      .map(key => ({ id: key, ...window.AlgoRegistry[key] }));
    totalAlgorithms += algos.length;

    html += `
      <div class="nav-group" data-group="${group.id}">
        <div class="nav-group-header" onclick="toggleGroup(this)">
          <span class="group-icon">${group.icon}</span>
          <span>${group.name}</span>
          <span class="group-count">${algos.length}</span>
          <span class="arrow">▶</span>
        </div>
        <div class="nav-group-items">
          ${algos.map(a => `
            <a class="nav-item" data-algo="${a.id}" onclick="selectAlgorithm('${a.id}')" href="#${a.id}">${a.name}</a>
          `).join('')}
        </div>
      </div>
    `;
  });

  nav.innerHTML = html;
  const totalEl = document.getElementById('totalAlgorithms');
  if (totalEl) totalEl.textContent = totalAlgorithms;
}

function toggleGroup(header) {
  const group = header.parentElement;
  group.classList.toggle('open');
}

/* ===== Search ===== */
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    document.querySelectorAll('.nav-group').forEach(group => {
      let hasVisible = false;
      group.querySelectorAll('.nav-item').forEach(item => {
        const name = item.textContent.toLowerCase();
        const match = !query || name.includes(query);
        item.style.display = match ? '' : 'none';
        if (match) hasVisible = true;
      });
      group.style.display = hasVisible ? '' : 'none';
      if (query && hasVisible) group.classList.add('open');
    });
  });
}

/* ===== Mobile Sidebar ===== */
function initMobileSidebar() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('active');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => closeMobileSidebar());
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

/* ===== Algorithm Selection ===== */
function selectAlgorithm(id) {
  const algo = window.AlgoRegistry[id];
  if (!algo) return;

  AppState.currentAlgo = id;
  stopAnimation();
  AppState.currentStep = 0;
  AppState.steps = [];

  /* Update sidebar active state */
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeItem = document.querySelector(`.nav-item[data-algo="${id}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
    /* Open parent group */
    const group = activeItem.closest('.nav-group');
    if (group) group.classList.add('open');
  }

  /* Toggle views */
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('algorithmView').style.display = '';

  /* Set header */
  const groupInfo = ALGO_GROUPS.find(g => g.id === algo.group);
  document.getElementById('algoCategoryBadge').textContent = groupInfo ? groupInfo.name : algo.group;
  document.getElementById('algoTitle').textContent = algo.name;

  /* Load description */
  renderDescription(algo);

  /* Set default input */
  const input = document.getElementById('algoInput');
  if (input && algo.defaultInput) {
    input.value = algo.defaultInput;
  }

  /* Load code */
  renderCode(algo);

  /* Reset visualizer */
  resetVisualizer();

  /* Activate description tab */
  switchTab('description');

  /* Close mobile sidebar */
  closeMobileSidebar();
}

/* ===== Description Rendering ===== */
function renderDescription(algo) {
  const container = document.getElementById('descriptionContent');
  if (!container) return;

  const desc = algo.description || '';
  const complexity = algo.complexity || {};
  const pros = algo.pros || [];
  const cons = algo.cons || [];
  const useCases = algo.useCases || [];

  let html = `
    <h3>📖 Giải thích</h3>
    <p>${desc}</p>

    <h3>📊 Độ phức tạp</h3>
    <table class="complexity-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Best</th>
          <th>Average</th>
          <th>Worst</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Time</strong></td>
          <td>${complexity.timeBest || 'N/A'}</td>
          <td>${complexity.timeAvg || 'N/A'}</td>
          <td>${complexity.timeWorst || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Space</strong></td>
          <td colspan="3">${complexity.space || 'N/A'}</td>
        </tr>
      </tbody>
    </table>
  `;

  if (pros.length) {
    html += `<h3>✅ Ưu điểm</h3><ul class="desc-list pros">${pros.map(p => `<li>${p}</li>`).join('')}</ul>`;
  }
  if (cons.length) {
    html += `<h3>❌ Nhược điểm</h3><ul class="desc-list cons">${cons.map(c => `<li>${c}</li>`).join('')}</ul>`;
  }
  if (useCases.length) {
    html += `<h3>💡 Use cases</h3><ul class="desc-list uses">${useCases.map(u => `<li>${u}</li>`).join('')}</ul>`;
  }

  container.innerHTML = html;
}

/* ===== Code Rendering ===== */
function renderCode(algo) {
  const block = document.getElementById('codeBlock');
  if (!block || !algo.code) return;

  const lang = AppState.currentLang;
  const code = algo.code[lang] || '// Code not available';
  block.textContent = code;
  block.className = `language-${lang}`;
  highlightCode(block);
}

/* Minimal syntax highlighting (inline, no CDN) */
function highlightCode(element) {
  let text = element.textContent;

  /* HTML-escape */
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* Comments */
  text = text.replace(/(\/\/.*$)/gm, '<span class="cm">$1</span>');
  text = text.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cm">$1</span>');

  /* Strings */
  text = text.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="st">$1</span>');
  text = text.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="st">$1</span>');
  text = text.replace(/(`(?:[^`\\]|\\.)*`)/g, '<span class="st">$1</span>');

  /* Numbers */
  text = text.replace(/\b(\d+\.?\d*)\b/g, '<span class="nu">$1</span>');

  /* Keywords (multi-language) */
  const keywords = [
    'func','func','package','import','var','const','let','if','else','for','while','do',
    'return','switch','case','break','continue','default','range','type','struct','interface',
    'map','make','append','len','cap','new','delete','defer','go','chan','select','fallthrough',
    'goto','nil','true','false','iota',
    'function','class','extends','super','this','typeof','instanceof','in','of','async','await',
    'try','catch','finally','throw','yield','export','from','static','get','set','void',
    'using','namespace','public','private','protected','internal','abstract','virtual','override',
    'sealed','partial','readonly','static','ref','out','params','async','await','yield',
    'string','int','int32','int64','float32','float64','bool','byte','rune','error',
    'number','boolean','any','undefined','null','console','Math','Array','Object',
    'List','Dictionary','HashSet','Queue','Stack','StringBuilder','Console','String',
    'foreach','is','as','checked','unchecked','lock','event','delegate','enum',
    'println','Println','Printf','Sprintf','fmt','sort','Sort','Ints','Slice'
  ];
  const kwPattern = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');
  text = text.replace(kwPattern, (match) => {
    /* Don't highlight inside already-highlighted spans */
    return '<span class="kw">' + match + '</span>';
  });

  element.innerHTML = text;
}

/* ===== Tab Switching ===== */
function switchTab(tabName) {
  AppState.currentTab = tabName;

  /* Desktop tabs */
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
  if (activeTab) activeTab.classList.add('active');

  /* Mobile bottom nav */
  document.querySelectorAll('.bottom-nav-item').forEach(t => t.classList.remove('active'));
  const activeBottom = document.querySelector(`.bottom-nav-item[data-tab="${tabName}"]`);
  if (activeBottom) activeBottom.classList.add('active');

  /* Show/hide panes */
  document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
  const pane = document.getElementById(tabName + 'Pane');
  if (pane) {
    pane.style.display = '';
    /* Re-animate */
    pane.style.animation = 'none';
    pane.offsetHeight; /* Trigger reflow */
    pane.style.animation = 'fadeIn 0.25s ease';
  }
}

function initTabs() {
  document.querySelectorAll('.tab, .bottom-nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.querySelectorAll('.code-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      AppState.currentLang = btn.dataset.lang;
      const algo = window.AlgoRegistry[AppState.currentAlgo];
      if (algo) renderCode(algo);
    });
  });
}

/* ===== Copy to Clipboard ===== */
function initCopyBtn() {
  const copyBtn = document.getElementById('copyBtn');
  if (!copyBtn) return;
  copyBtn.addEventListener('click', () => {
    const code = document.getElementById('codeBlock');
    if (!code) return;
    navigator.clipboard.writeText(code.textContent).then(() => {
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => { copyBtn.innerHTML = '📋 Copy'; }, 2000);
    }).catch(() => {
      /* Fallback */
      const textarea = document.createElement('textarea');
      textarea.value = code.textContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => { copyBtn.innerHTML = '📋 Copy'; }, 2000);
    });
  });
}

/* ===== Visualizer Engine ===== */
function resetVisualizer() {
  stopAnimation();
  AppState.currentStep = 0;
  AppState.steps = [];

  const canvas = document.getElementById('visualizerCanvas');
  if (canvas) canvas.innerHTML = '';

  updateStepInfo(0, 0, 'Nhấn Play để bắt đầu mô phỏng');
}

function generateSteps() {
  const algo = window.AlgoRegistry[AppState.currentAlgo];
  if (!algo || !algo.visualize) return;

  const input = document.getElementById('algoInput');
  const rawInput = input ? input.value : '';

  try {
    AppState.steps = algo.visualize(rawInput);
    AppState.currentStep = 0;
    if (AppState.steps.length > 0) {
      renderStep(0);
    }
  } catch (e) {
    console.error('Visualizer error:', e);
    updateStepInfo(0, 0, 'Lỗi: ' + e.message);
  }
}

function renderStep(stepIndex) {
  if (stepIndex < 0 || stepIndex >= AppState.steps.length) return;

  const step = AppState.steps[stepIndex];
  const canvas = document.getElementById('visualizerCanvas');
  if (!canvas) return;

  const algo = window.AlgoRegistry[AppState.currentAlgo];
  if (algo && algo.render) {
    algo.render(canvas, step);
  }

  updateStepInfo(stepIndex + 1, AppState.steps.length, step.description || '');
}

function updateStepInfo(current, total, desc) {
  const counter = document.getElementById('stepCounter');
  const description = document.getElementById('stepDescription');
  if (counter) counter.textContent = `Bước ${current}/${total}`;
  if (description) description.textContent = desc;
}

function playAnimation() {
  if (AppState.steps.length === 0) {
    generateSteps();
    if (AppState.steps.length === 0) return;
  }

  AppState.isPlaying = true;
  updatePlayBtn();

  const delay = getAnimationDelay();

  function animate() {
    if (!AppState.isPlaying) return;
    if (AppState.currentStep >= AppState.steps.length) {
      stopAnimation();
      return;
    }
    renderStep(AppState.currentStep);
    AppState.currentStep++;
    AppState.animationTimer = setTimeout(animate, delay);
  }
  animate();
}

function stopAnimation() {
  AppState.isPlaying = false;
  clearTimeout(AppState.animationTimer);
  updatePlayBtn();
}

function nextStep() {
  if (AppState.steps.length === 0) generateSteps();
  if (AppState.currentStep < AppState.steps.length) {
    renderStep(AppState.currentStep);
    AppState.currentStep++;
  }
}

function prevStep() {
  if (AppState.currentStep > 1) {
    AppState.currentStep -= 2;
    renderStep(AppState.currentStep);
    AppState.currentStep++;
  } else if (AppState.currentStep === 1) {
    AppState.currentStep = 0;
    renderStep(0);
    AppState.currentStep = 1;
  }
}

function getAnimationDelay() {
  /* Speed 1 => 1200ms, speed 10 => 50ms */
  const speed = AppState.speed;
  return Math.max(50, 1200 - (speed - 1) * 128);
}

function updatePlayBtn() {
  const btn = document.getElementById('playBtn');
  if (!btn) return;
  if (AppState.isPlaying) {
    btn.innerHTML = '<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"/></svg>';
    btn.title = 'Pause';
  } else {
    btn.innerHTML = '<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>';
    btn.title = 'Play';
  }
}

/* Random data generation */
function generateRandomArray(size, min, max) {
  size = size || 15;
  min = min || 1;
  max = max || 99;
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function initControls() {
  const playBtn = document.getElementById('playBtn');
  const resetBtn = document.getElementById('resetBtn');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const randomBtn = document.getElementById('randomBtn');
  const speedSlider = document.getElementById('speedSlider');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (AppState.isPlaying) {
        stopAnimation();
      } else {
        playAnimation();
      }
    });
  }

  if (resetBtn) resetBtn.addEventListener('click', () => {
    resetVisualizer();
    generateSteps();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    stopAnimation();
    nextStep();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    stopAnimation();
    prevStep();
  });

  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      const algo = window.AlgoRegistry[AppState.currentAlgo];
      if (!algo) return;
      const input = document.getElementById('algoInput');
      if (!input) return;

      if (algo.randomInput) {
        input.value = algo.randomInput();
      } else {
        input.value = generateRandomArray().join(', ');
      }
      resetVisualizer();
      generateSteps();
    });
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', () => {
      AppState.speed = parseInt(speedSlider.value);
      document.getElementById('speedLabel').textContent = speedSlider.value + 'x';
    });
  }
}

/* ===== Helper: Render Array Bars ===== */
function renderArrayBars(canvas, array, highlights, maxVal) {
  if (!canvas) return;
  maxVal = maxVal || Math.max(...array, 1);
  const barHeight = 280;

  canvas.innerHTML = '';
  canvas.style.height = '300px';
  canvas.style.display = 'flex';
  canvas.style.alignItems = 'flex-end';
  canvas.style.justifyContent = 'center';
  canvas.style.gap = '2px';

  array.forEach((val, idx) => {
    const bar = document.createElement('div');
    bar.className = 'viz-bar';
    const h = Math.max(8, (val / maxVal) * barHeight);
    bar.style.height = h + 'px';

    if (highlights) {
      if (highlights.sorted && highlights.sorted.includes(idx)) bar.classList.add('sorted');
      if (highlights.comparing && highlights.comparing.includes(idx)) bar.classList.add('comparing');
      if (highlights.swapping && highlights.swapping.includes(idx)) bar.classList.add('swapping');
      if (highlights.pivot === idx) bar.classList.add('pivot');
      if (highlights.active && highlights.active.includes(idx)) bar.classList.add('active');
      if (highlights.found && highlights.found.includes(idx)) bar.classList.add('found');
    }

    const label = document.createElement('span');
    label.className = 'bar-value';
    label.textContent = val;
    bar.appendChild(label);

    canvas.appendChild(bar);
  });
}

/* ===== Helper: Parse Input ===== */
function parseArrayInput(raw) {
  if (!raw || !raw.trim()) return generateRandomArray();
  return raw.split(/[,\s]+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));
}

/* ===== Init ===== */
function initApp() {
  initTheme();
  buildSidebar();
  initSearch();
  initMobileSidebar();
  initTabs();
  initCopyBtn();
  initControls();

  /* Theme toggle buttons */
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

  /* Router */
  AlgoRouter.onRouteChange(id => selectAlgorithm(id));
  AlgoRouter.init();
}

document.addEventListener('DOMContentLoaded', initApp);
