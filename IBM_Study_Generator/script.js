// ============================================================
//  Smart Study Generator Agent — Enhanced Premium Script
//  File: script.js
//  All original functionality preserved + premium animations
// ============================================================

'use strict';

/* ── 1. Navbar: scroll shadow + active link highlight ──── */
(function initNavbar() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelectorAll('.nav__link[data-section]');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 10);
    updateActiveLink();
  }, { passive: true });

  if (toggle) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', String(nav.classList.contains('nav--open')));
    });
  }

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('nav--open'));
  });

  function updateActiveLink() {
    let current = '';
    links.forEach(link => {
      const section = document.getElementById(link.dataset.section);
      if (section && window.scrollY >= section.offsetTop - 100) current = link.dataset.section;
    });
    links.forEach(link => link.classList.toggle('active', link.dataset.section === current));
  }
  updateActiveLink();
})();

/* ── 2. Scroll-reveal ───────────────────────────────────── */
(function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();

/* ── 3. Animated counters ───────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix  || '';
    const prefix   = el.dataset.prefix  || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1600;
    const start    = performance.now();

    function tick(now) {
      const t   = Math.min((now - start) / duration, 1);
      const val = easeOut(t) * target;
      el.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.6 });

  counters.forEach(el => io.observe(el));
})();

/* ── 4. Smooth scroll ───────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── 5. CTA → Dashboard ─────────────────────────────────── */
(function initCTA() {
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => { window.location.href = btn.dataset.goto; });
  });
})();

/* ── 6. Feature card keyboard nav ───────────────────────── */
(function initCards() {
  document.querySelectorAll('.feature-card[data-href]').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = card.dataset.href; }
    });
    card.addEventListener('click', () => { window.location.href = card.dataset.href; });
  });
})();

/* ── 7. 3-D card tilt on mouse-move ─────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.feature-card, .how-step, .stat');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);   // -1 … +1
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 6;   // max 6 ° tilt
      const rotY   =  dx * 6;
      card.style.transform      = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-7px)`;
      card.style.transition     = 'transform 80ms linear, box-shadow 80ms linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = '';
    });
  });
})();

/* ── 8. Magnetic button effect ──────────────────────────── */
(function initMagneticBtns() {
  document.querySelectorAll('.btn-primary, .btn-white').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx   = e.clientX - (rect.left + rect.width  / 2);
      const dy   = e.clientY - (rect.top  + rect.height / 2);
      btn.style.transform  = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
      btn.style.transition = 'transform 120ms ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform 350ms cubic-bezier(.34,1.56,.64,1)';
    });
  });
})();

/* ── 9. Hero progress bars — animate on load ────────────── */
(function initProgressBars() {
  const fills = document.querySelectorAll('.ui-bar-fill');
  if (!fills.length) return;

  // Capture widths then set to 0, animate in
  fills.forEach(fill => {
    const target = fill.style.width;
    fill.style.width      = '0';
    fill.style.transition = 'none';

    // Delay to let paint settle
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.transition = 'width 1.4s cubic-bezier(.4,0,.2,1) .6s';
        fill.style.width      = target;
      });
    });
  });
})();

/* ── 10. Subtle cursor glow that follows the pointer ─────── */
(function initCursorGlow() {
  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position:      'fixed',
    pointerEvents: 'none',
    zIndex:        '9999',
    width:         '320px',
    height:        '320px',
    borderRadius:  '50%',
    background:    'radial-gradient(circle, rgba(15,98,254,.07) 0%, transparent 70%)',
    transform:     'translate(-50%,-50%)',
    transition:    'opacity .3s ease',
    opacity:       '0',
    top:           '0',
    left:          '0',
  });
  document.body.appendChild(glow);

  let raf;
  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; glow.style.opacity = '1'; });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  // Smooth follow with lerp
  function loop() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    raf = requestAnimationFrame(loop);
  }
  loop();
})();

/* ── 11. Staggered hero copy entrance ───────────────────── */
(function initHeroEntrance() {
  // Elements already use CSS animation via @keyframes fade-up in style.css
  // This adds a tiny extra delay nudge so elements don't all fire at 0ms
  const heroEls = document.querySelectorAll(
    '.hero__tag, .hero__title, .hero__subtitle, .hero__actions, .hero__trust'
  );
  heroEls.forEach((el, i) => {
    el.style.animationDelay = `${i * 90}ms`;
  });
})();
