'use strict';

const {reviseAndAuditClaim} = require('../../lib/bsp');
const {
  CHANGE_HISTORY_DISALLOW_REL,
  DISALLOW_REL,
  CHANGE_HISTORY_REL_VERIFIED
} = require('../../lib/constants');
const {
  AUDIT_DISALLOW
} = require('../../lib/audit-constants');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;
  res.marko(template, {claimId});
}

async function disallowClaim(req, res) {
  const {claimId} = req.params;
  const claim = req.session[claimId].relationshipVerification || req.claim;
  req.session[claimId].relationshipVerification = undefined;

  await reviseAndAuditClaim(req, {
    ...claim,
    decision: {
      allow: false,
      decisionCriteriaList: [{
        criteria: 'marriage',
        reason: DISALLOW_REL
      }]
    },
    changeInfoList: [
      {
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_REL_VERIFIED
      },
      {
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_DISALLOW_REL
      }
    ]
  }, claim, AUDIT_DISALLOW);

  return res.redirect(`/claim/${claimId}/decision`);
}

module.exports = {renderPage, disallowClaim};
