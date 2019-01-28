'use strict';

const {newClaimant, newClaim, reviseAndAuditClaim} = require('../../lib/bsp');
const {
  CHANGE_HISTORY_DISALLOWED_SPA,
  CHANGE_HISTORY_CLAIM_DETAILS_CONFIRMED,
  DISALLOW_SPA,
  CHANGE_HISTORY_NEW_CLAIM
} = require('../../lib/constants');
const {
  AUDIT_DISALLOW
} = require('../../lib/audit-constants');
const formToApi = require('../../utils/new-claim-data-to-api');
const sanitiseNino = require('../../utils/strip-spaces-force-uppercase');
const template = require('./template.marko');

function renderPage(req, res) {
  const {values} = req.session.startNewClaim;
  res.marko(template, {
    day: values.dateOfBirthDay.replace(/^[0]+/g, ''),
    month: values.dateOfBirthMonth.replace(/^[0]+/g, ''),
    year: values.dateOfBirthYear
  });
}

async function disallowClaim(req, res) {
  const {values} = req.session.startNewClaim;

  const claimaintNino = sanitiseNino(values.nino);
  const newClaimData = formToApi(values);

  const {claimantId} = await newClaimant(claimaintNino);

  const response = await newClaim(req, claimaintNino, {
    claimantId,
    ...newClaimData,
    changeInfoList: [{
      agentIdentifier: req.user.cis.dwp_staffid,
      agentName: req.user.username,
      changeDescription: CHANGE_HISTORY_NEW_CLAIM
    }]
  });

  const claim = response.body;

  const revisionData = {
    ...claim,
    decision: {
      allow: false,
      decisionCriteriaList: [{
        criteria: 'dateOfBirth',
        reason: DISALLOW_SPA
      }]
    },
    changeInfoList: [
      {
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_CLAIM_DETAILS_CONFIRMED
      },
      {
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_DISALLOWED_SPA
      }
    ]
  };

  await reviseAndAuditClaim(req, revisionData, claim, AUDIT_DISALLOW);

  req.session.startNewClaim = undefined;
  res.redirect(`/claim/${claim.claimId}/decision`);
}

module.exports = {renderPage, disallowClaim};
