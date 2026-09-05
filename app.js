/* ==========================================================================
   Rajiv M - AI & Data Science Engineer Portfolio
   Interactive Physics, 3D Hover Effects & Scroll Dynamics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCandidateDossierPreloader();
  initLenisSmoothScroll();
  initScrollProgress();
  initDualCursor();
  initMobileNavigation();
  initMagneticElements();
  init3DCardTiltAndSpotlight();
  initKineticHeadingSplit();
  initScrollRevealAnimations();
  initParallaxScroll();
  initAiWorkbench();
  initScrollCounters();
  initNavActiveState();
  initResumeModal();
});

/* --------------------------------------------------------------------------
   -1. High-Impact Executive AI Candidate Dossier Preloader
   -------------------------------------------------------------------------- */
function initCandidateDossierPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const fillEl = document.getElementById('preloaderFill');
  const percentEl = document.getElementById('loaderPercent');
  const stageEl = document.getElementById('loaderStage');
  const termTextEl = document.getElementById('termText');
  const btnSkip = document.getElementById('btnSkipLoader');

  let currentPercent = 0;
  let isFinished = false;

  const stages = [
    { threshold: 0, stage: 'DEV_PROFILE', text: '[01/04] Loading Software Development Profile...' },
    { threshold: 25, stage: 'TECH_STACK', text: '[02/04] Initializing Python • AI & ML • Web Development...' },
    { threshold: 55, stage: 'PROJECTS_EXP', text: '[03/04] Loading Projects & Technical Experience...' },
    { threshold: 85, stage: 'PROFILE_READY', text: '[04/04] Profile Ready — Welcome to Rajiv M.' }
  ];

  function finishLoader() {
    if (isFinished) return;
    isFinished = true;

    if (fillEl) fillEl.style.width = '100%';
    if (percentEl) percentEl.textContent = '100%';
    if (stageEl) stageEl.textContent = 'PROFILE_READY';
    if (termTextEl) termTextEl.textContent = '[04/04] Profile Ready — Welcome to Rajiv M.';

    setTimeout(() => {
      preloader.classList.add('preloader-hidden');
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 750);
    }, 200);
  }

  // Linear / Ease progress ticker over ~2.2 seconds targeted
  const startTime = performance.now();
  const totalDuration = 2200; // 2.2 seconds

  function updateLoader(now) {
    if (isFinished) return;

    const elapsed = now - startTime;
    let progress = Math.min(elapsed / totalDuration, 1);
    // Smooth ease-out curve
    const ease = 1 - Math.pow(1 - progress, 2.3);
    currentPercent = Math.min(Math.floor(ease * 100), 100);

    if (fillEl) fillEl.style.width = `${currentPercent}%`;
    if (percentEl) percentEl.textContent = `${currentPercent < 10 ? '0' : ''}${currentPercent}%`;

    // Find active stage
    for (let i = stages.length - 1; i >= 0; i--) {
      if (currentPercent >= stages[i].threshold) {
        if (stageEl && stageEl.textContent !== stages[i].stage) {
          stageEl.textContent = stages[i].stage;
        }
        if (termTextEl && termTextEl.textContent !== stages[i].text) {
          termTextEl.textContent = stages[i].text;
        }
        break;
      }
    }

    if (progress < 1) {
      requestAnimationFrame(updateLoader);
    } else {
      finishLoader();
    }
  }

  requestAnimationFrame(updateLoader);

  // Skip handlers (clicking button or anywhere on screen, or pressing ESC)
  if (btnSkip) {
    btnSkip.addEventListener('click', (e) => {
      e.stopPropagation();
      finishLoader();
    });
  }

  preloader.addEventListener('click', finishLoader);

  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape' && !isFinished) {
      finishLoader();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

/* --------------------------------------------------------------------------
   0. Lenis Smooth Momentum Inertial Scroll Engine
   -------------------------------------------------------------------------- */
let lenisInstance = null;

function initLenisSmoothScroll() {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    lenisInstance = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false
    });

    lenisInstance.on('scroll', () => {
      requestDualScrollUpdate();
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth navigation anchor interception
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenisInstance.scrollTo(targetEl, { offset: -50, duration: 1.3 });
        }
      });
    });
  } catch (err) {
    console.warn('Lenis init failed, using standard scroll', err);
  }
}

/* --------------------------------------------------------------------------
   1. Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* --------------------------------------------------------------------------
   2. Custom Dual Cursor System (Context-Aware Element-Level Theme Follower)
   -------------------------------------------------------------------------- */
function initDualCursor() {
  const follower = document.getElementById('cursorFollower');
  const dot = document.getElementById('cursorDot');
  if (!follower || !dot) return;

  // Disable completely on touch / mobile devices
  if (window.matchMedia && (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches)) {
    follower.style.display = 'none';
    dot.style.display = 'none';
    return;
  }

  // Also disable on first touch interaction
  window.addEventListener('touchstart', function onFirstTouch() {
    follower.style.display = 'none';
    dot.style.display = 'none';
    window.removeEventListener('touchstart', onFirstTouch);
  }, { passive: true, once: true });

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let isSkyMode = false;

  // Selectors defining explicitly dark surfaces (Priority 1: Always RED cursor)
  const DARK_SURFACE_SELECTOR = [
    '[data-theme="dark"]',
    '[data-theme="black"]',
    '.dark-section',
    '.hero-section',
    '.console-section',
    '.console-card',
    '.dark-tech-card',
    '.skill-category-card',
    '.dark-split-case',
    '.case-card',
    '.counter-section',
    '.counter-card',
    '.collab-section',
    '.collab-card',
    '.contact-section',
    '.enquiry-card',
    '.platform-card',
    '.simulator-wrapper',
    '.simulator-device',
    '.nav-shell',
    '.btn-red',
    '.btn-whatsapp',
    '.portrait-card',
    '.resume-modal-container',
    '.resume-modal-backdrop',
    '.site-footer'
  ].join(', ');

  // Selectors defining light surfaces (Priority 2: LIGHT SKY BLUE cursor)
  const LIGHT_SURFACE_SELECTOR = [
    '[data-theme="light"]',
    '.light-section',
    '.bg-light-gray'
  ].join(', ');

  function detectSurface(clientX, clientY, targetEl) {
    let el = targetEl;
    if (!el || !el.closest) {
      el = document.elementFromPoint(clientX, clientY);
    }
    if (!el || !el.closest) return;

    // Priority 1: Check if pointer is directly inside a dark container/card/button/panel
    const isDarkSurface = el.closest(DARK_SURFACE_SELECTOR);
    if (isDarkSurface) {
      setCursorSky(false);
      return;
    }

    // Priority 2: Check if pointer is on a light container/section
    const isLightSurface = el.closest(LIGHT_SURFACE_SELECTOR);
    if (isLightSurface) {
      setCursorSky(true);
      return;
    }

    // Default to dark/red (since global page background is black)
    setCursorSky(false);
  }

  function setCursorSky(enable) {
    if (enable === isSkyMode) return;
    isSkyMode = enable;
    if (isSkyMode) {
      document.body.classList.add('cursor-theme-light');
      follower.classList.add('cursor-sky');
      dot.classList.add('cursor-sky');
    } else {
      document.body.classList.remove('cursor-theme-light');
      follower.classList.remove('cursor-sky');
      dot.classList.remove('cursor-sky');
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant dot movement
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    // Context-aware surface detection
    detectSurface(mouseX, mouseY, e.target);
  }, { passive: true });

  window.addEventListener('scroll', () => {
    detectSurface(mouseX, mouseY, null);
  }, { passive: true });

  // Smooth lerp follower loop using requestAnimationFrame
  function renderFollower() {
    const ease = 0.18;
    followerX += (mouseX - followerX) * ease;
    followerY += (mouseY - followerY) * ease;

    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hide cursor on mouseleave window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

/* --------------------------------------------------------------------------
   3. Magnetic Button & Element Physics
   -------------------------------------------------------------------------- */
function initMagneticElements() {
  const magneticEls = document.querySelectorAll('.magnetic, .btn, .floating-chip, .case-tech-tags span');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic pull factor
      const factor = el.classList.contains('floating-chip') ? 0.35 : 0.25;
      el.style.transition = 'none';
      el.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'translate3d(0px, 0px, 0)';
      setTimeout(() => {
        el.style.transition = '';
      }, 500);
    });
  });
}

/* --------------------------------------------------------------------------
   4. 3D Tilt Card & Dynamic Spotlight Glare Physics
   -------------------------------------------------------------------------- */
function init3DCardTiltAndSpotlight() {
  const tiltCards = document.querySelectorAll(
    '.console-card, .case-card, .service-card, .timeline-card, .experience-card, .stat-card, .skill-category-card, .portrait-card, .contact-card, .tilt-card'
  );

  tiltCards.forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.35s ease, border-color 0.35s ease';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation angles (max +/- 6deg for smooth elegance)
      const rotateX = Math.max(-6, Math.min(6, ((y - centerY) / centerY) * -5.5));
      const rotateY = Math.max(-6, Math.min(6, ((x - centerX) / centerX) * 5.5));

      // Calculate percentage for spotlight gradient
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      card.style.setProperty('--mouse-x', `${percentX.toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${percentY.toFixed(1)}%`);
      card.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.35s ease';
      card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   4.5 Dual Scroll-Scrubbed Engine: Kinetic Letter Wave + Active Depth Blur
   -------------------------------------------------------------------------- */
let scrubbableHeadings = [];
let scrollFadeElements = [];
let dualScrollTicking = false;

function initKineticHeadingSplit() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 1. Setup Word-Safe Kinetic Character Splitting for Section Headings
  const headings = document.querySelectorAll(
    '.section-title, .collab-title, .hero-heading'
  );

  scrubbableHeadings = [];

  headings.forEach(heading => {
    if (heading.dataset.charSplit === 'true') return;
    heading.dataset.charSplit = 'true';

    const charSpans = [];

    function processNode(node) {
      const fragment = document.createDocumentFragment();

      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          const tokens = text.split(/(\s+)/);

          tokens.forEach(token => {
            if (!token) return;
            if (/^\s+$/.test(token)) {
              const spaceSpan = document.createElement('span');
              spaceSpan.className = 'char-space';
              spaceSpan.innerHTML = '&nbsp;';
              fragment.appendChild(spaceSpan);
            } else {
              const wordWrapper = document.createElement('span');
              wordWrapper.className = 'word-wrapper';

              for (let i = 0; i < token.length; i++) {
                const char = token[i];
                const charWrapper = document.createElement('span');
                charWrapper.className = 'char-wrapper';
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = char;

                charWrapper.appendChild(charSpan);
                wordWrapper.appendChild(charWrapper);
                charSpans.push(charSpan);
              }

              fragment.appendChild(wordWrapper);
            }
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName.toLowerCase() === 'br') {
            fragment.appendChild(child.cloneNode(true));
          } else {
            const clonedEl = child.cloneNode(false);
            const innerFragment = processNode(child);
            clonedEl.appendChild(innerFragment);
            fragment.appendChild(clonedEl);
          }
        }
      });

      return fragment;
    }

    const newContent = processNode(heading);
    heading.innerHTML = '';
    heading.appendChild(newContent);

    scrubbableHeadings.push({
      element: heading,
      isHero: heading.classList.contains('hero-heading'),
      chars: charSpans
    });
  });

  // 2. Setup Active Overlap Depth-Blur on Upcoming Content Cards & Grids
  const targetSelectors = [
    '.console-card',
    '.about-layout',
    '.timeline-card',
    '.skill-category-card',
    '.case-card',
    '.counter-card',
    '.experience-card',
    '.cert-card',
    '.collab-card'
  ];

  const elements = document.querySelectorAll(targetSelectors.join(', '));
  scrollFadeElements = [];

  elements.forEach(el => {
    el.classList.add('scroll-fade-item');
    scrollFadeElements.push(el);
  });

  window.addEventListener('scroll', requestDualScrollUpdate, { passive: true });
  window.addEventListener('resize', requestDualScrollUpdate, { passive: true });
  updateDualScroll();
}

function requestDualScrollUpdate() {
  if (!dualScrollTicking) {
    requestAnimationFrame(updateDualScroll);
    dualScrollTicking = true;
  }
}

function updateDualScroll() {
  const winH = window.innerHeight || document.documentElement.clientHeight;

  // A. Update Kinetic Character Wave on Headings
  scrubbableHeadings.forEach(item => {
    const chars = item.chars;
    const totalChars = chars.length;
    if (totalChars === 0) return;

    if (item.isHero) {
      chars.forEach(charSpan => {
        charSpan.style.transform = 'translateY(0%) rotateX(0deg)';
        charSpan.style.opacity = '1';
        charSpan.style.filter = 'none';
      });
      return;
    }

    const rect = item.element.getBoundingClientRect();

    // Active scrub zone: starts at 98% of viewport, completes by 55% (half page)
    const enterZone = winH * 0.98;
    const completeZone = winH * 0.55;
    const travelDistance = enterZone - completeZone;

    let progress = (enterZone - rect.top) / travelDistance;
    progress = Math.min(Math.max(progress, 0), 1);

    if (progress >= 0.99 || rect.top <= completeZone) {
      chars.forEach(charSpan => {
        charSpan.style.transform = 'translateY(0%) rotateX(0deg)';
        charSpan.style.opacity = '1';
        charSpan.style.filter = 'none';
      });
      return;
    }

    const charWindow = 0.45;
    const step = totalChars > 1 ? (1 - charWindow) / (totalChars - 1) : 0;

    chars.forEach((charSpan, idx) => {
      const startT = idx * step;
      let charProgress = (progress - startT) / charWindow;
      charProgress = Math.min(Math.max(charProgress, 0), 1);

      const ease = charProgress * (2 - charProgress); // Quad ease-out

      const translateY = ((1 - ease) * 115).toFixed(2);
      const rotateX = ((1 - ease) * -12).toFixed(2);
      const opacity = Math.min(ease * 1.3, 1).toFixed(3);
      const blur = ((1 - ease) * 7).toFixed(2);

      charSpan.style.transform = `translateY(${translateY}%) rotateX(${rotateX}deg)`;
      charSpan.style.opacity = opacity;
      charSpan.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
    });
  });

  // B. Active Overlap Depth-Blur on Upcoming Content
  scrollFadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();

    const enterZone = winH * 0.98;
    const completeZone = winH * 0.55;
    const travelDistance = enterZone - completeZone;

    let progress = (enterZone - rect.top) / travelDistance;
    progress = Math.min(Math.max(progress, 0), 1);

    const ease = progress * progress * (3 - 2 * progress); // Hermite smoothstep

    if (ease >= 0.98 || rect.top <= completeZone) {
      el.style.filter = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    } else {
      const blur = ((1 - ease) * 16).toFixed(1);
      const opacity = (0.20 + ease * 0.80).toFixed(3);
      const translateY = ((1 - ease) * 22).toFixed(1);

      el.style.filter = `blur(${blur}px)`;
      el.style.opacity = opacity;
      el.style.transform = `translate3d(0, ${translateY}px, 0)`;
    }
  });

  dualScrollTicking = false;
}

/* --------------------------------------------------------------------------
   5. Scroll Reveal & Accent Line Expansion
   -------------------------------------------------------------------------- */
function initScrollRevealAnimations() {
  const accentLines = document.querySelectorAll('.title-accent-line, .card-title-line, .section-tag');

  accentLines.forEach(el => {
    el.classList.add('reveal-init');
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  accentLines.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. Parallax Motion on Scroll
   -------------------------------------------------------------------------- */
function initParallaxScroll() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const watermark = document.querySelector('.hero-watermark');
  const heroOrb = document.querySelector('.hero-red-orb');
  const portraitCard = document.querySelector('.portrait-card');
  const contactOrb = document.querySelector('.contact-glow-orb');

  let ticking = false;

  function updateParallax() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY < window.innerHeight * 1.5) {
      if (watermark) {
        watermark.style.transform = `translate3d(0, ${(scrollY * 0.12).toFixed(2)}px, 0)`;
      }
      if (heroOrb) {
        heroOrb.style.transform = `translate(-5%, -50%) translate3d(0, ${(scrollY * 0.08).toFixed(2)}px, 0)`;
      }
      if (portraitCard && window.innerWidth > 900) {
        portraitCard.style.transform = `translate3d(0, ${(scrollY * 0.05).toFixed(2)}px, 0)`;
      }
    }

    if (contactOrb) {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight - rect.top) * 0.05;
          contactOrb.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        }
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
}

/* --------------------------------------------------------------------------
   7. Interactive AI Neural Workbench Simulator & Cyberdeck
   -------------------------------------------------------------------------- */
const WORKBENCH_DATA = {
  'food-cnn': {
    indexStr: 'PROJECT 01 / 03',
    modelFile: 'CNN_FOOD_V2.keras',
    projectAnchor: '#project-food',
    hwSpec: 'TENSOR CORE / CUDA',
    title: '>_ INFERENCE: Food Classifier (CNN)',
    freq: 'SIMULATION ACTIVE',
    techStack: ['Python', 'TensorFlow', 'Keras', 'CNN'],
    render: (highlightStep = -1) => `
      <div class="sim-tech-row font-mono">
        <span>TECH STACK:</span>
        <div class="sim-tech-pills">
          <span class="sim-tech-pill">Python</span>
          <span class="sim-tech-pill">TensorFlow</span>
          <span class="sim-tech-pill">Keras</span>
          <span class="sim-tech-pill">CNN</span>
        </div>
      </div>

      <div class="sim-pipeline-box font-mono">
        <div class="sim-pipeline-label">
          <span>PIPELINE FLOW</span>
          <span class="text-red">SEQUENTIAL INFERENCE</span>
        </div>
        <div class="sim-pipeline-flow">
          <span class="pipe-node ${highlightStep === 0 || highlightStep === -1 ? 'highlight' : ''}">IMAGE INPUT</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 1 || highlightStep === -1 ? 'highlight' : ''}">PREPROCESS</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 2 || highlightStep === -1 ? 'highlight' : ''}">CNN [80-CLS]</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 3 || highlightStep === -1 ? 'highlight' : ''}">FOOD PRED</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 4 || highlightStep === -1 ? 'highlight' : ''}">NUTRITION</span>
        </div>
      </div>

      <div class="prediction-panel font-mono">
        <div class="pred-row">
          <span>Target: <strong>Masala Dosa</strong></span>
          <span class="text-red">94.2% ACC</span>
        </div>
        <div class="pred-bar"><div class="pred-bar-fill" style="width: 94.2%;"></div></div>
        <div class="pred-row text-white/60" style="font-size: 0.7rem;">
          <span>Calories: <strong>350 kcal (&plusmn;8.4%)</strong></span>
          <span>Carbs: 48g | Protein: 8g</span>
        </div>
      </div>

      <div class="telemetry-strip font-mono">
        <span class="telemetry-label">SIMULATED TELEMETRY:</span>
        <div class="telemetry-bars">
          <span class="telemetry-bar" style="height: 35%;"></span>
          <span class="telemetry-bar" style="height: 65%;"></span>
          <span class="telemetry-bar" style="height: 90%;"></span>
          <span class="telemetry-bar" style="height: 45%;"></span>
          <span class="telemetry-bar" style="height: 80%;"></span>
          <span class="telemetry-bar" style="height: 100%;"></span>
          <span class="telemetry-bar" style="height: 70%;"></span>
          <span class="telemetry-bar" style="height: 85%;"></span>
        </div>
      </div>
    `,
    logs: [
      '> [TensorFlow 2.x] Loaded weights: cnn_indian_food_80.keras',
      '> [Preprocessing] Image normalized: [224x224x3] in 4.2ms',
      '> [Classification] Class 38: Masala Dosa (Conf: 94.2%)',
      '> [Calorie Estimation] Est: 350 kcal | Bounds: [320 - 380 kcal]'
    ],
    rerunLogs: [
      '> [RE-TRIGGER] INGESTING [224x224x3] FRAME TENSORS...',
      '> [CONV2D] ACTIVATING 80-CATEGORY FEATURE MAPS...',
      '> [SOFTMAX] PROBABILITY CONVERGENCE: 94.2% CONFIDENCE',
      '> [NUTRITION] MACRO ESTIMATE SYNCED (350 kcal ±8.4%)'
    ]
  },
  'doc-retrieval': {
    indexStr: 'PROJECT 02 / 03',
    modelFile: 'BIM_RANKER_TFIDF.bin',
    projectAnchor: '#project-bim',
    hwSpec: 'DENSE MATRIX ENGINE',
    title: '>_ NLP: BIM Probabilistic Ranking',
    freq: 'SIMULATION ACTIVE',
    techStack: ['Python', 'NLP', 'TF-IDF', 'Cosine Sim'],
    render: (highlightStep = -1) => `
      <div class="sim-tech-row font-mono">
        <span>TECH STACK:</span>
        <div class="sim-tech-pills">
          <span class="sim-tech-pill">Python</span>
          <span class="sim-tech-pill">NLP</span>
          <span class="sim-tech-pill">TF-IDF</span>
          <span class="sim-tech-pill">Cosine Sim</span>
        </div>
      </div>

      <div class="sim-pipeline-box font-mono">
        <div class="sim-pipeline-label">
          <span>PIPELINE FLOW</span>
          <span class="text-red">PROBABILISTIC IR</span>
        </div>
        <div class="sim-pipeline-flow">
          <span class="pipe-node ${highlightStep === 0 || highlightStep === -1 ? 'highlight' : ''}">DOC CORPUS</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 1 || highlightStep === -1 ? 'highlight' : ''}">TOKENIZE</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 2 || highlightStep === -1 ? 'highlight' : ''}">TF-IDF</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 3 || highlightStep === -1 ? 'highlight' : ''}">BIM LOG-ODDS</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 4 || highlightStep === -1 ? 'highlight' : ''}">TOP-K RANK</span>
        </div>
      </div>

      <div class="prediction-panel font-mono" style="width: 100%;">
        <div class="pred-row">
          <span>Query: <em>"neural retrieval optimization"</em></span>
          <span class="text-red">BIM Rank #1</span>
        </div>
        <div class="pred-bar"><div class="pred-bar-fill" style="width: 90%;"></div></div>
        <div class="pred-row text-white/70" style="font-size: 0.7rem; margin-top: 0.25rem;">
          <span>Doc ID: #DOC-1084</span>
          <span>Cosine Sim: <strong>0.924</strong></span>
        </div>
      </div>

      <div class="telemetry-strip font-mono">
        <span class="telemetry-label">SIMULATED TELEMETRY:</span>
        <div class="telemetry-bars">
          <span class="telemetry-bar" style="height: 50%;"></span>
          <span class="telemetry-bar" style="height: 75%;"></span>
          <span class="telemetry-bar" style="height: 100%;"></span>
          <span class="telemetry-bar" style="height: 85%;"></span>
          <span class="telemetry-bar" style="height: 90%;"></span>
          <span class="telemetry-bar" style="height: 60%;"></span>
          <span class="telemetry-bar" style="height: 95%;"></span>
          <span class="telemetry-bar" style="height: 80%;"></span>
        </div>
      </div>
    `,
    logs: [
      '> [TF-IDF] Vectorizing query tokens across 1,000+ documents',
      '> [Cosine Similarity] Computed dense matrix in 3.1ms',
      '> [BIM Feedback] Probabilistic term weights re-calculated (+20%)',
      '> [Retrieval] Ranked top 5 relevant documents with 90% precision'
    ],
    rerunLogs: [
      '> [RE-TRIGGER] PARSING NLP TOKENS ACROSS CORPUS...',
      '> [TF-IDF MATRIX] COMPUTING SPARSE TERM WEIGHTS...',
      '> [BIM SCORER] APPLYING LOG-ODDS RELEVANCE FEEDBACK...',
      '> [RANK COMPLETE] DOC #DOC-1084 RANKED #1 IN 3.1ms'
    ]
  },
  'face-cv': {
    indexStr: 'PROJECT 03 / 03',
    modelFile: 'HAAR_FACENET.onnx',
    projectAnchor: '#project-face',
    hwSpec: 'OPENCV STREAM ENGINE',
    title: '>_ VISION: Face Attendance Tracker',
    freq: 'SIMULATION ACTIVE',
    techStack: ['Python', 'OpenCV', 'FaceNet', 'CSV Stream'],
    render: (highlightStep = -1) => `
      <div class="sim-tech-row font-mono">
        <span>TECH STACK:</span>
        <div class="sim-tech-pills">
          <span class="sim-tech-pill">Python</span>
          <span class="sim-tech-pill">OpenCV</span>
          <span class="sim-tech-pill">FaceNet</span>
          <span class="sim-tech-pill">CSV Stream</span>
        </div>
      </div>

      <div class="sim-pipeline-box font-mono">
        <div class="sim-pipeline-label">
          <span>PIPELINE FLOW</span>
          <span class="text-red">REAL-TIME CV</span>
        </div>
        <div class="sim-pipeline-flow">
          <span class="pipe-node ${highlightStep === 0 || highlightStep === -1 ? 'highlight' : ''}">VIDEO RTSP</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 1 || highlightStep === -1 ? 'highlight' : ''}">DETECTION</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 2 || highlightStep === -1 ? 'highlight' : ''}">ALIGNMENT</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 3 || highlightStep === -1 ? 'highlight' : ''}">EMBEDDING</span>
          <span class="pipe-arrow">&rarr;</span>
          <span class="pipe-node ${highlightStep === 4 || highlightStep === -1 ? 'highlight' : ''}">CSV SYNC</span>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,42,42,0.04); border: 1px dashed rgba(255,42,42,0.4); border-radius: 8px; padding: 0.45rem 0.75rem; font-family: var(--font-mono); font-size: 0.7rem;">
        <span class="text-red font-bold">[FACE IDENTIFIED]</span>
        <span class="text-white/80">ID: ST-2024-08</span>
        <span class="text-emerald font-bold">CONF: 98.7%</span>
      </div>

      <div class="telemetry-strip font-mono">
        <span class="telemetry-label">SIMULATED TELEMETRY:</span>
        <div class="telemetry-bars">
          <span class="telemetry-bar" style="height: 80%;"></span>
          <span class="telemetry-bar" style="height: 95%;"></span>
          <span class="telemetry-bar" style="height: 60%;"></span>
          <span class="telemetry-bar" style="height: 100%;"></span>
          <span class="telemetry-bar" style="height: 85%;"></span>
          <span class="telemetry-bar" style="height: 90%;"></span>
          <span class="telemetry-bar" style="height: 75%;"></span>
          <span class="telemetry-bar" style="height: 95%;"></span>
        </div>
      </div>
    `,
    logs: [
      '> [OpenCV VideoCapture] Frame grabbed [1920x1080 @ 30fps]',
      '> [CascadeClassifier] Bounding box [x:120, y:85, w:180, h:180]',
      '> [Embedding Match] Distance 0.12 < Threshold 0.40 -> Verified',
      '> [CSV Stream] Appended row to attendance_log_2026.csv'
    ],
    rerunLogs: [
      '> [RE-TRIGGER] INGESTING REAL-TIME FRAME BUFFER...',
      '> [HAAR CASCADE] LOCALIZING MULTI-FACE BOUNDING BOXES...',
      '> [FEATURE EMBEDDING] VECTOR DISTANCE: 0.12 (MATCH CONFIRMED)',
      '> [CSV SYNC] ATTENDANCE ROW TIMESTAMPED & LOGGED'
    ]
  }
};

let currentModule = 'food-cnn';
let isSimulationRunning = false;

function initAiWorkbench() {
  const moduleBtns = document.querySelectorAll('.module-btn');
  const simActiveModel = document.getElementById('simActiveModel');
  const simHwSpec = document.getElementById('simHwSpec');
  const simProjectCounter = document.getElementById('simProjectCounter');
  const screenTitle = document.getElementById('screenTitle');
  const screenFreq = document.getElementById('screenFreq');
  const screenTerminal = document.getElementById('screenTerminal');
  const screenBody = document.getElementById('screenBody');
  const simScreen = document.getElementById('simScreen');
  const btnA = document.getElementById('simBtnA');
  const btnB = document.getElementById('simBtnB');
  const hwChips = document.querySelectorAll('.hw-chip[data-filter]');
  const simViewProjectLink = document.getElementById('simViewProjectLink') || document.querySelector('.sim-view-project-link');

  const moduleToFilter = {
    'food-cnn': 'cnn',
    'doc-retrieval': 'nlp',
    'face-cv': 'cv'
  };

  function updateWorkbench(modKey) {
    currentModule = modKey;
    const data = WORKBENCH_DATA[modKey];
    if (!data) return;

    moduleBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-module') === modKey);
    });

    // Synchronize red glow on top domain specification chips
    const activeFilter = moduleToFilter[modKey];
    hwChips.forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-filter') === activeFilter);
    });

    const counterEl = document.getElementById('simProjectCounter');
    if (counterEl) {
      counterEl.textContent = data.indexStr;
      counterEl.classList.add('counter-pop');
      setTimeout(() => counterEl.classList.remove('counter-pop'), 220);
    }
    if (simActiveModel) simActiveModel.textContent = data.modelFile;
    if (simHwSpec) simHwSpec.textContent = data.hwSpec;
    if (screenTitle) screenTitle.textContent = data.title;
    if (screenFreq) screenFreq.textContent = data.freq;

    if (simViewProjectLink && data.projectAnchor) {
      simViewProjectLink.setAttribute('href', data.projectAnchor);
    }

    if (screenBody && data.render) {
      screenBody.innerHTML = data.render(-1);
      if (window.lucide) window.lucide.createIcons();
    }

    if (screenTerminal) {
      screenTerminal.innerHTML = '';
      data.logs.forEach((log, index) => {
        const line = document.createElement('div');
        line.className = index === 2 ? 'terminal-line text-red' : index === 3 ? 'terminal-line text-white/90' : 'terminal-line text-white/50';
        line.textContent = log;
        screenTerminal.appendChild(line);
      });
      const cursor = document.createElement('span');
      cursor.className = 'term-cursor';
      screenTerminal.appendChild(cursor);
    }
  }

  function runSimulationSequence() {
    if (isSimulationRunning) return;
    isSimulationRunning = true;

    const data = WORKBENCH_DATA[currentModule];
    if (!data) return;

    if (simScreen) {
      simScreen.classList.add('sim-scanning');
    }

    if (screenTerminal) {
      screenTerminal.innerHTML = '';
      const runLog1 = document.createElement('div');
      runLog1.className = 'terminal-line text-red';
      runLog1.textContent = '> [SYSTEM] RUNNING SIMULATION SEQUENCE...';
      screenTerminal.appendChild(runLog1);
    }

    // Sequentially illuminate pipeline stages (0 to 4)
    const pipelineSteps = [0, 1, 2, 3, 4];
    pipelineSteps.forEach((stepIdx, idx) => {
      setTimeout(() => {
        if (screenBody && data.render) {
          screenBody.innerHTML = data.render(stepIdx);
          if (window.lucide) window.lucide.createIcons();
        }

        // Randomize telemetry bars during simulation
        const bars = screenBody.querySelectorAll('.telemetry-bar');
        bars.forEach(b => {
          b.style.height = `${Math.floor(Math.random() * 70) + 30}%`;
        });

        // Add log line
        if (screenTerminal && data.rerunLogs[idx]) {
          const logLine = document.createElement('div');
          logLine.className = idx === 3 ? 'terminal-line text-white/90' : 'terminal-line text-white/60';
          logLine.textContent = data.rerunLogs[idx];
          screenTerminal.appendChild(logLine);
        }
      }, idx * 170);
    });

    // Finalize after 950ms
    setTimeout(() => {
      if (simScreen) {
        simScreen.classList.remove('sim-scanning');
      }
      updateWorkbench(currentModule);
      isSimulationRunning = false;
    }, 950);
  }

  moduleBtns.forEach(btn => {
    const modKey = btn.getAttribute('data-module');
    const filter = moduleToFilter[modKey];

    btn.addEventListener('click', () => {
      updateWorkbench(modKey);
    });

    // Interactive red glow feedback on hover/touch
    btn.addEventListener('mouseenter', () => {
      hwChips.forEach(chip => {
        if (chip.getAttribute('data-filter') === filter) {
          chip.classList.add('hover-linked');
        }
      });
    });

    btn.addEventListener('mouseleave', () => {
      hwChips.forEach(chip => chip.classList.remove('hover-linked'));
    });
  });

  // Category pills trigger corresponding project & glow
  hwChips.forEach(chip => {
    const filter = chip.getAttribute('data-filter');
    const matchingModKey = Object.keys(moduleToFilter).find(k => moduleToFilter[k] === filter);

    chip.addEventListener('click', () => {
      if (matchingModKey) updateWorkbench(matchingModKey);
    });

    chip.addEventListener('mouseenter', () => {
      moduleBtns.forEach(btn => {
        if (btn.getAttribute('data-module') === matchingModKey) {
          btn.classList.add('hover-linked');
        }
      });
    });

    chip.addEventListener('mouseleave', () => {
      moduleBtns.forEach(btn => btn.classList.remove('hover-linked'));
    });
  });

  if (btnA) {
    btnA.addEventListener('click', () => {
      runSimulationSequence();
    });
  }

  if (btnB) {
    btnB.addEventListener('click', () => {
      const keys = Object.keys(WORKBENCH_DATA);
      const nextIdx = (keys.indexOf(currentModule) + 1) % keys.length;
      updateWorkbench(keys[nextIdx]);
    });
  }

  // Smooth scroll and highlight specific project card when VIEW PROJECT is clicked
  if (simViewProjectLink) {
    simViewProjectLink.addEventListener('click', (e) => {
      const data = WORKBENCH_DATA[currentModule];
      const targetSelector = (data && data.projectAnchor) ? data.projectAnchor : simViewProjectLink.getAttribute('href');
      if (targetSelector && targetSelector.startsWith('#')) {
        const targetCard = document.querySelector(targetSelector);
        if (targetCard) {
          e.preventDefault();
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetCard.classList.add('project-card-highlight');
          setTimeout(() => {
            targetCard.classList.remove('project-card-highlight');
          }, 2200);
        }
      }
    });
  }

  // Keyboard navigation support ([A] run, [B] next, [ArrowLeft] prev, [ArrowRight] next)
  document.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');
    if (isTyping) return;

    if (e.key === 'a' || e.key === 'A') {
      runSimulationSequence();
    } else if (e.key === 'b' || e.key === 'B' || e.key === 'ArrowRight') {
      const keys = Object.keys(WORKBENCH_DATA);
      const nextIdx = (keys.indexOf(currentModule) + 1) % keys.length;
      updateWorkbench(keys[nextIdx]);
    } else if (e.key === 'ArrowLeft') {
      const keys = Object.keys(WORKBENCH_DATA);
      const prevIdx = (keys.indexOf(currentModule) - 1 + keys.length) % keys.length;
      updateWorkbench(keys[prevIdx]);
    }
  });

  updateWorkbench('food-cnn');
}

/* --------------------------------------------------------------------------
   8. Numerical Scroll Counters
   -------------------------------------------------------------------------- */
function initScrollCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = el.getAttribute('data-is-decimal') === 'true';
        const noAnim = el.getAttribute('data-no-anim') === 'true';

        if (noAnim) {
          el.textContent = target;
          obs.unobserve(el);
          return;
        }

        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        function animateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = start + (target - start) * easeProgress;

          if (isDecimal) {
            el.textContent = currentVal.toFixed(2) + suffix;
          } else {
            el.textContent = Math.floor(currentVal).toLocaleString() + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(animateCounter);
          } else {
            if (isDecimal) {
              el.textContent = target.toFixed(2) + suffix;
            } else {
              el.textContent = target.toLocaleString() + suffix;
            }
          }
        }

        requestAnimationFrame(animateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* --------------------------------------------------------------------------
   9. Active Nav Link on Scroll
   -------------------------------------------------------------------------- */
function initNavActiveState() {
  const sections = document.querySelectorAll('section[id], main[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.style.color = 'var(--color-white)';
      } else {
        link.style.color = '';
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   10. Contact Form Submission
   -------------------------------------------------------------------------- */
window.handleContactSubmit = function() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const service = document.getElementById('serviceSelect') ? document.getElementById('serviceSelect').value : 'General Consultation';
  const message = document.getElementById('message').value;
  const feedback = document.getElementById('formFeedback');

  if (!feedback) return;

  feedback.textContent = `Preparing direct enquiry for Rajiv M...`;
  
  const subject = encodeURIComponent(`Project Enquiry: [${service}] from ${name}`);
  const body = encodeURIComponent(`Hi Rajiv,\n\nName: ${name}\nEmail: ${email}\nService Required: ${service}\n\nProject / Requirement Details:\n${message}\n\nSent via Portfolio`);
  
  setTimeout(() => {
    feedback.innerHTML = `✓ Thank you ${name}! Opening your email client to send directly to <strong>mrajiv4969@gmail.com</strong>...`;
    window.location.href = `mailto:mrajiv4969@gmail.com?subject=${subject}&body=${body}`;
  }, 600);
};

/* --------------------------------------------------------------------------
   11. Interactive Resume Viewer Modal
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const modal = document.getElementById('resumeModal');
  const btnOpen = document.getElementById('btnOpenResumeModal');
  const btnClose = document.getElementById('btnCloseResumeModal');
  const btnPrint = document.getElementById('btnPrintResume');

  if (!modal || !btnOpen) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenisInstance) lenisInstance.stop();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenisInstance) lenisInstance.start();
  }

  btnOpen.addEventListener('click', openModal);

  if (btnClose) {
    btnClose.addEventListener('click', closeModal);
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      const iframe = modal.querySelector('iframe');
      try {
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.print();
          return;
        }
      } catch (err) {}
      window.open('assets/Rajiv_M_Resume.pdf', '_blank');
    });
  }

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   12. Mobile Responsive Navigation Toggle & Interaction
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggleBtn || !navLinks) return;

  function setMenuState(open) {
    const shouldOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('mobile-open');
    navLinks.classList.toggle('mobile-open', shouldOpen);
    toggleBtn.classList.toggle('is-open', shouldOpen);
    toggleBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenuState();
  });

  // Smooth close when clicking any navigation link
  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  // Close when clicking outside of nav
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
      setMenuState(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
      setMenuState(false);
    }
  });
}





