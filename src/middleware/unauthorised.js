'use strict';

function unauthorised(req, res, next) {
  const err = new Error('Unauthorised');
  err.status = 401;
  next(err);
}

module.exports = unauthorised;
