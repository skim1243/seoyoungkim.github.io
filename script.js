(function () {
  'use strict';

  // ----- Fade-in: reveal elements when they enter the viewport -----
  (function fadeInOnScroll() {
    var fadeEls = document.querySelectorAll('.fade-in');
    if (!fadeEls.length) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { rootMargin: '0px 0px -30px 0px', threshold: 0.05 }
    );
    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  })();

  // ----- Hero content: slide in one by one on load -----
  (function heroSlideIn() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    function addLoaded() {
      hero.classList.add('loaded');
    }
    if (document.readyState === 'complete') {
      requestAnimationFrame(addLoaded);
    } else {
      window.addEventListener('load', function () {
        requestAnimationFrame(addLoaded);
      });
    }
  })();

  // ----- Hero background circles: concentric orbits (increasing radius, never overlap) -----
  (function heroCircles() {
    const container = document.querySelector('.hero-bg-circles');
    const circles = document.querySelectorAll('.hero-circle');
    if (!container || !circles.length) return;

    // Circle sizes (px) – must match CSS .hero-circle-1 … .hero-circle-7 (order: circle 0..6)
    const sizes = [200, 140, 280, 110, 170, 220, 95];
    const n = circles.length;
    const startRadius = 480;
    const gapMultiplier = 2.2;

    var sortedIndices = sizes.map(function (_, i) { return i; });
    sortedIndices.sort(function (a, b) { return sizes[a] - sizes[b]; });

    var orbitRadii = [];
    var R = startRadius;
    for (var i = 0; i < n; i++) {
      orbitRadii.push(R);
      if (i < n - 1) R += gapMultiplier * (sizes[sortedIndices[i]] + sizes[sortedIndices[i + 1]]) / 2;
    }
    var maxRadius = orbitRadii[n - 1] + sizes[sortedIndices[n - 1]] / 2;

    var orbitIndexByCircle = [];
    for (var j = 0; j < n; j++) orbitIndexByCircle[sortedIndices[j]] = j;

    const state = Array.from(circles).map(function (el, i) {
      return {
        el: el,
        angle: (i * 2 * Math.PI) / n,
        angularSpeed: 0.3 + 0.15 * (i % 3),
        orbitRadius: orbitRadii[orbitIndexByCircle[i]],
        bounds: null
      };
    });

    var lastTime = null;

    function getBounds() {
      var r = container.getBoundingClientRect();
      return { w: r.width, h: r.height };
    }

    function tick(time) {
      if (lastTime === null) lastTime = time;
      var delta = (time - lastTime) / 1000;
      lastTime = time;

      var b = getBounds();
      var cx = b.w / 2;
      var cy = b.h / 2;
      var scale = Math.min(b.w, b.h) * 1.4 / maxRadius;

      state.forEach(function (s, i) {
        s.bounds = b;
        s.angle += s.angularSpeed * delta;
        var R = s.orbitRadius * scale;
        var x = cx + R * Math.cos(s.angle);
        var y = cy + R * Math.sin(s.angle);
        s.el.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-50%, -50%)';
      });

      requestAnimationFrame(tick);
    }

    function initPositions() {
      var b = getBounds();
      state.forEach(function (s) { s.bounds = b; });
    }

    initPositions();
    window.addEventListener('resize', initPositions);
    requestAnimationFrame(tick);
  })();

  // ----- Mobile nav toggle -----
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('is-open');
      navLinks.classList.toggle('is-open');
      document.body.style.overflow = navLinks.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close menu when clicking a link (anchor)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('is-open');
        navLinks.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ----- Smooth scroll for anchor links (fallback for older browsers) -----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----- Optional: subtle header background on scroll -----
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.background = window.scrollY > 20
        ? 'rgba(35, 36, 76, 0.98)'
        : 'rgba(35, 36, 76, 0.9)';
    });
  }
})();
