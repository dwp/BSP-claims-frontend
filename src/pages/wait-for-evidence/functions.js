'use strict';

const {CHANGE_HISTORY_REL_NOT_VERIFIED} = require('../../lib/constants');
const {reviseClaim} = require('../../lib/bsp');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;
  const {claim} = req;
  const fullName = claim.claimantDetails && claim.claimantDetails.fullName;
  const {values, errors} = {...req.session[claimId].waitForEvidence};
  req.session[claimId].waitForEvidence = undefined;
  res.marko(template, {claimId, errors, values, fullName});
}

function validateForm(req, res, next) {
  const {wait} = req.body;

  if (wait !== 'Y' && wait !== 'N') {
    const errors = {wait: req.t('wait-for-evidence:form.wait.errors')};
    req.session[req.params.claimId].waitForEvidence = {errors};
    return res.redirect('back');
  }

  res.locals.values = wait;
  next();
}

async function redirect(req, res) {
  const {claimId} = req.params;
  const {wait} = req.body;
  const {values} = res.locals;
  req.session[claimId].waitForEvidence = {values};

  if (wait === 'Y') {
    await reviseClaim(claimId, {
      ...req.session[claimId].relationshipVerification,
      changeInfoList: [{
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_REL_NOT_VERIFIED
      }]
    });
    return res.redirect(`/claim/${claimId}/tasks-to-complete`);
  }

  res.redirect(`/claim/${claimId}/verify-relationship/wait-for-evidence/disallow-claim`);
}

module.exports = {renderPage, validateForm, redirect};
