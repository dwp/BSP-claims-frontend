'use strict';

const time = () => ',"timestamp":"' + (new Date().toISOString()) + '"';

const pino = require('pino')({
  useLevelLabels: true,
  timestamp: time,
  enabled: process.env.NODE_ENV !== 'test'
});

module.exports = pino;
