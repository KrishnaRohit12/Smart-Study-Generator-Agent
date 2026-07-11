// ============================================================
//  Smart Study Generator — Shared App Module
//  IBM University Engagement Project
//  File: js/app.js  (loaded on every page)
// ============================================================
'use strict';

/* ── 1. Navigation ──────────────────────────────────────── */
(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  if (!nav) return;

  // Scroll shadow
  const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('nav--open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close mobile nav on link click
  nav.querySelectorAll('.nav__link').forEach(l =>
    l.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    })
  );

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
      nav.classList.remove('nav--open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Mark current page link active (file-name matching)
  const path = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav__link[href]').forEach(l => {
    const href = l.getAttribute('href').split('/').pop().split('#')[0];
    if (href === path || (path === '' && href === 'index.html')) {
      l.classList.add('active');
    }
  });
})();

/* ── 2. Dark / Light theme toggle ───────────────────────── */
(function initTheme() {
  const btn   = document.getElementById('themeToggle');
  const saved = localStorage.getItem('ssg-theme') || 'light';
  applyTheme(saved);

  btn?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('ssg-theme', next);
  });

  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    const icon = t === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    if (btn) btn.innerHTML = icon;
  }
})();

/* ── 3. Scroll-reveal ───────────────────────────────────── */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all elements immediately
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();

/* ── 4. Smooth scroll anchors ───────────────────────────── */
(function initScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── 5. Counter animations ──────────────────────────────── */
(function initCounters() {
  if (!('IntersectionObserver' in window)) return;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      const start  = performance.now();
      const tick   = now => {
        const t = Math.min((now - start) / dur, 1);
        const val = easeOut(t) * target;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
})();

/* ── 6. Toast notification helper ──────────────────────── */
window.showToast = function(msg, type = 'info', duration = 4000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  t.innerHTML = `<span style="font-weight:700;font-size:1rem;flex-shrink:0">${icons[type] || 'ℹ'}</span><span>${msg}</span>`;
  container.appendChild(t);
  // Auto-dismiss
  const dismiss = () => {
    t.style.transition = 'opacity .35s, transform .35s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(16px)';
    setTimeout(() => t.remove(), 380);
  };
  const timer = setTimeout(dismiss, duration);
  t.addEventListener('click', () => { clearTimeout(timer); dismiss(); });
};

/* ── 7. Cursor glow (desktop only) ─────────────────────── */
(function initGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const g = document.createElement('div');
  Object.assign(g.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: '9997',
    width: '320px', height: '320px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(15,98,254,.055) 0%, transparent 70%)',
    transform: 'translate(-50%,-50%)', opacity: '0', top: '0', left: '0',
    transition: 'opacity .4s', willChange: 'transform'
  });
  document.body.appendChild(g);
  let mx = 0, my = 0, cx = 0, cy = 0, raf;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; g.style.opacity = '1'; });
  document.addEventListener('mouseleave', () => { g.style.opacity = '0'; });
  (function loop() {
    cx += (mx - cx) * .09;
    cy += (my - cy) * .09;
    g.style.left = cx + 'px';
    g.style.top  = cy + 'px';
    raf = requestAnimationFrame(loop);
  })();
})();
