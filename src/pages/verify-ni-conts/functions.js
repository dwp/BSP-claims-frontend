'use strict';

const {reviseAndAuditClaim} = require('../../lib/bsp');
const {CHANGE_HISTORY_NICONTS_VERIFIED} = require('../../lib/constants');
const {AUDIT_VERIFY_NICONTS} = require('../../lib/audit-constants');
const createVerification = require('../../utils/create-verification');
const reviseVerification = require('../../utils/revise-verification');
const flattenVerifications = require('../../utils/flatten-verifications');
const removeVerification = require('../../utils/remove-verification');
const isFutureTaxYear = require('../../utils/is-future-tax-year');
const isEmpty = require('../../utils/is-empty');
const whiteListObject = require('../../utils/white-list-object');
const template = require('./template.marko');

const isValidYear = /^\d{4}$/;

function renderPage(req, res) {
  const {claimId} = req.params;

  if (req.session[claimId].niConts) {
    const {errors, values} = {...req.session[claimId].niConts};
    req.session[claimId].niConts = undefined;
    return res.marko(template, {claimId, errors, values});
  }

  const {claim} = req;
  const flattenVer = flattenVerifications(claim);
  const values = {
    niContsYear: flattenVer.niContsYear,
    sufficientNIContributions: flattenVer.eligibilityCriteria && flattenVer.eligibilityCriteria.sufficientNIContributions
  };

  res.marko(template, {claimId, values, errors: {}});
}

function validateForm(req, res, next) {
  const values = whiteListObject(req.body, [
    'sufficientNIContributions', 'niContsYear'
  ]);
  const errors = {};

  const parsedYear = parseInt(values.niContsYear, 10);

  if (values.sufficientNIContributions !== 'true' && values.sufficientNIContributions !== 'false') {
    errors.sufficientNIContributions = req.t('verify-ni-conts:form.sufficientNIContributions.errors.presence');
  } else if (values.sufficientNIContributions === 'true') {
    if (isEmpty(values.niContsYear)) {
      errors.niContsYear = req.t('verify-ni-conts:form.niContsYear.errors.presence');
    } else if (!isValidYear.test(values.niContsYear)) {
      errors.niContsYear = req.t('verify-ni-conts:form.niContsYear.errors.format.notNumber');
    } else if (parsedYear < 1975) {
      errors.niContsYear = req.t('verify-ni-conts:form.niContsYear.errors.format.before1975');
    } else if (isFutureTaxYear(parsedYear)) {
      errors.niContsYear = req.t('verify-ni-conts:form.niContsYear.errors.format.futureYear');
    }
  }

  if (Object.keys(errors).length > 0) {
    req.session[req.params.claimId].niConts = {values, errors};
    return res.redirect('back');
  }

  res.locals.values = values;
  next();
}

async function reviseClaimData(req, res) {
  const {claimId} = req.params;
  const {values} = res.locals;
  req.session[claimId].niConts = {values};

  const {claim} = req;
  if (values.sufficientNIContributions === 'true') {
    const verifications = createVerification('niConts', {year: values.niContsYear});
    const claimWithVerifcations = reviseVerification(claim, verifications);
    const claimRevision = {
      ...claimWithVerifcations,
      eligibilityCriteria: {
        ...claim.eligibilityCriteria,
        sufficientNIContributions: values.sufficientNIContributions
      },
      changeInfoList: [{
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_NICONTS_VERIFIED
      }]
    };
    await reviseAndAuditClaim(req, claimRevision, claim, AUDIT_VERIFY_NICONTS);
    res.redirect(`/claim/${claimId}/tasks-to-complete`);
  } else {
    const claimWithoutVerification = removeVerification(claim, 'niConts');
    const claimRevision = {
      ...claimWithoutVerification,
      eligibilityCriteria: {
        ...claim.eligibilityCriteria,
        sufficientNIContributions: values.sufficientNIContributions
      }
    };
    req.session[claimId].verifyNiConts = claimRevision;

    res.redirect(`/claim/${claimId}/verify-national-insurance/disallow-claim`);
  }
}

module.exports = {renderPage, validateForm, reviseClaimData};
