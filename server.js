const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const { projects, categories, filterProjects, getSizeAspect, getProject, getAdjacentProjects, getRelatedProjects } = require('./data/projects');
const { services } = require('./data/services');

const app = express();
const PORT = process.env.PORT || 3000;
const PER_PAGE = 6;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(session({ secret: 'graphiccity-admin-secret-2026', resave: false, saveUninitialized: false, cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' } }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const adminRouter = require('./admin');
app.use('/admin', adminRouter);

/* ─── Render Helpers (used by work routes) ─── */
function renderFilters(activeCategory, searchValue) {
  return `
    <div class="flex flex-wrap items-center gap-2 md:gap-3" role="tablist" aria-label="Filter by category">
      ${categories.map(cat => `
        <button role="tab"
                aria-selected="${cat.id === activeCategory ? 'true' : 'false'}"
                class="px-4 py-2 rounded-md font-body text-sm transition-all duration-200 focus-ring
                       ${cat.id === activeCategory
                         ? 'bg-core-black dark:bg-core-white text-core-white dark:text-core-black'
                         : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white hover:bg-stone-200 dark:hover:bg-stone-700'}"
                hx-get="/partials/work-grid?category=${cat.id}"
                hx-target="#work-grid"
                hx-push-url="/work?category=${cat.id}"
                hx-indicator="#work-indicator">
          ${cat.label}
        </button>
      `).join('')}

      <div class="relative ml-auto">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
        <input type="search" name="search" value="${searchValue || ''}"
               placeholder="Search projects..."
               class="w-40 md:w-56 h-9 pl-9 pr-3 bg-stone-100 dark:bg-stone-800 border border-transparent focus:border-stone-300 dark:focus:border-stone-600 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 transition-all duration-200 focus-ring"
               hx-get="/partials/work-grid"
               hx-trigger="keyup changed delay:300ms, search"
               hx-target="#work-grid"
               hx-push-url="true"
               hx-include="[name='category']"
               hx-indicator="#work-indicator">
      </div>
    </div>
    <div id="work-indicator" class="h-0.5 bg-stone-200 dark:bg-stone-800 mt-4 rounded-full overflow-hidden">
      <div class="h-full bg-core-black dark:bg-core-white rounded-full transition-all duration-300 w-0 htmx-request:w-full"></div>
    </div>
  `;
}

function renderGrid(items) {
  if (items.length === 0) {
    return `
      <div class="text-center py-24">
        <p class="font-display text-2xl text-stone-400 dark:text-stone-500 mb-2">No projects found</p>
        <p class="font-body text-sm text-stone-400 dark:text-stone-500">Try adjusting your filter or search.</p>
      </div>
    `;
  }
  return `
    <div class="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      ${items.map(renderCard).join('')}
    </div>
  `;
}

function renderCard(p) {
  const aspect = getSizeAspect(p.size);
  const thumbUrl = `https://picsum.photos/seed/${p.seeds.thumb}/${aspect.w}/${aspect.h}`;
  return `
    <article class="masonry-item break-inside-avoid mb-6 project-card group cursor-pointer relative"
             data-project-id="${p.id}"
             data-category="${p.category}">
      <div class="relative overflow-hidden rounded-md bg-stone-100 dark:bg-stone-900">
        <div class="${aspect.css}">
          <img src="${thumbUrl}"
               alt="${p.title} — ${p.client}"
               class="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]"
               loading="lazy">
        </div>
        <div class="absolute inset-0 bg-core-black/0 group-hover:bg-core-black/20 dark:group-hover:bg-core-black/40 transition-all duration-500 flex items-center justify-center">
          <span class="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="text-core-white"><path d="M4 16H28M28 16L20 8M28 16L20 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </div>
      </div>
      <div class="mt-4 space-y-1.5">
        <div class="flex items-center gap-2">
          <span class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500">${p.client}</span>
          <span class="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
          <span class="font-body text-xs text-stone-400 dark:text-stone-500">${p.year}</span>
        </div>
        <h2 class="font-display text-xl text-core-black dark:text-core-white group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors duration-200">
          <a href="/work/${p.id}" class="hover:underline underline-offset-2 decoration-stone-300 dark:decoration-stone-700 focus-ring rounded-sm">${p.title}</a>
        </h2>
        <p class="font-body text-sm text-stone-400 dark:text-stone-500 line-clamp-2 text-balance">${p.description}</p>
        <div class="flex items-center gap-2 pt-1">
          <span class="inline-block px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded font-body text-xs text-stone-500 dark:text-stone-400">
            ${categories.find(c => c.id === p.category)?.label || p.category}
          </span>
        </div>
      </div>
    </article>
  `;
}

function renderPagination(result, category, search) {
  if (result.totalPages <= 1) return '';
  const pages = [];
  for (let i = 1; i <= result.totalPages; i++) {
    const isActive = i === result.currentPage;
    const url = `/work?category=${category}&search=${encodeURIComponent(search)}&page=${i}`;
    pages.push(`
      <button class="w-9 h-9 rounded-md font-body text-sm transition-all duration-200 flex items-center justify-center
                     ${isActive
                       ? 'bg-core-black dark:bg-core-white text-core-white dark:text-core-black'
                       : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-core-black dark:hover:text-core-white'}"
              ${isActive ? 'aria-current="page"' : ''}
              hx-get="/partials/work-grid?category=${category}&search=${encodeURIComponent(search)}&page=${i}"
              hx-target="#work-grid"
              hx-push-url="${url}"
              hx-indicator="#work-indicator"
              aria-label="Page ${i}">
        ${i}
      </button>
    `);
  }
  return `
    <nav aria-label="Pagination" class="flex items-center justify-center gap-2">
      ${pages.join('')}
    </nav>
  `;
}

function renderNav(current) {
  const links = [
    { href: '/work', label: 'Work', id: 'work' },
    { href: '/capabilities', label: 'Capabilities', id: 'capabilities' },
    { href: '/about', label: 'About', id: 'about' },
    { href: '/journal', label: 'Journal', id: 'journal' }
  ];
  return `
  <header id="site-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out">
    <nav class="flex items-center justify-between h-16 px-6 md:px-8 lg:px-12 bg-core-white/85 dark:bg-core-black/85 backdrop-blur-[20px] border-b border-stone-200 dark:border-stone-800" aria-label="Primary navigation">
      <a href="/" class="flex items-center" aria-label="GraphicCity home"><svg width="32" height="16" viewBox="0 0 32 16" fill="none" aria-hidden="true"><rect width="6" height="16" rx="1" fill="currentColor"/><rect x="9" width="6" height="16" rx="1" fill="currentColor"/><rect x="18" width="6" height="16" rx="1" fill="currentColor"/><rect x="27" width="5" height="16" rx="1" fill="currentColor"/></svg></a>
      <div class="hidden md:flex items-center gap-6 lg:gap-8">
        ${links.map(l => `<a href="${l.href}" class="font-body text-sm ${l.id === current ? 'font-medium text-core-black dark:text-core-white' : 'text-stone-500 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white'} transition-colors">${l.label}</a>`).join('')}
      </div>
      <div class="flex items-center gap-4">
        <a href="/start" class="hidden sm:inline-flex items-center h-9 px-4 bg-core-black dark:bg-core-white text-core-white dark:text-core-black font-body font-medium text-sm rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-all">Start a Project</a>
        <button id="menu-toggle" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors px-1 py-1" aria-label="Open menu" aria-haspopup="true" aria-controls="menu-overlay">Menu</button>
      </div>
    </nav>
  </header>

  <div id="menu-overlay" class="fixed inset-0 z-[60] bg-core-black/98 backdrop-blur-[40px] transition-opacity duration-300 ease-out opacity-0 pointer-events-none" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Site navigation menu">
    <button class="absolute top-4 right-4 md:top-6 md:right-8 lg:top-8 lg:right-12 font-body text-xs font-medium tracking-wider uppercase text-stone-400 hover:text-core-white transition-colors duration-150 menu-close-btn px-3 py-2" aria-label="Close menu">Close</button>
    <div class="flex flex-col items-center justify-center h-full px-6">
      <nav aria-label="Site navigation" class="text-center">
        ${links.map(l => `<a href="${l.href}" class="block font-display text-4xl md:text-5xl text-core-white hover:text-stone-300 transition-colors duration-150 py-3">${l.label}</a>`).join('')}
        <hr class="w-12 mx-auto my-8 border-stone-700"><a href="/start" class="inline-flex items-center h-12 px-8 bg-core-white text-core-black font-body font-medium text-base rounded-md hover:bg-stone-200 transition-all">Start a Project</a>
      </nav>
      <div class="absolute bottom-8 left-0 right-0 px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <a href="mailto:hello@graphiccity.studio" class="font-body text-sm text-stone-400 hover:text-core-white transition-colors">hello@graphiccity.studio</a>
          <div class="flex items-center gap-6">
            <a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 hover:text-core-white transition-colors">LinkedIn</a>
            <a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 hover:text-core-white transition-colors">Instagram</a>
            <a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 hover:text-core-white transition-colors">Twitter</a>
          </div>
        </div>
        <p class="text-center mt-6 font-body text-xs text-stone-600">&copy; 2026 GraphicCity</p>
      </div>
    </div>
  </div>`;
}

/* ─── Work Grid Partial (HTMX) — defined before generic partials route ─── */
app.get('/partials/work-grid', (req, res) => {
  const category = req.query.category || 'all';
  const search = req.query.search || '';
  const page = parseInt(req.query.page, 10) || 1;
  const result = filterProjects(category, search, page, PER_PAGE);
  const html = `
    <div class="flex items-center justify-between mb-8">
      <p class="font-body text-sm text-stone-400 dark:text-stone-500"><span class="font-medium text-core-black dark:text-core-white">${result.total}</span> project${result.total !== 1 ? 's' : ''}</p>
    </div>
    ${renderGrid(result.items)}
    <div id="work-pagination" class="mt-16" hx-swap-oob="true">
      ${renderPagination(result, category, search)}
    </div>
  `;
  res.send(html);
});

/* ─── Capabilities Partials (defined before generic catch-all) ─── */
app.get('/partials/services-process', (req, res) => {
  const html = `
    <div class="max-w-7xl mx-auto w-full">
      <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Our Process</p>
      <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-16 reveal-item">How we get there.</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 reveal-grid" data-reveal-grid>
        ${[
          { phase: 'Discover', icon: '01', desc: 'We listen first. Stakeholder interviews, market research, competitive audit. Before we make anything, we understand everything.', color: 'from-stone-900 to-stone-700' },
          { phase: 'Define', icon: '02', desc: 'We find the signal. Strategy, positioning, creative direction. A clear north star before a single pixel is touched.', color: 'from-stone-800 to-stone-600' },
          { phase: 'Design', icon: '03', desc: 'We explore, refine, and commit. Multiple directions, rigorous critique, relentless reduction. We arrive at the solution that feels inevitable.', color: 'from-stone-700 to-stone-500' },
          { phase: 'Deploy', icon: '04', desc: 'We deliver, document, and support. Final assets, brand guidelines, launch collateral. You leave with a system, not a folder.', color: 'from-stone-600 to-stone-400' }
        ].map(p => `
          <div class="reveal-item text-center">
            <div class="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center">
              <span class="font-mono text-lg font-medium text-core-white">${p.icon}</span>
            </div>
            <h3 class="font-display text-xl text-core-black dark:text-core-white mb-3">${p.phase}</h3>
            <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed text-balance max-w-xs mx-auto">${p.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
    <script>if(window.Alpine) Alpine.initTree(document.currentScript.parentElement);</script>`;
  res.send(html);
});

app.get('/partials/services-pricing', (req, res) => {
  const html = `
    <div class="max-w-7xl mx-auto w-full">
      <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 text-center reveal-item">Investment</p>
      <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-4 text-center reveal-item">Transparent by default.</h2>
      <p class="font-body text-base text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-center mb-16 text-balance reveal-item">Every project is different, but these ranges give you a clear starting point. We'll provide a precise estimate after our first conversation.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-grid max-w-5xl mx-auto" data-reveal-grid
           x-data="{ hovered: null }">
        ${services.filter(s => s.id !== 'brand-guidance').slice(0, 3).map((s, i) => `
          <div class="reveal-item rounded-xl border transition-all duration-300 cursor-default"
               :class="hovered === ${i} ? 'border-core-black dark:border-core-white shadow-md -translate-y-0.5' : 'border-stone-200 dark:border-stone-800'"
               @mouseenter="hovered = ${i}" @mouseleave="hovered = null">
            <div class="p-6 md:p-8">
              <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-1">${s.title}</p>
              <p class="font-display text-3xl md:text-4xl text-core-black dark:text-core-white -tracking-tight mb-1">
                <span class="font-body text-base text-stone-300 dark:text-stone-600 align-top">$</span>${s.pricing}
                <span class="font-body text-sm text-stone-300 dark:text-stone-600 font-normal">+</span>
              </p>
              <p class="font-body text-xs text-stone-400 dark:text-stone-500 mb-6">Starting investment</p>
              <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed text-balance mb-6">${s.tagline}</p>
              <ul class="space-y-2">
                ${s.deliverables.slice(0, 3).map(d => `
                  <li class="flex items-center gap-2 font-body text-xs text-stone-500 dark:text-stone-400">
                    <svg class="w-3 h-3 text-stone-300 dark:text-stone-600 shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="1.5,6 4.5,9 10.5,3"/></svg>
                    ${d}
                  </li>
                `).join('')}
              </ul>
            </div>
            <div class="px-6 md:px-8 pb-6 md:pb-8">
              <a href="/start" class="block w-full text-center h-9 leading-9 rounded-md bg-stone-100 dark:bg-stone-800 text-core-black dark:text-core-white font-body text-sm font-medium hover:bg-core-black dark:hover:bg-core-white hover:text-core-white dark:hover:text-core-black transition-all">Get started</a>
            </div>
          </div>
        `).join('')}
      </div>
      <p class="text-center mt-10 font-body text-sm text-stone-400 dark:text-stone-500 reveal-item">Not sure what you need? <a href="/start" class="text-core-black dark:text-core-white hover:underline underline-offset-2 decoration-stone-300 dark:decoration-stone-700">Tell us about your project</a> and we'll recommend the right approach.</p>
    </div>
    <script>if(window.Alpine) Alpine.initTree(document.currentScript.parentElement);</script>`;
  res.send(html);
});

app.get('/partials/services-faq', (req, res) => {
  const allFaq = services.flatMap(s => s.faq).slice(0, 6);
  const html = `
    <div class="max-w-3xl mx-auto w-full" x-data="{ open: null }">
      <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 text-center reveal-item">FAQ</p>
      <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-16 text-center reveal-item">Common questions.</h2>
      <div class="space-y-3 reveal-grid" data-reveal-grid>
        ${allFaq.map((item, i) => `
          <div class="reveal-item rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden transition-all duration-200"
               :class="{ 'shadow-sm': open === ${i} }">
            <button @click="open = open === ${i} ? null : ${i}"
                    class="w-full flex items-center justify-between px-6 py-5 text-left font-body text-base font-medium text-core-black dark:text-core-white hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors focus-ring rounded-xl"
                    :aria-expanded="open === ${i}">
              <span>${item.q}</span>
              <svg class="w-4 h-4 text-stone-400 shrink-0 ml-4 transition-transform duration-200" :class="{ 'rotate-45': open === ${i} }" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>
            </button>
            <div x-show="open === ${i}" x-cloak
                 x-transition:enter="transition-all duration-300 ease-out"
                 x-transition:enter-start="opacity-0 max-h-0"
                 x-transition:enter-end="opacity-1 max-h-[500px]">
              <div class="px-6 pb-5 pt-0">
                <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed text-balance">${item.a}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <p class="text-center mt-10 font-body text-sm text-stone-400 dark:text-stone-500 reveal-item">Still have questions? <a href="mailto:hello@graphiccity.studio" class="text-core-black dark:text-core-white hover:underline underline-offset-2 decoration-stone-300 dark:decoration-stone-700">Get in touch</a>.</p>
    </div>
    <script>if(window.Alpine) Alpine.initTree(document.currentScript.parentElement);</script>`;
  res.send(html);
});

/* ─── Static Partials (generic) ─── */
app.get('/partials/:name', (req, res) => {
  const name = req.params.name.replace(/[^a-z0-9-]/gi, '');
  const filePath = path.join(__dirname, 'views', 'partials', `${name}.html`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('');
  }
});

/* ─── Work Page ─── */
app.get('/work', (req, res) => {
  const category = req.query.category || 'all';
  const search = req.query.search || '';
  const page = parseInt(req.query.page, 10) || 1;

  const result = filterProjects(category, search, page, PER_PAGE);
  const aspect = getSizeAspect('standard');

  const gridHtml = renderGrid(result.items);
  const filtersHtml = renderFilters(category, search);
  const paginationHtml = renderPagination(result, category, search);

  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Selected Work — GraphicCity</title>
  <meta name="description" content="A curated selection of brand identity, digital product, art direction, and motion projects.">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="Selected Work — GraphicCity">
  <meta property="og:description" content="A curated selection of brand identity, digital product, art direction, and motion projects.">
  <meta property="og:type" content="website">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/css/styles.css">
  <script src="https://unpkg.com/htmx.org@1.9.12" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js" defer></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics-compat.js"></script>
</head>
<body class="bg-core-white dark:bg-core-black text-core-black dark:text-core-white font-body">

  <div id="loading-screen" aria-hidden="true"><div class="loader-mark" aria-label="Loading"><span></span><span></span><span></span><span></span></div></div>
  <div id="page-transition" aria-hidden="true"></div>
  <div id="htmx-topbar" aria-hidden="true"><div class="bar"></div></div>

  <a href="#work-main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-core-white focus:text-core-black focus:outline-2 focus:outline-signal-blue focus:rounded-md focus:shadow-md">Skip to content</a>

  ${renderNav('work')}

  <main id="work-main">
    <!-- Header -->
    <section class="pt-36 pb-12 md:pt-40 md:pb-16 px-6 md:px-12 lg:px-20">
      <div class="max-w-7xl mx-auto">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4">Portfolio</p>
        <h1 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-4">Selected Work</h1>
        <p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-xl text-balance">Each project is a partnership. These are some of the stories we&rsquo;re proudest of.</p>
      </div>
    </section>

    <!-- Filters -->
    <section id="work-filters" class="px-6 md:px-12 lg:px-20 mb-8 md:mb-12">
      <div class="max-w-7xl mx-auto">
        ${filtersHtml}
      </div>
    </section>

    <!-- Grid -->
    <section id="work-grid" class="px-6 md:px-12 lg:px-20 pb-12">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <p class="font-body text-sm text-stone-400 dark:text-stone-500"><span class="font-medium text-core-black dark:text-core-white">${result.total}</span> project${result.total !== 1 ? 's' : ''}</p>
        </div>
        ${gridHtml}
      </div>
    </section>

    <!-- Pagination -->
    <section id="work-pagination" class="px-6 md:px-12 lg:px-20 pb-28">
      <div class="max-w-7xl mx-auto">
        ${paginationHtml}
      </div>
    </section>
  </main>

  <!-- Gallery Overlay -->
  <div id="gallery-overlay"
       x-data="gallery()"
       x-show="open"
       @keydown.right.prevent="next()"
       @keydown.left.prevent="prev()"
       @keydown.escape.window="close()"
       style="display: none;"
       class="fixed inset-0 z-[70] bg-core-black"
       role="dialog"
       aria-modal="true"
       aria-label="Project gallery">

    <div class="relative h-full flex flex-col">
      <!-- Top bar -->
      <div class="flex items-center justify-between px-6 py-4 z-10">
        <div class="flex items-center gap-4">
          <p class="font-body text-sm text-core-white" x-text="currentProject ? currentProject.client : ''"></p>
          <span class="text-stone-600" aria-hidden="true">/</span>
          <p class="font-body text-xs text-stone-400">
            <span x-text="currentImage + 1"></span>
            <span class="text-stone-600"> / </span>
            <span x-text="currentProject ? currentProject.gallery.length : 0"></span>
          </p>
        </div>
        <button @click="close()" class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 hover:text-core-white transition-colors duration-150 px-2 py-1" aria-label="Close gallery">Close</button>
      </div>

      <!-- Image area -->
      <div class="flex-1 relative flex items-center justify-center px-4">
        <button @click="prev()" class="absolute left-4 md:left-8 z-10 w-10 h-10 flex items-center justify-center text-stone-500 hover:text-core-white transition-colors duration-150" aria-label="Previous image">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <div class="max-w-5xl w-full max-h-[70vh] flex items-center justify-center">
          <template x-if="currentProject">
            <img :src="'https://picsum.photos/seed/' + currentProject.gallery[currentImage] + '/1200/800'"
                 :alt="currentProject.title + ' gallery image ' + (currentImage + 1)"
                 class="max-w-full max-h-[70vh] object-contain rounded-sm"
                 x-transition:enter.duration.300ms
                 x-transition:leave.duration.200ms>
          </template>
        </div>

        <button @click="next()" class="absolute right-4 md:right-8 z-10 w-10 h-10 flex items-center justify-center text-stone-500 hover:text-core-white transition-colors duration-150" aria-label="Next image">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4L14 10L8 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <!-- Thumbnail strip -->
      <div class="flex items-center justify-center gap-2 px-6 py-6 overflow-x-auto scrollbar-hide">
        <template x-for="(seed, idx) in (currentProject ? currentProject.gallery : [])" :key="seed">
          <button @click="currentImage = idx"
                  class="flex-shrink-0 w-16 h-12 rounded-sm overflow-hidden border-2 transition-all duration-200"
                  :class="idx === currentImage ? 'border-core-white opacity-100' : 'border-transparent opacity-40 hover:opacity-70'">
            <img :src="'https://picsum.photos/seed/' + seed + '/160/120'" alt="" class="w-full h-full object-cover" loading="lazy">
          </button>
        </template>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer id="site-footer" class="bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800" aria-label="Site footer">
    <div class="border-b border-stone-200 dark:border-stone-800">
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12">
        <a href="/start" class="group inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors duration-200">
          Start a Project
          <span class="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </a>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        <div>
          <a href="/" class="inline-flex items-center gap-2 mb-4" aria-label="GraphicCity home">
            <svg width="28" height="14" viewBox="0 0 32 16" fill="none" aria-hidden="true" class="text-core-black dark:text-core-white"><rect width="6" height="16" rx="1" fill="currentColor"/><rect x="9" width="6" height="16" rx="1" fill="currentColor"/><rect x="18" width="6" height="16" rx="1" fill="currentColor"/><rect x="27" width="5" height="16" rx="1" fill="currentColor"/></svg>
          </a>
          <p class="font-body text-sm text-stone-500 dark:text-stone-400 max-w-xs text-balance">Design, made permanent.</p>
        </div>
        <nav aria-label="Footer navigation">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-3">
              <a href="/work" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors duration-150">Work</a>
              <a href="/capabilities" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors duration-150">Capabilities</a>
            </div>
            <div class="space-y-3">
              <a href="/about" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors duration-150">About</a>
              <a href="/journal" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors duration-150">Journal</a>
            </div>
          </div>
        </nav>
        <div class="space-y-4">
          <a href="mailto:hello@graphiccity.studio" class="block font-body text-sm text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors duration-150">hello@graphiccity.studio</a>
          <p class="font-body text-xs text-stone-400 dark:text-stone-500">San Francisco, CA</p>
          <div class="flex items-center gap-5 pt-2">
            <a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors duration-150">LinkedIn</a>
            <a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors duration-150">Instagram</a>
            <a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors duration-150">Twitter</a>
          </div>
        </div>
      </div>
      <div class="mt-16 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="font-body text-xs text-stone-400 dark:text-stone-500">&copy; 2026 GraphicCity. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <a href="/privacy" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-150">Privacy</a>
          <a href="/terms" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-150">Terms</a>
        </div>
      </div>
    </div>
  </footer>

  <script id="project-data" type="application/json">${JSON.stringify(projects.map(p => ({
    id: p.id,
    title: p.title,
    client: p.client,
    category: p.category,
    color: p.color,
    gallery: p.seeds.gallery
  })))}</script>
  <script src="/public/js/firebase-init.js"></script>
  <script src="/public/js/animations.js"></script>
  <script src="/public/js/main.js"></script>
  <script src="/public/js/work.js"></script>
</body>
</html>`;

  res.send(html);
});

/* ─── Case Study Page ─── */
app.get('/work/:id', (req, res) => {
  const project = getProject(req.params.id);
  if (!project) return res.status(404).send('Project not found');
  const cs = project.cs;
  const adjacent = getAdjacentProjects(project.id);
  const related = getRelatedProjects(project.id, project.category, 3);
  const heroSeed = project.seeds.thumb + 200;

  const page = (section) => `
    <section class="min-h-screen ${section.bg || 'bg-core-white dark:bg-core-black'} flex items-center px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section" data-reveal>
      <div class="max-w-7xl mx-auto w-full">
        <div class="max-w-2xl">
          ${section.label ? `<p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">${section.label}</p>` : ''}
          ${section.title ? `<h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-6 reveal-item">${section.title}</h2>` : ''}
          ${section.content || ''}
        </div>
      </div>
    </section>`;

  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title} — ${project.client} — GraphicCity</title>
  <meta name="description" content="${project.description}">
  <meta property="og:title" content="${project.title} — ${project.client}">
  <meta property="og:description" content="${project.description}">
  <meta property="og:type" content="article">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/css/styles.css">
  <script src="https://unpkg.com/htmx.org@1.9.12" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js" defer></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics-compat.js"></script>
  <style>
    .reveal-item { opacity: 0; transform: translateY(30px); transition: opacity 0.7s cubic-bezier(0.25,0.01,0.25,1), transform 0.7s cubic-bezier(0.25,0.01,0.25,1); }
    .reveal-item.revealed { opacity: 1; transform: translateY(0); }
    .reveal-item:nth-child(2) { transition-delay: 0.1s; }
    .reveal-item:nth-child(3) { transition-delay: 0.2s; }
    .reveal-item:nth-child(4) { transition-delay: 0.3s; }
    .reveal-grid > * { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
    .reveal-grid.revealed > * { opacity: 1; transform: translateY(0); }
    .reveal-grid.revealed > *:nth-child(2) { transition-delay: 0.1s; }
    .reveal-grid.revealed > *:nth-child(3) { transition-delay: 0.2s; }
    .reveal-grid.revealed > *:nth-child(4) { transition-delay: 0.3s; }
    .parallax-hero { transform: translateY(0); will-change: transform; }
  </style>
</head>
<body class="bg-core-white dark:bg-core-black text-core-black dark:text-core-white font-body">

  <div id="loading-screen" aria-hidden="true"><div class="loader-mark" aria-label="Loading"><span></span><span></span><span></span><span></span></div></div>
  <div id="page-transition" aria-hidden="true"></div>
  <div id="htmx-topbar" aria-hidden="true"><div class="bar"></div></div>

  <a href="#cs-main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-core-white focus:text-core-black focus:outline-2 focus:outline-signal-blue focus:rounded-md focus:shadow-md">Skip to content</a>

  ${renderNav('work')}

  <main id="cs-main">

    <!-- ═══ HERO ═══ -->
    <section class="relative min-h-screen flex items-end pb-20 px-6 md:px-12 lg:px-20 overflow-hidden" data-reveal>
      <div class="absolute inset-0 bg-core-black" aria-hidden="true">
        <img src="https://picsum.photos/seed/${heroSeed}/1600/900" alt="" class="w-full h-full object-cover opacity-60 parallax-hero">
        <div class="absolute inset-0 bg-gradient-to-t from-core-black/80 via-core-black/30 to-transparent"></div>
      </div>
      <div class="relative z-10 max-w-5xl reveal-item">
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <span class="font-body text-xs font-medium tracking-wider uppercase text-core-white/60">${categories.find(c => c.id === project.category)?.label || project.category}</span>
          <span class="text-core-white/30" aria-hidden="true">·</span>
          <span class="font-body text-xs text-core-white/60">${project.year}</span>
        </div>
        <h1 class="font-display font-light text-h1 md:text-display-sm xl:text-display text-core-white -tracking-tight mb-3">${project.title}</h1>
        <p class="font-display text-xl md:text-2xl text-core-white/70">${project.client}</p>
      </div>
      <div class="scroll-affordance" aria-hidden="true" style="background: rgba(255,255,255,0.2);"></div>
    </section>

    <!-- ═══ CHALLENGE ═══ -->
    <section class="min-h-screen flex flex-col lg:flex-row items-center px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-core-white dark:bg-core-black" data-reveal>
      <div class="w-full lg:w-1/2 lg:pr-16 xl:pr-24 mb-12 lg:mb-0">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">The Challenge</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-6 reveal-item">What needed to change.</h2>
        <p class="font-body text-lg md:text-xl leading-relaxed text-stone-600 dark:text-stone-300 text-balance reveal-item">${cs.challenge}</p>
      </div>
      <div class="w-full lg:w-1/2 reveal-item">
        <div class="aspect-[4/3] rounded-md overflow-hidden bg-stone-100 dark:bg-stone-900">
          <img src="https://picsum.photos/seed/${project.seeds.thumb + 210}/800/600" alt="Research process for ${project.title}" class="w-full h-full object-cover" loading="lazy">
        </div>
      </div>
    </section>

    <!-- ═══ RESEARCH ═══ -->
    <section class="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-stone-50 dark:bg-stone-950" data-reveal>
      <div class="max-w-7xl mx-auto w-full">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Research</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-6 reveal-item">Understanding the landscape.</h2>
        <p class="font-body text-base md:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mb-12 text-balance reveal-item">${cs.research}</p>
        <div class="reveal-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" data-reveal-grid>
          ${[1,2,3].map(i => `
            <div class="aspect-[3/2] rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800">
              <img src="https://picsum.photos/seed/${project.seeds.thumb + 220 + i}/600/400" alt="Research image ${i}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy">
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ SKETCHES ═══ -->
    <section class="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-core-white dark:bg-core-black" data-reveal>
      <div class="max-w-7xl mx-auto w-full">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Sketches & Exploration</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-6 reveal-item">Where ideas begin.</h2>
        <div class="reveal-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" data-reveal-grid>
          ${[0,1,2].map(i => `
            <div class="reveal-item">
              <div class="aspect-[4/5] rounded-md overflow-hidden bg-stone-100 dark:bg-stone-900 mb-4 ${i === 1 ? 'md:mt-8' : ''}">
                <img src="https://picsum.photos/seed/${project.seeds.thumb + 230 + i}/400/500" alt="Sketch ${i + 1}" class="w-full h-full object-cover" loading="lazy">
              </div>
              <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed text-balance">${cs.sketches[i]}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ ITERATIONS ═══ -->
    <section class="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-stone-50 dark:bg-stone-950" data-reveal>
      <div class="max-w-7xl mx-auto w-full">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Iterations</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-6 reveal-item">Refining toward resolution.</h2>
        <p class="font-body text-base md:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mb-12 text-balance reveal-item">Every project passes through multiple rounds of critique and refinement. The difference between good and great is rarely a single breakthrough — it is a hundred small improvements.</p>
        <div class="reveal-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" data-reveal-grid>
          ${[0,1,2].map(i => `
            <div class="relative group overflow-hidden rounded-md bg-stone-200 dark:bg-stone-800" style="aspect-ratio: ${i === 1 ? '3/4' : '4/3'}">
              <img src="https://picsum.photos/seed/${project.seeds.thumb + 240 + i}/800/500" alt="Iteration ${i + 1}" class="w-full h-full object-cover" loading="lazy">
              <div class="absolute top-3 left-3 px-2 py-0.5 bg-core-black/60 backdrop-blur-sm rounded font-body text-xs text-core-white">v${i + 1}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ TYPOGRAPHY ═══ -->
    <section class="min-h-screen flex flex-col lg:flex-row items-center px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-core-black text-core-white" data-reveal>
      <div class="w-full lg:w-1/2 lg:pr-16 xl:pr-24 mb-12 lg:mb-0">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 mb-4 reveal-item">Typography</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-white -tracking-tight mb-8 reveal-item">The voice of the brand.</h2>
        ${cs.typography.typefaces.map((tf, i) => `
          <div class="mb-6 reveal-item">
            <p class="font-display font-light text-4xl md:text-5xl text-core-white/90 tracking-tight" style="font-family: '${tf}', sans-serif;">${tf}</p>
          </div>
        `).join('')}
        <p class="font-body text-base text-stone-400 max-w-lg text-balance reveal-item">${cs.typography.description}</p>
      </div>
      <div class="w-full lg:w-1/2 reveal-item">
        <div class="aspect-[4/3] rounded-md overflow-hidden bg-stone-900">
          <img src="https://picsum.photos/seed/${project.seeds.thumb + 250}/800/600" alt="Typography specimen" class="w-full h-full object-cover opacity-80" loading="lazy">
        </div>
      </div>
    </section>

    <!-- ═══ COLOR PALETTE ═══ -->
    <section class="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-core-white dark:bg-core-black" data-reveal>
      <div class="max-w-7xl mx-auto w-full">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Color Palette</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-12 reveal-item">A considered spectrum.</h2>
        <div class="reveal-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" data-reveal-grid>
          ${cs.colors.map(c => `
            <div class="reveal-item">
              <div class="w-full aspect-[3/2] rounded-md mb-3" style="background-color: ${c.hex};"></div>
              <p class="font-mono text-sm text-stone-500 dark:text-stone-400 mb-1">${c.hex}</p>
              <p class="font-body text-sm font-medium text-core-black dark:text-core-white">${c.name}</p>
              <p class="font-body text-xs text-stone-400 dark:text-stone-500">${c.usage}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ MOCKUPS ═══ -->
    <section class="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-stone-50 dark:bg-stone-950" data-reveal>
      <div class="max-w-7xl mx-auto w-full">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Mockups & Applications</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-6 reveal-item">In the world.</h2>
        <p class="font-body text-base md:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mb-12 text-balance reveal-item">Design does not exist in a vacuum. Every mark, every color, every typeface is tested against real-world conditions before it ships.</p>
        <div class="reveal-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" data-reveal-grid>
          ${[0,1,2].map(i => `
            <div class="${i === 0 ? 'md:col-span-2 aspect-[2/1]' : 'aspect-[4/3]'} rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800">
              <img src="https://picsum.photos/seed/${project.seeds.thumb + 260 + i}/800/600" alt="Mockup ${i + 1}" class="w-full h-full object-cover" loading="lazy">
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ RESULTS ═══ -->
    <section class="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-core-black text-core-white" data-reveal>
      <div class="max-w-7xl mx-auto w-full">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 mb-4 reveal-item">Results</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-white -tracking-tight mb-16 reveal-item">Measured impact.</h2>
        <div class="reveal-grid grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16" data-reveal-grid>
          ${cs.results.map(r => `
            <div class="reveal-item">
              <p class="font-display font-light text-[clamp(3rem,8vw,5rem)] text-core-white -tracking-tight leading-none mb-3">${r.value}</p>
              <p class="font-body text-base text-stone-400 max-w-xs text-balance">${r.label}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ GALLERY ═══ -->
    <section class="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-core-white dark:bg-core-black" data-reveal>
      <div class="max-w-7xl mx-auto w-full">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Gallery</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-12 reveal-item">Selected visuals.</h2>
        <div class="reveal-grid columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4" data-reveal-grid>
          ${project.seeds.gallery.map((seed, i) => `
            <div class="break-inside-avoid rounded-md overflow-hidden bg-stone-100 dark:bg-stone-900 reveal-item">
              <img src="https://picsum.photos/seed/${seed + 300}/${i % 2 === 0 ? 600 : 600}/${i % 2 === 0 ? 400 : 600}" alt="Gallery image ${i + 1}" class="w-full h-full object-cover" loading="lazy">
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ NEXT PROJECT ═══ -->
    <section class="relative min-h-[60vh] flex items-center px-6 md:px-12 lg:px-20 py-24 scroll-section bg-core-black overflow-hidden cursor-pointer" data-reveal
             onclick="window.location.href='/work/${adjacent.next.id}'" role="link" tabindex="0"
             onkeydown="if(event.key==='Enter') window.location.href='/work/${adjacent.next.id}'">
      <div class="absolute inset-0" aria-hidden="true">
        <img src="https://picsum.photos/seed/${adjacent.next.seeds.thumb + 200}/1600/900" alt="" class="w-full h-full object-cover opacity-30">
        <div class="absolute inset-0 bg-gradient-to-l from-core-black/60 to-core-black/20"></div>
      </div>
      <div class="relative z-10 max-w-5xl mx-auto w-full">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 mb-4 reveal-item">Next Project</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-white -tracking-tight mb-3 reveal-item">${adjacent.next.title}</h2>
        <p class="font-display text-xl text-core-white/60 mb-8 reveal-item">${adjacent.next.client}</p>
        <div class="reveal-item">
          <span class="group inline-flex items-center gap-3 font-body text-sm text-stone-400 hover:text-core-white transition-colors">
            View case study
            <span class="inline-block transition-transform duration-300 group-hover:translate-x-1"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          </span>
        </div>
      </div>
    </section>

    <!-- ═══ RELATED PROJECTS ═══ -->
    ${related.length > 0 ? `
    <section class="px-6 md:px-12 lg:px-20 py-24 scroll-section bg-stone-50 dark:bg-stone-950" data-reveal>
      <div class="max-w-7xl mx-auto">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Related Work</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-12 reveal-item">More in ${categories.find(c => c.id === project.category)?.label || project.category}.</h2>
        <div class="reveal-grid grid grid-cols-1 md:grid-cols-3 gap-6" data-reveal-grid>
          ${related.map(r => `
            <a href="/work/${r.id}" class="group reveal-item">
              <div class="aspect-[4/3] rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800 mb-4">
                <img src="https://picsum.photos/seed/${r.seeds.thumb}/600/450" alt="${r.title}" class="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03]" loading="lazy">
              </div>
              <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-1">${r.client}</p>
              <h3 class="font-display text-xl text-core-black dark:text-core-white group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors">${r.title}</h3>
            </a>
          `).join('')}
        </div>
      </div>
    </section>` : ''}

  </main>

  <!-- Footer -->
  <footer id="site-footer" class="bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
    <div class="border-b border-stone-200 dark:border-stone-800">
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12">
        <a href="/start" class="group inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">
          Start a Project
          <span class="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </a>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        <div><a href="/" class="inline-flex items-center gap-2 mb-4" aria-label="GraphicCity home"><svg width="28" height="14" viewBox="0 0 32 16" fill="none" aria-hidden="true" class="text-core-black dark:text-core-white"><rect width="6" height="16" rx="1" fill="currentColor"/><rect x="9" width="6" height="16" rx="1" fill="currentColor"/><rect x="18" width="6" height="16" rx="1" fill="currentColor"/><rect x="27" width="5" height="16" rx="1" fill="currentColor"/></svg></a><p class="font-body text-sm text-stone-500 dark:text-stone-400 max-w-xs text-balance">Design, made permanent.</p></div>
        <nav aria-label="Footer navigation"><div class="grid grid-cols-2 gap-6"><div class="space-y-3"><a href="/work" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Work</a><a href="/capabilities" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Capabilities</a></div><div class="space-y-3"><a href="/about" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">About</a><a href="/journal" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Journal</a></div></div></nav>
        <div class="space-y-4"><a href="mailto:hello@graphiccity.studio" class="block font-body text-sm text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">hello@graphiccity.studio</a><p class="font-body text-xs text-stone-400 dark:text-stone-500">San Francisco, CA</p><div class="flex items-center gap-5 pt-2"><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">LinkedIn</a><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">Instagram</a><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">Twitter</a></div></div>
      </div>
      <div class="mt-16 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="font-body text-xs text-stone-400 dark:text-stone-500">&copy; 2026 GraphicCity. All rights reserved.</p>
        <div class="flex items-center gap-6"><a href="/privacy" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Privacy</a><a href="/terms" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Terms</a></div>
      </div>
    </div>
  </footer>

  <script src="/public/js/firebase-init.js"></script>
  <script src="/public/js/animations.js"></script>
  <script src="/public/js/main.js"></script>
  <script src="/public/js/work.js"></script>
</body>
</html>`;

  res.send(html);
});

/* ─── Capabilities (Services) ─── */
app.get('/capabilities', (req, res) => {
  const nav = renderNav('capabilities');

  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Capabilities — GraphicCity</title>
  <meta name="description" content="We partner with organizations at every stage — from founding moments to brand evolutions, from a single identity to a full design system.">
  <meta property="og:title" content="Capabilities — GraphicCity">
  <meta property="og:description" content="Brand strategy, visual identity, digital design, motion, and brand guidance.">
  <meta property="og:type" content="website">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/css/styles.css">
  <script src="https://unpkg.com/htmx.org@1.9.12" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js" defer></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics-compat.js"></script>
  <style>
    .reveal-item { opacity: 0; transform: translateY(24px); transition: opacity 0.6s cubic-bezier(0.25,0.01,0.25,1), transform 0.6s cubic-bezier(0.25,0.01,0.25,1); }
    .reveal-item.revealed { opacity: 1; transform: translateY(0); }
    .reveal-item:nth-child(2) { transition-delay: 0.1s; }
    .reveal-item:nth-child(3) { transition-delay: 0.2s; }
    .reveal-item:nth-child(4) { transition-delay: 0.3s; }
    .reveal-grid > * { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
    .reveal-grid.revealed > * { opacity: 1; transform: translateY(0); }
    .reveal-grid.revealed > *:nth-child(2) { transition-delay: 0.1s; }
    .reveal-grid.revealed > *:nth-child(3) { transition-delay: 0.2s; }
    .parallax-hero { transform: translateY(0); will-change: transform; }
  </style>
</head>
<body class="bg-core-white dark:bg-core-black text-core-black dark:text-core-white font-body">

  <div id="loading-screen" aria-hidden="true"><div class="loader-mark" aria-label="Loading"><span></span><span></span><span></span><span></span></div></div>
  <div id="page-transition" aria-hidden="true"></div>
  <div id="htmx-topbar" aria-hidden="true"><div class="bar"></div></div>

  <a href="#caps-main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-core-white focus:text-core-black focus:outline-2 focus:outline-signal-blue focus:rounded-md focus:shadow-md">Skip to content</a>
  ${nav}
  <main id="caps-main">

    <!-- ═══ HERO ═══ -->
    <section class="relative min-h-screen flex items-end pb-20 px-6 md:px-12 lg:px-20 overflow-hidden" data-reveal>
      <div class="absolute inset-0 bg-core-black" aria-hidden="true">
        <div class="absolute inset-0 bg-gradient-to-br from-stone-900 via-core-black to-stone-900 parallax-hero"></div>
        <div class="absolute inset-0 opacity-[0.06] mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-core-black/80 via-core-black/20 to-transparent"></div>
      </div>
      <div class="relative z-10 max-w-5xl reveal-item">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-core-white/40 mb-4">Capabilities</p>
        <h1 class="font-display font-light text-h1 md:text-display-sm xl:text-display text-core-white -tracking-tight mb-5">What we do.</h1>
        <p class="font-display text-lg md:text-xl text-core-white/60 max-w-2xl text-balance">We partner with organizations at every stage — from founding moments to brand evolutions, from a single identity to a full design system.</p>
      </div>
      <div class="scroll-affordance" aria-hidden="true"></div>
    </section>

    <!-- ═══ SERVICES GRID ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-core-white dark:bg-core-black scroll-section" data-reveal>
      <div class="max-w-7xl mx-auto w-full">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Our Services</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-16 reveal-item">Everything you need, nothing you don't.</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-grid" data-reveal-grid
             x-data="{ active: null }">
          ${services.map(s => `
            <div class="group rounded-xl border border-stone-200 dark:border-stone-800 bg-core-white dark:bg-stone-900 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col overflow-hidden"
                 :class="{ 'ring-2 ring-core-black dark:ring-core-white shadow-lg -translate-y-0.5': active === '${s.id}', 'col-span-2': active === '${s.id}' }">
              <div class="p-6 md:p-8 flex flex-col flex-1">
                <div class="text-stone-700 dark:text-stone-300 mb-4 transition-colors duration-200
                            ${'group-hover:text-core-black dark:group-hover:text-core-white'}">
                  ${s.icon}
                </div>
                <h3 class="font-display text-xl text-core-black dark:text-core-white mb-2">${s.title}</h3>
                <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-6 text-balance flex-1">${s.tagline}</p>
                <div class="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                  <span class="font-mono text-sm text-stone-400 dark:text-stone-500">From $${s.pricing}</span>
                  <button @click="active = active === '${s.id}' ? null : '${s.id}'"
                          class="font-body text-sm font-medium text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors flex items-center gap-1.5 focus-ring rounded-sm px-2 py-1 -mr-2"
                          :aria-expanded="active === '${s.id}'">
                    <span x-text="active === '${s.id}' ? 'Close' : 'Details'"></span>
                    <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-45': active === '${s.id}' }" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>
                  </button>
                </div>
              </div>
              <!-- Expanded detail panel -->
              <div x-show="active === '${s.id}'" x-cloak
                   x-transition:enter="transition-all duration-400 ease-out"
                   x-transition:enter-start="opacity-0 max-h-0"
                   x-transition:enter-end="opacity-1 max-h-[2000px]"
                   class="border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                <div class="p-6 md:p-8 space-y-8">
                  <!-- Overview -->
                  <div>
                    <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-3">Overview</p>
                    <p class="font-body text-base text-stone-600 dark:text-stone-300 leading-relaxed text-balance">${s.overview}</p>
                  </div>
                  <!-- Process -->
                  <div>
                    <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4">Process</p>
                    <div class="space-y-4">
                      ${s.process.map((p, i) => `
                        <div class="flex gap-4">
                          <span class="font-mono text-xs text-stone-300 dark:text-stone-700 mt-0.5 shrink-0 w-6">${String(i + 1).padStart(2, '0')}</span>
                          <div>
                            <p class="font-body font-medium text-sm text-core-black dark:text-core-white mb-1">${p.phase}</p>
                            <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed">${p.description}</p>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  <!-- Deliverables -->
                  <div>
                    <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4">Deliverables</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      ${s.deliverables.map(d => `
                        <div class="flex items-center gap-2.5 font-body text-sm text-stone-600 dark:text-stone-300">
                          <svg class="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 shrink-0" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>
                          ${d}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  <!-- Timeline -->
                  <div class="flex items-center justify-between p-4 rounded-lg bg-core-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <div>
                      <p class="font-body text-xs text-stone-400 dark:text-stone-500 mb-0.5">Typical timeline</p>
                      <p class="font-display text-lg text-core-black dark:text-core-white">${s.timeline}</p>
                    </div>
                    <a href="/start" class="inline-flex items-center h-9 px-4 bg-core-black dark:bg-core-white text-core-white dark:text-core-black font-body font-medium text-sm rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-all">Inquire</a>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ PROCESS ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-stone-50 dark:bg-stone-950" data-reveal
             hx-get="/partials/services-process" hx-trigger="revealed" hx-target="this" hx-indicator="#process-indicator">
      <div class="max-w-7xl mx-auto w-full text-center">
        <div id="process-indicator" class="flex items-center justify-center py-16">
          <div class="w-6 h-6 border-2 border-stone-300 dark:border-stone-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </section>

    <!-- ═══ PRICING ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-core-white dark:bg-core-black" data-reveal
             hx-get="/partials/services-pricing" hx-trigger="revealed" hx-target="this" hx-indicator="#pricing-indicator">
      <div class="max-w-7xl mx-auto w-full text-center">
        <div id="pricing-indicator" class="flex items-center justify-center py-16">
          <div class="w-6 h-6 border-2 border-stone-300 dark:border-stone-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-stone-50 dark:bg-stone-950" data-reveal
             hx-get="/partials/services-faq" hx-trigger="revealed" hx-target="this" hx-indicator="#faq-indicator">
      <div class="max-w-7xl mx-auto w-full text-center">
        <div id="faq-indicator" class="flex items-center justify-center py-16">
          <div class="w-6 h-6 border-2 border-stone-300 dark:border-stone-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-core-black text-core-white relative overflow-hidden" data-reveal>
      <div class="absolute inset-0 opacity-[0.04] mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      <div class="max-w-3xl mx-auto text-center relative z-10">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 mb-4 reveal-item">Let's work together</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-white -tracking-tight mb-6 reveal-item">Sound like your kind of partner?</h2>
        <p class="font-body text-lg text-stone-400 max-w-xl mx-auto mb-10 text-balance reveal-item">Every project begins with a conversation. Tell us what you're building, and we'll let you know if there's alignment. No pitch. No pressure.</p>
        <div class="reveal-item">
          <a href="/start" class="inline-flex items-center h-12 px-8 bg-core-white text-core-black font-body font-medium text-base rounded-md hover:bg-stone-200 transition-all">Start a Project</a>
        </div>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer id="site-footer" class="bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
    <div class="border-b border-stone-200 dark:border-stone-800">
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12">
        <a href="/start" class="group inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">
          Start a Project
          <span class="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </a>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        <div><a href="/" class="inline-flex items-center gap-2 mb-4" aria-label="GraphicCity home"><svg width="28" height="14" viewBox="0 0 32 16" fill="none" aria-hidden="true" class="text-core-black dark:text-core-white"><rect width="6" height="16" rx="1" fill="currentColor"/><rect x="9" width="6" height="16" rx="1" fill="currentColor"/><rect x="18" width="6" height="16" rx="1" fill="currentColor"/><rect x="27" width="5" height="16" rx="1" fill="currentColor"/></svg></a><p class="font-body text-sm text-stone-500 dark:text-stone-400 max-w-xs text-balance">Design, made permanent.</p></div>
        <nav aria-label="Footer navigation"><div class="grid grid-cols-2 gap-6"><div class="space-y-3"><a href="/work" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Work</a><a href="/capabilities" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Capabilities</a></div><div class="space-y-3"><a href="/about" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">About</a><a href="/journal" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Journal</a></div></div></nav>
        <div class="space-y-4"><a href="mailto:hello@graphiccity.studio" class="block font-body text-sm text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">hello@graphiccity.studio</a><p class="font-body text-xs text-stone-400 dark:text-stone-500">San Francisco, CA</p><div class="flex items-center gap-5 pt-2"><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">LinkedIn</a><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">Instagram</a><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">Twitter</a></div></div>
      </div>
      <div class="mt-16 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="font-body text-xs text-stone-400 dark:text-stone-500">&copy; 2026 GraphicCity. All rights reserved.</p>
        <div class="flex items-center gap-6"><a href="/privacy" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Privacy</a><a href="/terms" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Terms</a></div>
      </div>
    </div>
  </footer>

  <script src="/public/js/firebase-init.js"></script>
  <script src="/public/js/animations.js"></script>
  <script src="/public/js/main.js"></script>
</body>
</html>`;

  res.send(html);
});

/* ─── About ─── */
app.get('/about', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About — GraphicCity</title>
  <meta name="description" content="We are GraphicCity. A creative design studio built on the belief that design is not a service. It is a partnership.">
  <meta property="og:title" content="About — GraphicCity">
  <meta property="og:description" content="A creative design studio built on craft, clarity, and partnership.">
  <meta property="og:type" content="website">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/css/styles.css">
  <script src="https://unpkg.com/htmx.org@1.9.12" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js" defer></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics-compat.js"></script>
  <style>
    .reveal-item { opacity: 0; transform: translateY(24px); transition: opacity 0.6s cubic-bezier(0.25,0.01,0.25,1), transform 0.6s cubic-bezier(0.25,0.01,0.25,1); }
    .reveal-item.revealed { opacity: 1; transform: translateY(0); }
    .reveal-item:nth-child(2) { transition-delay: 0.1s; }
    .reveal-item:nth-child(3) { transition-delay: 0.2s; }
    .reveal-item:nth-child(4) { transition-delay: 0.3s; }
    .reveal-grid > * { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
    .reveal-grid.revealed > * { opacity: 1; transform: translateY(0); }
    .reveal-grid.revealed > *:nth-child(2) { transition-delay: 0.1s; }
    .reveal-grid.revealed > *:nth-child(3) { transition-delay: 0.2s; }
    .reveal-grid.revealed > *:nth-child(4) { transition-delay: 0.3s; }
    .timeline-line { position: absolute; left: 7px; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, #D4D4D4 10%, #D4D4D4 90%, transparent); }
    .dark .timeline-line { background: linear-gradient(to bottom, transparent, #525252 10%, #525252 90%, transparent); }
    .parallax-bg { transform: translateY(0); will-change: transform; }
    .quote-mark { font-family: 'Space Grotesk', sans-serif; font-weight: 300; font-size: clamp(4rem, 12vw, 8rem); line-height: 0.8; }
    .stat-number { font-size: clamp(2.5rem, 6vw, 4rem); }
  </style>
</head>
<body class="bg-core-white dark:bg-core-black text-core-black dark:text-core-white font-body">

  <div id="loading-screen" aria-hidden="true"><div class="loader-mark" aria-label="Loading"><span></span><span></span><span></span><span></span></div></div>
  <div id="page-transition" aria-hidden="true"></div>
  <div id="htmx-topbar" aria-hidden="true"><div class="bar"></div></div>

  <a href="#about-main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-core-white focus:text-core-black focus:outline-2 focus:outline-signal-blue focus:rounded-md focus:shadow-md">Skip to content</a>
  ${renderNav('about')}
  <main id="about-main">

    <!-- ═══ HERO ═══ -->
    <section class="relative min-h-screen flex items-center px-6 md:px-12 lg:px-20 overflow-hidden bg-core-black" data-reveal>
      <div class="absolute inset-0" aria-hidden="true">
        <div class="absolute inset-0 bg-gradient-to-br from-stone-900 via-core-black to-stone-950 parallax-bg"></div>
        <div class="absolute inset-0 opacity-[0.05] mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.06%22%3E%3Cpath d=%22M50 50v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-40V6h-2v4h-4v2h4v4h2v-4h4v-2h-4zM10 50v-4H8v4H4v2h4v4h2v-4h4v-2H10zM10 10V6H8v4H4v2h4v4h2v-4h4v-2H10z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        <div class="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-core-black to-transparent"></div>
      </div>
      <div class="relative z-10 max-w-4xl mx-auto w-full reveal-item">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 mb-6">About</p>
        <h1 class="font-display font-light text-h1 md:text-display-sm xl:text-display text-core-white -tracking-tight mb-8 leading-[0.9]">
          We are<br>
          <span class="italic font-light text-stone-300">GraphicCity.</span>
        </h1>
        <p class="font-display text-lg md:text-xl lg:text-2xl text-core-white/60 max-w-2xl text-balance leading-relaxed">
          A creative design studio built on the belief that design is not a service. It is a partnership.
        </p>
      </div>
      <div class="scroll-affordance" aria-hidden="true"></div>
    </section>

    <!-- ═══ THE STORY ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-28 md:py-36 scroll-section bg-core-white dark:bg-core-black" data-reveal>
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          <div class="lg:col-span-2 reveal-item">
            <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4">Our Story</p>
            <div class="w-8 h-px bg-core-black dark:bg-core-white opacity-20"></div>
          </div>
          <div class="lg:col-span-3 space-y-6 reveal-item">
            <p class="font-display text-xl md:text-2xl text-core-black dark:text-core-white leading-relaxed text-balance">
              We started GraphicCity to restore what the industry had lost: the idea that design is a craft, not a commodity.
            </p>
            <p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 leading-relaxed text-balance">
              Every project we take is a project we believe in. Every detail we ship has been chosen, not defaulted. We do not optimize for speed at the expense of soul. We optimize for what lasts.
            </p>
            <p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 leading-relaxed text-balance">
              This approach is not efficient. It is not scalable. It is not for everyone. But for the people we work with — founders who care about legacy, leaders who see design as a strategic advantage — it is the only approach that makes sense.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ MANIFESTO ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-28 md:py-36 scroll-section bg-stone-50 dark:bg-stone-950 relative overflow-hidden" data-reveal>
      <div class="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-core-black dark:bg-core-white blur-[120px]"></div>
      </div>
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <p class="quote-mark text-stone-200 dark:text-stone-800 select-none">"</p>
        <blockquote class="font-display font-light text-[clamp(1.5rem,4vw,2.5rem)] text-core-black dark:text-core-white leading-[1.2] -tracking-tight text-balance -mt-6 md:-mt-8">
          Design is not a service.<br>
          <span class="text-stone-400 dark:text-stone-500">It is a partnership.</span>
        </blockquote>
        <div class="mt-10 flex items-center justify-center gap-3 reveal-item">
          <div class="w-6 h-px bg-core-black/30 dark:bg-core-white/30"></div>
          <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500">Our Belief</p>
        </div>
      </div>
    </section>

    <!-- ═══ PHILOSOPHY ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-28 md:py-36 scroll-section bg-core-white dark:bg-core-black" data-reveal>
      <div class="max-w-7xl mx-auto">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 text-center reveal-item">Philosophy</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-6 text-center reveal-item">What we believe.</h2>
        <p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-center mb-16 text-balance reveal-item">Every decision we make — from the partners we choose to the pixels we place — is guided by a simple set of convictions.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto reveal-grid" data-reveal-grid>
          ${[
            { title: 'Craft Over Speed', body: 'We will never optimize our way to mediocrity. Every output, no matter how small, is worthy of care.' },
            { title: 'Clarity is Kindness', body: 'Complexity is lazy. Simplicity is hard. We do the hard work so the result feels inevitable.' },
            { title: 'Earn the Detail', body: 'Every border radius, every letter-spacing value, every micro-interaction must justify its existence. If it does not serve, it does not stay.' },
            { title: 'Confidence in Restraint', body: 'The best work often involves removing. What we choose not to do is as important as what we do.' },
            { title: 'Partnership, Not Service', body: 'We do not take orders. We collaborate. We challenge. We push back when it matters.' },
            { title: 'Make It Last', body: 'Trends fade. Great work grows more respected with time. We design for the decade, not the quarter.' }
          ].map(p => `
            <div class="reveal-item p-8 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors duration-300">
              <p class="font-display text-lg font-medium text-core-black dark:text-core-white mb-3">${p.title}</p>
              <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed text-balance">${p.body}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ TIMELINE ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-28 md:py-36 scroll-section bg-stone-50 dark:bg-stone-950" data-reveal>
      <div class="max-w-5xl mx-auto">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Timeline</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-16 reveal-item">The path to here.</h2>
        <div class="relative pl-10 reveal-grid" data-reveal-grid>
          <div class="timeline-line"></div>
          ${[
            { year: '2020', title: 'The Beginning', desc: 'Two founders, a shared desk, and a conviction that design deserved better. GraphicCity is founded with a single client and a radical idea: say no more often than yes.' },
            { year: '2021', title: 'First Milestone', desc: 'The studio grows to five. Our first major brand identity ships — a project that defines our process and our standards. We learn what happens when you care more than the brief requires.' },
            { year: '2022', title: 'Finding Our Voice', desc: 'We turn down more work than we accept for the first time. Our portfolio earns us a reputation for the kind of rigor most agencies avoid. We double down on craft.' },
            { year: '2023', title: 'Depth Over Breadth', desc: 'The team reaches ten. We invest in process, tools, and the systems that let us maintain quality at scale. Every new hire passes the same test: do they care about the details that no one will see?' },
            { year: '2024', title: 'Partnerships That Last', desc: 'Our earliest clients are still our clients. We have never lost a relationship to dissatisfaction. The work speaks for itself — and the results speak louder.' },
            { year: '2025', title: 'The Studio Today', desc: 'A small, intentional team. A waiting list of partners who value what we value. No growth targets. No quarterly revenue goals. Just the work, the craft, and the relationships that make it possible.' }
          ].map((m, i) => `
            <div class="reveal-item relative pb-14 last:pb-0">
              <div class="absolute -left-10 top-1 w-[15px] h-[15px] rounded-full border-2 border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
                <div class="w-[5px] h-[5px] rounded-full bg-core-black dark:bg-core-white"></div>
              </div>
              <div class="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8">
                <p class="font-mono text-sm text-stone-400 dark:text-stone-500 shrink-0 w-14">${m.year}</p>
                <div>
                  <h3 class="font-display text-xl text-core-black dark:text-core-white mb-2">${m.title}</h3>
                  <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed text-balance max-w-xl">${m.desc}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ SKILLS & EXPERIENCE ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-28 md:py-36 scroll-section bg-core-white dark:bg-core-black relative overflow-hidden" data-reveal>
      <div class="absolute inset-0 opacity-[0.02]" aria-hidden="true">
        <div class="absolute top-1/3 right-0 w-[40vw] h-[40vw] rounded-full bg-core-black dark:bg-core-white blur-[100px]"></div>
      </div>
      <div class="max-w-7xl mx-auto relative z-10">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Experience</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-16 reveal-item">What we bring.</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 reveal-grid" data-reveal-grid>
          ${[
            { stat: '6+', label: 'Years in practice', detail: 'Since 2020' },
            { stat: '40+', label: 'Projects delivered', detail: 'Across 5 disciplines' },
            { stat: '20+', label: 'Repeat partners', detail: 'Long-term relationships' },
            { stat: '12', label: 'Studio size', detail: 'Intentional, not scalable' }
          ].map(s => `
            <div class="reveal-item text-center">
              <p class="stat-number font-display font-light text-core-black dark:text-core-white -tracking-tight leading-none mb-2">${s.stat}</p>
              <p class="font-body text-sm font-medium text-core-black dark:text-core-white mb-1">${s.label}</p>
              <p class="font-body text-xs text-stone-400 dark:text-stone-500">${s.detail}</p>
            </div>
          `).join('')}
        </div>
        <div class="mt-20 reveal-grid grid grid-cols-1 md:grid-cols-3 gap-6" data-reveal-grid>
          ${[
            { title: 'Brand Identity', desc: 'Strategy, naming, visual language, guidelines. The foundation.' },
            { title: 'Digital Design', desc: 'Websites, products, interfaces, design systems. The expression.' },
            { title: 'Motion & Direction', desc: 'Film, interaction, environmental. The dimension.' }
          ].map(s => `
            <div class="reveal-item p-6 rounded-lg border border-stone-100 dark:border-stone-800">
              <p class="font-display text-lg font-medium text-core-black dark:text-core-white mb-2">${s.title}</p>
              <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed text-balance">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ CREATIVE PROCESS ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-28 md:py-36 scroll-section bg-stone-50 dark:bg-stone-950" data-reveal>
      <div class="max-w-7xl mx-auto">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 text-center reveal-item">Process</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-6 text-center reveal-item">How we create.</h2>
        <p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-center mb-16 text-balance reveal-item">A repeatable framework that ensures consistency without sacrificing the unexpected.</p>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 reveal-grid" data-reveal-grid>
          ${[
            { phase: 'Discover', num: '01', desc: 'We listen first. Stakeholder interviews, market research, competitive audit. Before we make anything, we understand everything.', accent: 'from-stone-900 to-stone-700' },
            { phase: 'Define', num: '02', desc: 'We find the signal. Strategy, positioning, creative direction. A clear north star before a single pixel is touched.', accent: 'from-stone-800 to-stone-600' },
            { phase: 'Design', num: '03', desc: 'We explore, refine, and commit. Multiple directions, rigorous critique, relentless reduction. We arrive at the solution that feels inevitable.', accent: 'from-stone-700 to-stone-500' },
            { phase: 'Deploy', num: '04', desc: 'We deliver, document, and support. Final assets, brand guidelines, launch collateral. You leave with a system, not a folder.', accent: 'from-stone-600 to-stone-400' }
          ].map(p => `
            <div class="reveal-item text-center">
              <div class="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center">
                <span class="font-mono text-sm font-medium text-core-white">${p.num}</span>
              </div>
              <h3 class="font-display text-xl text-core-black dark:text-core-white mb-3">${p.phase}</h3>
              <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed text-balance max-w-xs mx-auto">${p.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ COLLABORATION MODEL ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-28 md:py-36 scroll-section bg-core-black text-core-white relative overflow-hidden" data-reveal>
      <div class="absolute inset-0 opacity-[0.04] mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 mb-4 reveal-item">How We Work</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-white -tracking-tight mb-8 reveal-item">Direct. Honest. Without layers.</h2>
        <p class="font-body text-base md:text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed text-balance reveal-item">
          When you work with GraphicCity, there are no account managers, no intermediaries, no game of telephone. You work with the people making the work. Every conversation, every decision, every detail.
        </p>
        <p class="font-body text-base text-stone-500 max-w-xl mx-auto mt-6 leading-relaxed text-balance reveal-item">
          We operate on fixed-scope phases with flexible output. We do not bill by the hour. We bill by the outcome.
        </p>
      </div>
    </section>

    <!-- ═══ TESTIMONIALS ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-28 md:py-36 scroll-section bg-core-white dark:bg-core-black" data-reveal>
      <div class="max-w-5xl mx-auto">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 text-center reveal-item">What They Say</p>
        <div class="space-y-20 md:space-y-24 mt-12 reveal-grid" data-reveal-grid>
          ${[
            { quote: 'Most agencies sell you what they want to make. GraphicCity took the time to understand what we needed — and then made something we did not know was possible.', attr: 'Founder, venture-backed SaaS company' },
            { quote: 'They have an obsession with detail that I have only ever seen in the best product teams. Every pixel has a reason. Every interaction feels considered.', attr: 'Creative Director, consumer brand' },
            { quote: 'We came to GraphicCity for a refresh. We left with a foundation. They did not just redesign our brand — they redefined how we think about ourselves.', attr: 'CEO, fintech company' }
          ].map(t => `
            <div class="reveal-item text-center max-w-3xl mx-auto">
              <p class="quote-mark text-[clamp(3rem,8vw,5rem)] text-stone-100 dark:text-stone-900 leading-none -mb-6 select-none">&ldquo;</p>
              <p class="font-display text-xl md:text-2xl lg:text-3xl text-core-black dark:text-core-white leading-relaxed -tracking-tight text-balance font-light italic">${t.quote}</p>
              <div class="mt-8 flex items-center justify-center gap-3">
                <div class="w-6 h-px bg-stone-300 dark:bg-stone-700"></div>
                <p class="font-body text-sm text-stone-400 dark:text-stone-500">&mdash; ${t.attr}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-28 md:py-36 scroll-section bg-core-black text-core-white relative overflow-hidden" data-reveal>
      <div class="absolute inset-0 opacity-[0.04] mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      <div class="max-w-3xl mx-auto text-center relative z-10">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 mb-4 reveal-item">Let's Talk</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-white -tracking-tight mb-6 reveal-item">Ready to start a conversation?</h2>
        <p class="font-body text-base md:text-lg text-stone-400 max-w-xl mx-auto mb-10 text-balance reveal-item">Every project begins with a conversation. No pitch. No pressure. Just two questions: what are you building, and why does it matter?</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 reveal-item">
          <a href="/start" class="inline-flex items-center h-12 px-8 bg-core-white text-core-black font-body font-medium text-base rounded-md hover:bg-stone-200 transition-all">Start a Project</a>
          <a href="/work" class="inline-flex items-center h-12 px-8 border border-stone-700 text-core-white font-body font-medium text-base rounded-md hover:bg-stone-900 transition-all">See the Work</a>
        </div>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer id="site-footer" class="bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
    <div class="border-b border-stone-200 dark:border-stone-800">
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12">
        <a href="/start" class="group inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">
          Start a Project
          <span class="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </a>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        <div><a href="/" class="inline-flex items-center gap-2 mb-4" aria-label="GraphicCity home"><svg width="28" height="14" viewBox="0 0 32 16" fill="none" aria-hidden="true" class="text-core-black dark:text-core-white"><rect width="6" height="16" rx="1" fill="currentColor"/><rect x="9" width="6" height="16" rx="1" fill="currentColor"/><rect x="18" width="6" height="16" rx="1" fill="currentColor"/><rect x="27" width="5" height="16" rx="1" fill="currentColor"/></svg></a><p class="font-body text-sm text-stone-500 dark:text-stone-400 max-w-xs text-balance">Design, made permanent.</p></div>
        <nav aria-label="Footer navigation"><div class="grid grid-cols-2 gap-6"><div class="space-y-3"><a href="/work" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Work</a><a href="/capabilities" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Capabilities</a></div><div class="space-y-3"><a href="/about" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">About</a><a href="/journal" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Journal</a></div></div></nav>
        <div class="space-y-4"><a href="mailto:hello@graphiccity.studio" class="block font-body text-sm text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">hello@graphiccity.studio</a><p class="font-body text-xs text-stone-400 dark:text-stone-500">San Francisco, CA</p><div class="flex items-center gap-5 pt-2"><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">LinkedIn</a><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">Instagram</a><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">Twitter</a></div></div>
      </div>
      <div class="mt-16 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="font-body text-xs text-stone-400 dark:text-stone-500">&copy; 2026 GraphicCity. All rights reserved.</p>
        <div class="flex items-center gap-6"><a href="/privacy" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Privacy</a><a href="/terms" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Terms</a></div>
      </div>
    </div>
  </footer>

  <script src="/public/js/firebase-init.js"></script>
  <script src="/public/js/animations.js"></script>
  <script src="/public/js/main.js"></script>
</body>
</html>`;
  res.send(html);
});

/* ─── Start a Project ─── */
app.get('/start', (req, res) => {
  const options = {
    projectTypes: ['A new brand identity', 'A brand refresh or evolution', 'A website or digital product', 'A design system or guidelines', 'Motion or video', 'Creative direction or consulting', 'Something else'],
    budgets: ['Under $25,000', '$25,000 – $75,000', '$75,000 – $150,000', '$150,000+', 'Prefer not to say'],
    timelines: ['Less than 4 weeks', '4 – 8 weeks', '8 – 12 weeks', '12+ weeks', 'Flexible / Not sure'],
    services: ['Brand Strategy', 'Visual Identity', 'Digital Design', 'Motion & Interaction', 'Brand Guidance']
  };

  const select = (id, label, items) => `
    <label for="${id}" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">${label}</label>
    <div class="relative">
      <select id="${id}" name="${id}" required
              class="w-full h-11 pl-4 pr-10 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg font-body text-sm text-core-black dark:text-core-white appearance-none cursor-pointer focus:border-core-black dark:focus:border-core-white focus-ring transition-colors"
              hx-post="/validate/${id}" hx-trigger="blur" hx-target="#${id}-error" hx-swap="innerHTML">
        <option value="" disabled selected>Select an option</option>
        ${items.map(i => `<option value="${i}">${i}</option>`).join('')}
      </select>
      <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 6l4 4 4-4"/></svg>
    </div>
    <p id="${id}-error" class="font-body text-xs text-signal-red mt-1 min-h-[1em]"></p>`;

  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Start a Project — GraphicCity</title>
  <meta name="description" content="Tell us what you're building. We'll listen, ask questions, and let you know if there's alignment. No pitch. No pressure.">
  <meta property="og:title" content="Start a Project — GraphicCity">
  <meta property="og:description" content="Begin a conversation with GraphicCity. Tell us what you're building.">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/css/styles.css">
  <script src="https://unpkg.com/htmx.org@1.9.12" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js" defer></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics-compat.js"></script>
  <style>
    .reveal-item { opacity: 0; transform: translateY(20px); transition: opacity 0.6s cubic-bezier(0.25,0.01,0.25,1), transform 0.6s cubic-bezier(0.25,0.01,0.25,1); }
    .reveal-item.revealed { opacity: 1; transform: translateY(0); }
    .reveal-item:nth-child(2) { transition-delay: 0.1s; }
    .reveal-item:nth-child(3) { transition-delay: 0.2s; }
    .reveal-grid > * { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
    .reveal-grid.revealed > * { opacity: 1; transform: translateY(0); }
    @keyframes draw-check { to { stroke-dashoffset: 0; } }
    @keyframes scale-in { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes fade-up { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes float-particle { 0% { transform: translateY(0) scale(0); opacity: 0; } 20% { opacity: 0.6; } 100% { transform: translateY(-120px) scale(1); opacity: 0; } }
    .check-circle { animation: scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .check-path { stroke-dasharray: 48; stroke-dashoffset: 48; animation: draw-check 0.5s ease-out 0.3s forwards; }
    .confirm-text { opacity: 0; animation: fade-up 0.6s ease-out 0.6s forwards; }
    .confirm-text:nth-child(2) { animation-delay: 0.8s; }
    .confirm-text:nth-child(3) { animation-delay: 1.0s; }
    .file-drop.drag-over { border-color: #0A0A0A; background: #F5F5F5; }
    .dark .file-drop.drag-over { border-color: #FFFFFF; background: #262626; }
    .contact-link { transition: all 0.2s ease-out; }
    .contact-link:hover { transform: translateX(4px); }
  </style>
</head>
<body class="bg-core-white dark:bg-core-black text-core-black dark:text-core-white font-body">

  <div id="loading-screen" aria-hidden="true"><div class="loader-mark" aria-label="Loading"><span></span><span></span><span></span><span></span></div></div>
  <div id="page-transition" aria-hidden="true"></div>
  <div id="htmx-topbar" aria-hidden="true"><div class="bar"></div></div>

  <a href="#start-main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-core-white focus:text-core-black focus:outline-2 focus:outline-signal-blue focus:rounded-md focus:shadow-md">Skip to content</a>
  ${renderNav('start')}
  <main id="start-main">

    <!-- ═══ HERO ═══ -->
    <section class="pt-36 pb-16 md:pt-40 md:pb-20 px-6 md:px-12 lg:px-20 bg-core-white dark:bg-core-black scroll-section" data-reveal>
      <div class="max-w-7xl mx-auto">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Contact</p>
        <h1 class="font-display font-light text-h1 md:text-display-sm xl:text-display text-core-black dark:text-core-white -tracking-tight mb-5 reveal-item">Start a Project.</h1>
        <p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-xl text-balance reveal-item">Tell us what you're building. We'll listen, ask questions, and let you know if there's alignment. No pitch. No pressure.</p>
      </div>
    </section>

    <!-- ═══ FORM + CONTACT ═══ -->
    <section class="px-6 md:px-12 lg:px-20 pb-28 md:pb-36 scroll-section" data-reveal>
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          <!-- Left: Form -->
          <div class="lg:col-span-3 reveal-item">
            <div id="form-container">
              <form id="inquiry-form"
                    hx-post="/inquiry"
                    hx-target="#form-container"
                    hx-swap="innerHTML"
                    hx-encoding="multipart/form-data"
                    class="space-y-6"
                    x-data="{ files: [] }">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label for="name" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Your name</label>
                    <input type="text" id="name" name="name" required autocomplete="name"
                           class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-core-black dark:focus:border-core-white focus-ring transition-colors"
                           hx-post="/validate/name" hx-trigger="blur" hx-target="#name-error" hx-swap="innerHTML">
                    <p id="name-error" class="font-body text-xs text-signal-red mt-1 min-h-[1em]"></p>
                  </div>
                  <div>
                    <label for="company" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Company</label>
                    <input type="text" id="company" name="company" autocomplete="organization"
                           class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-core-black dark:focus:border-core-white focus-ring transition-colors">
                    <p class="font-body text-xs text-stone-400 mt-1 min-h-[1em]">Optional</p>
                  </div>
                </div>

                <div>
                  <label for="email" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Email address</label>
                  <input type="email" id="email" name="email" required autocomplete="email"
                         class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-core-black dark:focus:border-core-white focus-ring transition-colors"
                         hx-post="/validate/email" hx-trigger="blur" hx-target="#email-error" hx-swap="innerHTML">
                  <p id="email-error" class="font-body text-xs text-signal-red mt-1 min-h-[1em]"></p>
                </div>

                <div>
                  ${select('service', 'What do you need?', options.services)}
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>${select('budget', 'Investment range', options.budgets)}</div>
                  <div>${select('timeline', 'Timeline', options.timelines)}</div>
                </div>

                <!-- File Upload -->
                <div>
                  <label class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Attachments</label>
                  <div class="file-drop relative border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer"
                       @dragover.prevent="$el.classList.add('drag-over')"
                       @dragleave.prevent="$el.classList.remove('drag-over')"
                       @drop.prevent="
                         $el.classList.remove('drag-over');
                         files = [...$el.querySelector('input[type=file]').files, ...$dataTransfer.files].slice(0, 5);
                         $el.querySelector('input[type=file]').files = $dataTransfer.files;
                       ">
                    <input type="file" id="files" name="files" multiple accept=".pdf,.jpg,.png,.ai,.psd,.sketch,.fig"
                           class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                           @change="files = [...$event.target.files]">
                    <template x-if="files.length === 0">
                      <div>
                        <svg class="w-8 h-8 mx-auto mb-3 text-stone-300 dark:text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 4v12m0 0l-4-4m4 4l4-4"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>
                        <p class="font-body text-sm text-stone-400 dark:text-stone-500">Drag files here or <span class="text-core-black dark:text-core-white underline underline-offset-2 decoration-stone-300 dark:decoration-stone-700">browse</span></p>
                        <p class="font-body text-xs text-stone-300 dark:text-stone-600 mt-1">PDF, JPG, PNG, AI, PSD, SKETCH, FIG (max 10MB each)</p>
                      </div>
                    </template>
                    <template x-if="files.length > 0">
                      <div class="text-left">
                        <p class="font-body text-sm font-medium text-core-black dark:text-core-white mb-2">
                          <span x-text="files.length"></span> file<span x-text="files.length !== 1 ? 's' : ''"></span> selected
                        </p>
                        <template x-for="(f, i) in files" :key="i">
                          <p class="font-body text-xs text-stone-500 dark:text-stone-400 truncate"><span x-text="f.name"></span> <span class="text-stone-300 dark:text-stone-600" x-text="'(' + (f.size / 1024).toFixed(0) + ' KB)'"></span></p>
                        </template>
                        <button type="button" @click="files = []; $el.querySelector('input[type=file]').value = ''" class="mt-2 font-body text-xs text-stone-400 hover:text-signal-red transition-colors">Remove all</button>
                      </div>
                    </template>
                  </div>
                </div>

                <div>
                  <label for="description" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Tell us about your project</label>
                  <textarea id="description" name="description" rows="5" required
                            class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-core-black dark:focus:border-core-white focus-ring transition-colors resize-y min-h-[120px]"
                            placeholder="Briefly describe your project, your goals, and what success looks like to you."
                            hx-post="/validate/description" hx-trigger="blur" hx-target="#desc-error" hx-swap="innerHTML"></textarea>
                  <p id="desc-error" class="font-body text-xs text-signal-red mt-1 min-h-[1em]"></p>
                </div>

                <div>
                  <label for="referral" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">How did you hear about us?</label>
                  <input type="text" id="referral" name="referral"
                         class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-core-black dark:focus:border-core-white focus-ring transition-colors">
                  <p class="font-body text-xs text-stone-400 mt-1 min-h-[1em]">Optional</p>
                </div>

                <button type="submit"
                        class="w-full h-12 bg-core-black dark:bg-core-white text-core-white dark:text-core-black font-body font-medium text-base rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
                        hx-indicator="#submit-spinner">
                  <span>Send Inquiry</span>
                  <svg id="submit-spinner" class="htmx-indicator w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32" stroke-linecap="round"/></svg>
                </button>

                <p class="font-body text-xs text-stone-400 dark:text-stone-500 text-center">We review every inquiry personally. You will hear from us within 48 hours.</p>
              </form>
            </div>
          </div>

          <!-- Right: Contact Info -->
          <div class="lg:col-span-2 reveal-item">
            <div class="space-y-10 lg:sticky lg:top-36">
              <div>
                <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-5">Get in touch</p>
                <div class="space-y-4">
                  <a href="mailto:hello@graphiccity.studio" class="contact-link flex items-center gap-3 group">
                    <svg class="w-5 h-5 text-stone-300 dark:text-stone-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 6l8 5.5L20 6"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                    <span class="font-body text-sm text-core-black dark:text-core-white group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors">hello@graphiccity.studio</span>
                  </a>
                  <a href="https://wa.me/15551234567" target="_blank" rel="noopener" class="contact-link flex items-center gap-3 group">
                    <svg class="w-5 h-5 text-stone-300 dark:text-stone-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                    <span class="font-body text-sm text-core-black dark:text-core-white group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors">WhatsApp</span>
                  </a>
                </div>
              </div>

              <div>
                <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-5">Location</p>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-stone-300 dark:text-stone-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div>
                    <p class="font-body text-sm text-core-black dark:text-core-white">San Francisco, CA</p>
                    <p class="font-body text-xs text-stone-400 dark:text-stone-500 mt-0.5">Available worldwide for remote engagements</p>
                  </div>
                </div>
              </div>

              <div>
                <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-5">Social</p>
                <div class="flex items-center gap-5">
                  <a href="#" class="font-body text-sm text-stone-500 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">LinkedIn</a>
                  <a href="#" class="font-body text-sm text-stone-500 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Instagram</a>
                  <a href="#" class="font-body text-sm text-stone-500 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Twitter</a>
                </div>
              </div>

              <div class="pt-6 border-t border-stone-100 dark:border-stone-800">
                <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-3">What happens next</p>
                <div class="space-y-4">
                  <div class="flex gap-3">
                    <span class="font-mono text-xs text-stone-300 dark:text-stone-700 shrink-0 mt-0.5 w-5">01</span>
                    <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed">We review your brief within 48 hours.</p>
                  </div>
                  <div class="flex gap-3">
                    <span class="font-mono text-xs text-stone-300 dark:text-stone-700 shrink-0 mt-0.5 w-5">02</span>
                    <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed">If there is alignment, we invite you to a conversation. No pitch. Just questions.</p>
                  </div>
                  <div class="flex gap-3">
                    <span class="font-mono text-xs text-stone-300 dark:text-stone-700 shrink-0 mt-0.5 w-5">03</span>
                    <p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed">We prepare a tailored scope, timeline, and investment. No pressure. No follow-up sequences.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ WHAT HAPPENS NEXT (full width) ═══ -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-32 scroll-section bg-stone-50 dark:bg-stone-950" data-reveal>
      <div class="max-w-4xl mx-auto text-center">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Our Promise</p>
        <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-8 reveal-item">Every inquiry, treated with care.</h2>
        <p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed text-balance reveal-item">We do not use chatbots, auto-responders, or sales sequences. Every inquiry is read by a human who cares about the work. If there is alignment, we will invite you to a conversation. If not, we will tell you honestly.</p>
        <div class="mt-12 reveal-item">
          <a href="/work" class="inline-flex items-center gap-2 font-body text-sm text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">
            Browse our work
            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 12l4-4-4-4"/></svg>
          </a>
        </div>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer id="site-footer" class="bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
    <div class="border-b border-stone-200 dark:border-stone-800">
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12">
        <a href="/start" class="group inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">
          Start a Project
          <span class="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </a>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        <div><a href="/" class="inline-flex items-center gap-2 mb-4" aria-label="GraphicCity home"><svg width="28" height="14" viewBox="0 0 32 16" fill="none" aria-hidden="true" class="text-core-black dark:text-core-white"><rect width="6" height="16" rx="1" fill="currentColor"/><rect x="9" width="6" height="16" rx="1" fill="currentColor"/><rect x="18" width="6" height="16" rx="1" fill="currentColor"/><rect x="27" width="5" height="16" rx="1" fill="currentColor"/></svg></a><p class="font-body text-sm text-stone-500 dark:text-stone-400 max-w-xs text-balance">Design, made permanent.</p></div>
        <nav aria-label="Footer navigation"><div class="grid grid-cols-2 gap-6"><div class="space-y-3"><a href="/work" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Work</a><a href="/capabilities" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Capabilities</a></div><div class="space-y-3"><a href="/about" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">About</a><a href="/journal" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Journal</a></div></div></nav>
        <div class="space-y-4"><a href="mailto:hello@graphiccity.studio" class="block font-body text-sm text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">hello@graphiccity.studio</a><p class="font-body text-xs text-stone-400 dark:text-stone-500">San Francisco, CA</p><div class="flex items-center gap-5 pt-2"><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">LinkedIn</a><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">Instagram</a><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors">Twitter</a></div></div>
      </div>
      <div class="mt-16 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="font-body text-xs text-stone-400 dark:text-stone-500">&copy; 2026 GraphicCity. All rights reserved.</p>
        <div class="flex items-center gap-6"><a href="/privacy" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Privacy</a><a href="/terms" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Terms</a></div>
      </div>
    </div>
  </footer>

  <script src="/public/js/firebase-init.js"></script>
  <script src="/public/js/animations.js"></script>
  <script src="/public/js/main.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      document.body.addEventListener('htmx:afterRequest', function(evt) {
        if (evt.detail.target && evt.detail.target.id === 'form-container' && evt.detail.successful) {
          document.querySelector('#form-container .check-circle') && document.getElementById('start-main').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  </script>
</body>
</html>`;
  res.send(html);
});

/* ─── Validation Endpoints ─── */
app.post('/validate/name', (req, res) => {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    const val = new URLSearchParams(body).get('name') || '';
    res.send(!val.trim() ? 'Please fill this in.' : '');
  });
});

app.post('/validate/email', (req, res) => {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    const val = new URLSearchParams(body).get('email') || '';
    if (!val.trim()) return res.send('Please fill this in.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return res.send('Please enter a valid email address.');
    res.send('');
  });
});

app.post('/validate/service', (req, res) => {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    const val = new URLSearchParams(body).get('service') || '';
    res.send(!val ? 'Please select a service.' : '');
  });
});

app.post('/validate/budget', (req, res) => {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    const val = new URLSearchParams(body).get('budget') || '';
    res.send(!val ? 'Please select a budget range.' : '');
  });
});

app.post('/validate/timeline', (req, res) => {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    const val = new URLSearchParams(body).get('timeline') || '';
    res.send(!val ? 'Please select a timeline.' : '');
  });
});

app.post('/validate/description', (req, res) => {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    const val = new URLSearchParams(body).get('description') || '';
    if (!val.trim()) return res.send('Please tell us about your project.');
    if (val.trim().length < 20) return res.send('Please provide a bit more detail.');
    res.send('');
  });
});

/* ─── Inquiry Submission ─── */
app.post('/inquiry', (req, res) => {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    const confirm = `
    <div class="text-center py-12 md:py-16 px-4">
      <div class="check-circle w-16 h-16 mx-auto mb-6 rounded-full bg-core-black dark:bg-core-white flex items-center justify-center">
        <svg class="w-8 h-8 text-core-white dark:text-core-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path class="check-path" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h2 class="confirm-text font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-4">Thank you.</h2>
      <p class="confirm-text font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-lg mx-auto text-balance leading-relaxed">We review every inquiry personally. You will hear from us within 48 hours. If there is alignment, we will invite you to a conversation. No pitches. Just questions.</p>
      <div class="confirm-text mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="/work" class="inline-flex items-center h-11 px-6 bg-core-black dark:bg-core-white text-core-white dark:text-core-black font-body font-medium text-sm rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-all">Browse our work</a>
        <a href="/" class="inline-flex items-center h-11 px-6 border border-stone-200 dark:border-stone-700 text-core-black dark:text-core-white font-body font-medium text-sm rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900 transition-all">Back to home</a>
      </div>
    </div>`;
    res.send(confirm);
  });
});

/* ─── Journal ─── */
app.get('/journal', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Journal — GraphicCity</title>
  <meta name="description" content="Thoughts on craft, design, and building enduring brands.">
  <meta property="og:title" content="Journal — GraphicCity">
  <meta property="og:description" content="Thoughts on craft, design, and building enduring brands.">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/css/styles.css">
  <script src="https://unpkg.com/htmx.org@1.9.12" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js" defer></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics-compat.js"></script>
</head>
<body class="bg-core-white dark:bg-core-black text-core-black dark:text-core-white font-body">
  <div id="loading-screen" aria-hidden="true"><div class="loader-mark" aria-label="Loading"><span></span><span></span><span></span><span></span></div></div>
  <div id="page-transition" aria-hidden="true"></div>
  <div id="htmx-topbar" aria-hidden="true"><div class="bar"></div></div>
  <a href="#journal-main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-core-white focus:text-core-black focus:outline-2 focus:outline-signal-blue focus:rounded-md focus:shadow-md">Skip to content</a>
  ${renderNav('journal')}
  <main id="journal-main">
    <section class="pt-36 pb-20 px-6 md:px-12 lg:px-20 scroll-section" data-reveal>
      <div class="max-w-4xl mx-auto reveal-item">
        <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4">Journal</p>
        <h1 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-5">Coming soon.</h1>
        <p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-xl text-balance">We are putting the finishing touches on our first entries. Check back for thoughts on craft, process, and the stories behind the work.</p>
      </div>
    </section>
  </main>
  <script src="/public/js/firebase-init.js"></script>
  <script src="/public/js/animations.js"></script>
  <script src="/public/js/main.js"></script>
</body>
</html>`;
  res.send(html);
});

/* ─── Homepage ─── */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/* ─── 404 ─── */
app.use((req, res) => {
  res.status(404).send(`<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>404 — GraphicCity</title><link rel="stylesheet" href="/public/css/styles.css"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"></head>
<body class="bg-core-white dark:bg-core-black text-core-black dark:text-core-white font-body flex items-center justify-center min-h-screen px-6">
  <div class="text-center max-w-lg">
    <p class="font-mono text-sm text-stone-300 dark:text-stone-700 mb-4">404</p>
    <h1 class="font-display font-light text-h1 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-4">Page not found.</h1>
    <p class="font-body text-base text-stone-500 dark:text-stone-400 mb-10 text-balance">The page you are looking for does not exist or has been moved.</p>
    <a href="/" class="inline-flex items-center h-11 px-6 bg-core-black dark:bg-core-white text-core-white dark:text-core-black font-body font-medium text-sm rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-all">Back to home</a>
  </div>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`GraphicCity running at http://localhost:${PORT}`);
});
