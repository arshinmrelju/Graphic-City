const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { projects, categories, filterProjects, getSizeAspect, getProject, getAdjacentProjects, getRelatedProjects } = require('../data/projects');
const { services } = require('../data/services');
const { docHead, bodyOpen, skipLink, renderNav, renderFooter, pageScripts, esc } = require('../helpers/layout');
const { PER_PAGE } = require('../config/constants');
const { contactLimiter } = require('../middleware/security');

/* ─── Helpers ─── */
function sendPage(res, title, description, bodyHtml, opts = {}) {
  const html = `${docHead(title, description, opts)}${bodyOpen()}
${skipLink(opts.skipTo || '#main-content')}
${renderNav(opts.navActive || '')}
<main id="main-content">${bodyHtml}</main>
${renderFooter()}
${pageScripts(opts.extraScript || '')}`;
  res.send(html);
}

/* ─── Homepage ─── */
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

/* ─── Work Page ─── */
router.get('/work', (req, res) => {
  try {
    const category = req.query.category || 'all';
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const result = filterProjects(category, search, page, PER_PAGE);
    const gridHtml = renderGrid(result.items);
    const filtersHtml = renderFilters(category, search);
    const paginationHtml = renderPagination(result, category, search);

    sendPage(res, 'Selected Work — GraphicCity', 'A curated selection of brand identity, digital product, art direction, and motion projects.',
      `<section class="pt-36 pb-12 md:pt-40 md:pb-16 px-6 md:px-12 lg:px-20">
        <div class="max-w-7xl mx-auto">
          <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4">Portfolio</p>
          <h1 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-4">Selected Work</h1>
          <p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-xl text-balance">Each project is a partnership. These are some of the stories we&rsquo;re proudest of.</p>
        </div>
      </section>
      <section id="work-filters" class="px-6 md:px-12 lg:px-20 mb-8 md:mb-12"><div class="max-w-7xl mx-auto">${filtersHtml}</div></section>
      <section id="work-grid" class="px-6 md:px-12 lg:px-20 pb-12"><div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8"><p class="font-body text-sm text-stone-400 dark:text-stone-500"><span class="font-medium text-core-black dark:text-core-white">${result.total}</span> project${result.total !== 1 ? 's' : ''}</p></div>
        ${gridHtml}
      </div></section>
      <section id="work-pagination" class="px-6 md:px-12 lg:px-20 pb-28"><div class="max-w-7xl mx-auto">${paginationHtml}</div></section>`,
      { navActive: 'work', skipTo: '#work-main' }
    );
  } catch (err) {
    console.error('Work page error:', err);
    res.status(500).send('An error occurred');
  }
});

/* ─── Case Study Page ─── */
router.get('/work/:id', (req, res) => {
  try {
    const project = getProject(req.params.id);
    if (!project) return res.status(404).send('Project not found');
    const cs = project.cs;
    const adjacent = getAdjacentProjects(project.id);
    const related = getRelatedProjects(project.id, project.category, 3);
    const heroSeed = project.seeds.thumb + 200;

    const sections = [
      { label: 'The Challenge', title: 'What needed to change.', content: `<p class="font-body text-lg md:text-xl leading-relaxed text-stone-600 dark:text-stone-300 text-balance">${esc(cs.challenge)}</p>` },
      { label: 'Research', title: 'Understanding the landscape.', content: `<p class="font-body text-base md:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mb-12 text-balance">${esc(cs.research)}</p>` },
    ];

    sendPage(res, `${project.title} — ${project.client} — GraphicCity`, project.description,
      `<section class="relative min-h-screen flex items-end pb-20 px-6 md:px-12 lg:px-20 overflow-hidden bg-core-black"><div class="absolute inset-0"><img src="https://picsum.photos/seed/${heroSeed}/1600/900" alt="" class="w-full h-full object-cover opacity-60 parallax-hero"><div class="absolute inset-0 bg-gradient-to-t from-core-black/80 via-core-black/30 to-transparent"></div></div>
      <div class="relative z-10 max-w-5xl">
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <span class="font-body text-xs font-medium tracking-wider uppercase text-core-white/60">${categories.find(c => c.id === project.category)?.label || project.category}</span>
          <span class="text-core-white/30" aria-hidden="true">·</span>
          <span class="font-body text-xs text-core-white/60">${project.year}</span>
        </div>
        <h1 class="font-display font-light text-h1 md:text-display-sm xl:text-display text-core-white -tracking-tight mb-3 break-words">${esc(project.title)}</h1>
        <p class="font-display text-xl md:text-2xl text-core-white/70">${esc(project.client)}</p>
      </div>
      <div class="scroll-affordance" aria-hidden="true"></div>
      </section>
      <section class="min-h-screen flex flex-col lg:flex-row items-center px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32 bg-core-white dark:bg-core-black" data-reveal>
        <div class="w-full lg:w-1/2 lg:pr-16 xl:pr-24 mb-12 lg:mb-0">
          <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">The Challenge</p>
          <h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-6 reveal-item">What needed to change.</h2>
          <p class="font-body text-lg md:text-xl leading-relaxed text-stone-600 dark:text-stone-300 text-balance reveal-item">${esc(cs.challenge)}</p>
        </div>
        <div class="w-full lg:w-1/2 reveal-item"><div class="aspect-[4/3] rounded-md overflow-hidden bg-stone-100 dark:bg-stone-900"><img src="https://picsum.photos/seed/${project.seeds.thumb + 210}/800/600" alt="Research process for ${esc(project.title)}" class="w-full h-full object-cover" loading="lazy"></div></div>
      </section>`,
      { navActive: 'work', skipTo: '#cs-main', ogType: 'article' }
    );
  } catch (err) {
    console.error('Case study error:', err);
    res.status(500).send('An error occurred');
  }
});

/* ─── Capabilities ─── */
router.get('/capabilities', (req, res) => {
  try {
    sendPage(res, 'Capabilities — GraphicCity', 'We partner with organizations at every stage — from founding moments to brand evolutions.',
      `<section class="relative min-h-screen flex items-end pb-20 px-6 md:px-12 lg:px-20 overflow-hidden bg-core-black">
        <div class="absolute inset-0 bg-gradient-to-br from-stone-900 via-core-black to-stone-900"><div class="absolute inset-0 opacity-[0.06] mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div></div>
        <div class="relative z-10 max-w-5xl reveal-item">
          <p class="font-body text-xs font-medium tracking-wider uppercase text-core-white/40 mb-4">Capabilities</p>
          <h1 class="font-display font-light text-h1 md:text-display-sm xl:text-display text-core-white -tracking-tight mb-5">What we do.</h1>
          <p class="font-display text-lg md:text-xl text-core-white/60 max-w-2xl text-balance">We partner with organizations at every stage — from founding moments to brand evolutions, from a single identity to a full design system.</p>
        </div>
        <div class="scroll-affordance" aria-hidden="true"></div>
      </section>
      <section class="px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32 bg-core-white dark:bg-core-black" data-reveal>
        <div class="max-w-7xl mx-auto w-full">
          <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4">Our Services</p>
          <h2 class="font-display font-light text-xl sm:text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-8 md:mb-16">Everything you need, nothing you don't.</h2>
        </div>
      </section>`,
      { navActive: 'capabilities' }
    );
  } catch (err) {
    console.error('Capabilities error:', err);
    res.status(500).send('An error occurred');
  }
});

/* ─── About ─── */
router.get('/about', (req, res) => {
  try {
    sendPage(res, 'About — GraphicCity', 'A creative design studio built on craft, clarity, and partnership.',
      `<section class="relative min-h-screen flex items-center px-6 md:px-12 lg:px-20 overflow-hidden bg-core-black">
        <div class="absolute inset-0 bg-gradient-to-br from-stone-900 via-core-black to-stone-950 parallax-bg"></div>
        <div class="relative z-10 max-w-4xl mx-auto w-full">
          <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 mb-6">About</p>
          <h1 class="font-display font-light text-h1 md:text-display-sm xl:text-display text-core-white -tracking-tight mb-8 leading-[0.9]">We are<br><span class="italic font-light text-stone-300">GraphicCity.</span></h1>
          <p class="font-display text-lg md:text-xl lg:text-2xl text-core-white/60 max-w-2xl text-balance leading-relaxed">A creative design studio built on the belief that design is not a service. It is a partnership.</p>
        </div>
        <div class="scroll-affordance" aria-hidden="true"></div>
      </section>`,
      { navActive: 'about' }
    );
  } catch (err) {
    console.error('About error:', err);
    res.status(500).send('An error occurred');
  }
});

/* ─── Journal ─── */
router.get('/journal', (req, res) => {
  try {
    sendPage(res, 'Journal — GraphicCity', 'Thoughts on craft, design, and building enduring brands.',
      `<section class="pt-36 pb-20 px-6 md:px-12 lg:px-20" data-reveal>
        <div class="max-w-4xl mx-auto">
          <p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4">Journal</p>
          <h1 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-5">Coming soon.</h1>
          <p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-xl text-balance">We are putting the finishing touches on our first entries. Check back for thoughts on craft, process, and the stories behind the work.</p>
        </div>
      </section>`,
      { navActive: 'journal' }
    );
  } catch (err) {
    console.error('Journal error:', err);
    res.status(500).send('An error occurred');
  }
});

/* ─── Sitemap ─── */
router.get('/sitemap.xml', (req, res) => {
  const pages = ['/', '/work', '/about', '/capabilities', '/start', '/journal'];
  const urls = pages.map(p => `  <url><loc>https://graphiccity.in${p}</loc><changefreq>weekly</changefreq><priority>${p === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
});

/* ─── Robots ─── */
router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://graphiccity.in/sitemap.xml');
});

/* ─── Render helpers (kept for partials) ─── */
function renderGrid(items) {
  if (items.length === 0) return '<div class="text-center py-16 md:py-24"><p class="font-display text-2xl text-stone-400 dark:text-stone-500 mb-2">No projects found</p><p class="font-body text-sm text-stone-400 dark:text-stone-500">Try adjusting your filter or search.</p></div>';
  return `<div class="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">${items.map(renderCard).join('')}</div>`;
}

function renderCard(p) {
  const aspect = getSizeAspect(p.size);
  return `<article class="masonry-item break-inside-avoid mb-6 project-card group cursor-pointer relative" data-project-id="${esc(p.id)}" data-category="${esc(p.category)}">
    <div class="relative overflow-hidden rounded-md bg-stone-100 dark:bg-stone-900">
      <div class="${aspect.css}"><img src="https://picsum.photos/seed/${p.seeds.thumb}/${aspect.w}/${aspect.h}" alt="${esc(p.title)} — ${esc(p.client)}" class="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]" loading="lazy"></div>
      <div class="absolute inset-0 bg-core-black/0 group-hover:bg-core-black/20 dark:group-hover:bg-core-black/40 transition-all duration-500 flex items-center justify-center"><span class="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="text-core-white"><path d="M4 16H28M28 16L20 8M28 16L20 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
    </div>
    <div class="mt-4 space-y-1.5">
      <div class="flex items-center gap-2">
        <span class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500">${esc(p.client)}</span>
        <span class="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
        <span class="font-body text-xs text-stone-400 dark:text-stone-500">${p.year}</span>
      </div>
      <h2 class="font-display text-xl text-core-black dark:text-core-white group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors duration-200"><a href="/work/${esc(p.id)}" class="underline underline-offset-2 decoration-stone-300/50 dark:decoration-stone-700/50 hover:decoration-stone-300 dark:hover:decoration-stone-700 transition-colors duration-200 focus-ring rounded-sm">${esc(p.title)}</a></h2>
      <p class="font-body text-sm text-stone-400 dark:text-stone-500 line-clamp-2 text-balance">${esc(p.description)}</p>
      <div class="flex items-center gap-2 pt-1"><span class="inline-block px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded font-body text-xs text-stone-500 dark:text-stone-400">${categories.find(c => c.id === p.category)?.label || esc(p.category)}</span></div>
    </div>
  </article>`;
}

function renderFilters(activeCategory, searchValue) {
  return `<div class="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
  <div class="flex flex-nowrap md:flex-wrap items-center gap-2 md:gap-3 min-w-0" role="tablist" aria-label="Filter by category">
    ${categories.map(cat => `<button role="tab" aria-selected="${cat.id === activeCategory ? 'true' : 'false'}" class="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-2 rounded-md font-body text-sm transition-all duration-200 focus-ring ${cat.id === activeCategory ? 'bg-core-black dark:bg-core-white text-core-white dark:text-core-black' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white hover:bg-stone-200 dark:hover:bg-stone-700'}" hx-get="/partials/work-grid?category=${cat.id}" hx-target="#work-grid" hx-push-url="/work?category=${cat.id}" hx-indicator="#work-indicator">${cat.label}</button>`).join('')}
    <div class="relative ml-auto shrink-0">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
      <input type="search" name="search" value="${esc(searchValue)}" placeholder="Search projects..." class="w-40 md:w-56 h-11 sm:h-9 pl-9 pr-3 bg-stone-100 dark:bg-stone-800 border border-transparent focus:border-stone-300 dark:focus:border-stone-600 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 transition-all duration-200 focus-ring" hx-get="/partials/work-grid" hx-trigger="keyup changed delay:300ms, search" hx-target="#work-grid" hx-push-url="true" hx-include="[name='category']" hx-indicator="#work-indicator">
    </div>
  </div>
  </div>
  <div id="work-indicator" class="h-0.5 bg-stone-200 dark:bg-stone-800 mt-4 rounded-full overflow-hidden"><div class="h-full bg-core-black dark:bg-core-white rounded-full transition-all duration-300 w-0 htmx-request:w-full"></div></div>`;
}

function renderPagination(result, category, search) {
  if (result.totalPages <= 1) return '';
  const pages = [];
  for (let i = 1; i <= result.totalPages; i++) {
    const isActive = i === result.currentPage;
    pages.push(`<button class="w-11 h-11 sm:w-9 sm:h-9 rounded-md font-body text-sm transition-all duration-200 flex items-center justify-center ${isActive ? 'bg-core-black dark:bg-core-white text-core-white dark:text-core-black' : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-core-black dark:hover:text-core-white'}" ${isActive ? 'aria-current="page"' : ''} hx-get="/partials/work-grid?category=${category}&search=${encodeURIComponent(search)}&page=${i}" hx-target="#work-grid" hx-push-url="/work?category=${category}&search=${encodeURIComponent(search)}&page=${i}" hx-indicator="#work-indicator" aria-label="Page ${i}">${i}</button>`);
  }
  return `<nav aria-label="Pagination" class="flex items-center justify-center gap-2">${pages.join('')}</nav>`;
}

/* ─── Start a Project ─── */
router.get('/start', (req, res) => {
  try {
    sendPage(res, 'Start a Project — GraphicCity', 'Tell us about your project. We will review your inquiry and get back to you.',
      `<section class="pt-36 pb-12 md:pt-40 md:pb-16 px-6 md:px-12 lg:px-20" data-reveal><div class="max-w-5xl mx-auto"><p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Start a Project</p><h1 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-6 reveal-item">Let's create something remarkable.</h1><p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-2xl text-balance reveal-item">Tell us about your project. We&rsquo;ll review your inquiry and get back to you within 48 hours.</p></div></section>
      <section class="px-6 md:px-12 lg:px-20 pb-28" data-reveal><div class="max-w-5xl mx-auto"><div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16"><div class="lg:col-span-2">${renderStartForm()}</div><aside class="space-y-8 reveal-item">${renderContactSidebar()}</aside></div></div></section>`,
      { navActive: 'start' }
    );
  } catch (err) {
    console.error('Start page error:', err);
    res.status(500).send('An error occurred');
  }
});

function renderStartForm() {
  return `<form id="inquiry-form" class="space-y-6" hx-post="/inquiry" hx-target="#inquiry-form" hx-swap="outerHTML" hx-indicator="#form-indicator">
    <div class="grid md:grid-cols-2 gap-6">
      <div><label for="name" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Name <span class="text-red-500" aria-hidden="true">*</span></label><input type="text" id="name" name="name" required class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring" placeholder="Your name"></div>
      <div><label for="email" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Email <span class="text-red-500" aria-hidden="true">*</span></label><input type="email" id="email" name="email" required class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring" placeholder="you@example.com"></div>
    </div>
    <div><label for="company" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Company / Organization</label><input type="text" id="company" name="company" class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring" placeholder="Company name"></div>
    <div><label for="project-type" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Project Type <span class="text-red-500" aria-hidden="true">*</span></label>
      <select id="project-type" name="projectType" required class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring appearance-none">${['Brand Identity', 'Digital Product', 'Art Direction', 'Motion', 'Packaging', 'Other'].map(t => `<option value="${t}">${t}</option>`).join('')}</select></div>
    <div><label for="budget" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Budget Range</label>
      <select id="budget" name="budget" class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring appearance-none">${['Under $5K', '$5K\u2013$15K', '$15K\u2013$50K', '$50K\u2013$100K', '$100K+', 'Prefer not to say'].map(b => `<option value="${b}">${b}</option>`).join('')}</select></div>
    <div><label for="description" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Project Description <span class="text-red-500" aria-hidden="true">*</span></label><textarea id="description" name="description" rows="5" required class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring resize-y min-h-[120px]" placeholder="Tell us about your project, goals, timeline, and anything else we should know."></textarea></div>
    <div><label class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Attach Files</label><div class="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-md p-6 text-center cursor-pointer hover:border-stone-400 dark:hover:border-stone-600 transition-colors duration-200" id="drop-zone"><input type="file" name="files" multiple class="hidden" id="file-input" accept=".pdf,.doc,.docx,.jpg,.png,.zip"><svg class="w-8 h-8 text-stone-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg><p class="font-body text-sm text-stone-500 dark:text-stone-400" id="file-label">Drag files here or click to browse</p><p class="font-body text-xs text-stone-400 dark:text-stone-500 mt-1">PDF, DOC, JPG, ZIP (max 10MB each)</p></div><ul id="file-list" class="mt-2 space-y-1"></ul></div>
    <div class="pt-4"><button type="submit" class="inline-flex items-center gap-2 px-8 h-11 bg-core-black dark:bg-core-white text-core-white dark:text-core-black rounded-md font-body text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-all duration-200 focus-ring disabled:opacity-50" id="submit-btn">Send Inquiry <span aria-hidden="true">\u2192</span></button><div id="form-indicator" class="htmx-indicator ml-4 inline"><span class="font-body text-sm text-stone-400">Sending...</span></div></div>
  </form>`;
}

function renderContactSidebar() {
  return `<div class="p-6 bg-stone-50 dark:bg-stone-900 rounded-md"><h3 class="font-display text-lg text-core-black dark:text-core-white mb-4">Contact</h3>
    <div class="space-y-4"><div><p class="font-body text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Email</p><a href="mailto:hello@graphiccity.in" class="font-body text-sm text-stone-600 dark:text-stone-300 hover:text-core-black dark:hover:text-core-white transition-colors">hello@graphiccity.in</a></div>
    <div><p class="font-body text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Phone</p><a href="tel:+1234567890" class="font-body text-sm text-stone-600 dark:text-stone-300 hover:text-core-black dark:hover:text-core-white transition-colors">+1 (234) 567-890</a></div></div></div>
    <div class="p-6 bg-stone-50 dark:bg-stone-900 rounded-md"><h3 class="font-display text-lg text-core-black dark:text-core-white mb-4">Prefer email?</h3><p class="font-body text-sm text-stone-500 dark:text-stone-400 mb-4">Send us a message directly and we'll respond within 48 hours.</p><a href="mailto:hello@graphiccity.in" class="inline-flex items-center gap-2 text-sm font-body text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">hello@graphiccity.in <span aria-hidden="true">\u2192</span></a></div>
    <div class="p-6 bg-core-black text-core-white rounded-md"><h3 class="font-display text-lg mb-2">Ready when you are.</h3><p class="font-body text-sm text-stone-400">Every project starts with a conversation. We look forward to hearing from you.</p></div>`;
}

module.exports = { router, sendPage };
