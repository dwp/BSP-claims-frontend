'use strict';

const {reviseAndAuditClaim} = require('../../lib/bsp');
const {CHANGE_HISTORY_CHIB_VERIFIED, CHANGE_HISTORY_CHIB_NOT_VERIFIED} = require('../../lib/constants');
const {AUDIT_VERIFY_CHILD} = require('../../lib/audit-constants');
const createVerification = require('../../utils/create-verification');
const reviseVerification = require('../../utils/revise-verification');
const flattenVerifications = require('../../utils/flatten-verifications');
const isChildBenefitNumber = require('../../utils/is-child-benefit-number');
const isEmpty = require('../../utils/is-empty');
const sanitiseCHIB = require('../../utils/strip-spaces-force-uppercase');
const whiteListObject = require('../../utils/white-list-object');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;
  const {errors, values: sessionValues} = {...req.session[claimId].childBenefit};
  const values = sessionValues || flattenVerifications(req.claim);
  res.marko(template, {claimId, errors, values});
}

function validateForm(req, res, next) {
  const values = whiteListObject(req.body, [
    'childrenCHIBinCBOL', 'childrenCHIB'
  ]);
  const errors = {};

  if (values.childrenCHIBinCBOL !== 'true' && values.childrenCHIBinCBOL !== 'false') {
    errors.childrenCHIBinCBOL = req.t('child-benefit:form.childrenCHIBinCBOL.errors.presence');
  } else if (values.childrenCHIBinCBOL === 'true') {
    const sanitisedCHIB = sanitiseCHIB(values.childrenCHIB);

    if (isEmpty(sanitisedCHIB)) {
      errors.childrenCHIB = req.t('child-benefit:form.childrenCHIB.errors.presence');
    } else if (!isChildBenefitNumber(sanitisedCHIB)) {
      errors.childrenCHIB = req.t('child-benefit:form.childrenCHIB.errors.format');
    }
  }

  req.session[req.params.claimId].childBenefit = {values, errors};

  if (Object.keys(errors).length > 0) {
    return res.redirect('back');
  }

  res.locals.values = values;
  next();
}

async function reviseClaimData(req, res) {
  const {claimId} = req.params;
  const {values} = res.locals;

  const CHIBinCBOL = values.childrenCHIBinCBOL;
  const CHIB = CHIBinCBOL === 'true' && sanitiseCHIB(values.childrenCHIB);
  const changeDescription = CHIBinCBOL === 'true' ? CHANGE_HISTORY_CHIB_VERIFIED : CHANGE_HISTORY_CHIB_NOT_VERIFIED;

  const {claim} = req;
  const verifications = createVerification('children', {CHIBinCBOL, CHIB});
  const claimWithVerifcations = reviseVerification(claim, verifications);

  if (CHIBinCBOL === 'true' || (claim.eligibilityCriteria && claim.eligibilityCriteria.pregnantAtDateOfDeath)) {
    await reviseAndAuditClaim(req, {
      ...claimWithVerifcations,
      changeInfoList: [{
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription
      }]
    }, claim, AUDIT_VERIFY_CHILD);

    return res.redirect(`/claim/${claimId}/tasks-to-complete`);
  }

  req.session[claimId].childBenefitClaim = {
    ...claimWithVerifcations,
    changeInfoList: [{
      agentIdentifier: req.user.cis.dwp_staffid,
      agentName: req.user.username,
      changeDescription
    }]
  };
  res.redirect(`/claim/${claimId}/standard-rate`);
}

module.exports = {renderPage, validateForm, reviseClaimData};
