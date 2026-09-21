(() => {
  'use strict';

  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------- Opening status (America/Sao_Paulo) --------
  const statusNode = document.querySelector('#open-status');
  const statusDot = document.querySelector('.status-dot');

  function getSaoPauloParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(date);
    return Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  }

  function updateOpenStatus() {
    if (!statusNode || !statusDot) return;
    const p = getSaoPauloParts();
    const mins = Number(p.hour) * 60 + Number(p.minute);
    const bakeryDays = ['Wed', 'Thu', 'Fri'];
    const cafeDays = ['Sat', 'Sun'];
    const openBakery = bakeryDays.includes(p.weekday) && mins >= 16 * 60 && mins < 19 * 60;
    const openCafe = cafeDays.includes(p.weekday) && mins >= 8 * 60 && mins < 12 * 60;
    const isOpen = openBakery || openCafe;
    statusDot.classList.toggle('is-open', isOpen);
    statusNode.textContent = isOpen ? (openCafe ? 'Café aberto agora' : 'Padaria aberta agora') : 'Fechado agora';
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60_000);

  // -------- Menu --------
  const menuButton = document.querySelector('.menu-button');
  const menu = document.querySelector('#site-menu');
  const setMenu = (open) => {
    menuButton?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-hidden', String(!open));
    menu?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // -------- Thematic entry: critical-image handshake --------
  const entry = document.querySelector('#entry');
  const ENTRY_KEY = 'pao-do-pedro:thematic-entry:v2';

  const canUseStorage = (() => {
    try {
      const k = '__pdp_test__';
      sessionStorage.setItem(k, '1');
      sessionStorage.removeItem(k);
      return true;
    } catch (_) { return false; }
  })();

  const wasSeen = canUseStorage && sessionStorage.getItem(ENTRY_KEY) === '1';

  const preload = (src) => new Promise(resolve => {
    const img = new Image();
    img.onload = () => img.decode?.().catch(() => {}).finally(resolve);
    img.onerror = resolve;
    img.src = src;
  });

  async function runEntry() {
    if (!entry || prefersReducedMotion || wasSeen) {
      entry?.classList.add('is-hidden');
      return;
    }

    const criticalReady = Promise.all([
      preload('assets/images/entry-corridor-532.webp'),
      preload('assets/images/patio-arches-709.webp')
    ]);
    const safetyTimeout = new Promise(resolve => setTimeout(resolve, 4200));

    await Promise.race([criticalReady, safetyTimeout]);
    entry.classList.add('is-ready');
    await new Promise(resolve => setTimeout(resolve, 260));

    if (canUseStorage) {
      try { sessionStorage.setItem(ENTRY_KEY, '1'); } catch (_) {}
    }

    entry.classList.add('is-opening');
    setTimeout(() => entry.classList.add('is-hidden'), 1100);
  }
  runEntry();

  // -------- Scroll-driven cinematic image reel --------
  const reel = document.querySelector('#reel');
  const scenes = [...document.querySelectorAll('.reel__scene')];
  const captions = [...document.querySelectorAll('.reel__caption')];
  const progressBar = document.querySelector('.reel__progress span');

  let reelTop = 0;
  let reelScrollable = 1;
  let ticking = false;

  function measureReel() {
    if (!reel || prefersReducedMotion) return;
    const rect = reel.getBoundingClientRect();
    reelTop = window.scrollY + rect.top;
    reelScrollable = Math.max(1, reel.offsetHeight - window.innerHeight);
    renderReel();
  }

  function renderReel() {
    ticking = false;
    if (!reel || prefersReducedMotion || scenes.length === 0) return;

    const p = clamp((window.scrollY - reelTop) / reelScrollable);
    const position = p * (scenes.length - 1);

    scenes.forEach((scene, index) => {
      const dist = Math.abs(position - index);
      const focus = 1 - smoothstep(.12, .86, dist);
      const opacity = clamp(1 - smoothstep(.48, .95, dist));
      scene.style.opacity = opacity.toFixed(3);
      scene.style.setProperty('--focus', focus.toFixed(3));
    });

    captions.forEach((caption, index) => {
      const dist = Math.abs(position - index);
      const visibility = clamp(1 - smoothstep(.38, .82, dist));
      caption.style.opacity = visibility.toFixed(3);
      caption.style.transform = `translate3d(0, ${(1 - visibility) * 18}px, 0)`;
      caption.style.pointerEvents = visibility > .75 ? 'auto' : 'none';
    });

    if (progressBar) progressBar.style.transform = `scaleY(${p.toFixed(4)})`;
  }

  function requestReelRender() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(renderReel);
  }

  if (reel && !prefersReducedMotion) {
    scenes[0].style.opacity = '1';
    scenes[0].style.setProperty('--focus', '1');
    captions[0].style.opacity = '1';
    captions[0].style.transform = 'translate3d(0,0,0)';
    window.addEventListener('scroll', requestReelRender, { passive: true });
    window.addEventListener('resize', measureReel, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(measureReel, 180), { passive: true });
    measureReel();
  }

  // -------- Gentle image drift only when visible --------
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const driftTargets = document.querySelectorAll('.story__media img, .visit__image-wrap img');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { rootMargin: '10% 0px', threshold: .15 });
    driftTargets.forEach(el => observer.observe(el));
  }
})();
