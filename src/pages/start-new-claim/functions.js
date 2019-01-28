'use strict';

const {newClaimant, newClaim} = require('../../lib/bsp');
const {CHANGE_HISTORY_NEW_CLAIM} = require('../../lib/constants');
const whiteListObject = require('../../utils/white-list-object');
const isEmpty = require('../../utils/is-empty');
const isNino = require('../../utils/is-national-insurance-number');
const isFutureDate = require('../../utils/is-future-date');
const isValidNameFormat = require('../../utils/is-valid-name-format');
const formToApi = require('../../utils/new-claim-data-to-api');
const getValidDate = require('../../utils/get-valid-date');
const getInvalidNameCharacters = require('../../utils/get-invalid-name-characters');
const sanitiseNino = require('../../utils/strip-spaces-force-uppercase');
const checkPensionAgeEligibility = require('../../utils/check-pension-eligibility');
const template = require('./template.marko');

const BSP_START_DATE = new Date('2017-04-06');

function renderPage(req, res) {
  if (req.session.duplicateClaim) {
    const values = {...req.session.duplicateClaim.original};
    req.session.duplicateClaim = undefined;
    return res.marko(template, {values, errors: {}});
  }

  if (req.session.startNewClaim) {
    const {errors, values} = {...req.session.startNewClaim};
    req.session.startNewClaim = undefined;
    return res.marko(template, {errors, values});
  }

  res.marko(template, {});
}

function validateForm(req, res, next) {
  const values = whiteListObject(req.body, [
    'nino',
    'title',
    'fullName',
    'sex',
    'dateOfBirthDay',
    'dateOfBirthMonth',
    'dateOfBirthYear',
    'partnerNino',
    'partnerTitle',
    'partnerFullName',
    'dateOfDeathDay',
    'dateOfDeathMonth',
    'dateOfDeathYear',
    'dateOfClaimDay',
    'dateOfClaimMonth',
    'dateOfClaimYear'
  ]);

  const errors = {};
  const sanitisedNino = sanitiseNino(values.nino);
  const dateOfBirth = getValidDate(values.dateOfBirthYear, values.dateOfBirthMonth, values.dateOfBirthDay);
  const dateOfDeath = getValidDate(values.dateOfDeathYear, values.dateOfDeathMonth, values.dateOfDeathDay);
  const dateOfClaim = getValidDate(values.dateOfClaimYear, values.dateOfClaimMonth, values.dateOfClaimDay);

  if (isEmpty(values.title)) {
    errors.title = req.t('start-new-claim:form.title.errors.presence');
  } else if (!isValidNameFormat(values.title)) {
    const invalid = getInvalidNameCharacters(values.title);
    errors.title = req.t('start-new-claim:form.title.errors.format', {invalid});
  }

  if (isEmpty(values.fullName)) {
    errors.fullName = req.t('start-new-claim:form.fullName.errors.presence');
  } else if (!isValidNameFormat(values.fullName)) {
    const invalid = getInvalidNameCharacters(values.fullName);
    errors.fullName = req.t('start-new-claim:form.fullName.errors.format', {invalid});
  }

  if (isEmpty(values.nino)) {
    errors.nino = req.t('start-new-claim:form.nino.errors.presence');
  } else if (!isNino(sanitisedNino)) {
    errors.nino = req.t('start-new-claim:form.nino.errors.format');
  }

  if (isEmpty(values.dateOfBirthDay) && isEmpty(values.dateOfBirthMonth) && isEmpty(values.dateOfBirthYear)) {
    errors.dateOfBirth = req.t('start-new-claim:form.dateOfBirth.errors.presence');
  } else if (isNaN(dateOfBirth)) {
    errors.dateOfBirth = req.t('start-new-claim:form.dateOfBirth.errors.format');
  } else if (isFutureDate(dateOfBirth)) {
    errors.dateOfBirth = req.t('start-new-claim:form.dateOfBirth.errors.future');
  }

  if (values.sex !== 'Male' && values.sex !== 'Female') {
    errors.sex = req.t('start-new-claim:form.sex.errors.presence');
  }

  if (isEmpty(values.partnerTitle)) {
    errors.partnerTitle = req.t('start-new-claim:form.partnerTitle.errors.presence');
  } else if (!isValidNameFormat(values.partnerTitle)) {
    const invalid = getInvalidNameCharacters(values.partnerTitle);
    errors.partnerTitle = req.t('start-new-claim:form.partnerTitle.errors.format', {invalid});
  }

  if (isEmpty(values.partnerFullName)) {
    errors.partnerFullName = req.t('start-new-claim:form.partnerFullName.errors.presence');
  } else if (!isValidNameFormat(values.partnerFullName)) {
    const invalid = getInvalidNameCharacters(values.partnerFullName);
    errors.partnerFullName = req.t('start-new-claim:form.partnerFullName.errors.format', {invalid});
  }

  if (isEmpty(values.partnerNino)) {
    errors.partnerNino = req.t('start-new-claim:form.partnerNino.errors.presence');
  } else if (!isNino(sanitiseNino(values.partnerNino))) {
    errors.partnerNino = req.t('start-new-claim:form.partnerNino.errors.format');
  }

  if (isEmpty(values.dateOfDeathDay) && isEmpty(values.dateOfDeathMonth) && isEmpty(values.dateOfDeathYear)) {
    errors.dateOfDeath = req.t('start-new-claim:form.dateOfDeath.errors.presence');
  } else if (isNaN(dateOfDeath)) {
    errors.dateOfDeath = req.t('start-new-claim:form.dateOfDeath.errors.format');
  } else if (isFutureDate(dateOfDeath)) {
    errors.dateOfDeath = req.t('start-new-claim:form.dateOfDeath.errors.future');
  } else if (dateOfDeath < BSP_START_DATE) {
    errors.dateOfDeath = req.t('start-new-claim:form.dateOfDeath.errors.eligibility');
  }

  if (isEmpty(values.dateOfClaimDay) && isEmpty(values.dateOfClaimMonth) && isEmpty(values.dateOfClaimYear)) {
    errors.dateOfClaim = req.t('start-new-claim:form.dateOfClaim.errors.presence');
  } else if (isNaN(dateOfClaim)) {
    errors.dateOfClaim = req.t('start-new-claim:form.dateOfClaim.errors.format');
  } else if (isFutureDate(dateOfClaim)) {
    errors.dateOfClaim = req.t('start-new-claim:form.dateOfClaim.errors.future');
  } else if (dateOfClaim < BSP_START_DATE) {
    errors.dateOfClaim = req.t('start-new-claim:form.dateOfClaim.errors.eligibility');
  }

  if ((!errors.dateOfClaim && !errors.dateOfBirth) && isFutureDate(dateOfBirth, dateOfClaim)) {
    errors.dateOfBirth = req.t('start-new-claim:form.dateOfBirth.errors.afterDateOfClaim');
    errors.dateOfClaim = req.t('start-new-claim:form.dateOfClaim.errors.beforeDateOfBirth');
  }

  if ((!errors.dateOfClaim && !errors.dateOfDeath) && isFutureDate(dateOfDeath, dateOfClaim)) {
    errors.dateOfDeath = req.t('start-new-claim:form.dateOfDeath.errors.afterDateOfClaim');
    errors.dateOfClaim = req.t('start-new-claim:form.dateOfClaim.errors.beforeDateOfDeath');
  }

  if ((!errors.dateOfDeath && !errors.dateOfBirth) && isFutureDate(dateOfBirth, dateOfDeath)) {
    errors.dateOfBirth = req.t('start-new-claim:form.dateOfBirth.errors.afterDateOfDeath');
    errors.dateOfDeath = req.t('start-new-claim:form.dateOfDeath.errors.beforeDateOfBirth');
  }

  if ((!errors.nino && !errors.partnerNino) && values.nino === values.partnerNino) {
    errors.nino = req.t('start-new-claim:form.nino.errors.ninoMatchPartner');
    errors.partnerNino = req.t('start-new-claim:form.partnerNino.errors.ninoMatchClaimant');
  }

  if (Object.keys(errors).length > 0) {
    req.session.startNewClaim = {values, errors};
    return res.redirect('back');
  }

  res.locals.values = values;

  next();
}

function checkSPA(req, res, next) {
  if (checkPensionAgeEligibility(res.locals.values)) {
    req.session.startNewClaim = {values: res.locals.values};
    return res.redirect('/claim/disallow-claim-state-pension-age');
  }

  next();
}

async function setupClaim(req, res) {
  const {values} = res.locals;

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

  res.redirect(`/claim/${response.body.claimId}/tasks-to-complete`);
}

module.exports = {renderPage, validateForm, checkSPA, setupClaim};
