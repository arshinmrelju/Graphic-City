const express = require('express');
const router = express.Router();
const { projects, categories, filterProjects, getSizeAspect, getProject, getAdjacentProjects, getRelatedProjects } = require('../data/projects');
const { services } = require('../data/services');
const { esc } = require('../helpers/layout');

/* ─── Helpers ─── */
function renderGrid(items) {
  if (items.length === 0) return '<div class="text-center py-16 md:py-24"><p class="font-display text-2xl text-stone-400 dark:text-stone-500 mb-2">No projects found</p><p class="font-body text-sm text-stone-400 dark:text-stone-500">Try adjusting your filter or search.</p></div>';
  return `<div class="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">${items.map(renderCard).join('')}</div>`;
}
function renderCard(p) {
  const aspect = getSizeAspect(p.size);
  const catLabel = categories.find(c => c.id === p.category)?.label || p.category;
  return `<article class="masonry-item break-inside-avoid mb-6 project-card group cursor-pointer relative" data-project-id="${esc(p.id)}" data-category="${esc(p.category)}">
    <div class="relative overflow-hidden rounded-md bg-stone-100 dark:bg-stone-900"><div class="${aspect.css}"><img src="https://picsum.photos/seed/${p.seeds.thumb}/${aspect.w}/${aspect.h}" alt="${esc(p.title)} — ${esc(p.client)}" class="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]" loading="lazy"></div>
    <div class="absolute inset-0 bg-core-black/0 group-hover:bg-core-black/20 dark:group-hover:bg-core-black/40 transition-all duration-500 flex items-center justify-center"><span class="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="text-core-white"><path d="M4 16H28M28 16L20 8M28 16L20 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div></div>
    <div class="mt-4 space-y-1.5">
      <div class="flex items-center gap-2"><span class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500">${esc(p.client)}</span><span class="text-stone-300 dark:text-stone-700">·</span><span class="font-body text-xs text-stone-400 dark:text-stone-500">${p.year}</span></div>
      <h2 class="font-display text-xl text-core-black dark:text-core-white group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors duration-200"><a href="/work/${esc(p.id)}" class="underline underline-offset-2 decoration-stone-300/50 dark:decoration-stone-700/50 hover:decoration-stone-300 dark:hover:decoration-stone-700 transition-colors duration-200 focus-ring rounded-sm">${esc(p.title)}</a></h2>
      <p class="font-body text-sm text-stone-400 dark:text-stone-500 line-clamp-2 text-balance">${esc(p.description)}</p>
      <div class="flex items-center gap-2 pt-1"><span class="inline-block px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded font-body text-xs text-stone-500 dark:text-stone-400">${esc(catLabel)}</span></div>
    </div>
  </article>`;
}

/* ─── Work partials ─── */
router.get('/partials/work-grid', (req, res) => {
  const category = req.query.category || 'all';
  const search = req.query.search || '';
  const page = parseInt(req.query.page, 10) || 1;
  const result = filterProjects(category, search, page, 12);
  res.send(renderGrid(result.items));
});

router.get('/partials/work-filters', (req, res) => {
  const activeCategory = req.query.category || 'all';
  const search = req.query.search || '';
  const cats = categories.map(cat => `<button role="tab" aria-selected="${cat.id === activeCategory}" class="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-2 rounded-md font-body text-sm transition-all duration-200 focus-ring ${cat.id === activeCategory ? 'bg-core-black dark:bg-core-white text-core-white dark:text-core-black' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white hover:bg-stone-200 dark:hover:bg-stone-700'}" hx-get="/partials/work-grid?category=${cat.id}" hx-target="#work-grid" hx-push-url="/work?category=${cat.id}" hx-indicator="#work-indicator">${cat.label}</button>`).join('');
  res.send(`<div class="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0"><div class="flex flex-nowrap md:flex-wrap items-center gap-2 md:gap-3 min-w-0" role="tablist" aria-label="Filter by category">${cats}<div class="relative ml-auto shrink-0"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg><input type="search" name="search" value="${esc(search)}" placeholder="Search projects..." class="w-40 md:w-56 h-11 sm:h-9 pl-9 pr-3 bg-stone-100 dark:bg-stone-800 border border-transparent focus:border-stone-300 dark:focus:border-stone-600 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 transition-all duration-200 focus-ring" hx-get="/partials/work-grid" hx-trigger="keyup changed delay:300ms, search" hx-target="#work-grid" hx-push-url="true" hx-include="[name='category']" hx-indicator="#work-indicator"></div></div></div>`);
});

router.get('/partials/work-indicator', (req, res) => {
  res.send('<div id="work-indicator" class="h-0.5 bg-stone-200 dark:bg-stone-800 mt-4 rounded-full overflow-hidden"><div class="h-full bg-core-black dark:bg-core-white rounded-full transition-all duration-300 w-0 htmx-request:w-full"></div></div>');
});

/* ─── Capabilities service cards ─── */
router.get('/partials/capabilities-services', (req, res) => {
  const html = services.map((s, i) => `<article class="border-t border-stone-200 dark:border-stone-800 py-8 sm:py-10 md:py-14 first:border-t-0" x-data="{ expanded: false }" data-reveal>
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
      <div class="flex items-start justify-between cursor-pointer group" @click="expanded = !expanded" role="button" tabindex="0" :aria-expanded="expanded" @keydown.enter.prevent="expanded = !expanded" @keydown.space.prevent="expanded = !expanded">
        <div class="flex-1"><p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-2">0${i + 1}</p><h2 class="font-display font-light text-2xl sm:text-h3 md:text-h1 text-core-black dark:text-core-white -tracking-tight group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors duration-200">${esc(s.title)}</h2></div>
        <div class="w-10 h-10 flex items-center justify-center mt-1 shrink-0"><svg :class="{ 'rotate-45': expanded }" class="w-5 h-5 text-core-black dark:text-core-white transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg></div>
      </div>
      <div x-show="expanded" x-collapse.duration.300ms><div class="pt-8 pb-4 max-w-3xl"><p class="font-body text-base md:text-lg text-stone-600 dark:text-stone-300 leading-relaxed text-balance mb-6">${esc(s.overview)}</p><ul class="space-y-2">${(s.deliverables || []).map(o => `<li class="flex items-center gap-3 font-body text-sm text-stone-500 dark:text-stone-400"><svg class="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>${esc(o)}</li>`).join('')}</ul></div></div>
    </div>
  </article>`).join('');
  res.send(`<section class="bg-core-white dark:bg-core-black divide-y-0">${html}</section>`);
});

/* ─── About partials ─── */
router.get('/partials/about-story', (req, res) => {
  res.send(`<section class="px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32 md:min-h-screen flex items-center bg-stone-50 dark:bg-stone-950/50" data-reveal><div class="max-w-6xl mx-auto w-full"><div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
    <div><p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Our Story</p><h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-8 reveal-item">Built on craft, clarity, and trust.</h2><div class="space-y-4 reveal-item"><p class="font-body text-base md:text-lg text-stone-600 dark:text-stone-300 leading-relaxed text-balance">GraphicCity began in a small studio with a simple belief: design should be honest. Not loud. Not trendy. Just clear, purposeful, and deeply human. We started with one client, one project, and a commitment to craft that has never wavered.</p><p class="font-body text-base md:text-lg text-stone-600 dark:text-stone-300 leading-relaxed text-balance">Over time, we've grown — not by chasing scale, but by staying true to the work. Every project is a chance to build something that matters, for people who care.</p></div></div>
    <div><div class="aspect-square rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800 reveal-item"><img src="https://picsum.photos/seed/about-studio/800/800" alt="GraphicCity studio space" class="w-full h-full object-cover" loading="lazy"></div></div>
  </div></div></section>`);
});

router.get('/partials/about-process', (req, res) => {
  const steps = [
    { num: '01', title: 'Discovery', desc: 'We learn your world — your audience, your goals, your competition. No assumptions, only understanding.' },
    { num: '02', title: 'Strategy', desc: 'We define the path forward. A clear direction built on insight, not opinion.' },
    { num: '03', title: 'Design', desc: 'We craft every element with intention. Every color, every word, every pixel serves a purpose.' },
    { num: '04', title: 'Deliver', desc: 'We hand over more than files. We give you a system — tools, guidelines, and the confidence to move forward.' }
  ];
  res.send(`<section class="px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32 bg-core-white dark:bg-core-black" data-reveal><div class="max-w-7xl mx-auto w-full"><p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4">How We Work</p><h2 class="font-display font-light text-h2 md:text-display-sm text-core-black dark:text-core-white -tracking-tight mb-4">A process built for partnership.</h2><p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-xl mb-8 md:mb-16">Not a rigid formula. A flexible framework shaped around each project.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">${steps.map((s, i) => `<div class="reveal-item"><p class="font-display text-4xl md:text-5xl font-light text-stone-200 dark:text-stone-800 mb-4">${s.num}</p><h3 class="font-display text-xl text-core-black dark:text-core-white mb-3">${s.title}</h3><p class="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed text-balance">${s.desc}</p></div>`).join('')}</div></div></section>`);
});

router.get('/partials/about-numbers', (req, res) => {
  res.send(`<section class="px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32 bg-core-black text-core-white" data-reveal><div class="max-w-7xl mx-auto w-full"><p class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 mb-4">By the Numbers</p><h2 class="font-display font-light text-h2 md:text-display-sm -tracking-tight mb-8 md:mb-16">The sum of our parts.</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12">${[
      { num: '12+', label: 'Years in practice' },
      { num: '150+', label: 'Projects delivered' },
      { num: '40+', label: 'Countries reached' },
      { num: '98%', label: 'Client satisfaction' }
    ].map(s => `<div class="reveal-item"><p class="font-display text-4xl md:text-h1 font-light text-core-white mb-2">${s.num}</p><p class="font-body text-sm text-stone-400">${s.label}</p></div>`).join('')}</div></div></section>`);
});

router.get('/partials/about-manifesto', (req, res) => {
  res.send(`<section class="px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32 bg-stone-50 dark:bg-stone-950/50" data-reveal><div class="max-w-4xl mx-auto"><p class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-4 reveal-item">Manifesto</p><div class="space-y-8 reveal-item"><p class="font-display text-xl sm:text-h3 md:text-h1 font-light text-core-black dark:text-core-white leading-tight -tracking-tight">Design is not decoration.</p><p class="font-display text-xl sm:text-h3 md:text-h1 font-light text-core-black dark:text-core-white leading-tight -tracking-tight">It is a conversation between what something wants to be and how it is perceived.</p><p class="font-display text-xl sm:text-h3 md:text-h1 font-light text-core-black dark:text-core-white leading-tight -tracking-tight">We choose clarity over cleverness. Substance over spectacle. Intent over impulse.</p><p class="font-display text-xl sm:text-h3 md:text-h1 font-light text-core-black dark:text-core-white leading-tight -tracking-tight">Every project deserves a point of view. Not a formula.</p></div></div></section>`);
});

module.exports = router;
