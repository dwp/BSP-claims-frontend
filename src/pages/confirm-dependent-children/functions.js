'use strict';

const get = require('lodash.get');
const findIndex = require('lodash.findindex');

const constants = require('../../lib/constants');
const auditConstants = require('../../lib/audit-constants');
const audit = require('../../utils/audit');
const {reviseAndAuditClaim} = require('../../lib/bsp');
const createVerification = require('../../utils/create-verification');
const reviseVerification = require('../../utils/revise-verification');
const sanitiseCHIB = require('../../utils/strip-spaces-force-uppercase');
const backLinker = require('../../utils/back-link');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;
  const {claim} = req;
  const backLink = backLinker.returnLink(req.session[claimId].changeDependentChildrenBackStack, `/claim/${claimId}/confirm-dependent-children`);

  if (req.session[claimId].changeDependentChildren === undefined &&
    req.session[claimId].changeChildBenefitNumber === undefined) {
    return res.redirect(backLink);
  }

  const changeDependentChildren = get(req.session, `[${claimId}].changeDependentChildren.values`, {});
  const changeChildBenefitNumber = get(req.session, `[${claimId}].changeChildBenefitNumber.values`, {});

  const changeDetails = Object.assign(changeDependentChildren, changeChildBenefitNumber);

  const childIndex = findIndex(claim.verificationList, o => {
    return o.category === 'children';
  });
  let pastCHIB = false;
  if (childIndex !== -1) {
    const attributeIndex = findIndex(claim.verificationList[childIndex].verificationAttributeList, o => {
      return o.attributeName === 'CHIBinCBOL';
    });
    if (attributeIndex !== -1) {
      pastCHIB = claim.verificationList[childIndex].verificationAttributeList[attributeIndex].attributeValue;
    }
  }

  const isSame = changeDetails.dependentChildren === claim.eligibilityCriteria.dependentChildren.toString() &&
   (changeDetails.childrenCHIBinCBOL === pastCHIB || changeDetails.childrenCHIBinCBOL === undefined) &&
   changeDetails.pregnantAtDateOfDeath === claim.eligibilityCriteria.pregnantAtDateOfDeath.toString();

  res.marko(template, {claimId, isSame, changeDetails, backLink});
}

async function reviseClaimData(req, res) {
  const {claimId} = req.params;
  const backLink = req.session[claimId].changeDependentChildrenBackStack || `/claim/${claimId}/change-dependent-children`;

  if (req.session[claimId].changeDependentChildren === undefined &&
    req.session[claimId].changeChildBenefitNumber === undefined) {
    return res.redirect(backLink);
  }

  const changeDependentChildren = get(req.session, `[${claimId}].changeDependentChildren.values`, {});
  const changeChildBenefitNumber = get(req.session, `[${claimId}].changeChildBenefitNumber.values`, {});

  const {dependentChildren, pregnantAtDateOfDeath, childrenCHIBinCBOL, childrenCHIB} = changeDependentChildren || changeChildBenefitNumber;

  const {claim} = req;

  const changeInfoList = [];

  if (pregnantAtDateOfDeath) {
    const changeDescriptionKey = 'CHANGE_HISTORY_DEPENDENT_CHILDREN' +
      (dependentChildren === 'true' ? '_YES' : '_NO') +
      (pregnantAtDateOfDeath === 'true' ? '_PREGNANT' : '');
    changeInfoList.push({
      agentIdentifier: req.user.cis.dwp_staffid,
      agentName: req.user.username,
      changeDescription: constants[changeDescriptionKey]
    });
  }

  if (childrenCHIBinCBOL === 'true') {
    changeInfoList.push({
      agentIdentifier: req.user.cis.dwp_staffid,
      agentName: req.user.username,
      changeDescription: constants.CHANGE_HISTORY_CHIB_VERIFIED
    });
  } else if (dependentChildren === 'true' && childrenCHIBinCBOL === 'false') {
    changeInfoList.push({
      agentIdentifier: req.user.cis.dwp_staffid,
      agentName: req.user.username,
      changeDescription: constants.CHANGE_HISTORY_CHIB_NOT_VERIFIED
    });
  }

  if (pregnantAtDateOfDeath === 'true' || childrenCHIBinCBOL === 'true') {
    changeInfoList.push({
      agentIdentifier: req.user.cis.dwp_staffid,
      agentName: req.user.username,
      changeDescription: constants.CHANGE_HISTORY_RATE
    });
  }

  let revisedClaim = {
    ...claim,
    eligibilityCriteria: {
      ...claim.eligibilityCriteria,
      dependentChildren,
      pregnantAtDateOfDeath
    },
    changeInfoList
  };

  if (childrenCHIBinCBOL === 'true') {
    const CHIBinCBOL = childrenCHIBinCBOL;
    const CHIB = CHIBinCBOL === 'true' && sanitiseCHIB(childrenCHIB);

    const verifications = createVerification('children', {CHIBinCBOL, CHIB});
    revisedClaim = reviseVerification(revisedClaim, verifications);
  }

  await reviseAndAuditClaim(req, revisedClaim, claim, auditConstants.AUDIT_UPRATE_CLAIM);

  res.redirect(`/claim/${claimId}/payment-schedule`);
}

function rateNotChanged(req, res) {
  const {claimId} = req.params;
  const {interactionId} = req.headers;

  const changeDependentChildren = get(req.session, `[${claimId}].changeDependentChildren.values`, {});
  const changeChildBenefitNumber = get(req.session, `[${claimId}].changeChildBenefitNumber.values`, {});

  const {dependentChildren, pregnantAtDateOfDeath, childrenCHIBinCBOL, childrenCHIB} = changeDependentChildren || changeChildBenefitNumber;
  const {claim} = req;

  const revisionData = {
    ...claim,
    eligibilityCriteria: {
      ...claim.eligibilityCriteria,
      dependentChildren,
      pregnantAtDateOfDeath,
      childrenCHIBinCBOL,
      childrenCHIB
    }
  };

  const auditMessage = audit.buildAuditObject(req.user, claim, revisionData, auditConstants.AUDIT_UPRATE_CLAIM, interactionId);

  audit.sendMessage(auditMessage);

  res.redirect(`/claim/${claimId}/payment-schedule`);
}

module.exports = {renderPage, reviseClaimData, rateNotChanged};
