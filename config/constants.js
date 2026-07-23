module.exports = {
  PORT: process.env.PORT || 3000,
  PER_PAGE: 6,
  SESSION_SECRET: process.env.SESSION_SECRET || 'graphiccity-session-secret',
  COOKIE_MAX_AGE: 24 * 60 * 60 * 1000,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000,
  RATE_LIMIT_MAX: 100,
  LOGIN_RATE_LIMIT_MAX: 5,
  UPLOAD_MAX_SIZE: 10 * 1024 * 1024,
  SITE_URL: process.env.SITE_URL || 'https://graphiccity.in',
  SITE_NAME: 'GraphicCity',
  SITE_DESCRIPTION: 'A creative design studio crafting enduring brand experiences.',
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: '$2a$10$K5X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X'
};
