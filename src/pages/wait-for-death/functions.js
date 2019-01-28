'use strict';

const {reviseAndAuditClaim} = require('../../lib/bsp');
const {CHANGE_HISTORY_DEATH_NOT_VERIFIED} = require('../../lib/constants');
const {AUDIT_VERIFY_DEATH} = require('../../lib/audit-constants');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;
  const {claim} = req;
  const fullName = claim.claimantDetails && claim.claimantDetails.fullName;
  const {values, errors} = {...req.session[claimId].waitForDeath};
  req.session[claimId].waitForDeath = undefined;
  res.marko(template, {claimId, errors, values, fullName});
}

function validateForm(req, res, next) {
  const {wait} = req.body;

  if (wait !== 'Y' && wait !== 'N') {
    const errors = {wait: req.t('wait-for-death:form.wait.errors')};
    req.session[req.params.claimId].waitForDeath = {errors};
    return res.redirect('back');
  }

  res.locals.values = wait;
  next();
}

async function redirectAndReviseClaim(req, res) {
  const {claimId} = req.params;
  const {values} = res.locals;
  const claim = req.session[claimId].deathVerification;
  req.session[claimId].waitForDeath = {values};

  if (values === 'Y') {
    req.session[claimId].deathVerification = undefined;
    req.session[claimId].waitForDeath = undefined;
    if (claim) {
      await reviseAndAuditClaim(req, {
        ...claim,
        changeInfoList: [{
          agentIdentifier: req.user.cis.dwp_staffid,
          agentName: req.user.username,
          changeDescription: CHANGE_HISTORY_DEATH_NOT_VERIFIED
        }]
      }, claim, AUDIT_VERIFY_DEATH);
    }

    return res.redirect(`/claim/${claimId}/tasks-to-complete`);
  }

  res.redirect(`/claim/${claimId}/verify-death/wait-for-evidence/disallow-claim`);
}

module.exports = {renderPage, validateForm, redirectAndReviseClaim};
