'use strict';

const {reviseAndAuditClaim} = require('../../lib/bsp');
const {
  CHANGE_HISTORY_DEATH_NOT_VERIFIED,
  CHANGE_HISTORY_DISALLOW_DEATH_EVIDENCE,
  DISALLOW_DEATH_EVIDENCE
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
  const claim = req.session[claimId].deathVerification || req.claim;
  req.session[claimId].deathVerification = undefined;

  await reviseAndAuditClaim(req, {
    ...claim,
    decision: {
      allow: false,
      decisionCriteriaList: [{
        criteria: 'death',
        reason: DISALLOW_DEATH_EVIDENCE
      }]
    },
    changeInfoList: [
      {
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_DEATH_NOT_VERIFIED
      },
      {
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_DISALLOW_DEATH_EVIDENCE
      }
    ]
  }, claim, AUDIT_DISALLOW);

  return res.redirect(`/claim/${claimId}/decision`);
}

module.exports = {renderPage, disallowClaim};
