'use strict';

const constants = require('../../lib/constants');
const {AUDIT_DEPENDENT_CHILDREN} = require('../../lib/audit-constants');
const {reviseAndAuditClaim} = require('../../lib/bsp');
const whiteListObject = require('../../utils/white-list-object');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;

  if (req.session[claimId].dependentChildren) {
    const {errors, values} = {...req.session[claimId].dependentChildren};
    req.session[claimId].dependentChildren = undefined;
    return res.marko(template, {claimId, errors, values});
  }

  const {claim} = req;
  const values = claim.eligibilityCriteria || {};
  res.marko(template, {claimId, values, errors: {}});
}

function validateForm(req, res, next) {
  const values = whiteListObject(req.body, [
    'dependentChildren', 'pregnantAtDateOfDeath'
  ]);

  const errors = {};

  if (values.dependentChildren !== 'true' && values.dependentChildren !== 'false') {
    errors.dependentChildren = req.t('dependent-children:form.dependentChildren.errors.presence');
  }

  if (values.pregnantAtDateOfDeath !== 'true' && values.pregnantAtDateOfDeath !== 'false') {
    errors.pregnantAtDateOfDeath = req.t('dependent-children:form.pregnantAtDateOfDeath.errors.presence');
  }

  if (Object.keys(errors).length > 0) {
    req.session[req.params.claimId].dependentChildren = {values, errors};
    return res.redirect('back');
  }

  res.locals.values = values;
  next();
}

async function reviseClaimData(req, res) {
  const {claimId} = req.params;
  const {dependentChildren, pregnantAtDateOfDeath} = res.locals.values;
  const {claim} = req;

  const changeDescriptionKey = 'CHANGE_HISTORY_DEPENDENT_CHILDREN' +
    (dependentChildren === 'true' ? '_YES' : '_NO') +
    (pregnantAtDateOfDeath === 'true' ? '_PREGNANT' : '');

  await reviseAndAuditClaim(req, {
    ...claim,
    eligibilityCriteria: {
      ...claim.eligibilityCriteria,
      dependentChildren,
      pregnantAtDateOfDeath
    },
    changeInfoList: [{
      agentIdentifier: req.user.cis.dwp_staffid,
      agentName: req.user.username,
      changeDescription: constants[changeDescriptionKey]
    }]
  }, claim, AUDIT_DEPENDENT_CHILDREN);

  res.redirect(`/claim/${claimId}/tasks-to-complete`);
}

module.exports = {renderPage, validateForm, reviseClaimData};
