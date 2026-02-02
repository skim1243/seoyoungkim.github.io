(function () {
  'use strict';

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
        ? 'rgba(15, 15, 15, 0.95)'
        : 'rgba(15, 15, 15, 0.85)';
    });
  }
})();
