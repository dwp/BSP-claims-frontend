'use strict';

const getDate = require('../../utils/get-valid-date');
const isEmpty = require('../../utils/is-empty');
const isFutureDate = require('../../utils/is-future-date');
const {AUDIT_STOP_CLAIM} = require('../../lib/audit-constants');
const {stopScheduleAndAudit} = require('../../lib/bsp');
const whiteListObject = require('../../utils/white-list-object');
const template = require('./template.marko');

const formFields = [
  'reason',
  'deathDateDay',
  'deathDateMonth',
  'deathDateYear',
  'prisonDateDay',
  'prisonDateMonth',
  'prisonDateYear'
];

function renderPage(req, res) {
  const {claimId} = req.params;

  if (req.session[claimId].stopClaim) {
    const {errors, values} = {...req.session[claimId].stopClaim};
    req.session[claimId].stopClaim = undefined;
    return res.marko(template, {claimId, errors, values});
  }

  const {claim} = req;
  const values = claim.stopClaim || {};
  res.marko(template, {claimId, values, errors: {}});
}

function validateForm(req, res, next) {
  const values = whiteListObject(req.body, formFields);
  const errors = {};

  const {reason} = values;
  let date;

  if (isNotAny(reason, ['death', 'prison', 'fraud', 'error', 'clerical'])) {
    errors.reason = req.t('stop:form.reason.errors.presence');
  } else if (reason === 'death' || reason === 'prison') {
    const name = reason + 'Date';
    const day = values[name + 'Day'];
    const month = values[name + 'Month'];
    const year = values[name + 'Year'];

    if (isEmpty(day) && isEmpty(month) && isEmpty(year)) {
      errors[name] = req.t(`stop:form.${name}.errors.presence`);
    } else {
      date = getDate(year, month, day);

      if (isNaN(date)) {
        errors[name] = req.t(`stop:form.${name}.errors.format`);
      } else if (isFutureDate(date)) {
        errors[name] = req.t(`stop:form.${name}.errors.future`);
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    req.session[req.params.claimId].stopClaim = {values, errors};
    return res.redirect('back');
  }

  res.locals.values = values;
  next();
}

async function stopClaim(req, res) {
  const {claimId} = req.params;
  const {values} = res.locals;

  const name = values.reason + 'Date';
  const day = values[name + 'Day'];
  const month = values[name + 'Month'];
  const year = values[name + 'Year'];
  let date = new Date();
  if (day !== undefined && month !== undefined && year !== undefined) {
    date = getDate(year, month, day);
  }

  const effectiveDate = psmDateFormat(date);

  await stopScheduleAndAudit(req, values.reason, effectiveDate, AUDIT_STOP_CLAIM);

  res.redirect(`/claim/${claimId}/payment-schedule`);
}

function isNotAny(input, validValues) {
  return !validValues.some(value => input === value);
}

function psmDateFormat(date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') +
    '-' + String(date.getDate()).padStart(2, '0');
}

module.exports = {renderPage, validateForm, stopClaim};
