'use strict';

module.exports = {
  kongEnabled: process.env.KONG_ENABLED === 'true',
  sslEnabled: process.env.SSL_ENABLED === 'true',
  sslKeyPath: process.env.SSL_KEY_PATH || 'ssl/local-key.key',
  sslCertPath: process.env.SSL_CERT_PATH || 'ssl/local-key.crt',
  sslCaPath: process.env.SSL_CA_PATH || 'ssl/local-key.csr'
};
