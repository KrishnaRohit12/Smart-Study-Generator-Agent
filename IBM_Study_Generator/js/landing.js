// ============================================================
//  IBM Smart Study Generator — Landing Page JS
//  File: js/landing.js
// ============================================================

'use strict';

// ── Navbar scroll behaviour ──────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    lastScrollY = scrollY;
  }, { passive: true });
})();

// ── Smooth scroll for anchor links ──────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// ── Intersection Observer — fade-in-up animations ───────
(function initScrollAnimations() {
  const ANIMATION_CLASS = 'is-visible';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(ANIMATION_CLASS);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
})();

// ── Hero CTA → Dashboard redirect ───────────────────────
(function initCTAButtons() {
  document.querySelectorAll('[data-cta="launch"]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'pages/dashboard.html';
    });
  });
})();

// ── Animated counter for hero stats ─────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.counterSuffix || '';
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = easeOut(progress) * target;

      el.textContent = (Number.isInteger(target)
        ? Math.round(value)
        : value.toFixed(1)) + suffix;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();
