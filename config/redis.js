'use strict';

const prefix = 'claims-frontend';
const db = 0;

if (process.env.REDIS_URL) {
  const {hostname, port, password} = new URL(process.env.REDIS_URL);
  module.exports = {host: hostname, port, pass: password, prefix, db};
} else {
  const host = 'localhost';
  const port = 6379;
  module.exports = {host, port, prefix, db};
}
