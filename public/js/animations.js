/**
 * GraphicCity — Animation System
 * Purpose-driven motion. Apple/Linear quality.
 * Every animation serves the content; nothing decorative.
 */
;(function () {
  'use strict';

  /* ═════════════════════════════════════════════════
     TEXT REVEAL — word-by-word & character-by-character
     ═════════════════════════════════════════════════ */

  var TextReveal = {
    init: function () {
      document.querySelectorAll('[data-reveal-text]').forEach(function (el) {
        var type = el.getAttribute('data-reveal-text') || 'word';
        var delay = parseFloat(el.getAttribute('data-reveal-delay')) || 40;
        if (type === 'word') { this.splitWords(el, delay); }
        else if (type === 'char') { this.splitChars(el, delay); }
      }, this);
    },

    splitWords: function (el, delay) {
      var text = el.textContent.trim();
      if (!text) return;
      el.textContent = '';
      var words = text.split(/\s+/);
      words.forEach(function (word, i) {
        var wrapper = document.createElement('span');
        wrapper.className = 'text-reveal-word';
        wrapper.style.transitionDelay = i * delay + 'ms';
        var inner = document.createElement('span');
        inner.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
        wrapper.appendChild(inner);
        el.appendChild(wrapper);
      });
    },

    splitChars: function (el, delay) {
      var text = el.textContent.trim();
      if (!text) return;
      el.textContent = '';
      var chars = text.split('');
      chars.forEach(function (ch, i) {
        var span = document.createElement('span');
        span.className = 'text-reveal-char';
        span.style.transitionDelay = i * delay + 'ms';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        el.appendChild(span);
      });
    },

    reveal: function (el) {
      el.querySelectorAll('.text-reveal-word').forEach(function (w) { w.classList.add('revealed'); });
      el.querySelectorAll('.text-reveal-char').forEach(function (c) { c.classList.add('revealed'); });
    }
  };

  /* ═════════════════════════════════════════════════
     SCROLL REVEAL OBSERVER
     ═════════════════════════════════════════════════ */

  var ScrollReveal = {
    observer: null,
    instance: null,

    init: function () {
      var self = this;
      this.instance = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;

            // Image reveal
            if (el.classList.contains('img-reveal') || el.classList.contains('img-reveal-left')) {
              el.classList.add('revealed');
            }

            // Scroll blur/scale reveals
            if (el.classList.contains('scroll-blur-reveal') || el.classList.contains('scroll-scale-reveal')) {
              el.classList.add('revealed');
            }

            // Stagger children
            if (el.classList.contains('stagger-children')) {
              el.classList.add('revealed');
            }

            // Text reveal within this element
            TextReveal.reveal(el);

            // Existing reveal-item system
            el.querySelectorAll('.reveal-item').forEach(function (item, i) {
              setTimeout(function () { item.classList.add('revealed'); }, i * 100);
            });

            // Reveal grids
            var grid = el.querySelector('.reveal-grid');
            if (grid) { grid.classList.add('revealed'); }

            // Unobserve after reveal
            self.instance.unobserve(el);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      // Observe all relevant elements
      document.querySelectorAll(
        '.img-reveal, .img-reveal-left, .scroll-blur-reveal, .scroll-scale-reveal, .stagger-children, [data-reveal]'
      ).forEach(function (el) {
        self.instance.observe(el);
      });

      // Also observe reveal-item containers that aren't caught by [data-reveal]
      document.querySelectorAll('.scroll-section').forEach(function (el) {
        self.instance.observe(el);
      });
    },

    reveal: function (container) {
      container.querySelectorAll('.reveal-item').forEach(function (item, i) {
        setTimeout(function () { item.classList.add('revealed'); }, i * 100);
      });
      var grid = container.querySelector('.reveal-grid');
      if (grid) { grid.classList.add('revealed'); }
    }
  };

  /* ═════════════════════════════════════════════════
     PARALLAX
     ═════════════════════════════════════════════════ */

  var Parallax = {
    elements: [],

    init: function () {
      var self = this;
      this.elements = [];
      document.querySelectorAll('.parallax-layer').forEach(function (el) {
        var speedAttr = el.getAttribute('data-parallax-speed');
        var speed = speedAttr ? parseFloat(speedAttr) : 0.3;
        self.elements.push({ el: el, speed: speed, rect: null });
      });

      // Existing parallax-hero elements
      document.querySelectorAll('.parallax-hero, .parallax-bg').forEach(function (el) {
        self.elements.push({ el: el, speed: 0.3, rect: null });
      });

      if (this.elements.length > 0) {
        this.updateRects();
        this.onScroll();
        window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        window.addEventListener('resize', this.updateRects.bind(this), { passive: true });
      }
    },

    updateRects: function () {
      this.elements.forEach(function (item) {
        item.rect = item.el.getBoundingClientRect();
      });
    },

    onScroll: function () {
      var sy = window.scrollY;
      this.elements.forEach(function (item) {
        var offset = sy * item.speed;
        item.el.style.transform = 'translateY(' + offset + 'px)';
      });
    }
  };

  /* ═════════════════════════════════════════════════
     CUSTOM CURSOR RING
     ═════════════════════════════════════════════════ */

  var CursorRing = {
    ring: null,
    rafId: null,
    mx: 0,
    my: 0,
    enabled: false,

    init: function () {
      // Only enable on non-touch devices
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

      this.ring = document.getElementById('cursor-ring');
      if (!this.ring) {
        this.ring = document.createElement('div');
        this.ring.id = 'cursor-ring';
        this.ring.className = 'cursor-ring';
        document.body.appendChild(this.ring);
      }

      this.enabled = true;
      var self = this;

      document.addEventListener('mousemove', function (e) {
        self.mx = e.clientX;
        self.my = e.clientY;
        if (!self.ring.classList.contains('visible')) {
          self.ring.classList.add('visible');
        }
        if (!self.rafId) {
          self.rafId = requestAnimationFrame(self.tick.bind(self));
        }
      });

      // Hover targets
      document.addEventListener('mouseenter', function (e) {
        var target = e.target.closest('a, button, .project-card, .hover-cursor');
        if (target) {
          self.ring.classList.add('hover');
          var darkParent = target.closest('.bg-core-black, .bg-black');
          if (darkParent) {
            self.ring.classList.remove('dark-ring');
          } else {
            self.ring.classList.add('dark-ring');
          }
        }
      }, true);

      document.addEventListener('mouseleave', function (e) {
        var target = e.target.closest('a, button, .project-card, .hover-cursor');
        if (target) {
          self.ring.classList.remove('hover');
          self.ring.classList.remove('dark-ring');
        }
      }, true);

      // Hide on window leave
      document.addEventListener('mouseleave', function () {
        self.ring.classList.remove('visible');
      });

      document.addEventListener('mouseenter', function () {
        self.ring.classList.add('visible');
      });
    },

    tick: function () {
      if (!this.enabled) return;
      this.ring.style.left = this.mx + 'px';
      this.ring.style.top = this.my + 'px';
      this.rafId = null;
    }
  };

  /* ═════════════════════════════════════════════════
     LOADING SCREEN
     ═════════════════════════════════════════════════ */

  var LoadingScreen = {
    el: null,

    init: function () {
      this.el = document.getElementById('loading-screen');
      if (this.el) {
        // Add active class after a tick to trigger entrance
        requestAnimationFrame(function () {
          this.el.classList.add('active');
        }.bind(this));

        // Remove after animation completes
        setTimeout(function () {
          this.hide();
        }.bind(this), 1200);
      }
    },

    hide: function () {
      if (!this.el) return;
      this.el.classList.remove('active');
      this.el.classList.add('animate-loader-fade');

      setTimeout(function () {
        this.el.style.display = 'none';
      }.bind(this), 500);
    },

    show: function () {
      if (!this.el) return;
      this.el.style.display = 'flex';
      requestAnimationFrame(function () {
        this.el.classList.add('active');
        this.el.classList.remove('animate-loader-fade');
      }.bind(this));
    }
  };

  /* ═════════════════════════════════════════════════
     PAGE TRANSITION (HTMX interceptor)
     ═════════════════════════════════════════════════ */

  var PageTransition = {
    overlay: null,

    init: function () {
      this.overlay = document.getElementById('page-transition');
      if (!this.overlay) {
        this.overlay = document.createElement('div');
        this.overlay.id = 'page-transition';
        document.body.appendChild(this.overlay);
      }
    },

    fadeOut: function (callback) {
      var self = this;
      this.overlay.classList.add('active');
      setTimeout(function () {
        if (callback) callback();
        setTimeout(function () {
          self.overlay.classList.remove('active');
        }, 50);
      }, 250);
    }
  };

  /* ═════════════════════════════════════════════════
     SMOOTH SCROLL FOR ANCHOR LINKS
     ═════════════════════════════════════════════════ */

  var SmoothScroll = {
    init: function () {
      document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;
        var target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  /* ═════════════════════════════════════════════════
     HTMX INTEGRATION
     ═════════════════════════════════════════════════ */

  function initHtmxIntegration() {
    document.body.addEventListener('htmx:afterSwap', function (evt) {
      var target = evt.detail.target;

      // Re-init animations on newly loaded content
      if (ScrollReveal.instance) {
        target.querySelectorAll(
          '.img-reveal, .img-reveal-left, .scroll-blur-reveal, .scroll-scale-reveal, .stagger-children, [data-reveal]'
        ).forEach(function (el) {
          ScrollReveal.instance.observe(el);
        });
      }

      // Text reveal in swapped content
      target.querySelectorAll('[data-reveal-text]').forEach(function (el) {
        TextReveal.splitWords(el, parseFloat(el.getAttribute('data-reveal-delay')) || 40);
      });

      // Entrance animations on swapped content
      target.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-in, .animate-reveal-up').forEach(function (el) {
        el.style.animation = 'none';
        requestAnimationFrame(function () {
          el.style.animation = '';
        });
      });

      // Trigger reveal on the target itself
      ScrollReveal.reveal(target);
    });

    // HTMX loading indicator integration
    var topbar = document.getElementById('htmx-topbar');
    if (!topbar) {
      topbar = document.createElement('div');
      topbar.id = 'htmx-topbar';
      topbar.innerHTML = '<div class="bar"></div>';
      document.body.appendChild(topbar);
    }

    var barEl = topbar.querySelector('.bar');

    document.body.addEventListener('htmx:beforeRequest', function () {
      barEl.style.width = '30%';
    });

    document.body.addEventListener('htmx:afterRequest', function () {
      barEl.style.width = '100%';
      setTimeout(function () {
        barEl.style.width = '0%';
      }, 300);
    });

    // Page transitions for HTMX navigation
    document.body.addEventListener('htmx:beforeSwap', function (evt) {
      // Only for full page replacements, not partials
      var path = evt.detail.pathInfo ? evt.detail.pathInfo.current : '';
      if (path && !path.includes('/partials/')) {
        // Could add pre-fade here for full page navigations
      }
    });
  }

  /* ═════════════════════════════════════════════════
     HORIZONTAL PIN SCROLL (Swipe down left side-scrolling)
     ═════════════════════════════════════════════════ */

  var HorizontalPinScroll = {
    init: function () {
      var pinSection = document.getElementById('horizontal-pin-section');
      var stickyViewport = document.getElementById('horizontal-sticky-viewport');
      var track = document.getElementById('horizontal-track');
      var progressBar = document.getElementById('horizontal-progress-bar');
      var stepCounter = document.getElementById('horizontal-step-counter');
      var stepPills = document.querySelectorAll('.horizontal-step-pill');
      var prevBtn = document.getElementById('horizontal-prev-btn');
      var nextBtn = document.getElementById('horizontal-next-btn');

      if (!pinSection || !stickyViewport || !track) return;

      function updateScroll() {
        var sectionRect = pinSection.getBoundingClientRect();
        var sectionTop = sectionRect.top;
        var sectionHeight = pinSection.offsetHeight;
        var viewportHeight = window.innerHeight;

        var maxScroll = sectionHeight - viewportHeight;
        if (maxScroll <= 0) return;

        var progress = -sectionTop / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        var trackWidth = track.scrollWidth;
        var viewportWidth = stickyViewport.clientWidth;
        var maxTranslate = Math.max(0, trackWidth - viewportWidth + 60);

        var currentTranslate = progress * maxTranslate;

        track.style.transform = 'translate3d(-' + currentTranslate + 'px, 0, 0)';

        if (progressBar) {
          progressBar.style.width = (progress * 100) + '%';
        }

        var cards = track.querySelectorAll('.horizontal-card');
        var activeIndex = 0;
        cards.forEach(function (card, idx) {
          var cardRect = card.getBoundingClientRect();
          if (cardRect.left <= window.innerWidth * 0.55 && cardRect.right >= window.innerWidth * 0.1) {
            activeIndex = idx;
          }
        });

        if (stepCounter) {
          var formattedIndex = String(activeIndex + 1).padStart(2, '0');
          var totalFormatted = String(cards.length).padStart(2, '0');
          stepCounter.textContent = formattedIndex + ' / ' + totalFormatted;
        }

        stepPills.forEach(function (pill, idx) {
          if (idx === activeIndex) {
            pill.classList.add('active');
            pill.style.opacity = '1';
            pill.style.borderColor = 'rgba(255,255,255,0.7)';
            pill.style.backgroundColor = 'rgba(255,255,255,0.15)';
          } else {
            pill.classList.remove('active');
            pill.style.opacity = '0.4';
            pill.style.borderColor = 'rgba(255,255,255,0.1)';
            pill.style.backgroundColor = 'transparent';
          }
        });
      }

      stepPills.forEach(function (pill, idx) {
        pill.addEventListener('click', function () {
          var cards = track.querySelectorAll('.horizontal-card');
          if (!cards[idx]) return;

          var targetCard = cards[idx];
          var maxScroll = pinSection.offsetHeight - window.innerHeight;
          var trackWidth = track.scrollWidth;
          var viewportWidth = stickyViewport.clientWidth;
          var maxTranslate = Math.max(0, trackWidth - viewportWidth + 60);

          var targetTranslate = targetCard.offsetLeft - 40;
          var targetProgress = Math.min(1, Math.max(0, targetTranslate / maxTranslate));

          var targetScrollY = pinSection.offsetTop + targetProgress * maxScroll;
          window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        });
      });

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          var cards = track.querySelectorAll('.horizontal-card');
          var activeIndex = 0;
          cards.forEach(function (card, idx) {
            var cardRect = card.getBoundingClientRect();
            if (cardRect.left <= window.innerWidth * 0.5) activeIndex = idx;
          });
          var nextIndex = Math.min(cards.length - 1, activeIndex + 1);
          if (stepPills[nextIndex]) stepPills[nextIndex].click();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          var cards = track.querySelectorAll('.horizontal-card');
          var activeIndex = 0;
          cards.forEach(function (card, idx) {
            var cardRect = card.getBoundingClientRect();
            if (cardRect.left <= window.innerWidth * 0.5) activeIndex = idx;
          });
          var prevIndex = Math.max(0, activeIndex - 1);
          if (stepPills[prevIndex]) stepPills[prevIndex].click();
        });
      }

      // Touch gesture support for horizontal swiping
      var touchStartX = 0;
      var touchStartY = 0;

      stickyViewport.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      stickyViewport.addEventListener('touchmove', function (e) {
        if (!touchStartX || !touchStartY || e.touches.length !== 1) return;
        var deltaX = touchStartX - e.touches[0].clientX;
        var deltaY = touchStartY - e.touches[0].clientY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
          window.scrollBy({ top: deltaX * 1.2, behavior: 'auto' });
          touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      window.addEventListener('scroll', updateScroll, { passive: true });
      window.addEventListener('resize', updateScroll, { passive: true });
      updateScroll();
    }
  };

  /* ═════════════════════════════════════════════════
     INITIALIZATION
     ═════════════════════════════════════════════════ */

  function init() {
    // Order matters

    // 1. Text reveal (must be before scroll reveal so observer can trigger)
    TextReveal.init();

    // 2. Scroll reveal observer
    ScrollReveal.init();

    // 3. Parallax
    Parallax.init();

    // 4. Cursor ring (only desktop)
    CursorRing.init();

    // 5. Loading screen
    LoadingScreen.init();

    // 6. Page transition overlay
    PageTransition.init();

    // 7. Smooth scroll
    SmoothScroll.init();

    // 8. Horizontal pin scroll
    HorizontalPinScroll.init();

    // 9. HTMX integration
    if (typeof htmx !== 'undefined') {
      initHtmxIntegration();
    }

    // 10. Trigger initial reveal on visible sections
    document.querySelectorAll('[data-reveal].in-viewport').forEach(function (el) {
      ScrollReveal.reveal(el);
    });
  }


  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for manual use
  window.GCAnimations = {
    TextReveal: TextReveal,
    ScrollReveal: ScrollReveal,
    Parallax: Parallax,
    LoadingScreen: LoadingScreen,
    PageTransition: PageTransition,
    refresh: function (container) {
      // Re-initialize animations within a container (for HTMX swaps)
      if (container) {
        container.querySelectorAll('[data-reveal-text]').forEach(function (el) {
          TextReveal.splitWords(el, parseFloat(el.getAttribute('data-reveal-delay')) || 40);
        });
        if (ScrollReveal.instance) {
          container.querySelectorAll('.img-reveal, .img-reveal-left, .scroll-blur-reveal, .scroll-scale-reveal, .stagger-children, [data-reveal]').forEach(function (el) {
            ScrollReveal.instance.observe(el);
          });
        }
      }
    }
  };

})();
