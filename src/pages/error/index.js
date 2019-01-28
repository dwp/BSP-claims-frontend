'use strict';

const pino = require('../../utils/pino');

const template = require('./template.marko');

/* eslint-disable-next-line no-unused-vars */
function handleError(err, req, res, next) {
  const {status = 500, stack} = err;
  const url = req.originalUrl;
  pino.error({err});
  res.marko(template, {status, stack, url});
}

module.exports = handleError;
