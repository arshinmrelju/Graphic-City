const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { contactLimiter } = require('../middleware/security');
const esc = (s) => { if (typeof s !== 'string') return s; return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); };

/* ─── Inquiry form submission ─── */
router.post('/inquiry', contactLimiter, (req, res) => {
  try {
    const { name, email, company, projectType, budget, description } = req.body;
    if (!name || !email || !projectType || !description) {
      return res.status(400).send(renderFormError('Please fill in all required fields.'));
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).send(renderFormError('Please enter a valid email address.'));
    }
    const inquiry = { name: esc(name), email: esc(email), company: esc(company || ''), projectType: esc(projectType), budget: esc(budget || 'Not specified'), description: esc(description), timestamp: new Date().toISOString() };
    const filePath = path.join(__dirname, '..', 'data', 'contact-requests.json');
    let requests = [];
    try { requests = JSON.parse(fs.readFileSync(filePath, 'utf-8')); } catch { requests = []; }
    requests.push(inquiry);
    fs.writeFileSync(filePath, JSON.stringify(requests, null, 2));
    console.log(`Inquiry received from ${name} <${email}>`);
    res.send(renderSuccess(name));
  } catch (err) {
    console.error('Inquiry error:', err);
    res.status(500).send(renderFormError('Something went wrong. Please try again.'));
  }
});

/* ─── HTMX validation routes ─── */
router.post('/validate/email', (req, res) => {
  const email = req.body.email || '';
  if (!email) return res.send('<span class="font-body text-xs text-red-500">Email is required</span>');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.send('<span class="font-body text-xs text-red-500">Please enter a valid email</span>');
  res.send('<span class="font-body text-xs text-green-500">Valid email</span>');
});

router.post('/validate/name', (req, res) => {
  const name = req.body.name || '';
  if (!name || name.length < 2) return res.send('<span class="font-body text-xs text-red-500">Name must be at least 2 characters</span>');
  res.send('<span class="font-body text-xs text-green-500">Looks good</span>');
});

function renderFormError(msg) {
  return `<div class="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md mb-6"><p class="font-body text-sm text-red-600 dark:text-red-400">${esc(msg)}</p></div>${renderStartForm()}`;
}

function renderSuccess(name) {
  return `<div class="text-center py-16" data-reveal><div class="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mx-auto mb-6"><svg class="w-8 h-8 text-core-black dark:text-core-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg></div>
    <h2 class="font-display text-h2 md:text-display-sm font-light text-core-black dark:text-core-white -tracking-tight mb-4">Thank you, ${esc(name)}.</h2><p class="font-body text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-md mx-auto text-balance">Your inquiry has been received. Our team will review it and get back to you within 48 hours.</p>
    <div class="mt-8 inline-flex items-center gap-2 font-body text-sm text-stone-500 dark:text-stone-400">Redirecting to homepage...</div></div><script>setTimeout(() => { window.location.href = '/'; }, 4000);</script>`;
}

function renderStartForm() {
  return `<form id="inquiry-form" class="space-y-6" hx-post="/inquiry" hx-target="#inquiry-form" hx-swap="outerHTML" hx-indicator="#form-indicator">
    <div class="grid md:grid-cols-2 gap-6">
      <div><label for="name" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Name <span class="text-red-500">*</span></label><input type="text" id="name" name="name" required class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring" placeholder="Your name"></div>
      <div><label for="email" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Email <span class="text-red-500">*</span></label><input type="email" id="email" name="email" required class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring" placeholder="you@example.com"></div>
    </div>
    <div><label for="company" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Company / Organization</label><input type="text" id="company" name="company" class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring" placeholder="Company name"></div>
    <div><label for="project-type" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Project Type <span class="text-red-500">*</span></label>
      <select id="project-type" name="projectType" required class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring appearance-none">${['Brand Identity', 'Digital Product', 'Art Direction', 'Motion', 'Packaging', 'Other'].map(t => `<option value="${t}">${t}</option>`).join('')}</select></div>
    <div><label for="budget" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Budget Range</label>
      <select id="budget" name="budget" class="w-full h-11 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring appearance-none">${['Under ₹50,000', '₹50,000–₹1.5 Lakhs', '₹1.5 Lakhs–₹5 Lakhs', '₹5 Lakhs–₹15 Lakhs', '₹15 Lakhs+', 'Prefer not to say'].map(b => `<option value="${b}">${b}</option>`).join('')}</select></div>
    <div><label for="description" class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Project Description <span class="text-red-500">*</span></label><textarea id="description" name="description" rows="5" required class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md font-body text-sm text-core-black dark:text-core-white placeholder-stone-400 focus:border-stone-400 dark:focus:border-stone-600 transition-colors duration-200 focus-ring resize-y min-h-[120px]" placeholder="Tell us about your project, goals, timeline, and anything else we should know."></textarea></div>
    <div><label class="block font-body text-sm font-medium text-core-black dark:text-core-white mb-1.5">Attach Files</label><div class="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-md p-6 text-center cursor-pointer hover:border-stone-400 dark:hover:border-stone-600 transition-colors duration-200" id="drop-zone"><input type="file" name="files" multiple class="hidden" id="file-input" accept=".pdf,.doc,.docx,.jpg,.png,.zip"><svg class="w-8 h-8 text-stone-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg><p class="font-body text-sm text-stone-500 dark:text-stone-400" id="file-label">Drag files here or click to browse</p><p class="font-body text-xs text-stone-400 dark:text-stone-500 mt-1">PDF, DOC, JPG, ZIP (max 10MB each)</p></div><ul id="file-list" class="mt-2 space-y-1"></ul></div>
    <div class="pt-4"><button type="submit" class="inline-flex items-center gap-2 px-8 h-11 bg-core-black dark:bg-core-white text-core-white dark:text-core-black rounded-md font-body text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-all duration-200 focus-ring disabled:opacity-50" id="submit-btn">Send Inquiry <span aria-hidden="true">→</span></button><div id="form-indicator" class="htmx-indicator ml-4 inline"><span class="font-body text-sm text-stone-400">Sending...</span></div></div>
  </form>`;
}

module.exports = router;
