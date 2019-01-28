'use strict';

const {reviseAndAuditClaim} = require('../../lib/bsp');
const {AUDIT_VERIFY_CHILD} = require('../../lib/audit-constants');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claim} = req;
  const claimantDetails = claim.claimantDetails || {};
  const {fullName} = claimantDetails;
  res.marko(template, {fullName, claimId: claim.claimId});
}

async function reviseClaimData(req, res) {
  const {claimId} = req.params;
  const {claim} = req;

  if (req.session[claimId].childBenefitClaim) {
    await reviseAndAuditClaim(req, req.session[claimId].childBenefitClaim, claim, AUDIT_VERIFY_CHILD);
    req.session[claimId].childBenefitClaim = undefined;
    req.session[claimId].childBenefit = undefined;
  }

  return res.redirect(`/claim/${claimId}/tasks-to-complete`);
}

module.exports = {renderPage, reviseClaimData};
