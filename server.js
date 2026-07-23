const express = require('express');
const path = require('path');
const session = require('express-session');
const { csp } = require('./middleware/security');
const { compression } = require('./middleware/performance');
const { PORT, SESSION_SECRET } = require('./config/constants');
const { router: publicRouter } = require('./routes/public');
const partialsRouter = require('./routes/partials');
const contactRouter = require('./routes/contact');
const adminRouter = require('./routes/admin');

const app = express();

/* ─── Middleware ─── */
app.use(compression());
app.use(csp);
app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: '1y', immutable: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '1y', immutable: true }));
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' } }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ─── Routes ─── */
app.use('/', publicRouter);
app.use('/', partialsRouter);
app.use('/', contactRouter);
app.use('/admin', adminRouter);

/* ─── 404 ─── */
app.use((req, res) => {
  if (req.headers['hx-request']) return res.status(404).send('<div class="p-12 text-center"><h2 class="font-display text-2xl mb-2">Page not found</h2><p class="font-body text-sm text-stone-500">The page you requested does not exist.</p></div>');
  res.status(404).send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>404 — GraphicCity</title><script src="https://cdn.tailwindcss.com"></script><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');body{font-family:'Inter',sans-serif;background:#0A0A0A;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px}</style></head><body><div><h1 style="font-size:120px;font-weight:200;letter-spacing:-0.04em;line-height:1;margin-bottom:8px;color:#262626">404</h1><p style="font-size:18px;color:#A3A3A3;margin-bottom:32px">The page you're looking for doesn't exist.</p><a href="/" style="display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 24px;background:#fff;color:#0A0A0A;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none">Back to Home</a></div></body></html>`);
});

/* ─── Error handler ─── */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal server error');
});

app.listen(PORT, () => console.log(`GraphicCity running at http://localhost:${PORT}`));
