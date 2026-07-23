const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const PROJ_DATA_PATH = path.join(__dirname, '..', 'data');
const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(PROJ_DATA_PATH, f), 'utf8')); } catch { return []; } };
const write = (f, d) => fs.writeFileSync(path.join(PROJ_DATA_PATH, f), JSON.stringify(d, null, 2));
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';
const esc = (s) => { if (typeof s !== 'string') return s; return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, ''))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

function auth(req, res, next) {
  if (req.session && req.session.admin) return next();
  if (req.headers['hx-request']) return res.send('<script>window.location.href="/admin/login"</script>');
  res.redirect('/admin/login');
}

function layout(req, title, content, active) {
  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' },
    { id: 'projects', label: 'Projects', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>' },
    { id: 'testimonials', label: 'Testimonials', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' },
    { id: 'services', label: 'Services', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' },
    { id: 'contact', label: 'Inquiries', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { id: 'blog', label: 'Blog', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
    { id: 'media', label: 'Media', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' },
    { id: 'seo', label: 'SEO', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' }
  ];
  const userName = req.session?.admin?.name || 'Admin';
  return `<!DOCTYPE html><html lang="en" class="scroll-smooth"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} — Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/htmx.org@1.9.12" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js" defer></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #FAFAFA; color: #0A0A0A; display: flex; min-height: 100vh; }
    .sidebar { width: 240px; background: #0A0A0A; color: #fff; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 40; }
    .sidebar .logo { padding: 20px 20px 16px; border-bottom: 1px solid #262626; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; }
    .sidebar .logo span { color: #737373; font-weight: 400; }
    .sidebar nav { flex: 1; overflow-y: auto; padding: 12px 0; }
    .sidebar nav a { display: flex; align-items: center; gap: 12px; padding: 10px 20px; color: #A3A3A3; text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.15s; border-left: 2px solid transparent; }
    .sidebar nav a:hover { color: #fff; background: #171717; }
    .sidebar nav a.active { color: #fff; background: #171717; border-left-color: #fff; }
    .sidebar .user { padding: 16px 20px; border-top: 1px solid #262626; font-size: 12px; color: #525252; display: flex; justify-content: space-between; align-items: center; }
    .sidebar .user a { color: #737373; text-decoration: none; font-size: 12px; }
    .sidebar .user a:hover { color: #fff; }
    .main { margin-left: 240px; flex: 1; min-height: 100vh; }
    .topbar { height: 56px; border-bottom: 1px solid #E5E5E5; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 30; }
    .topbar h1 { font-size: 16px; font-weight: 600; }
    .content { padding: 32px; }
    .card { background: #fff; border: 1px solid #E5E5E5; border-radius: 8px; padding: 24px; }
    .card + .card { margin-top: 16px; }
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .stat { background: #fff; border: 1px solid #E5E5E5; border-radius: 8px; padding: 20px 24px; }
    .stat .value { font-size: 28px; font-weight: 600; line-height: 1.2; }
    .stat .label { font-size: 13px; color: #737373; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 12px 16px; border-bottom: 1px solid #E5E5E5; font-weight: 600; color: #525252; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
    td { padding: 12px 16px; border-bottom: 1px solid #F5F5F5; }
    tr:hover td { background: #FAFAFA; }
    .btn { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; text-decoration: none; transition: all 0.15s; }
    .btn-primary { background: #0A0A0A; color: #fff; }
    .btn-primary:hover { background: #262626; }
    .btn-secondary { background: #F5F5F5; color: #0A0A0A; border: 1px solid #E5E5E5; }
    .btn-secondary:hover { background: #E5E5E5; }
    .btn-danger { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
    .btn-danger:hover { background: #FEE2E2; }
    .btn-sm { height: 30px; padding: 0 12px; font-size: 12px; }
    .badge { display: inline-flex; align-items: center; height: 22px; padding: 0 8px; border-radius: 999px; font-size: 11px; font-weight: 500; }
    .badge-new { background: #EFF6FF; color: #2563EB; }
    .badge-read { background: #F5F5F5; color: #737373; }
    .badge-replied { background: #F0FDF4; color: #16A34A; }
    .badge-published { background: #F0FDF4; color: #16A34A; }
    .badge-draft { background: #FEF3C7; color: #D97706; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; color: #525252; }
    .form-group input, .form-group textarea, .form-group select { width: 100%; height: 40px; padding: 0 12px; border: 1px solid #E5E5E5; border-radius: 6px; font-size: 13px; font-family: 'Inter', sans-serif; outline: none; transition: border 0.15s; background: #fff; }
    .form-group textarea { height: auto; padding: 12px; resize: vertical; min-height: 100px; }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: #0A0A0A; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .empty-state { text-align: center; padding: 48px 24px; color: #A3A3A3; }
    .empty-state p { font-size: 14px; }
    .toast { position: fixed; bottom: 24px; right: 24px; background: #0A0A0A; color: #fff; padding: 12px 20px; border-radius: 8px; font-size: 13px; z-index: 100; animation: fadeUp 0.3s ease-out; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 768px) {
      .sidebar { width: 100%; position: relative; min-height: auto; }
      .sidebar nav { display: flex; flex-wrap: wrap; gap: 0; }
      .sidebar nav a { flex: 1 1 auto; min-width: 80px; justify-content: center; font-size: 11px; padding: 8px 12px; border-left: none; border-bottom: 2px solid transparent; }
      .sidebar nav a.active { border-left: none; border-bottom-color: #fff; }
      .main { margin-left: 0; }
      .topbar { padding: 0 16px; }
      .content { padding: 16px; }
      .form-row { grid-template-columns: 1fr; }
      table { font-size: 12px; }
      th, td { padding: 8px 10px; }
    }
    .htmx-request .htmx-ind { opacity: 1; }
    .htmx-ind { opacity: 0; transition: opacity 0.15s; }
    [x-cloak] { display: none !important; }
    .file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
    .file-item { background: #fff; border: 1px solid #E5E5E5; border-radius: 6px; overflow: hidden; }
    .file-item img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
    .file-item .info { padding: 8px 10px; }
    .file-item .info p { font-size: 11px; color: #525252; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .drop-zone { border: 2px dashed #E5E5E5; border-radius: 8px; padding: 32px; text-align: center; color: #A3A3A3; cursor: pointer; transition: all 0.15s; }
    .drop-zone:hover, .drop-zone.drag-over { border-color: #0A0A0A; background: #FAFAFA; }
    .seo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  </style></head><body>
  <aside class="sidebar">
    <div class="logo">GraphicCity <span>Admin</span></div>
    <nav>${nav.map(n => `<a href="/admin/${n.id === 'dashboard' ? '' : n.id}" class="${active === n.id ? 'active' : ''}">${n.icon}${n.label}</a>`).join('')}</nav>
    <div class="user"><span>${esc(userName)}</span><a href="/admin/logout">Logout</a></div>
  </aside>
  <div class="main">
    <div class="topbar"><h1>${esc(title)}</h1><div class="actions"></div></div>
    <div class="content"><div id="admin-content">${content}</div></div>
  </div>
  <div id="toast" class="toast" style="display:none"></div>
  <script>
    document.body.addEventListener('htmx:afterRequest', function(e) {
      var toast = document.getElementById('toast');
      var msg = e.detail.xhr.getResponseHeader('X-Toast');
      if (msg) { toast.textContent = msg; toast.style.display = 'block'; setTimeout(function(){ toast.style.display='none'; }, 3000); }
    });
  </script>
</body></html>`;
}

/* ─── AUTH ─── */
router.get('/login', (req, res) => {
  if (req.session?.admin) return res.redirect('/admin');
  res.send(`<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login — Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #FAFAFA; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .login { width: 380px; max-width: 90vw; }
    .login h1 { font-size: 24px; font-weight: 600; margin-bottom: 4px; }
    .login p { color: #737373; font-size: 14px; margin-bottom: 32px; }
    .login .card { background: #fff; border: 1px solid #E5E5E5; border-radius: 12px; padding: 32px; }
    .login label { display: block; font-size: 13px; font-weight: 500; color: #525252; margin-bottom: 4px; }
    .login input { width: 100%; height: 44px; padding: 0 14px; border: 1px solid #E5E5E5; border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; transition: border 0.15s; }
    .login input:focus { border-color: #0A0A0A; }
    .login .btn { width: 100%; height: 44px; background: #0A0A0A; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
    .login .btn:hover { background: #262626; }
    .login .error { color: #DC2626; font-size: 13px; margin-top: 12px; text-align: center; }
  </style></head><body>
  <div class="login">
    <h1>GraphicCity</h1>
    <p>Sign in to your admin account</p>
    <div class="card">
      <form method="POST" action="/admin/login">
        <div style="margin-bottom:16px"><label for="username">Username</label><input type="text" id="username" name="username" required autocomplete="username" autofocus></div>
        <div style="margin-bottom:24px"><label for="password">Password</label><input type="password" id="password" name="password" required autocomplete="current-password"></div>
        <button type="submit" class="btn">Sign in</button>
        ${req.query.error ? '<div class="error">Invalid username or password</div>' : ''}
      </form>
    </div>
  </div></body></html>`);
});

router.post('/login', (req, res) => {
  const users = read('users.json');
  const user = users.find(u => u.username === req.body.username);
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    req.session.admin = { id: user.id, name: user.name, username: user.username, role: user.role };
    return res.redirect('/admin');
  }
  res.redirect('/admin/login?error=1');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

/* ─── DASHBOARD ─── */
router.get('/', auth, (req, res) => {
  let projCount = 0;
  try { projCount = require('../data/projects').projects.length; } catch { projCount = 0; }
  const contactReqs = read('contact-requests.json');
  const testimonials = read('testimonials.json');
  const blog = read('blog.json');
  const newReqs = contactReqs.filter(r => r.status === 'new').length;
  const recentReqs = contactReqs.slice(-3).reverse();

  res.send(layout(req, 'Dashboard', `
    <div class="stat-grid">
      <div class="stat"><div class="value">${projCount}</div><div class="label">Projects</div></div>
      <div class="stat"><div class="value">${testimonials.length}</div><div class="label">Testimonials</div></div>
      <div class="stat"><div class="value">${contactReqs.length}</div><div class="label">Inquiries</div></div>
      <div class="stat"><div class="value">${blog.length}</div><div class="label">Blog Posts</div></div>
      <div class="stat"><div class="value">${newReqs}</div><div class="label">New Inquiries</div></div>
      <div class="stat"><div class="value">${contactReqs.filter(r => r.status === 'replied').length}</div><div class="label">Replied</div></div>
    </div>
    <div class="card">
      <h2 style="font-size:15px;font-weight:600;margin-bottom:16px">Recent Inquiries</h2>
      ${recentReqs.length ? `<table><thead><tr><th>Name</th><th>Company</th><th>Service</th><th>Status</th><th>Date</th></tr></thead><tbody>
        ${recentReqs.map(r => `<tr><td>${esc(r.name)}</td><td>${esc(r.company || '—')}</td><td>${esc(r.service)}</td><td><span class="badge badge-${esc(r.status)}">${esc(r.status)}</span></td><td style="color:#A3A3A3;font-size:12px">${esc(r.created)}</td></tr>`).join('')}
      </tbody></table>` : '<div class="empty-state"><p>No inquiries yet</p></div>'}
    </div>
  `, 'dashboard'));
});

/* ─── PROJECTS CRUD ─── */
const getProjects = () => {
  try {
    const raw = fs.readFileSync(path.join(PROJ_DATA_PATH, 'projects.js'), 'utf8');
    const match = raw.match(/const projects = (\[[\s\S]*?\]);/);
    if (match) return JSON.parse(match[1]);
  } catch {}
  return [];
};

const saveProjects = (projects) => {
  const cats = require('../data/projects').categories;
  const helpers = `
const categories = ${JSON.stringify(cats, null, 2)};

function getSizeAspect(size) {
  switch (size) {
    case 'featured': return { css: 'aspect-[16/9]', w: 800, h: 450 };
    case 'wide':     return { css: 'aspect-[2/1]',  w: 800, h: 400 };
    case 'tall':     return { css: 'aspect-[3/4]',  w: 600, h: 800 };
    default:         return { css: 'aspect-[4/3]',  w: 600, h: 450 };
  }
}

function filterProjects(category, search, page, perPage) {
  let filtered = [...projects];
  if (category && category !== 'all') filtered = filtered.filter(p => p.category === category);
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * perPage;
  return { items: filtered.slice(start, start + perPage), total, totalPages, currentPage };
}

function getProject(id) {
  return projects.find(p => p.id === id) || null;
}

function getAdjacentProjects(id) {
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? projects[idx - 1] : projects[projects.length - 1],
    next: idx < projects.length - 1 ? projects[idx + 1] : projects[0]
  };
}

function getRelatedProjects(id, category, count) {
  return projects.filter(p => p.id !== id && p.category === category).slice(0, count || 3);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projects, categories, filterProjects, getSizeAspect, getProject, getAdjacentProjects, getRelatedProjects };
}`;
  fs.writeFileSync(path.join(PROJ_DATA_PATH, 'projects.js'), `const projects = ${JSON.stringify(projects, null, 2)};\n${helpers}`);
};

router.get('/projects', auth, (req, res) => {
  const projs = getProjects();
  res.send(layout(req, 'Projects', `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <p style="font-size:14px;color:#737373">${projs.length} projects</p>
      <a href="/admin/projects/new" class="btn btn-primary" hx-get="/admin/projects/new" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">+ New Project</a>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table><thead><tr><th>Title</th><th>Client</th><th>Category</th><th>Year</th><th></th></tr></thead><tbody>
        ${projs.map(p => `
        <tr>
          <td style="font-weight:500">${esc(p.title)}</td>
          <td style="color:#737373">${esc(p.client)}</td>
          <td><span class="badge" style="background:#F5F5F5;color:#525252">${esc(p.category)}</span></td>
          <td style="color:#A3A3A3">${esc(p.year)}</td>
          <td style="text-align:right">
            <a href="/admin/projects/${esc(p.id)}/edit" class="btn btn-secondary btn-sm" hx-get="/admin/projects/${esc(p.id)}/edit" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">Edit</a>
            <button class="btn btn-danger btn-sm" hx-post="/admin/projects/${esc(p.id)}/delete" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="/admin/projects" hx-confirm="Delete ${esc(p.title)}?">Delete</button>
          </td>
        </tr>`).join('')}
        ${!projs.length ? '<tr><td colspan="5"><div class="empty-state"><p>No projects yet</p></div></td></tr>' : ''}
      </tbody></table>
    </div>
  `, 'projects'));
});

router.get('/projects/new', auth, (req, res) => {
  const cats = read('categories-admin.json');
  res.send(layout(req, 'New Project', `
    <form hx-post="/admin/projects/save" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="/admin/projects" class="card" style="max-width:720px">
      <div class="form-row">
        <div class="form-group"><label>Title</label><input type="text" name="title" required></div>
        <div class="form-group"><label>Client</label><input type="text" name="client" required></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Category</label><select name="category">${cats.map(c => `<option value="${esc(c.id)}">${esc(c.label)}</option>`).join('')}</select></div>
        <div class="form-group"><label>Year</label><input type="text" name="year" value="2025" required></div>
      </div>
      <div class="form-group"><label>Size</label><select name="size"><option value="standard">Standard (4:3)</option><option value="featured">Featured (16:9)</option><option value="wide">Wide (2:1)</option><option value="tall">Tall (3:4)</option></select></div>
      <div class="form-group"><label>Accent Color</label><input type="text" name="color" value="#0066FF" placeholder="#0066FF"></div>
      <div class="form-group"><label>Description</label><textarea name="description" rows="3" required></textarea></div>
      <div class="form-row">
        <div class="form-group"><label>Thumb Seed</label><input type="number" name="thumbSeed" value="1"></div>
        <div class="form-group"><label>Gallery Seeds (comma separated)</label><input type="text" name="gallerySeeds" value="5,6,7,8"></div>
      </div>
      <div class="form-group"><label>Challenge</label><textarea name="challenge" rows="3"></textarea></div>
      <div class="form-group"><label>Research</label><textarea name="research" rows="3"></textarea></div>
      <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:16px;border-top:1px solid #E5E5E5">
        <a href="/admin/projects" class="btn btn-secondary" hx-get="/admin/projects" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">Cancel</a>
        <button type="submit" class="btn btn-primary">Save Project</button>
      </div>
    </form>
  `, 'projects'));
});

router.get('/projects/:id/edit', auth, (req, res) => {
  const projs = getProjects();
  const p = projs.find(x => x.id === req.params.id);
  if (!p) return res.send(layout(req, 'Edit Project', '<div class="empty-state"><p>Project not found</p></div>', 'projects'));
  const cats = read('categories-admin.json');
  res.send(layout(req, 'Edit Project', `
    <form hx-post="/admin/projects/save" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="/admin/projects" class="card" style="max-width:720px">
      <input type="hidden" name="id" value="${esc(p.id)}">
      <div class="form-row">
        <div class="form-group"><label>Title</label><input type="text" name="title" value="${esc(p.title)}" required></div>
        <div class="form-group"><label>Client</label><input type="text" name="client" value="${esc(p.client)}" required></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Category</label><select name="category">${cats.map(c => `<option value="${esc(c.id)}" ${c.id === p.category ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}</select></div>
        <div class="form-group"><label>Year</label><input type="text" name="year" value="${esc(p.year)}" required></div>
      </div>
      <div class="form-group"><label>Size</label><select name="size"><option value="standard" ${p.size === 'standard' ? 'selected' : ''}>Standard</option><option value="featured" ${p.size === 'featured' ? 'selected' : ''}>Featured</option><option value="wide" ${p.size === 'wide' ? 'selected' : ''}>Wide</option><option value="tall" ${p.size === 'tall' ? 'selected' : ''}>Tall</option></select></div>
      <div class="form-group"><label>Accent Color</label><input type="text" name="color" value="${esc(p.color)}"></div>
      <div class="form-group"><label>Description</label><textarea name="description" rows="3" required>${esc(p.description)}</textarea></div>
      <div class="form-group"><label>Challenge</label><textarea name="challenge" rows="3">${esc(p.cs?.challenge || '')}</textarea></div>
      <div class="form-group"><label>Research</label><textarea name="research" rows="3">${esc(p.cs?.research || '')}</textarea></div>
      <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:16px;border-top:1px solid #E5E5E5">
        <a href="/admin/projects" class="btn btn-secondary" hx-get="/admin/projects" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">Cancel</a>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>
  `, 'projects'));
});

router.post('/projects/save', auth, (req, res) => {
  const projs = getProjects();
  const existing = projs.findIndex(p => p.id === req.body.id);
  const id = req.body.id || slugify(req.body.title) + '-' + Date.now().toString(36);
  const project = {
    id, title: req.body.title, client: req.body.client, category: req.body.category,
    year: req.body.year, size: req.body.size || 'standard', color: req.body.color || '#0066FF',
    seeds: { thumb: parseInt(req.body.thumbSeed) || 1, gallery: (req.body.gallerySeeds || '5,6,7,8').split(',').map(Number) },
    description: req.body.description,
    cs: { challenge: req.body.challenge || '', research: req.body.research || '', sketches: ['', '', ''], typography: { typefaces: ['Space Grotesk', 'Inter'], description: '' }, colors: [{ hex: '#0066FF', name: 'Primary', usage: '' }], results: [{ value: '', label: '' }] }
  };
  if (existing >= 0) projs[existing] = project;
  else projs.push(project);
  saveProjects(projs);
  res.set('X-Toast', existing >= 0 ? 'Project updated' : 'Project created');
  res.redirect('/admin/projects');
});

router.post('/projects/:id/delete', auth, (req, res) => {
  let projs = getProjects();
  projs = projs.filter(p => p.id !== req.params.id);
  saveProjects(projs);
  res.set('X-Toast', 'Project deleted');
  res.send('<script>window.location.href="/admin/projects"</script>');
});

/* ─── CATEGORIES ─── */
router.get('/categories', auth, (req, res) => {
  const cats = read('categories-admin.json');
  res.send(layout(req, 'Categories', `
    <div class="card" style="max-width:500px">
      <form hx-post="/admin/categories/save" hx-target="#cat-list" hx-swap="innerHTML" style="display:flex;gap:8px;margin-bottom:16px">
        <input type="text" name="label" placeholder="New category name" required style="flex:1;height:36px;padding:0 12px;border:1px solid #E5E5E5;border-radius:6px;font-size:13px;outline:none">
        <button type="submit" class="btn btn-primary btn-sm">Add</button>
      </form>
      <div id="cat-list">${cats.map(c => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F5F5F5">
          <span style="font-size:13px;font-weight:500">${esc(c.label)}</span>
          <span style="font-size:11px;color:#A3A3A3;font-family:monospace">${esc(c.id)}</span>
        </div>`).join('')}</div>
    </div>`, 'projects'));
});

router.post('/categories/save', auth, (req, res) => {
  const cats = read('categories-admin.json');
  const newCat = { id: slugify(req.body.label), label: req.body.label };
  if (!cats.find(c => c.id === newCat.id)) cats.push(newCat);
  write('categories-admin.json', cats);
  res.set('X-Toast', 'Category added');
  res.send(cats.map(c => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F5F5F5">
      <span style="font-size:13px;font-weight:500">${esc(c.label)}</span>
      <span style="font-size:11px;color:#A3A3A3;font-family:monospace">${esc(c.id)}</span>
    </div>`).join(''));
});

/* ─── TESTIMONIALS CRUD ─── */
router.get('/testimonials', auth, (req, res) => {
  const list = read('testimonials.json');
  res.send(layout(req, 'Testimonials', `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <p style="font-size:14px;color:#737373">${list.length} testimonials</p>
      <a href="/admin/testimonials/new" class="btn btn-primary btn-sm" hx-get="/admin/testimonials/new" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">+ New</a>
    </div>
    <div id="testimonials-list">${list.map(t => `
      <div class="card" style="margin-bottom:12px;padding:16px 20px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
          <div style="flex:1"><p style="font-size:13px;line-height:1.5;margin-bottom:6px">&quot;${esc(t.quote.length > 120 ? t.quote.slice(0,120) + '...' : t.quote)}&quot;</p><p style="font-size:12px;color:#A3A3A3">&mdash; ${esc(t.attr)}</p></div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <a href="/admin/testimonials/${esc(t.id)}/edit" class="btn btn-secondary btn-sm" hx-get="/admin/testimonials/${esc(t.id)}/edit" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">Edit</a>
            <button class="btn btn-danger btn-sm" hx-post="/admin/testimonials/${esc(t.id)}/delete" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="/admin/testimonials" hx-confirm="Delete this testimonial?">Delete</button>
          </div>
        </div>
      </div>`).join('')}</div>`, 'testimonials'));
});

router.get('/testimonials/new', auth, (req, res) => {
  res.send(layout(req, 'New Testimonial', `
    <form hx-post="/admin/testimonials/save" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="/admin/testimonials" class="card" style="max-width:600px">
      <div class="form-group"><label>Quote</label><textarea name="quote" rows="4" required></textarea></div>
      <div class="form-group"><label>Attribution</label><input type="text" name="attr" placeholder="e.g. CEO, Company Name" required></div>
      <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:16px;border-top:1px solid #E5E5E5">
        <a href="/admin/testimonials" class="btn btn-secondary" hx-get="/admin/testimonials" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">Cancel</a>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>`, 'testimonials'));
});

router.get('/testimonials/:id/edit', auth, (req, res) => {
  const list = read('testimonials.json');
  const t = list.find(x => x.id == req.params.id);
  if (!t) return res.send(layout(req, 'Edit Testimonial', '<div class="empty-state"><p>Not found</p></div>', 'testimonials'));
  res.send(layout(req, 'Edit Testimonial', `
    <form hx-post="/admin/testimonials/save" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="/admin/testimonials" class="card" style="max-width:600px">
      <input type="hidden" name="id" value="${esc(t.id)}">
      <div class="form-group"><label>Quote</label><textarea name="quote" rows="4" required>${esc(t.quote)}</textarea></div>
      <div class="form-group"><label>Attribution</label><input type="text" name="attr" value="${esc(t.attr)}" required></div>
      <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:16px;border-top:1px solid #E5E5E5">
        <a href="/admin/testimonials" class="btn btn-secondary" hx-get="/admin/testimonials" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">Cancel</a>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>`, 'testimonials'));
});

router.post('/testimonials/save', auth, (req, res) => {
  const list = read('testimonials.json');
  const existing = list.findIndex(t => t.id == req.body.id);
  const entry = { id: existing >= 0 ? list[existing].id : (list.length ? Math.max(...list.map(t => t.id)) + 1 : 1), quote: req.body.quote, attr: req.body.attr, published: true, created: new Date().toISOString().slice(0,10) };
  if (existing >= 0) list[existing] = { ...list[existing], ...entry };
  else list.push(entry);
  write('testimonials.json', list);
  res.set('X-Toast', existing >= 0 ? 'Testimonial updated' : 'Testimonial created');
  res.redirect('/admin/testimonials');
});

router.post('/testimonials/:id/delete', auth, (req, res) => {
  let list = read('testimonials.json');
  list = list.filter(t => t.id != req.params.id);
  write('testimonials.json', list);
  res.set('X-Toast', 'Testimonial deleted');
  res.send('<script>window.location.href="/admin/testimonials"</script>');
});

/* ─── SERVICES (read-only view) ─── */
router.get('/services', auth, (req, res) => {
  const svcs = require('../data/services').services;
  res.send(layout(req, 'Services', `
    <p style="font-size:14px;color:#737373;margin-bottom:20px">Services are managed in the services data file. Below is a read-only view.</p>
    <div class="card" style="padding:0;overflow:hidden">
      <table><thead><tr><th>Service</th><th>Pricing</th><th>Timeline</th><th>Deliverables</th></tr></thead><tbody>
        ${svcs.map(s => `<tr><td style="font-weight:500">${esc(s.title)}</td><td style="color:#737373">${esc(s.pricing)}+</td><td style="color:#A3A3A3">${esc(s.timeline)}</td><td style="color:#A3A3A3;font-size:12px">${s.deliverables.length} items</td></tr>`).join('')}
      </tbody></table>
    </div>`, 'services'));
});

/* ─── INQUIRIES ─── */
router.get('/contact', auth, (req, res) => {
  const reqs = read('contact-requests.json');
  res.send(layout(req, 'Inquiries', `
    <div style="display:flex;gap:12px;margin-bottom:20px">
      <span class="badge badge-new">${reqs.filter(r => r.status === 'new').length} New</span>
      <span class="badge badge-read">${reqs.filter(r => r.status === 'read').length} Read</span>
      <span class="badge badge-replied">${reqs.filter(r => r.status === 'replied').length} Replied</span>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table><thead><tr><th>Name</th><th>Company</th><th>Service</th><th>Budget</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>
        ${reqs.slice().reverse().map(r => `
        <tr>
          <td style="font-weight:500">${esc(r.name)}</td>
          <td style="color:#737373">${esc(r.company || '—')}</td>
          <td style="color:#525252;font-size:12px">${esc(r.service)}</td>
          <td style="color:#A3A3A3;font-size:12px">${esc(r.budget)}</td>
          <td><span class="badge badge-${esc(r.status)}">${esc(r.status)}</span></td>
          <td style="color:#A3A3A3;font-size:12px">${esc(r.created)}</td>
          <td style="text-align:right"><button class="btn btn-secondary btn-sm" hx-get="/admin/contact/${esc(r.id)}" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">View</button></td>
        </tr>`).join('')}
      </tbody></table>
    </div>`, 'contact'));
});

router.get('/contact/:id', auth, (req, res) => {
  const reqs = read('contact-requests.json');
  const r = reqs.find(x => x.id == req.params.id);
  if (!r) return res.send(layout(req, 'Inquiry', '<div class="empty-state">Not found</div>', 'contact'));
  if (r.status === 'new') { r.status = 'read'; write('contact-requests.json', reqs); }
  res.send(layout(req, 'Inquiry Details', `
    <div class="card" style="max-width:640px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
        <div><p style="font-size:11px;color:#A3A3A3;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px">Name</p><p style="font-size:14px;font-weight:500">${esc(r.name)}</p></div>
        <div><p style="font-size:11px;color:#A3A3A3;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px">Company</p><p style="font-size:14px">${esc(r.company || '—')}</p></div>
        <div><p style="font-size:11px;color:#A3A3A3;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px">Email</p><p style="font-size:14px"><a href="mailto:${esc(r.email)}" style="color:#0A0A0A;text-decoration:none">${esc(r.email)}</a></p></div>
        <div><p style="font-size:11px;color:#A3A3A3;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px">Service</p><p style="font-size:14px">${esc(r.service)}</p></div>
        <div><p style="font-size:11px;color:#A3A3A3;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px">Budget</p><p style="font-size:14px">${esc(r.budget)}</p></div>
        <div><p style="font-size:11px;color:#A3A3A3;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px">Timeline</p><p style="font-size:14px">${esc(r.timeline)}</p></div>
      </div>
      <div style="margin-bottom:20px;padding-top:16px;border-top:1px solid #E5E5E5">
        <p style="font-size:11px;color:#A3A3A3;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:6px">Project Description</p>
        <p style="font-size:13px;line-height:1.6;color:#525252">${esc(r.description)}</p>
      </div>
      <div style="display:flex;gap:8px;padding-top:16px;border-top:1px solid #E5E5E5">
        <button class="btn btn-primary btn-sm" hx-post="/admin/contact/${esc(r.id)}/mark-replied" hx-swap="none">Mark as Replied</button>
        <a href="mailto:${esc(r.email)}" class="btn btn-secondary btn-sm">Reply via Email</a>
        <a href="/admin/contact" class="btn btn-secondary btn-sm" hx-get="/admin/contact" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">Back</a>
      </div>
    </div>`, 'contact'));
});

router.post('/contact/:id/mark-replied', auth, (req, res) => {
  const reqs = read('contact-requests.json');
  const r = reqs.find(x => x.id == req.params.id);
  if (r) { r.status = 'replied'; write('contact-requests.json', reqs); }
  res.set('X-Toast', 'Marked as replied');
  res.send('');
});

/* ─── BLOG CRUD ─── */
router.get('/blog', auth, (req, res) => {
  const posts = read('blog.json');
  res.send(layout(req, 'Blog', `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <p style="font-size:14px;color:#737373">${posts.length} posts</p>
      <a href="/admin/blog/new" class="btn btn-primary btn-sm" hx-get="/admin/blog/new" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">+ New Post</a>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table><thead><tr><th>Title</th><th>Slug</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>
        ${posts.map(p => `<tr>
          <td style="font-weight:500">${esc(p.title)}</td>
          <td style="color:#A3A3A3;font-family:monospace;font-size:12px">${esc(p.slug)}</td>
          <td><span class="badge ${p.published ? 'badge-published' : 'badge-draft'}">${p.published ? 'Published' : 'Draft'}</span></td>
          <td style="color:#A3A3A3;font-size:12px">${esc(p.created)}</td>
          <td style="text-align:right">
            <a href="/admin/blog/${esc(p.id)}/edit" class="btn btn-secondary btn-sm" hx-get="/admin/blog/${esc(p.id)}/edit" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">Edit</a>
            <button class="btn btn-danger btn-sm" hx-post="/admin/blog/${esc(p.id)}/delete" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="/admin/blog" hx-confirm="Delete ${esc(p.title)}?">Delete</button>
          </td>
        </tr>`).join('')}
        ${!posts.length ? '<tr><td colspan="5"><div class="empty-state"><p>No posts yet</p></div></td></tr>' : ''}
      </tbody></table>
    </div>`, 'blog'));
});

router.get('/blog/new', auth, (req, res) => {
  res.send(layout(req, 'New Post', `
    <form hx-post="/admin/blog/save" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="/admin/blog" class="card" style="max-width:720px">
      <div class="form-group"><label>Title</label><input type="text" name="title" required></div>
      <div class="form-group"><label>Slug</label><input type="text" name="slug" placeholder="Leave empty to auto-generate"></div>
      <div class="form-group"><label>Excerpt</label><textarea name="excerpt" rows="2" required></textarea></div>
      <div class="form-group"><label>Content (Markdown)</label><textarea name="content" rows="12" required></textarea></div>
      <div class="form-group"><label>Tags (comma separated)</label><input type="text" name="tags" placeholder="design, brand, process"></div>
      <div class="form-group"><label><input type="checkbox" name="published" value="1" checked> Published</label></div>
      <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:16px;border-top:1px solid #E5E5E5">
        <a href="/admin/blog" class="btn btn-secondary" hx-get="/admin/blog" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">Cancel</a>
        <button type="submit" class="btn btn-primary">Save Post</button>
      </div>
    </form>`, 'blog'));
});

router.get('/blog/:id/edit', auth, (req, res) => {
  const posts = read('blog.json');
  const p = posts.find(x => x.id == req.params.id);
  if (!p) return res.send(layout(req, 'Edit Post', '<div class="empty-state">Not found</div>', 'blog'));
  res.send(layout(req, 'Edit Post', `
    <form hx-post="/admin/blog/save" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="/admin/blog" class="card" style="max-width:720px">
      <input type="hidden" name="id" value="${esc(p.id)}">
      <div class="form-group"><label>Title</label><input type="text" name="title" value="${esc(p.title)}" required></div>
      <div class="form-group"><label>Slug</label><input type="text" name="slug" value="${esc(p.slug)}"></div>
      <div class="form-group"><label>Excerpt</label><textarea name="excerpt" rows="2" required>${esc(p.excerpt)}</textarea></div>
      <div class="form-group"><label>Content (Markdown)</label><textarea name="content" rows="12" required>${esc(p.content)}</textarea></div>
      <div class="form-group"><label>Tags (comma separated)</label><input type="text" name="tags" value="${esc((p.tags || []).join(', '))}"></div>
      <div class="form-group"><label><input type="checkbox" name="published" value="1" ${p.published ? 'checked' : ''}> Published</label></div>
      <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:16px;border-top:1px solid #E5E5E5">
        <a href="/admin/blog" class="btn btn-secondary" hx-get="/admin/blog" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="true">Cancel</a>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>`, 'blog'));
});

router.post('/blog/save', auth, (req, res) => {
  const posts = read('blog.json');
  const existing = posts.findIndex(p => p.id == req.body.id);
  const now = new Date().toISOString().slice(0, 10);
  const entry = {
    id: existing >= 0 ? posts[existing].id : (posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1),
    title: req.body.title, slug: req.body.slug || slugify(req.body.title),
    excerpt: req.body.excerpt, content: req.body.content,
    author: 'GraphicCity', tags: (req.body.tags || '').split(',').map(t => t.trim()).filter(Boolean),
    published: !!req.body.published, created: existing >= 0 ? posts[existing].created : now
  };
  if (existing >= 0) posts[existing] = entry;
  else posts.push(entry);
  write('blog.json', posts);
  res.set('X-Toast', existing >= 0 ? 'Post updated' : 'Post created');
  res.redirect('/admin/blog');
});

router.post('/blog/:id/delete', auth, (req, res) => {
  let posts = read('blog.json');
  posts = posts.filter(p => p.id != req.params.id);
  write('blog.json', posts);
  res.set('X-Toast', 'Post deleted');
  res.send('<script>window.location.href="/admin/blog"</script>');
});

/* ─── MEDIA MANAGER ─── */
router.get('/media', auth, (req, res) => {
  read('media.json');
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  let files = [];
  try { files = fs.readdirSync(uploadsDir).map(f => ({ name: f, url: '/public/uploads/' + f, size: fs.statSync(path.join(uploadsDir, f)).size })).reverse(); } catch {}
  res.send(layout(req, 'Media', `
    <div class="card" style="margin-bottom:16px">
      <form id="upload-form" hx-post="/admin/media/upload" hx-target="#media-grid" hx-swap="innerHTML" hx-encoding="multipart/form-data">
        <div class="drop-zone" id="drop-zone" style="margin-bottom:12px">
          <p style="font-size:14px;margin-bottom:4px">Drag & drop files or click to browse</p>
          <p style="font-size:12px">PNG, JPG, PDF, AI, PSD, SVG &mdash; Max 10MB</p>
          <input type="file" name="file" id="file-input" style="display:none">
          <button type="button" class="btn btn-secondary btn-sm" style="margin-top:12px" onclick="document.getElementById('file-input').click()">Choose File</button>
        </div>
      </form>
    </div>
    <div id="media-grid">
      <div class="file-grid">${files.map(f => `
        <div class="file-item">
          ${/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f.name) ? `<img src="${f.url}" alt="${esc(f.name)}">` : `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:#F5F5F5;color:#A3A3A3;font-size:11px">${f.name.split('.').pop().toUpperCase()}</div>`}
          <div class="info"><p>${esc(f.name.length > 20 ? f.name.slice(0, 20) + '...' : f.name)}</p><p style="color:#D4D4D4;font-size:10px">${(f.size / 1024).toFixed(0)} KB</p></div>
        </div>`).join('')}
        ${!files.length ? '<div class="empty-state" style="grid-column:1/-1"><p>No files uploaded yet</p></div>' : ''}
      </div>
    </div>`, 'media'));
});

router.post('/media/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.send('');
  const media = read('media.json');
  media.push({ name: req.file.filename, original: req.file.originalname, size: req.file.size, uploaded: new Date().toISOString() });
  write('media.json', media);
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  let files = [];
  try { files = fs.readdirSync(uploadsDir).map(f => ({ name: f, url: '/public/uploads/' + f, size: fs.statSync(path.join(uploadsDir, f)).size })).reverse(); } catch {}
  res.set('X-Toast', 'File uploaded');
  res.send(`<div class="file-grid">${files.map(f => `
    <div class="file-item">
      ${/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f.name) ? `<img src="${f.url}" alt="${esc(f.name)}">` : `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:#F5F5F5;color:#A3A3A3;font-size:11px">${esc(f.name.split('.').pop().toUpperCase())}</div>`}
      <div class="info"><p>${esc(f.name.length > 20 ? f.name.slice(0,20)+'...' : f.name)}</p><p style="color:#D4D4D4;font-size:10px">${(f.size/1024).toFixed(0)} KB</p></div>
    </div>`).join('')}</div>`);
});

/* ─── SEO MANAGER ─── */
router.get('/seo', auth, (req, res) => {
  const seo = read('seo.json');
  res.send(layout(req, 'SEO', `
    <form hx-post="/admin/seo/save" hx-target="#admin-content" hx-swap="innerHTML" hx-push-url="/admin/seo">
      <div class="seo-grid">${Object.entries(seo).map(([key, val]) => `
        <div class="card">
          <p style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#A3A3A3;margin-bottom:12px">${esc(key)}</p>
          <div class="form-group"><label>Title</label><input type="text" name="${esc(key)}_title" value="${esc(val.title)}"></div>
          <div class="form-group"><label>Description</label><textarea name="${esc(key)}_desc" rows="2">${esc(val.description)}</textarea></div>
        </div>`).join('')}</div>
      <div style="margin-top:16px;text-align:right"><button type="submit" class="btn btn-primary">Save SEO Settings</button></div>
    </form>`, 'seo'));
});

router.post('/seo/save', auth, (req, res) => {
  const seo = read('seo.json');
  for (const key of Object.keys(seo)) {
    if (req.body[key + '_title'] !== undefined) seo[key].title = req.body[key + '_title'];
    if (req.body[key + '_desc'] !== undefined) seo[key].description = req.body[key + '_desc'];
  }
  write('seo.json', seo);
  res.set('X-Toast', 'SEO settings saved');
  res.redirect('/admin/seo');
});

module.exports = router;
