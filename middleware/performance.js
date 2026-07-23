const compression = require('compression');

function cacheControl(req, res, next) {
  if (req.path.startsWith('/public/')) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.path.startsWith('/assets/')) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
}

module.exports = { compression, cacheControl };
