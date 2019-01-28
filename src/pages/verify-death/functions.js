'use strict';

const {reviseAndAuditClaim} = require('../../lib/bsp');
const {CHANGE_HISTORY_DEATH_VERIFIED} = require('../../lib/constants');
const {AUDIT_VERIFY_DEATH} = require('../../lib/audit-constants');
const getValidDate = require('../../utils/get-valid-date');
const getDateString = require('../../utils/get-date-string');
const flattenVerifications = require('../../utils/flatten-verifications');
const isEmpty = require('../../utils/is-empty');
const isFutureDate = require('../../utils/is-future-date');
const createVerification = require('../../utils/create-verification');
const reviseVerification = require('../../utils/revise-verification');
const removeVerification = require('../../utils/remove-verification');
const whiteListObject = require('../../utils/white-list-object');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;
  const {errors, values: sessionValues} = {...req.session[claimId].death};
  const values = sessionValues || flattenVerifications(req.claim);
  req.session[claimId].death = undefined;
  res.marko(template, {claimId, errors, values});
}

function validateForm(req, res, next) {
  const values = whiteListObject(req.body, [
    'seenEvidence',
    'deathVerifiedByCert',
    'deathVerifiedInCIS',
    'deathVerifiedInNIRS',
    'deathVerifiedByBS',
    'deathDateDay',
    'deathDateMonth',
    'deathDateYear'
  ]);

  const errors = {};
  const deathDate = getValidDate(values.deathDateYear, values.deathDateMonth, values.deathDateDay);

  if (values.seenEvidence !== 'true' && values.seenEvidence !== 'false') {
    errors.seenEvidence = req.t('verify-death:form.seenEvidence.errors.presence');
  } else if (values.seenEvidence === 'true') {
    if (values.deathVerifiedInCIS !== 'true' && values.deathVerifiedInNIRS !== 'true' &&
      values.deathVerifiedByCert !== 'true' && values.deathVerifiedByBS !== 'true') {
      errors.evidence = req.t('verify-death:form.evidence.errors.presence');
    }

    if (isEmpty(values.deathDateDay) && isEmpty(values.deathDateMonth) && isEmpty(values.deathDateYear)) {
      errors.deathDate = req.t('verify-death:form.deathDate.errors.presence');
    } else if (isNaN(deathDate)) {
      errors.deathDate = req.t('verify-death:form.deathDate.errors.format');
    } else if (isFutureDate(deathDate)) {
      errors.deathDate = req.t('verify-death:form.deathDate.errors.future');
    }
  }

  if (Object.keys(errors).length > 0) {
    req.session[req.params.claimId].death = {values, errors};
    return res.redirect('back');
  }

  res.locals.values = values;
  next();
}

async function reviseClaimData(req, res) {
  const {claimId} = req.params;
  const {values} = res.locals;

  const {claim} = req;

  if (values.seenEvidence === 'true') {
    const newVerificationItem = createVerification('death', {
      verifiedByCert: values.deathVerifiedByCert,
      verifiedInCIS: values.deathVerifiedInCIS,
      verifiedInNIRS: values.deathVerifiedInNIRS,
      verifiedByBS: values.deathVerifiedByBS,
      date: getDateString(values.deathDateYear, values.deathDateMonth, values.deathDateDay)
    });

    const withDeathVerification = reviseVerification(claim, newVerificationItem);
    await reviseAndAuditClaim(req, {
      ...withDeathVerification,
      changeInfoList: [{
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_DEATH_VERIFIED
      }]
    }, claim, AUDIT_VERIFY_DEATH);

    res.redirect(`/claim/${claimId}/tasks-to-complete`);
  } else {
    const claimWithoutDeathVerifcation = removeVerification(claim, 'death');

    req.session[claimId].death = {values};

    req.session[claimId].deathVerification = claimWithoutDeathVerifcation;

    res.redirect(`/claim/${claimId}/verify-death/wait-for-evidence`);
  }
}

module.exports = {renderPage, validateForm, reviseClaimData};
