'use strict';

const secure = process.env.SSL_ENABLED === 'true';
const maxAge = parseInt(process.env.SESSION_EXPIRY, 10) || 1200000;

module.exports = {
  secret: process.env.SESSION_SECRET || 'oh my glob',
  name: 'bruce',
  cookie: {
    maxAge,
    secure
  },
  resave: false,
  rolling: true,
  saveUninitialized: false
};
