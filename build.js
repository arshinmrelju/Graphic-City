const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const PORT = 3456;

const app = require('./server');
app.set('port', PORT);

const pages = [
  { route: '/', file: 'index.html' },
  { route: '/work', file: 'work/index.html' },
  { route: '/capabilities', file: 'capabilities/index.html' },
  { route: '/about', file: 'about/index.html' },
  { route: '/start', file: 'start/index.html' },
  { route: '/journal', file: 'journal/index.html' },
  { route: '/sitemap.xml', file: 'sitemap.xml' },
  { route: '/robots.txt', file: 'robots.txt' },
];

const partials = [
  '/partials/work-grid',
  '/partials/work-filters',
  '/partials/capabilities-services',
  '/partials/about-story',
  '/partials/about-process',
  '/partials/about-numbers',
  '/partials/about-manifesto',
];

const { projects, categories } = require('./data/projects');
projects.forEach(p => {
  pages.push({ route: `/work/${p.id}`, file: `work/${p.id}/index.html` });
});

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${url}`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Client-side filtering JS for the work page
function workFilterScript() {
  return `<script>
const projects = ${JSON.stringify(projects.map(p => ({
    id: p.id, title: p.title, client: p.client, category: p.category,
    year: p.year, size: p.size, description: p.description, seeds: p.seeds
  })))};
const categories = ${JSON.stringify(categories)};
let currentCategory = 'all', currentSearch = '';

function renderGrid(items) {
  if (!items.length) return '<div class="text-center py-24"><p class="font-display text-2xl text-stone-400 dark:text-stone-500 mb-2">No projects found</p><p class="font-body text-sm text-stone-400 dark:text-stone-500">Try adjusting your filter or search.</p></div>';
  return '<div class="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">' + items.map(p => {
    const aspect = { standard: 'aspect-[4/3]', featured: 'aspect-[16/9]', wide: 'aspect-[2/1]', tall: 'aspect-[3/4]' }[p.size] || 'aspect-[4/3]';
    const sizes = { standard: [600,450], featured: [800,450], wide: [800,400], tall: [600,800] }[p.size] || [600,450];
    const cat = categories.find(c => c.id === p.category);
    return '<article class="masonry-item break-inside-avoid mb-6 project-card group cursor-pointer relative"><a href="/work/' + p.id + '"><div class="relative overflow-hidden rounded-md bg-stone-100 dark:bg-stone-900"><div class="' + aspect + '"><img src="https://picsum.photos/seed/' + p.seeds.thumb + '/' + sizes[0] + '/' + sizes[1] + '" alt="' + p.title + ' — ' + p.client + '" class="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]" loading="lazy"></div><div class="absolute inset-0 bg-core-black/0 group-hover:bg-core-black/20 dark:group-hover:bg-core-black/40 transition-all duration-500 flex items-center justify-center"><span class="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="text-core-white"><path d="M4 16H28M28 16L20 8M28 16L20 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div></div></a><div class="mt-4 space-y-1.5"><div class="flex items-center gap-2"><span class="font-body text-xs font-medium tracking-wider uppercase text-stone-400 dark:text-stone-500">' + p.client + '</span><span class="text-stone-300 dark:text-stone-700">·</span><span class="font-body text-xs text-stone-400 dark:text-stone-500">' + p.year + '</span></div><h2 class="font-display text-xl text-core-black dark:text-core-white group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors duration-200"><a href="/work/' + p.id + '" class="hover:underline underline-offset-2 decoration-stone-300 dark:decoration-stone-700 rounded-sm">' + p.title + '</a></h2><p class="font-body text-sm text-stone-400 dark:text-stone-500 line-clamp-2 text-balance">' + p.description + '</p><div class="flex items-center gap-2 pt-1"><span class="inline-block px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded font-body text-xs text-stone-500 dark:text-stone-400">' + (cat ? cat.label : p.category) + '</span></div></div></article>';
  }).join('') + '</div>';
}

function applyFilters() {
  let filtered = [...projects];
  if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
  if (currentSearch) { const q = currentSearch.toLowerCase(); filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)); }
  document.getElementById('project-count').textContent = filtered.length + ' project' + (filtered.length !== 1 ? 's' : '');
  document.getElementById('work-grid').innerHTML = renderGrid(filtered);
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[role="tab"]').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[role="tab"]').forEach(b => b.setAttribute('aria-selected', 'false'));
      this.setAttribute('aria-selected', 'true');
      currentCategory = new URLSearchParams(this.getAttribute('hx-get').split('?')[1]).get('category') || 'all';
      applyFilters();
      window.history.replaceState(null, '', '/work?category=' + currentCategory);
    });
  });
  document.querySelector('input[name="search"]')?.addEventListener('input', function() {
    currentSearch = this.value;
    applyFilters();
  });
});
<\/script>`;
}

// Formspree replacement script
function formspreeScript() {
  return '<script>document.addEventListener("DOMContentLoaded",function(){var f=document.getElementById("inquiry-form");if(f){f.setAttribute("action","https://formspree.io/f/YOUR_FORM_ID");f.removeAttribute("hx-post");f.removeAttribute("hx-target");f.removeAttribute("hx-swap");f.removeAttribute("hx-indicator");f.onsubmit=function(){var b=document.getElementById("submit-btn");b.disabled=1;b.textContent="Sending...";fetch("https://formspree.io/f/YOUR_FORM_ID",{method:"POST",body:new FormData(f),headers:{Accept:"application/json"}}).then(function(r){if(r.ok){f.innerHTML="<div class=\\"text-center py-16\\"><div class=\\"w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mx-auto mb-6\\"><svg class=\\"w-8 h-8 text-core-black dark:text-core-white\\" fill=\\"none\\" viewBox=\\"0 0 24 24\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\"><path stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" d=\\"M4.5 12.75l6 6 9-13.5\\"/></svg></div><h2 class=\\"font-display text-h2 md:text-display-sm font-light text-core-black dark:text-core-white -tracking-tight mb-4\\">Thank you.</h2><p class=\\"font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-md mx-auto text-balance\\">Your inquiry has been received. We will get back to you within 48 hours.</p></div>"}}).catch(function(){b.disabled=0;b.textContent="Send Inquiry →"});return!1}});});</script>';
}

async function build() {
  console.log('Starting server...');
  const server = app.listen(PORT, async () => {
    console.log('Server running on ' + PORT + ', fetching pages...');

    for (const p of pages) {
      const outPath = path.join(DIST, p.file);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      try {
        const html = await fetch(p.route);
        fs.writeFileSync(outPath, html);
        console.log('  \u2713 ' + p.route + ' \u2192 ' + p.file);
      } catch (err) {
        console.error('  \u2717 ' + p.route + ': ' + err.message);
      }
    }

    // Fetch partials
    const partialsDir = path.join(DIST, 'partials');
    fs.mkdirSync(partialsDir, { recursive: true });
    for (const route of partials) {
      const filename = route.replace('/partials/', '') + '.html';
      try {
        const html = await fetch(route);
        fs.writeFileSync(path.join(partialsDir, filename), html);
        console.log('  \u2713 ' + route + ' \u2192 partials/' + filename);
      } catch (err) {
        console.error('  \u2717 ' + route + ': ' + err.message);
      }
    }

    // Inline partials into about page (hero only, rest loaded via partials)
    const aboutHtml = fs.readFileSync(path.join(DIST, 'about', 'index.html'), 'utf8');
    const aboutPartials = ['about-story', 'about-process', 'about-numbers', 'about-manifesto'];
    let aboutSections = '';
    for (const name of aboutPartials) {
      const partialPath = path.join(partialsDir, name + '.html');
      if (fs.existsSync(partialPath)) aboutSections += fs.readFileSync(partialPath, 'utf8') + '\n';
    }
    const aboutFull = aboutHtml.replace('</main>', aboutSections + '</main>');
    fs.writeFileSync(path.join(DIST, 'about', 'index.html'), aboutFull);
    console.log('  \u2713 Inlined about page partials');

    // Inline partials into capabilities page
    const capsHtml = fs.readFileSync(path.join(DIST, 'capabilities', 'index.html'), 'utf8');
    const capsPartialPath = path.join(partialsDir, 'capabilities-services.html');
    if (fs.existsSync(capsPartialPath)) {
      const capsSection = fs.readFileSync(capsPartialPath, 'utf8');
      const capsFull = capsHtml.replace('</main>', capsSection + '\n</main>');
      fs.writeFileSync(path.join(DIST, 'capabilities', 'index.html'), capsFull);
      console.log('  \u2713 Inlined capabilities page partials');
    }

    // Post-process work page: inject client-side filtering
    const workHtml = fs.readFileSync(path.join(DIST, 'work', 'index.html'), 'utf8');
    const workWithJs = workHtml.replace('</body>', workFilterScript() + '\n</body>');
    fs.writeFileSync(path.join(DIST, 'work', 'index.html'), workWithJs);
    console.log('  \u2713 Injected client-side filtering into work page');

    // Post-process start page: replace HTMX form with Formspree
    const startHtml = fs.readFileSync(path.join(DIST, 'start', 'index.html'), 'utf8');
    const startWithForm = startHtml.replace('</body>', formspreeScript() + '\n</body>');
    fs.writeFileSync(path.join(DIST, 'start', 'index.html'), startWithForm);
    console.log('  \u2713 Injected Formspree handler into start page');

    // Copy static assets
    copyDir(path.join(__dirname, 'public'), path.join(DIST, 'public'));
    copyDir(path.join(__dirname, 'assets'), path.join(DIST, 'assets'));
    console.log('  \u2713 Copied public/ and assets/');

    // Generate 404 page from server
    try {
      const notFound = await fetch('/nonexistent');
      fs.writeFileSync(path.join(DIST, '404.html'), notFound);
      console.log('  \u2713 Generated 404.html');
    } catch {}

    // Generate firebase.json
    const firebaseJson = {
      hosting: {
        public: 'dist',
        ignore: ['**/.*'],
        cleanUrls: true,
        trailingSlash: false,
        rewrites: [
          { source: '/public/**', destination: '/public/$1' },
          { source: '/assets/**', destination: '/assets/$1' },
          { source: '/partials/{name}', destination: '/partials/{name}.html' }
        ]
      }
    };
    fs.writeFileSync(path.join(__dirname, 'firebase.json'), JSON.stringify(firebaseJson, null, 2));
    console.log('  \u2713 Updated firebase.json');

    // .firebaserc
    try {
      const existing = JSON.parse(fs.readFileSync(path.join(__dirname, '.firebaserc'), 'utf8'));
      if (!existing.projects?.default) {
        existing.projects = { default: 'graphiccity' };
        fs.writeFileSync(path.join(__dirname, '.firebaserc'), JSON.stringify(existing, null, 2));
      }
    } catch {
      fs.writeFileSync(path.join(__dirname, '.firebaserc'), JSON.stringify({ projects: { default: 'graphiccity' } }, null, 2));
    }

    console.log('\nBuild complete!');
    console.log('Next steps:');
    console.log('  1. Sign up at https://formspree.io and create a form');
    console.log('  2. Replace YOUR_FORM_ID in build.js and re-run "node build.js"');
    console.log('  3. Run: firebase deploy');
    server.close();
    process.exit(0);
  });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else if (!entry.name.endsWith('.gitkeep')) fs.copyFileSync(s, d);
  }
}

build();
