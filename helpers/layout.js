const { SITE_URL, SITE_NAME, SITE_DESCRIPTION } = require('../config/constants');

function docHead(title, description, opts = {}) {
  const canonical = opts.canonical || SITE_URL;
  const image = opts.image || `${SITE_URL}/public/favicon.svg`;
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description || SITE_DESCRIPTION)}">
<meta name="keywords" content="design studio, brand identity, UI UX design, graphic design agency, digital experience studio, motion graphics, creative agency, GraphicCity">
<meta name="author" content="GraphicCity">
<meta name="theme-color" content="#0a0a0a">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description || SITE_DESCRIPTION)}">
<meta property="og:type" content="${opts.ogType || 'website'}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@graphiccity">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description || SITE_DESCRIPTION)}">
<meta name="twitter:image" content="${esc(image)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="/public/favicon.svg">
<link rel="stylesheet" href="/public/css/styles.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "name": "GraphicCity",
  "url": "${SITE_URL}",
  "logo": "${SITE_URL}/public/favicon.svg",
  "description": "${esc(description || SITE_DESCRIPTION)}"
}
</script>
<script src="https://unpkg.com/htmx.org@1.9.12" defer></script>
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js" defer></script>
<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics-compat.js"></script>${opts.extraHead || ''}
</head>`;
}

function bodyOpen() {
  return `<body class="bg-core-white dark:bg-core-black text-core-black dark:text-core-white font-body">
<div id="loading-screen" aria-hidden="true"><div class="loader-mark" aria-label="Loading"><span></span><span></span><span></span><span></span></div></div>
<div id="page-transition" aria-hidden="true"></div>
<div id="htmx-topbar" aria-hidden="true"><div class="bar"></div></div>`;
}

function skipLink(href) {
  return `<a href="${href}" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-core-white focus:text-core-black focus:outline-2 focus:outline-signal-blue focus:rounded-md focus:shadow-md">Skip to content</a>`;
}

function renderNav(current) {
  const links = [
    { href: '/work', label: 'Work', id: 'work' },
    { href: '/capabilities', label: 'Capabilities', id: 'capabilities' },
    { href: '/about', label: 'About', id: 'about' },
    { href: '/journal', label: 'Journal', id: 'journal' }
  ];
  return `<header id="site-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out">
<nav class="flex items-center justify-between h-16 px-6 md:px-8 lg:px-12 bg-core-white/85 dark:bg-core-black/85 backdrop-blur-[20px] border-b border-stone-200 dark:border-stone-800" aria-label="Primary navigation">
<a href="/" class="flex items-center" aria-label="${SITE_NAME} home"><svg width="32" height="16" viewBox="0 0 32 16" fill="none" aria-hidden="true"><rect width="6" height="16" rx="1" fill="currentColor"/><rect x="9" width="6" height="16" rx="1" fill="currentColor"/><rect x="18" width="6" height="16" rx="1" fill="currentColor"/><rect x="27" width="5" height="16" rx="1" fill="currentColor"/></svg></a>
<div class="hidden md:flex items-center gap-6 lg:gap-8">${links.map(l => `<a href="${l.href}" class="font-body text-sm ${l.id === current ? 'font-medium text-core-black dark:text-core-white' : 'text-stone-500 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white'} transition-colors">${l.label}</a>`).join('')}</div>
<div class="flex items-center gap-4">
<a href="/start" class="hidden sm:inline-flex items-center h-9 px-4 bg-core-black dark:bg-core-white text-core-white dark:text-core-black font-body font-medium text-sm rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-all">Start a Project</a>
<button id="menu-toggle" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Open menu" aria-haspopup="true" aria-controls="menu-overlay">Menu</button>
</div>
</nav>
</header>

<div id="menu-overlay" class="fixed inset-0 z-[60] bg-core-black/98 backdrop-blur-[40px] transition-all duration-300 ease-out opacity-0 scale-95 pointer-events-none" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Site navigation menu">
<button class="absolute top-4 right-4 md:top-6 md:right-8 lg:top-8 lg:right-12 font-body text-xs font-medium tracking-wider uppercase text-stone-400 hover:text-core-white transition-colors duration-150 menu-close-btn min-h-[44px] flex items-center px-3" aria-label="Close menu">Close</button>
<div class="flex flex-col h-full px-6 py-24">
<nav aria-label="Site navigation" class="text-center flex-1 flex flex-col items-center justify-center">${links.map(l => `<a href="${l.href}" class="block font-display text-4xl md:text-5xl text-core-white hover:text-stone-300 transition-colors duration-150 py-3 min-h-[44px] flex items-center justify-center">${l.label}</a>`).join('')}
<hr class="w-12 mx-auto my-8 border-stone-700"><a href="/start" class="inline-flex items-center h-12 px-8 bg-core-white text-core-black font-body font-medium text-base rounded-md hover:bg-stone-200 transition-all">Start a Project</a>
</nav>
<div class="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto w-full">
<a href="mailto:hello@graphiccity.studio" class="font-body text-sm text-stone-400 hover:text-core-white transition-colors min-h-[44px] flex items-center">hello@graphiccity.studio</a>
<div class="flex items-center gap-6">
<a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 hover:text-core-white transition-colors min-h-[44px] flex items-center">LinkedIn</a>
<a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 hover:text-core-white transition-colors min-h-[44px] flex items-center">Instagram</a>
<a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 hover:text-core-white transition-colors min-h-[44px] flex items-center">Twitter</a>
</div>
</div>
<p class="text-center mt-6 font-body text-xs text-stone-600">&copy; 2026 ${SITE_NAME}</p>
</div>
</div>`;
}

function renderFooter() {
  return `<footer id="site-footer" class="bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800" aria-label="Site footer">
<div class="border-b border-stone-200 dark:border-stone-800">
<div class="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12">
<a href="/start" class="group inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors min-h-[44px] py-2">
Start a Project
<span class="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
</a>
</div>
</div>
<div class="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
<div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
<div><a href="/" class="inline-flex items-center gap-2 mb-4" aria-label="${SITE_NAME} home"><svg width="28" height="14" viewBox="0 0 32 16" fill="none" aria-hidden="true" class="text-core-black dark:text-core-white"><rect width="6" height="16" rx="1" fill="currentColor"/><rect x="9" width="6" height="16" rx="1" fill="currentColor"/><rect x="18" width="6" height="16" rx="1" fill="currentColor"/><rect x="27" width="5" height="16" rx="1" fill="currentColor"/></svg></a><p class="font-body text-sm text-stone-500 dark:text-stone-400 max-w-xs text-balance">Design, made permanent.</p></div>
<nav aria-label="Footer navigation"><div class="grid grid-cols-2 gap-6"><div class="space-y-3"><a href="/work" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Work</a><a href="/capabilities" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Capabilities</a></div><div class="space-y-3"><a href="/about" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">About</a><a href="/journal" class="block font-body text-sm text-stone-600 dark:text-stone-400 hover:text-core-black dark:hover:text-core-white transition-colors">Journal</a></div></div></nav>
<div class="space-y-4"><a href="mailto:hello@graphiccity.studio" class="block font-body text-sm text-core-black dark:text-core-white hover:text-stone-500 dark:hover:text-stone-400 transition-colors">hello@graphiccity.studio</a><p class="font-body text-xs text-stone-400 dark:text-stone-500">Pulpally, Wayanad, Kerala, India</p><div class="flex items-center gap-5 pt-2"><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors min-h-[44px] inline-flex items-center">LinkedIn</a><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors min-h-[44px] inline-flex items-center">Instagram</a><a href="#" class="font-body text-xs font-medium tracking-wider uppercase text-stone-500 dark:text-stone-500 hover:text-core-black dark:hover:text-core-white transition-colors min-h-[44px] inline-flex items-center">Twitter</a></div></div>
</div>
<div class="mt-16 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
<p class="font-body text-xs text-stone-400 dark:text-stone-500">&copy; 2026 ${SITE_NAME}. All rights reserved.</p>
<div class="flex items-center gap-6"><a href="/privacy" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Privacy</a><a href="/terms" class="font-body text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Terms</a></div>
</div>
</div>
</footer>`;
}

function pageScripts(extra) {
  return `<script src="/public/js/lenis.min.js"></script>
<script src="/public/js/firebase-init.js"></script>
<script src="/public/js/animations.js"></script>
<script src="/public/js/main.js"></script>${extra || ''}
</body>
</html>`;
}

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { docHead, bodyOpen, skipLink, renderNav, renderFooter, pageScripts, esc };
