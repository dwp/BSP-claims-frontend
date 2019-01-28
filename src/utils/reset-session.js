'use strict';

module.exports = function (req) {
  req.session[req.params.claimId] = {};
  req.session.startNewClaim = {};
};
