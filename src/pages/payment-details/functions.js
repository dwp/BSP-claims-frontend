'use strict';

const UkModulusChecking = require('uk-modulus-checking');
const {reviseClaim, reviseAndAuditClaim} = require('../../lib/bsp');
const {CHANGE_HISTORY_ADD_PAYMENT_DETAILS, CHANGE_HISTORY_NO_PAYMENT_DETAILS} = require('../../lib/constants');
const {AUDIT_CAPTURE_PAYMENT_DETAILS} = require('../../lib/audit-constants');
const isEmpty = require('../../utils/is-empty');
const isValidNameFormat = require('../../utils/is-valid-name-format');
const getInvalidNameCharacters = require('../../utils/get-invalid-name-characters');
const getInvalidRollNumberCharacters = require('../../utils/get-invalid-roll-number-characters');
const whiteListObject = require('../../utils/white-list-object');
const isValidSortCode = require('../../utils/is-valid-sort-code');
const isValidAccountNumber = require('../../utils/is-valid-account-number');
const isValidRollNumber = require('../../utils/is-valid-roll-number');
const sanitiseSortCode = require('../../utils/sanitise-sort-code');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;

  if (req.session.paymentDetails) {
    const {errors, values} = {...req.session.paymentDetails};
    req.session.paymentDetails = undefined;
    return res.marko(template, {claimId, errors, values});
  }

  const {claim} = req;
  const values = claim.paymentAccount || {};
  res.marko(template, {claimId, values, errors: {}, decision: claim.decision});
}

function validateForm(req, res, next) {
  const values = whiteListObject(req.body, [
    'detailsPresent', 'accountType', 'nameOnAccount', 'sortCode', 'accountNumber', 'rollNumber'
  ]);
  const errors = {};

  if (values.detailsPresent !== 'yes' && values.detailsPresent !== 'no') {
    errors.detailsPresent = req.t('payment-details:form.detailsPresent.errors.presence');
  } else if (values.detailsPresent === 'yes') {
    if (values.accountType !== 'UKBank' && values.accountType !== 'UKBuildingSociety') {
      errors.accountType = req.t('payment-details:form.accountType.errors.presence');
    } else if (values.accountType === 'UKBuildingSociety') {
      if (isEmpty(values.rollNumber)) {
        errors.rollNumber = req.t('payment-details:form.rollNumber.errors.presence');
      } else if (!isValidRollNumber(values.rollNumber)) {
        const invalid = getInvalidRollNumberCharacters(values.rollNumber);
        errors.rollNumber = req.t('payment-details:form.rollNumber.errors.format', {invalid});
      }
    }

    if (isEmpty(values.nameOnAccount)) {
      errors.nameOnAccount = req.t('payment-details:form.nameOnAccount.errors.presence');
    } else if (!isValidNameFormat(values.nameOnAccount)) {
      const invalid = getInvalidNameCharacters(values.nameOnAccount);
      errors.nameOnAccount = req.t('payment-details:form.nameOnAccount.errors.format', {invalid});
    }

    if (isEmpty(values.sortCode)) {
      errors.sortCode = req.t('payment-details:form.sortCode.errors.presence');
    } else if (!isValidSortCode(sanitiseSortCode(values.sortCode))) {
      errors.sortCode = req.t('payment-details:form.sortCode.errors.format');
    }

    if (isEmpty(values.accountNumber)) {
      errors.accountNumber = req.t('payment-details:form.accountNumber.errors.presence');
    } else if (!isValidAccountNumber(values.accountNumber)) {
      errors.accountNumber = req.t('payment-details:form.accountNumber.errors.format');
    }

    if (!errors.accountNumber && !errors.sortCode) {
      const isValidAccount = new UkModulusChecking({
        accountNumber: values.accountNumber,
        sortCode: sanitiseSortCode(values.sortCode)
      }).isValid();

      if (!isValidAccount) {
        errors.accountNumber = req.t('payment-details:form.accountNumber.errors.modulus');
        errors.sortCode = req.t('payment-details:form.sortCode.errors.modulus');
      }
    }
  }

  if (values.accountType === 'UKBank') {
    values.rollNumber = undefined;
  }

  if (Object.keys(errors).length > 0) {
    req.session.paymentDetails = {values, errors};
    return res.redirect('back');
  }

  res.locals.values = values;
  next();
}

async function reviseClaimData(req, res) {
  const {claimId} = req.params;
  const {values} = res.locals;

  const {claim} = req;

  if (values.detailsPresent === 'yes') {
    const claimRevision = {
      ...claim,
      paymentAccount: {
        accountType: values.accountType,
        nameOnAccount: values.nameOnAccount,
        accountNumber: values.accountNumber,
        sortCode: sanitiseSortCode(values.sortCode),
        rollNumber: values.rollNumber
      },
      changeInfoList: [{
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_ADD_PAYMENT_DETAILS
      }]
    };

    await reviseAndAuditClaim(req, claimRevision, claim, AUDIT_CAPTURE_PAYMENT_DETAILS);
  } else if (values.detailsPresent === 'no') {
    const claimRevision = {
      ...claim,
      paymentAccount: null,
      changeInfoList: [{
        agentIdentifier: req.user.cis.dwp_staffid,
        agentName: req.user.username,
        changeDescription: CHANGE_HISTORY_NO_PAYMENT_DETAILS
      }]
    };
    await reviseClaim(claimId, claimRevision);
  } else {
    throw new TypeError('invalid detailsPresent values sent to payment details controller');
  }

  res.redirect(`/claim/${claimId}/tasks-to-complete`);
}

module.exports = {renderPage, validateForm, reviseClaimData};
