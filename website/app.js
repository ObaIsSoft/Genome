/* ==========================================================================
   GENOME MCP WEBSITE INTERACTIVE CONTROLLER
   Pure Vanilla JS — No external framework overhead
   Enforces mathematical determinism and responsive tabs.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize subsystems
  initDnaHelixBonds();
  initSidebarTabs();
  initTopNavRouting();
  initClipboardCopying();
  initSandboxEngine();
  initMobileNav();
});

/* ==========================================================================
   0. MOBILE NAVIGATION — Hamburger Menu + Slide-in Drawer
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.getElementById('btn-hamburger');
  const drawer    = document.getElementById('mobile-nav-drawer');
  const backdrop  = document.getElementById('mobile-drawer-backdrop');
  const closeBtn  = document.getElementById('btn-close-drawer');

  if (!hamburger || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.innerHTML = '&#10005;'; // ✕ when open
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '&#9776;'; // ☰ when closed
  }

  hamburger.addEventListener('click', () => {
    if (drawer.classList.contains('open')) closeDrawer();
    else openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Close on any drawer link click
  drawer.querySelectorAll('a.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });
}


/* ==========================================================================
   1. DNA HELIX VISUALIZER — MATHEMATICALLY PLOTTED BONDS
   Calculates exact sine coordinates of the strands to place connecting nodes
   ========================================================================== */
function initDnaHelixBonds() {
  const bondGroup = document.getElementById('dna-bond-nodes');
  if (!bondGroup) return;

  // Clear any existing contents
  bondGroup.innerHTML = '';

  // Draw bonds at intermediate heights (skipping exact intersection nodes)
  const bondYCoords = [20, 30, 50, 60, 80, 90, 110, 120, 140, 150, 170, 180, 200, 210, 230];

  bondYCoords.forEach((y, index) => {
    // Math Formula: X_a = 50 + 30 * sin((Y - 40) * PI / 60)
    const angle = ((y - 40) * Math.PI) / 60;
    const xa = 50 + 30 * Math.sin(angle);
    const xb = 50 - 30 * Math.sin(angle);

    // Create bond line container
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'dna-bond-item');
    g.style.animationDelay = `${index * 150}ms`;

    // Create the connection line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', xa.toFixed(2));
    line.setAttribute('y1', y);
    line.setAttribute('x2', xb.toFixed(2));
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(27, 228, 235, 0.25)');
    line.setAttribute('stroke-width', '1');
    g.appendChild(line);

    // Create glowing circle node on strand A
    const circleA = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleA.setAttribute('cx', xa.toFixed(2));
    circleA.setAttribute('cy', y);
    circleA.setAttribute('r', '2');
    circleA.setAttribute('fill', '#1be4eb');
    circleA.setAttribute('class', 'dna-node-dot');
    g.appendChild(circleA);

    // Create glowing circle node on strand B
    const circleB = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleB.setAttribute('cx', xb.toFixed(2));
    circleB.setAttribute('cy', y);
    circleB.setAttribute('r', '1.5');
    circleB.setAttribute('fill', 'rgba(255, 255, 255, 0.6)');
    g.appendChild(circleB);

    bondGroup.appendChild(g);
  });
}

/* ==========================================================================
   2. DOCUMENTATION SIDEBAR NAVIGATION
   Manages article active panels in the split screen layout
   ========================================================================== */
function initSidebarTabs() {
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      // Deactivate all buttons & panes
      sidebarButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      // Activate selected
      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // Sync active state back to top nav if applicable
      syncTopNavToSidebar(targetId);
    });
  });
}

function syncTopNavToSidebar(tabId) {
  const philosophyLink = document.getElementById('nav-link-philosophy');
  const docsLink = document.getElementById('nav-link-docs');
  const pipelineLink = document.getElementById('nav-link-pipeline');

  // Clear active states
  [philosophyLink, docsLink, pipelineLink].forEach(el => {
    if (el) el.classList.remove('active');
  });

  if (tabId === 'tab-philosophy') {
    if (philosophyLink) philosophyLink.classList.add('active');
  } else if (tabId === 'tab-pipeline') {
    if (pipelineLink) pipelineLink.classList.add('active');
  } else {
    if (docsLink) docsLink.classList.add('active');
  }
}

/* ==========================================================================
   3. TOP NAVIGATION INTERACTION
   Smooth routing to anchor positions and automatic sidebar tab focus
   ========================================================================== */
function initTopNavRouting() {
  const topNavLinks = document.querySelectorAll('.top-nav .nav-item');

  topNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      // Handle custom behavior for tab scrolling
      if (href === '#philosophy') {
        e.preventDefault();
        triggerSidebarTab('sidebar-btn-philosophy');
        scrollToElement('docs');
      } else if (href === '#pipeline') {
        e.preventDefault();
        triggerSidebarTab('sidebar-btn-workflow');
        scrollToElement('docs');
      } else if (href === '#docs') {
        e.preventDefault();
        triggerSidebarTab('sidebar-btn-install');
        scrollToElement('docs');
      }
      // sandbox falls back to native smooth-scroll anchors
    });
  });

  // Logo click behavior (resets to top)
  const brandLogo = document.getElementById('logo-brand');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      triggerSidebarTab('sidebar-btn-philosophy');
    });
  }
}

function triggerSidebarTab(btnId) {
  const btn = document.getElementById(btnId);
  if (btn) btn.click();
}

function scrollToElement(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80; // Offset for sticky header
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

/* ==========================================================================
   4. CLIPBOARD COPY UTILITIES
   Provides feedback transitions (e.g. copying -> copied) to developer snippets
   ========================================================================== */
function initClipboardCopying() {
  const copyButtons = document.querySelectorAll('.btn-copy, .btn-copy-mini');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      let textToCopy = '';
      
      // Determine what source to copy from
      if (btn.hasAttribute('data-copy')) {
        textToCopy = btn.getAttribute('data-copy');
      } else if (btn.hasAttribute('data-copy-target')) {
        const targetEl = document.getElementById(btn.getAttribute('data-copy-target'));
        if (targetEl) {
          textToCopy = targetEl.textContent || targetEl.innerText;
        }
      }

      if (!textToCopy) return;

      // Write to Clipboard
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Successful feedback transition
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = 'rgba(27, 228, 235, 0.2)';
        btn.style.borderColor = '#1be4eb';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE GENOME SANDBOX ENGINE
   Houses full deterministic presets and runs beautiful simulation transitions
   ========================================================================== */

// 4 Pre-populated High-Fidelity Presets matching mathematical seed constraints
const GENOME_PRESETS = {
  'cyber-obsidian': {
    intent: 'A hyper-modern developer landing page and documentation portal for the mathematical design system engine named Genome MCP. Dark-mode, cybernetic grid lines.',
    seed: 'genome-website-official-2026',
    hash: '7b31e9c20a4b8df283ef9955fa24b5dca65839070a2569ef81bc7e1a3bc8fde6',
    sector: 'technology',
    prose: `<p><strong>Design Thesis:</strong> The design system sequences into a <strong>Cold Obsidian</strong> visual state. The primary interaction vector uses a narrow-focused glowing cyan core at <code>176° hue</code>. To enforce pure mathematical boundaries, spacing units are strictly derived in factors of 8px (base spacing logic).</p>
            <h5>Aesthetic Mandates</h5>
            <ul class="bullet-list-custom">
              <li>Use Cabinet Grotesk for Display Headings only; map size scales strictly.</li>
              <li>Incorporate 1px border frames with 8px radius corners to express semi-sharp tech logic.</li>
              <li>Animations MUST utilize spring physics cubic-bezier transition easing.</li>
            </ul>
            <h5>Forbidden Slop Patterns</h5>
            <ul class="bullet-list-custom slop-list">
              <li>NO full-bleed raster hero backgrounds (violates <code>large_hero_images</code>).</li>
              <li>NO standard rounded-xl or rounded-2xl Tailwind classes on content cards.</li>
              <li>NO generic blue-to-purple diagonal background gradients.</li>
            </ul>`,
    chromosomes: [
      { id: 'ch1', name: 'structure', val: 'maxNesting: 3 | sections: 6', badge: 'asymmetric' },
      { id: 'ch2', name: 'spacing_unit', val: 'baseUnitPx: 8px | ratio: 1.5', badge: 'compact' },
      { id: 'ch3', name: 'type_display', val: 'Cabinet Grotesk (geometric)', badge: 'import-fontshare' },
      { id: 'ch4', name: 'type_body', val: 'Satoshi (humanist-geometric)', badge: 'import-fontshare' },
      { id: 'ch5', name: 'color_primary', val: 'hue: 176 | hex: #0e9ba4 | dark: #1be4eb', badge: 'cyan-glow' },
      { id: 'ch6', name: 'color_temp', val: 'cold | surfaceStack: 4 layers (#080c0d...)', badge: 'obsidian' },
      { id: 'ch7', name: 'edge', val: 'borderRadiusPx: 8 | style: semi-sharp', badge: 'rect-8px' },
      { id: 'ch8', name: 'motion', val: 'spring | duration: 250ms | overshoot-curve', badge: 'spring' },
      { id: 'ch9', name: 'grid', val: 'logic: asymmetric | cols: 12', badge: 'asymmetric-0.3' },
      { id: 'ch17', name: 'accessibility', val: 'contrastRatio: 4.5+ | respectPref: active', badge: 'wcag-aa' }
    ],
    css: `:root {
  /* Seed: genome-website-official-2026 */
  --font-display: 'Cabinet Grotesk', sans-serif;
  --font-body: 'Satoshi', sans-serif;
  --genome-unit: 8px;
  
  --color-primary: #0e9ba4;
  --color-primary-interactive: #1be4eb;
  --color-surface-0: #080c0d;
  --color-surface-1: #0f1517;
  --color-surface-2: #162022;
  --color-surface-3: #1f2d30;
  
  --genome-border-radius: 8px;
  --genome-easing: cubic-bezier(0.175, 0.885, 0.32, 1.1);
  --genome-duration: 250ms;
}`
  },
  'y2k-football': {
    intent: 'A chaotic, high-density esports dashboard. Raw monospace, high-contrast matrix green accents, sharp 90-degree corners, grid structures, tabular telemetry.',
    seed: 'y2k-gaming-championship-2026',
    hash: 'e91fa4a20b78df1890efba33fa88dca125838070c2569ef81bc8e9a2bc6fde1c',
    sector: 'gaming',
    prose: `<p><strong>Design Thesis:</strong> The design sequences into a highly structural, aggressive <strong>Matrix Brutalist</strong> telemetry interface. Edges are completely sharp to represent rigid mathematical computations. Backdrops are flat pitch black to afford high emission contrast.</p>
            <h5>Aesthetic Mandates</h5>
            <ul class="bullet-list-custom">
              <li>Use Fira Code for all displays and tables, rendering clean technical alignment.</li>
              <li>Borders must be high weight (2px) and glowing matrix green (#39ff14).</li>
              <li>Transitions are instantaneous (0ms) or short linear snaps.</li>
            </ul>
            <h5>Forbidden Slop Patterns</h5>
            <ul class="bullet-list-custom slop-list">
              <li>NO curved card borders (violates <code>rounded_cards</code>).</li>
              <li>NO smooth ease-in-out animations or spring overshoots.</li>
              <li>NO ambient blurs or soft dropshadows.</li>
            </ul>`,
    chromosomes: [
      { id: 'ch1', name: 'structure', val: 'maxNesting: 1 | sections: 8', badge: 'flat' },
      { id: 'ch2', name: 'spacing_unit', val: 'baseUnitPx: 6px | ratio: 1.25', badge: 'super-dense' },
      { id: 'ch3', name: 'type_display', val: 'Fira Code (monospace)', badge: 'import-google' },
      { id: 'ch4', name: 'type_body', val: 'Inconsolata (monospace)', badge: 'import-google' },
      { id: 'ch5', name: 'color_primary', val: 'hue: 120 | hex: #00ff00 | dark: #39ff14', badge: 'matrix-neon' },
      { id: 'ch6', name: 'color_temp', val: 'neutral | flatStack (#050505, #111...)', badge: 'pitch-black' },
      { id: 'ch7', name: 'edge', val: 'borderRadiusPx: 0 | style: sharp', badge: 'rect-0px' },
      { id: 'ch8', name: 'motion', val: 'linear | duration: 100ms | instant-snap', badge: 'linear-snap' },
      { id: 'ch9', name: 'grid', val: 'logic: symmetric | cols: 16', badge: 'dense-telemetry' },
      { id: 'ch17', name: 'accessibility', val: 'contrastRatio: 7.0+ | respectPref: active', badge: 'wcag-aaa' }
    ],
    css: `:root {
  /* Seed: y2k-gaming-championship-2026 */
  --font-display: 'Fira Code', monospace;
  --font-body: 'Inconsolata', monospace;
  --genome-unit: 6px;
  
  --color-primary: #00ff00;
  --color-primary-interactive: #39ff14;
  --color-surface-0: #050505;
  --color-surface-1: #111111;
  --color-surface-2: #1c1c1c;
  --color-surface-3: #2a2a2a;
  
  --genome-border-radius: 0px;
  --genome-easing: steps(4, end);
  --genome-duration: 100ms;
}`
  },
  'biotech-forest': {
    intent: 'A clean, botanical laboratory dashboard. Deep leaf forest surface stacks, organic glowing emerald-lime accents, fluid circular elements, smooth micro-interactions.',
    seed: 'synthetic-biology-genome-2026',
    hash: 'a14ce9c20a4b8df283ef9955fa24b5dca65839070a2569ef81bc7e1a3bc8fd05a',
    sector: 'healthcare',
    prose: `<p><strong>Design Thesis:</strong> A warm, bio-synthetic environment inspired by <strong>Stratified Canopy Biomes</strong>. Surfaces are deeply saturated with high-depth leafy undertones. Interaction points glow like bioluminescent spores.</p>
            <h5>Aesthetic Mandates</h5>
            <ul class="bullet-list-custom">
              <li>Use modern circular geometric fonts (Outfit) to signify natural carbon bonds.</li>
              <li>Edges are heavily rounded (16px) to express fluid organic structure.</li>
              <li>Transitions utilize ultra-smooth, slow ease curves (400ms duration).</li>
            </ul>
            <h5>Forbidden Slop Patterns</h5>
            <ul class="bullet-list-custom slop-list">
              <li>NO raw 90-degree corners or technical monospace grid blocks.</li>
              <li>NO highly aggressive neon colors (e.g. magenta, cyan).</li>
              <li>NO hard border outlines (use soft inner shadows instead).</li>
            </ul>`,
    chromosomes: [
      { id: 'ch1', name: 'structure', val: 'maxNesting: 4 | sections: 5', badge: 'hierarchical' },
      { id: 'ch2', name: 'spacing_unit', val: 'baseUnitPx: 10px | ratio: 1.618', badge: 'golden-ratio' },
      { id: 'ch3', name: 'type_display', val: 'Outfit (circular-geometric)', badge: 'import-google' },
      { id: 'ch4', name: 'type_body', val: 'Outfit (light-weight)', badge: 'import-google' },
      { id: 'ch5', name: 'color_primary', val: 'hue: 92 | hex: #48a80d | dark: #a3ff12', badge: 'foliage-biom' },
      { id: 'ch6', name: 'color_temp', val: 'warm | mossStack (#070b08, #0e1510...)', badge: 'leaf-canopy' },
      { id: 'ch7', name: 'edge', val: 'borderRadiusPx: 16 | style: organic', badge: 'rect-16px' },
      { id: 'ch8', name: 'motion', val: 'ease-in-out | duration: 400ms | organic-flow', badge: 'fluid-ease' },
      { id: 'ch9', name: 'grid', val: 'logic: asymmetric | cols: 12', badge: 'asymmetric-0.2' },
      { id: 'ch17', name: 'accessibility', val: 'contrastRatio: 4.8 | respectPref: active', badge: 'wcag-aa' }
    ],
    css: `:root {
  /* Seed: synthetic-biology-genome-2026 */
  --font-display: 'Outfit', sans-serif;
  --font-body: 'Outfit', sans-serif;
  --genome-unit: 10px;
  
  --color-primary: #48a80d;
  --color-primary-interactive: #a3ff12;
  --color-surface-0: #070b08;
  --color-surface-1: #0e1510;
  --color-surface-2: #16241a;
  --color-surface-3: #223727;
  
  --genome-border-radius: 16px;
  --genome-easing: cubic-bezier(0.4, 0.0, 0.2, 1);
  --genome-duration: 400ms;
}`
  },
  'editorial-neon': {
    intent: 'A high-contrast cyber-brutalist newspaper from 2085. Warm paper-textured dark slate backdrops, radioactive neon pink highlights, heavy border lines, raw monospace offsets.',
    seed: 'retro-newspaper-future-2026',
    hash: 'fb32c9c20a4b8df283ef9955fa24b5dca65839070a2569ef81bc7e1a3bc8fd78b',
    sector: 'publishing',
    prose: `<p><strong>Design Thesis:</strong> Sequences into a radioactive <strong>Cyber Brutalist Newsroom</strong> profile. Warm slate gray backdrop provides reading comfort, punctuated by high emission neon pink blocks. Enforces dense typographic grids.</p>
            <h5>Aesthetic Mandates</h5>
            <ul class="bullet-list-custom">
              <li>Use large condensed Serif display types (Playfair Display) for headlines.</li>
              <li>Borders use heavy solid charcoal grid lines with offset shadow panels.</li>
              <li>Micro-interactions are snappy with slight elastic overshoot hooks.</li>
            </ul>
            <h5>Forbidden Slop Patterns</h5>
            <ul class="bullet-list-custom slop-list">
              <li>NO generic sans-serif default system body fonts.</li>
              <li>NO rounded glassmorphic elements or radial backdrop-filters.</li>
              <li>NO flat, shadowless cards.</li>
            </ul>`,
    chromosomes: [
      { id: 'ch1', name: 'structure', val: 'maxNesting: 2 | sections: 4', badge: 'news-column' },
      { id: 'ch2', name: 'spacing_unit', val: 'baseUnitPx: 9px | ratio: 1.4', badge: 'modular' },
      { id: 'ch3', name: 'type_display', val: 'Playfair Display (neo-classical)', badge: 'import-google' },
      { id: 'ch4', name: 'type_body', val: 'Satoshi (humanist-geometric)', badge: 'import-fontshare' },
      { id: 'ch5', name: 'color_primary', val: 'hue: 330 | hex: #d1006c | dark: #ff1493', badge: 'radioactive-pink' },
      { id: 'ch6', name: 'color_temp', val: 'warm | slateStack (#121010, #1b1717...)', badge: 'charcoal-paper' },
      { id: 'ch7', name: 'edge', val: 'borderRadiusPx: 4 | style: sharp-rounded', badge: 'rect-4px' },
      { id: 'ch8', name: 'motion', val: 'spring | duration: 200ms | elastic-snap', badge: 'overshoot-snap' },
      { id: 'ch9', name: 'grid', val: 'logic: asymmetric | cols: 8', badge: 'editorial-grid' },
      { id: 'ch17', name: 'accessibility', val: 'contrastRatio: 5.0 | respectPref: active', badge: 'wcag-aa' }
    ],
    css: `:root {
  /* Seed: retro-newspaper-future-2026 */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Satoshi', sans-serif;
  --genome-unit: 9px;
  
  --color-primary: #d1006c;
  --color-primary-interactive: #ff1493;
  --color-surface-0: #121010;
  --color-surface-1: #1b1717;
  --color-surface-2: #262121;
  --color-surface-3: #332b2b;
  
  --genome-border-radius: 4px;
  --genome-easing: cubic-bezier(0.25, 1.25, 0.5, 1);
  --genome-duration: 200ms;
}`
  }
};

function initSandboxEngine() {
  const presetSelector = document.getElementById('sb-preset');
  const intentInput = document.getElementById('sb-intent');
  const seedInput = document.getElementById('sb-seed');
  const simulateBtn = document.getElementById('btn-simulate-sequence');
  
  const outputTabs = document.querySelectorAll('.output-tab');
  const outputPanes = document.querySelectorAll('.out-pane');

  if (!presetSelector || !intentInput || !seedInput || !simulateBtn) return;

  // 1. Output tab-switching logic
  outputTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      if (!targetTab) return;

      outputTabs.forEach(t => t.classList.remove('active'));
      outputPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetTab);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 2. Preset dropdown trigger
  window.loadPreset = function() {
    const key = presetSelector.value;
    const data = GENOME_PRESETS[key];
    if (!data) return;

    // Load values into input controls
    intentInput.value = data.intent;
    seedInput.value = data.seed;
    
    // Auto simulate
    runSandboxSimulation(data);
  };

  // 3. Sequencer Simulation button trigger
  simulateBtn.addEventListener('click', () => {
    const key = presetSelector.value;
    const data = GENOME_PRESETS[key];
    if (!data) return;

    // Use current input box text overrides to create an on-the-fly "custom" simulation if changed
    const customData = {
      intent: intentInput.value,
      seed: seedInput.value,
      hash: generateMockHash(seedInput.value),
      sector: data.sector,
      prose: data.prose,
      chromosomes: [...data.chromosomes],
      css: data.css
    };

    // Override the seed title if changed
    customData.css = customData.css.replace(/\/\* Seed: .* \*\//, `/* Seed: ${customData.seed} */`);

    runSandboxSimulation(customData);
  });

  // Run initial default preset
  loadPreset();
}

/* Simulates the real-time sequencing effect inside the sandbox panel */
function runSandboxSimulation(data) {
  const simulateBtn = document.getElementById('btn-simulate-sequence');
  const reportTabBtn = document.getElementById('out-btn-report');
  
  // Elements to update
  const hashString = document.getElementById('hash-string');
  const blockSeed = document.querySelector('#block-seed .block-val');
  const blockL1 = document.querySelector('#block-l1 .block-val');
  const blockL2 = document.querySelector('#block-l2 .block-val');

  // Disable button and animate text to simulate CPU computations
  simulateBtn.disabled = true;
  simulateBtn.textContent = '🧬 SEQUENCING DESIGN CHROMOSOMES...';

  // Toggle report tab to active during build
  reportTabBtn.click();

  let tickCount = 0;
  const originalDnaNodes = document.getElementById('dna-bond-nodes').innerHTML;
  
  // Scramble visual cards during simulation
  const scrambleInterval = setInterval(() => {
    if (hashString) {
      hashString.textContent = generateMockHash(Math.random().toString());
    }
    tickCount++;
  }, 80);

  setTimeout(() => {
    clearInterval(scrambleInterval);
    simulateBtn.disabled = false;
    simulateBtn.textContent = '🧬 Run Sequencer Simulation';

    // 1. Render primary hero DNA card values
    if (hashString) hashString.textContent = data.hash;
    if (blockSeed) blockSeed.textContent = data.seed;
    
    // Capitalize sector name for card
    const sectorNameFormatted = data.sector.charAt(0).toUpperCase() + data.sector.slice(1);
    if (blockL2) blockL2.textContent = `${sectorNameFormatted} Ecosystem`;

    // Map aesthetic theme name to card
    let aestheticsName = 'Obsidian Surface + Spring Easing';
    if (data.sector === 'gaming') aestheticsName = 'Brutalist Flat + Linear Snaps';
    if (data.sector === 'healthcare') aestheticsName = 'Forest Canopy + Fluid Easing';
    if (data.sector === 'publishing') aestheticsName = 'Charcoal Editorial + Elastic Snap';
    if (blockL1) blockL1.textContent = aestheticsName;

    // 2. Render report prose
    const hashSpan = document.getElementById('out-hash');
    const sectorSpan = document.getElementById('out-sector');
    const reportProseBody = document.getElementById('report-prose-body');

    if (hashSpan) hashSpan.textContent = data.hash.substring(0, 32) + '...';
    if (sectorSpan) sectorSpan.textContent = data.sector;
    if (reportProseBody) reportProseBody.innerHTML = data.prose;

    // 3. Render chromosome cards list
    const chromGrid = document.getElementById('chrom-nodes-grid');
    if (chromGrid) {
      chromGrid.innerHTML = '';
      data.chromosomes.forEach(c => {
        const card = document.createElement('div');
        card.setAttribute('class', 'chrom-card');
        
        card.innerHTML = `
          <span class="chrom-index">${c.id}</span>
          <div class="chrom-body">
            <span class="chrom-name">${c.name}</span>
            <span class="chrom-value" title="${c.val}">${c.val}</span>
          </div>
        `;
        chromGrid.appendChild(card);
      });
    }

    // 4. Render live CSS code text
    const liveCssCode = document.getElementById('live-css-code');
    if (liveCssCode) {
      liveCssCode.textContent = data.css;
    }

    // Dynamic UI styling sync!
    // Dynamically change the primary glow color depending on the selected ecosystem preset!
    let interactiveHex = '#1be4eb';
    let primaryHex = '#0e9ba4';
    if (data.sector === 'gaming') { interactiveHex = '#39ff14'; primaryHex = '#00ff00'; }
    if (data.sector === 'healthcare') { interactiveHex = '#a3ff12'; primaryHex = '#48a80d'; }
    if (data.sector === 'publishing') { interactiveHex = '#ff1493'; primaryHex = '#d1006c'; }

    document.documentElement.style.setProperty('--color-primary-interactive', interactiveHex);
    document.documentElement.style.setProperty('--color-primary', primaryHex);

    // Dynamic bonds color update
    const dots = document.querySelectorAll('.dna-node-dot');
    dots.forEach(d => d.setAttribute('fill', interactiveHex));
    
  }, 1000);
}

/* Helper to make a rapid deterministic mock hash for sandbox edits */
function generateMockHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Hex conversion
  let hex = Math.abs(hash).toString(16);
  while (hex.length < 8) hex = '0' + hex;
  
  // Pad out to make it look like a SHA-256 hash (64 characters)
  const sha = hex + '8df283ef9955fa24b5dca65839070a2569ef81bc7e1a3bc8fde' + hex.substring(0, 4);
  return sha;
}

/* Switch flow visualizer diagram tabs */
window.switchFlow = function(flowType) {
  const stdBtn = document.getElementById('flow-btn-std');
  const creatorBtn = document.getElementById('flow-btn-creator');
  const stdDiag = document.getElementById('diag-flow-std');
  const creatorDiag = document.getElementById('diag-flow-creator');

  if (!stdBtn || !creatorBtn || !stdDiag || !creatorDiag) return;

  if (flowType === 'std') {
    stdBtn.classList.add('active');
    creatorBtn.classList.remove('active');
    stdDiag.classList.add('active');
    creatorDiag.classList.remove('active');
  } else {
    stdBtn.classList.remove('active');
    creatorBtn.classList.add('active');
    stdDiag.classList.remove('active');
    creatorDiag.classList.add('active');
  }
};
