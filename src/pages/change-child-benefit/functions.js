'use strict';

const get = require('lodash.get');
const isChildBenefitNumber = require('../../utils/is-child-benefit-number');
const isEmpty = require('../../utils/is-empty');
const sanitiseCHIB = require('../../utils/strip-spaces-force-uppercase');
const whiteListObject = require('../../utils/white-list-object');
const backLinker = require('../../utils/back-link');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;

  const changeChildBenefitNumber = get(req.session, `[${claimId}].changeChildBenefitNumber`, {});
  const {errors = {}, values = {}} = changeChildBenefitNumber;
  const backLink = backLinker.returnLink(req.session[claimId].changeDependentChildrenBackStack, `/claim/${claimId}/change-child-benefit`);

  req.session[claimId].changeChildBenefitNumber = undefined;
  res.marko(template, {claimId, errors, values, backLink});
}

function validateForm(req, res, next) {
  const {claimId} = req.params;
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

  if (Object.keys(errors).length > 0) {
    req.session[claimId].changeChildBenefitNumber = {values, errors};
    return res.redirect('back');
  }

  res.locals.values = {...values};
  next();
}

function redirectToConfirm(req, res) {
  const {claimId} = req.params;
  let {values} = res.locals;

  if (values.childrenCHIBinCBOL === 'false') {
    values = {...values, childrenCHIB: false};
  }

  req.session[claimId].changeChildBenefitNumber = {values};
  req.session[claimId].changeDependentChildren = {values: {dependentChildren: 'true', pregnantAtDateOfDeath: 'false'}};
  req.session[claimId].changeDependentChildrenBackStack = backLinker.storeBackLink(`/claim/${claimId}/change-child-benefit`, req.session[claimId].changeDependentChildrenBackStack);

  res.redirect(`/claim/${claimId}/confirm-dependent-children`);
}

module.exports = {renderPage, validateForm, redirectToConfirm};
