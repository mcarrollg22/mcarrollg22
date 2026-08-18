 
(function () {
  'use strict';
 
  /* ----------------------------------------------------------
     0. Mark that JS is running.
     CSS uses .no-js to show content if JS is disabled or blocked,
     so nothing is ever invisible for a visitor without JS.
     ---------------------------------------------------------- */
  document.documentElement.classList.remove('no-js');
 
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
 
 
  /* ==========================================================
     1. MOBILE MENU
     ========================================================== */
  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('nav');
    if (!toggle || !nav) return;
 
    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
 
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenu(!isOpen);
    });
 
    // Tapping a link should close the menu, not leave it hanging open
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
 
    // Escape closes it and returns focus to the button
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
 
    // Clicking outside the header closes it
    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('is-open')) return;
      if (!event.target.closest('.site-header')) setMenu(false);
    });
 
    // If the window is widened back to desktop, reset to a clean state
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setMenu(false);
    });
  }
 
 
  /* ==========================================================
     2. HEADER SHADOW ON SCROLL
     ========================================================== */
  function initHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;
 
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
 
    update();
    window.addEventListener('scroll', update, { passive: true });
  }
 
 
  /* ==========================================================
     3. REVEAL ON SCROLL
     Adds .is-visible to each .reveal element the first time it
     enters the viewport. Skipped entirely if the visitor has
     asked their system to reduce motion.
     ========================================================== */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
 
    // No IntersectionObserver support, or reduced motion: just show everything.
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
 
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);   // only animate once
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
 
    items.forEach(function (el) { observer.observe(el); });
  }
 
 
  /* ==========================================================
     4. PHOTO PLACEHOLDERS
     While images/ is still empty, show a labelled box with the
     filename you need instead of a broken-image icon. Once you
     drop the real file in, this quietly stops doing anything.
     ========================================================== */
  function initPhotoPlaceholders() {
    var figures = document.querySelectorAll('.photo[data-placeholder]');
 
    figures.forEach(function (figure) {
      var img = figure.querySelector('img');
      if (!img) {
        figure.classList.add('is-placeholder');
        return;
      }
 
      function markMissing() { figure.classList.add('is-placeholder'); }
 
      // Already failed before this script ran
      if (img.complete && img.naturalWidth === 0) {
        markMissing();
      } else {
        img.addEventListener('error', markMissing);
        // If it loads fine, make sure the placeholder is off
        img.addEventListener('load', function () {
          if (img.naturalWidth > 0) figure.classList.remove('is-placeholder');
        });
      }
    });
  }
 
 
  /* ==========================================================
     5. ACTIVE NAV LINK + FOOTER YEAR
     ========================================================== */
  function initActiveNav() {
    var sections = document.querySelectorAll('main section[id]');
    var links = document.querySelectorAll('.nav-list a[href^="#"]');
    if (!sections.length || !links.length) return;
    if (!('IntersectionObserver' in window)) return;
 
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute('id');
          links.forEach(function (link) {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === '#' + id
            );
          });
        });
      },
      // Fires when a section crosses the upper-middle of the screen
      { rootMargin: '-45% 0px -50% 0px' }
    );
 
    sections.forEach(function (section) { observer.observe(section); });
  }
 
  function initYear() {
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }
 
 
  /* ==========================================================
     RUN
     ========================================================== */
  function init() {
    initMobileMenu();
    initHeaderScroll();
    initReveal();
    initPhotoPlaceholders();
    initActiveNav();
    initYear();
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();