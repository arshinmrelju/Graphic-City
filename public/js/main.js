/**
 * GraphicCity — Main JavaScript
 * Minimal. Purpose-driven. No jQuery. No bloat.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── Navigation scroll handler ─── */
  const header = document.getElementById('site-header');

  if (header) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY > 80;
      if (scrolled) {
        header.classList.add('frosted-glass', 'border-b', 'border-stone-200', 'dark:border-stone-800');
        header.classList.remove('bg-transparent');
      } else {
        header.classList.remove('frosted-glass', 'border-b', 'border-stone-200', 'dark:border-stone-800');
        header.classList.add('bg-transparent');
      }
    }, { passive: true });
  }

  /* ─── Menu overlay ─── */
  const menuOverlay = document.getElementById('menu-overlay');
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.querySelector('.menu-close-btn');

  function openMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.add('open');
    menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
    menuOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus first focusable element
    const firstLink = menuOverlay.querySelector('a');
    if (firstLink) setTimeout(function () { firstLink.focus(); }, 100);
  }

  function closeMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.remove('open');
    menuOverlay.classList.add('opacity-0', 'pointer-events-none');
    menuOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (menuToggle) menuToggle.focus();
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', openMenu);
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  // Click outside nav area to close
  if (menuOverlay) {
    menuOverlay.addEventListener('click', function (e) {
      if (e.target === menuOverlay || e.target.closest('.menu-close-btn')) {
        closeMenu();
      }
    });

    // Escape key
    menuOverlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMenu();
      }

      // Focus trap
      if (e.key === 'Tab') {
        var focusable = menuOverlay.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ─── Menu nav link close on click ─── */
  if (menuOverlay) {
    menuOverlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ─── Page transition interceptor (production static fallback) ─── */
  if (typeof htmx === 'undefined') {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]:not([href^="#"]):not([href^="http"]):not([href^="mailto"]):not([href^="tel"]):not([download]):not([target="_blank"])');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href === '' || href === '/' || href.startsWith('//')) return;
      if (href.startsWith('#')) return;
      if (href.startsWith('http')) return;
      e.preventDefault();
      var overlay = document.getElementById('page-transition');
      if (overlay) {
        overlay.classList.add('active');
      }
      setTimeout(function () {
        window.location.href = href;
      }, 300);
    });
  }

  /* ─── Dark mode detection ─── */
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (prefersDark.matches) {
    document.documentElement.classList.add('dark');
  }
  prefersDark.addEventListener('change', function (e) {
    if (e.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

});
