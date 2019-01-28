'use strict';

const {reviseAndAuditClaim} = require('../../lib/bsp');
const {
  CHANGE_HISTORY_NICONTS_NOT_VERIFIED,
  DISALLOW_NI_CONTS,
  CHANGE_HISTORY_NICONTS_VERIFIED
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
  const claim = req.session[claimId].verifyNiConts || req.claim;

  const revisionData = {
    ...claim,
    decision: {
      allow: false,
      decisionCriteriaList: [{
        criteria: 'niConts',
        reason: DISALLOW_NI_CONTS
      }]
    },
    changeInfoList: [
      {
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_NICONTS_VERIFIED
      },
      {
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_NICONTS_NOT_VERIFIED
      }
    ]
  };

  await reviseAndAuditClaim(req, revisionData, claim, AUDIT_DISALLOW);

  res.redirect(`/claim/${claimId}/decision`);
}

module.exports = {renderPage, disallowClaim};
