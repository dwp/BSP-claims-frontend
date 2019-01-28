'use strict';

const {reviseAndAuditClaim} = require('../../lib/bsp');
const {CHANGE_HISTORY_REL_VERIFIED} = require('../../lib/constants');
const {AUDIT_VERIFY_RELATIONSHIP} = require('../../lib/audit-constants');
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

  if (req.session[claimId].relationship) {
    const {errors, values} = {...req.session[claimId].relationship} || {...req.session[claimId].relationshipVerification};
    req.session[claimId].relationship = undefined;
    return res.marko(template, {claimId, errors, values});
  }

  const claim = flattenVerifications(req.claim);
  const values = {...claim, ...claim.eligibilityCriteria};
  res.marko(template, {claimId, values});
}

function validateForm(req, res, next) {
  const values = whiteListObject(req.body, [
    'marriedAtDateOfDeath',
    'seenEvidence',
    'marriageVerifiedByCert',
    'marriageVerifiedInCIS',
    'marriageVerifiedInNIRS',
    'marriageDateDay',
    'marriageDateMonth',
    'marriageDateYear'
  ]);

  const errors = {};
  const marriageDate = getValidDate(values.marriageDateYear, values.marriageDateMonth, values.marriageDateDay);

  if (values.marriedAtDateOfDeath !== 'true' && values.marriedAtDateOfDeath !== 'false') {
    errors.marriedAtDateOfDeath = req.t('relationship:form.marriedAtDateOfDeath.errors.presence');
  } else if (values.marriedAtDateOfDeath === 'true') {
    if (values.seenEvidence !== 'true' && values.seenEvidence !== 'false') {
      errors.seenEvidence = req.t('relationship:form.seenEvidence.errors.presence');
    } else if (values.seenEvidence === 'true') {
      if (values.marriageVerifiedInCIS !== 'true' && values.marriageVerifiedInNIRS !== 'true' && values.marriageVerifiedByCert !== 'true') {
        errors.evidence = req.t('relationship:form.evidence.errors.presence');
      }

      if (isEmpty(values.marriageDateDay) && isEmpty(values.marriageDateMonth) && isEmpty(values.marriageDateYear)) {
        errors.marriageDate = req.t('relationship:form.marriageDate.errors.presence');
      } else if (isNaN(marriageDate)) {
        errors.marriageDate = req.t('relationship:form.marriageDate.errors.format');
      } else if (isFutureDate(marriageDate)) {
        errors.marriageDate = req.t('relationship:form.marriageDate.errors.future');
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    req.session[req.params.claimId].relationship = {values, errors};
    return res.redirect('back');
  }

  res.locals.values = values;
  next();
}

async function reviseClaimData(req, res) {
  const {claimId} = req.params;
  const {values} = res.locals;
  req.session[claimId].relationship = {values};

  const {claim} = req;
  const claimWithoutMarriageVerifcation = removeVerification(claim, 'marriage');

  const claimRevision = {
    ...claimWithoutMarriageVerifcation,
    eligibilityCriteria: {
      ...claim.eligibilityCriteria,
      marriedAtDateOfDeath: values.marriedAtDateOfDeath
    }
  };

  if (values.marriedAtDateOfDeath === 'true') {
    if (values.seenEvidence === 'true') {
      const newVerificationItem = createVerification('marriage', {
        verifiedByCert: values.marriageVerifiedByCert,
        verifiedInCIS: values.marriageVerifiedInCIS,
        verifiedInNIRS: values.marriageVerifiedInNIRS,
        date: getDateString(values.marriageDateYear, values.marriageDateMonth, values.marriageDateDay)
      });

      const withMarriage = reviseVerification(claimRevision, newVerificationItem);
      await reviseAndAuditClaim(req, {
        ...withMarriage,
        changeInfoList: [{
          agentIdentifier: req.user.cis.dwp_staffid,
          agentName: req.user.username,
          changeDescription: CHANGE_HISTORY_REL_VERIFIED
        }]
      }, claim, AUDIT_VERIFY_RELATIONSHIP);

      res.redirect(`/claim/${claimId}/tasks-to-complete`);
    } else {
      req.session[claimId].relationshipVerification = claimRevision;

      res.redirect(`/claim/${claimId}/verify-relationship/wait-for-evidence`);
    }
  } else {
    req.session[claimId].relationshipVerification = claimRevision;

    res.redirect(`/claim/${claimId}/verify-relationship/disallow-claim`);
  }
}

module.exports = {renderPage, validateForm, reviseClaimData};
