'use strict';

const {reviseAndAuditClaim} = require('../../lib/bsp');
const {
  CHANGE_HISTORY_REL_NOT_VERIFIED,
  CHANGE_HISTORY_DISALLOW_REL_EVIDENCE,
  DISALLOW_REL_EVIDENCE
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
        reason: DISALLOW_REL_EVIDENCE
      }]
    },
    changeInfoList: [
      {
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_REL_NOT_VERIFIED
      },
      {
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_DISALLOW_REL_EVIDENCE
      }
    ]
  }, claim, AUDIT_DISALLOW);

  return res.redirect(`/claim/${claimId}/decision`);
}

module.exports = {renderPage, disallowClaim};
