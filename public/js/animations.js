/**
 * GraphicCity — Movie-Grade Ultra-Smooth Animation Engine
 * Cinema-quality motion, Lenis inertial scrolling, 3D text reveals, film grain,
 * fluid spring cursor, and continuous RAF lerp interpolation.
 */
;(function () {
  'use strict';

  /* ═════════════════════════════════════════════════
     1. LENIS SMOOTH SCROLLING ENGINE
     ═════════════════════════════════════════════════ */

  var LenisEngine = {
    instance: null,
    init: function () {
      if (typeof Lenis === 'undefined') return;

      var isTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

      this.instance = new Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        smoothTouch: false,
        touchMultiplier: 1.8,
        infinite: false
      });

      window.lenis = this.instance;

      function lenisRaf(time) {
        if (window.lenis) {
          window.lenis.raf(time);
        }
        requestAnimationFrame(lenisRaf);
      }
      requestAnimationFrame(lenisRaf);
    }
  };

  /* ═════════════════════════════════════════════════
     2. FILM GRAIN OVERLAY
     ═════════════════════════════════════════════════ */

  var FilmGrain = {
    init: function () {
      if (document.querySelector('.film-grain')) return;
      var grain = document.createElement('div');
      grain.className = 'film-grain';
      grain.setAttribute('aria-hidden', 'true');
      document.body.appendChild(grain);
    }
  };

  /* ═════════════════════════════════════════════════
     3. 3D CINEMATIC TEXT REVEAL
     ═════════════════════════════════════════════════ */

  var TextReveal = {
    init: function () {
      document.querySelectorAll('[data-reveal-text]').forEach(function (el) {
        var type = el.getAttribute('data-reveal-text') || 'word';
        var delay = parseFloat(el.getAttribute('data-reveal-delay')) || 45;
        if (type === 'word') { this.splitWords(el, delay); }
        else if (type === 'char') { this.splitChars(el, delay); }
      }, this);
    },

    splitWords: function (el, delay) {
      var text = el.textContent.trim();
      if (!text || el.dataset.splitDone) return;
      el.dataset.splitDone = 'true';
      el.textContent = '';
      var words = text.split(/\s+/);
      words.forEach(function (word, i) {
        var wrapper = document.createElement('span');
        wrapper.className = 'text-reveal-word';
        var inner = document.createElement('span');
        inner.style.transitionDelay = (i * delay) + 'ms';
        inner.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
        wrapper.appendChild(inner);
        el.appendChild(wrapper);
      });
    },

    splitChars: function (el, delay) {
      var text = el.textContent.trim();
      if (!text || el.dataset.splitDone) return;
      el.dataset.splitDone = 'true';
      el.textContent = '';
      var chars = text.split('');
      chars.forEach(function (ch, i) {
        var span = document.createElement('span');
        span.className = 'text-reveal-char';
        span.style.transitionDelay = (i * delay) + 'ms';
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
     4. SCROLL REVEAL OBSERVER
     ═════════════════════════════════════════════════ */

  var ScrollReveal = {
    instance: null,

    init: function () {
      var self = this;
      this.instance = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;

            if (el.classList.contains('img-reveal') || el.classList.contains('img-reveal-left')) {
              el.classList.add('revealed');
            }

            if (el.classList.contains('scroll-blur-reveal') || el.classList.contains('scroll-scale-reveal')) {
              el.classList.add('revealed');
            }

            if (el.classList.contains('stagger-children')) {
              el.classList.add('revealed');
            }

            TextReveal.reveal(el);

            el.querySelectorAll('.reveal-item').forEach(function (item, i) {
              setTimeout(function () { item.classList.add('revealed'); }, i * 90);
            });

            var grid = el.querySelector('.reveal-grid');
            if (grid) { grid.classList.add('revealed'); }

            self.instance.unobserve(el);
          }
        });
      }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll(
        '.img-reveal, .img-reveal-left, .scroll-blur-reveal, .scroll-scale-reveal, .stagger-children, [data-reveal]'
      ).forEach(function (el) {
        self.instance.observe(el);
      });

      document.querySelectorAll('.scroll-section').forEach(function (el) {
        self.instance.observe(el);
      });
    },

    reveal: function (container) {
      container.querySelectorAll('.reveal-item').forEach(function (item, i) {
        setTimeout(function () { item.classList.add('revealed'); }, i * 90);
      });
      var grid = container.querySelector('.reveal-grid');
      if (grid) { grid.classList.add('revealed'); }
      TextReveal.reveal(container);
    }
  };

  /* ═════════════════════════════════════════════════
     5. LERP PARALLAX SYSTEM
     ═════════════════════════════════════════════════ */

  var Parallax = {
    elements: [],
    currentY: 0,
    targetY: 0,

    init: function () {
      var self = this;
      this.elements = [];
      document.querySelectorAll('.parallax-layer').forEach(function (el) {
        var speedAttr = el.getAttribute('data-parallax-speed');
        var speed = speedAttr ? parseFloat(speedAttr) : 0.25;
        self.elements.push({ el: el, speed: speed });
      });

      document.querySelectorAll('.parallax-hero, .parallax-bg').forEach(function (el) {
        self.elements.push({ el: el, speed: 0.2 });
      });

      if (this.elements.length > 0) {
        function loop() {
          var sy = window.lenis ? window.lenis.scroll : window.scrollY;
          self.targetY = sy;
          self.currentY += (self.targetY - self.currentY) * 0.1;
          self.elements.forEach(function (item) {
            var offset = self.currentY * item.speed;
            item.el.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0)';
          });
          requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
      }
    }
  };

  /* ═════════════════════════════════════════════════
     6. FLUID SPRING CURSOR RING
     ═════════════════════════════════════════════════ */

  var CursorRing = {
    ring: null,
    mx: 0,
    my: 0,
    cx: 0,
    cy: 0,
    enabled: false,

    init: function () {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768 || window.matchMedia('(hover: none)').matches) {
        var existing = document.getElementById('cursor-ring');
        if (existing) existing.style.display = 'none';
        return;
      }

      this.ring = document.getElementById('cursor-ring');
      if (!this.ring) {
        this.ring = document.createElement('div');
        this.ring.id = 'cursor-ring';
        this.ring.className = 'cursor-ring';
        document.body.appendChild(this.ring);
      }

      this.enabled = true;
      var self = this;

      this.mx = window.innerWidth / 2;
      this.my = window.innerHeight / 2;
      this.cx = this.mx;
      this.cy = this.my;

      document.addEventListener('mousemove', function (e) {
        self.mx = e.clientX;
        self.my = e.clientY;
        if (!self.ring.classList.contains('visible')) {
          self.ring.classList.add('visible');
        }
      });

      function tick() {
        if (self.enabled) {
          self.cx += (self.mx - self.cx) * 0.18;
          self.cy += (self.my - self.cy) * 0.18;
          self.ring.style.left = self.cx.toFixed(1) + 'px';
          self.ring.style.top = self.cy.toFixed(1) + 'px';
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      document.addEventListener('mouseover', function (e) {
        var target = e.target.closest('a, button, .project-card, .horizontal-card, input, textarea, [data-hover]');
        if (target) {
          self.ring.classList.add('hover');
          var darkParent = target.closest('.bg-core-black, .bg-black, .bg-stone-900, .bg-stone-950');
          if (darkParent) {
            self.ring.classList.remove('dark-ring');
          } else {
            self.ring.classList.add('dark-ring');
          }
        }
      }, true);

      document.addEventListener('mouseout', function (e) {
        var target = e.target.closest('a, button, .project-card, .horizontal-card, input, textarea, [data-hover]');
        if (target) {
          self.ring.classList.remove('hover');
          self.ring.classList.remove('dark-ring');
        }
      }, true);

      document.addEventListener('mouseleave', function () {
        self.ring.classList.remove('visible');
      });

      document.addEventListener('mouseenter', function () {
        self.ring.classList.add('visible');
      });
    }
  };

  /* ═════════════════════════════════════════════════
     7. LOADING SCREEN
     ═════════════════════════════════════════════════ */

  var LoadingScreen = {
    el: null,

    init: function () {
      this.el = document.getElementById('loading-screen');
      if (this.el) {
        requestAnimationFrame(function () {
          this.el.classList.add('active');
        }.bind(this));

        setTimeout(function () {
          this.hide();
        }.bind(this), 1000);
      }
    },

    hide: function () {
      if (!this.el) return;
      this.el.classList.remove('active');
      this.el.classList.add('animate-loader-fade');

      setTimeout(function () {
        this.el.style.display = 'none';
      }.bind(this), 500);
    }
  };

  /* ═════════════════════════════════════════════════
     8. PAGE TRANSITION OVERLAY
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
     9. ANCHOR SMOOTH SCROLL WITH LENIS
     ═════════════════════════════════════════════════ */

  var SmoothScroll = {
    init: function () {
      document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        if (window.lenis) {
          window.lenis.scrollTo(target, { offset: -60, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  };

  /* ═════════════════════════════════════════════════
     10. CONTINUOUS RAF LERP HORIZONTAL PIN SCROLL
     ═════════════════════════════════════════════════ */

  var HorizontalPinScroll = {
    pinSection: null,
    stickyViewport: null,
    track: null,
    progressBar: null,
    stepCounter: null,
    stepPills: [],
    targetTranslate: 0,
    currentTranslate: 0,
    maxTranslate: 0,
    active: false,

    init: function () {
      this.pinSection = document.getElementById('horizontal-pin-section');
      this.stickyViewport = document.getElementById('horizontal-sticky-viewport');
      this.track = document.getElementById('horizontal-track');
      this.progressBar = document.getElementById('horizontal-progress-bar');
      this.stepCounter = document.getElementById('horizontal-step-counter');
      this.stepPills = document.querySelectorAll('.horizontal-step-pill');
      var prevBtn = document.getElementById('horizontal-prev-btn');
      var nextBtn = document.getElementById('horizontal-next-btn');

      if (!this.pinSection || !this.stickyViewport || !this.track) return;
      this.active = true;

      var self = this;

      function updateTarget() {
        var sectionRect = self.pinSection.getBoundingClientRect();
        var sectionTop = sectionRect.top;
        var sectionHeight = self.pinSection.offsetHeight;
        var viewportHeight = window.innerHeight;

        var maxScroll = sectionHeight - viewportHeight;
        if (maxScroll <= 0) return;

        var progress = -sectionTop / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        var trackWidth = self.track.scrollWidth;
        var viewportWidth = self.stickyViewport.clientWidth;
        self.maxTranslate = Math.max(0, trackWidth - viewportWidth + 60);

        self.targetTranslate = progress * self.maxTranslate;

        if (self.progressBar) {
          self.progressBar.style.width = (progress * 100) + '%';
        }

        var cards = self.track.querySelectorAll('.horizontal-card');
        var activeIndex = 0;
        cards.forEach(function (card, idx) {
          var cardRect = card.getBoundingClientRect();
          if (cardRect.left <= window.innerWidth * 0.55 && cardRect.right >= window.innerWidth * 0.1) {
            activeIndex = idx;
          }
        });

        if (self.stepCounter) {
          var formattedIndex = String(activeIndex + 1).padStart(2, '0');
          var totalFormatted = String(cards.length).padStart(2, '0');
          self.stepCounter.textContent = formattedIndex + ' / ' + totalFormatted;
        }

        self.stepPills.forEach(function (pill, idx) {
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

      function animLoop() {
        if (self.active) {
          updateTarget();
          self.currentTranslate += (self.targetTranslate - self.currentTranslate) * 0.09;
          if (Math.abs(self.targetTranslate - self.currentTranslate) < 0.05) {
            self.currentTranslate = self.targetTranslate;
          }
          self.track.style.transform = 'translate3d(-' + self.currentTranslate.toFixed(2) + 'px, 0, 0)';
        }
        requestAnimationFrame(animLoop);
      }
      requestAnimationFrame(animLoop);

      this.stepPills.forEach(function (pill, idx) {
        pill.addEventListener('click', function () {
          var cards = self.track.querySelectorAll('.horizontal-card');
          if (!cards[idx]) return;

          var targetCard = cards[idx];
          var maxScroll = self.pinSection.offsetHeight - window.innerHeight;
          var trackWidth = self.track.scrollWidth;
          var viewportWidth = self.stickyViewport.clientWidth;
          var maxTranslate = Math.max(0, trackWidth - viewportWidth + 60);

          var targetTranslate = targetCard.offsetLeft - 40;
          var targetProgress = Math.min(1, Math.max(0, targetTranslate / maxTranslate));

          var targetScrollY = self.pinSection.offsetTop + targetProgress * maxScroll;
          if (window.lenis) {
            window.lenis.scrollTo(targetScrollY, { duration: 1.2 });
          } else {
            window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
          }
        });
      });

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          var cards = self.track.querySelectorAll('.horizontal-card');
          var activeIndex = 0;
          cards.forEach(function (card, idx) {
            var cardRect = card.getBoundingClientRect();
            if (cardRect.left <= window.innerWidth * 0.5) activeIndex = idx;
          });
          var nextIndex = Math.min(cards.length - 1, activeIndex + 1);
          if (self.stepPills[nextIndex]) self.stepPills[nextIndex].click();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          var cards = self.track.querySelectorAll('.horizontal-card');
          var activeIndex = 0;
          cards.forEach(function (card, idx) {
            var cardRect = card.getBoundingClientRect();
            if (cardRect.left <= window.innerWidth * 0.5) activeIndex = idx;
          });
          var prevIndex = Math.max(0, activeIndex - 1);
          if (self.stepPills[prevIndex]) self.stepPills[prevIndex].click();
        });
      }
    }
  };

  /* ═════════════════════════════════════════════════
     11. HTMX INTEGRATION
     ═════════════════════════════════════════════════ */

  function initHtmxIntegration() {
    document.body.addEventListener('htmx:afterSwap', function (evt) {
      var target = evt.detail.target;

      if (ScrollReveal.instance) {
        target.querySelectorAll(
          '.img-reveal, .img-reveal-left, .scroll-blur-reveal, .scroll-scale-reveal, .stagger-children, [data-reveal]'
        ).forEach(function (el) {
          ScrollReveal.instance.observe(el);
        });
      }

      target.querySelectorAll('[data-reveal-text]').forEach(function (el) {
        TextReveal.splitWords(el, parseFloat(el.getAttribute('data-reveal-delay')) || 45);
      });

      ScrollReveal.reveal(target);
      if (window.lenis) {
        window.lenis.resize();
      }
    });

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
  }

  /* ═════════════════════════════════════════════════
     12. INITIALIZATION
     ═════════════════════════════════════════════════ */

  function init() {
    LenisEngine.init();
    FilmGrain.init();
    TextReveal.init();
    ScrollReveal.init();
    Parallax.init();
    CursorRing.init();
    LoadingScreen.init();
    PageTransition.init();
    SmoothScroll.init();
    HorizontalPinScroll.init();

    if (typeof htmx !== 'undefined') {
      initHtmxIntegration();
    }

    document.querySelectorAll('[data-reveal].in-viewport').forEach(function (el) {
      ScrollReveal.reveal(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.GCAnimations = {
    TextReveal: TextReveal,
    ScrollReveal: ScrollReveal,
    Parallax: Parallax,
    LoadingScreen: LoadingScreen,
    PageTransition: PageTransition,
    HorizontalPinScroll: HorizontalPinScroll,
    refresh: function (container) {
      if (container) {
        container.querySelectorAll('[data-reveal-text]').forEach(function (el) {
          TextReveal.splitWords(el, parseFloat(el.getAttribute('data-reveal-delay')) || 45);
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
