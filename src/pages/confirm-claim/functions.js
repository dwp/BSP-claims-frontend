'use strict';

const {decideClaim, getPotentialDecision} = require('../../lib/bsp');
const flattenVerifications = require('../../utils/flatten-verifications');
const template = require('./template.marko');

async function confirmClaimIsDecidable(req, res, next) {
  const {claimId} = req.params;
  const decision = await getPotentialDecision(claimId);

  if (!decision) {
    return res.redirect(`/claim/${claimId}/tasks-to-complete`);
  }

  next();
}

function renderPage(req, res) {
  const {claimId} = req.params;
  const claim = flattenVerifications(req.claim);
  req.session[claimId].ninoToDecide = claim.nino;
  res.marko(template, {claimId, claim});
}

async function decide(req, res) {
  const {claimId} = req.params;
  await decideClaim(req, claimId);
  res.redirect(`/claim/${claimId}/decision`);
}

module.exports = {confirmClaimIsDecidable, renderPage, decide};
