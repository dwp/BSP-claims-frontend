'use strict';

const get = require('lodash.get');
const UkModulusChecking = require('uk-modulus-checking');
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
  const changePayment = get(req.session, `[${claimId}].changePayment`, {});

  const {errors = {}, values = {}} = changePayment;
  const backLinkPath = req.session.changePaymentDetailsOrigin || 'payment-schedule';
  const backLink = `/claim/${claimId}/${backLinkPath}`;

  req.session[claimId].changePayment = undefined;

  return res.marko(template, {claimId, errors, values, backLink});
}

function validateForm(req, res, next) {
  const {claimId} = req.params;
  const values = whiteListObject(req.body, [
    'accountType', 'nameOnAccount', 'sortCode', 'accountNumber', 'rollNumber'
  ]);
  const errors = {};

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

  if (values.accountType === 'UKBank') {
    values.rollNumber = undefined;
  }

  if (Object.keys(errors).length > 0) {
    req.session[claimId].changePayment = {values, errors};
    return res.redirect('back');
  }

  res.locals.values = values;
  next();
}

function redirectToConfirm(req, res) {
  const {claimId} = req.params;
  const {values} = res.locals;

  req.session[claimId].changePayment = {values};

  res.redirect(`/claim/${claimId}/confirm-payment-details`);
}

module.exports = {renderPage, validateForm, redirectToConfirm};
