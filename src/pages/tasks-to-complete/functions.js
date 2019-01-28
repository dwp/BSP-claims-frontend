'use strict';

const {getClaimAndAudit, getPotentialDecision} = require('../../lib/bsp');
const flattenVerifications = require('../../utils/flatten-verifications');
const resetSession = require('../../utils/reset-session');
const template = require('./template.marko');

async function redirectToView(req, res, next) {
  let claim = {};
  const {claimId} = req.params;
  if (req.session[claimId].visited) {
    claim = req.claim;
  } else {
    claim = await getClaimAndAudit(req, claimId);
    req.session[claimId].visited = true;
  }

  if (claim.decision) {
    return res.redirect('view');
  }

  res.locals.claim = claim;

  next();
}

async function renderPage(req, res) {
  const claim = flattenVerifications(res.locals.claim);
  const decision = await getPotentialDecision(req.params.claimId);
  const allowable = decision ? decision.allow : false;

  resetSession(req);

  res.marko(template, {claim, allowable});
}

module.exports = {redirectToView, renderPage};
