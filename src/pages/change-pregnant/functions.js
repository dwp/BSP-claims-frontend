'use strict';

const get = require('lodash.get');

const whiteListObject = require('../../utils/white-list-object');
const backLinker = require('../../utils/back-link');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;

  const changeDependentChildren = get(req.session, `[${claimId}].changeDependentChildren`, {});
  const {errors = {}, values = {}} = changeDependentChildren;
  const backLink = backLinker.returnLink(req.session[claimId].changeDependentChildrenBackStack, `/claim/${claimId}/change-pregnant`);

  req.session[claimId].changeDependentChildren = undefined;

  return res.marko(template, {claimId, errors, values, backLink});
}

function validateForm(req, res, next) {
  const {claimId} = req.params;

  const values = whiteListObject(req.body, [
    'dependentChildren', 'pregnantAtDateOfDeath'
  ]);

  const errors = {};

  if (values.pregnantAtDateOfDeath !== 'true' && values.pregnantAtDateOfDeath !== 'false') {
    errors.pregnantAtDateOfDeath = req.t('dependent-children:form.pregnantAtDateOfDeath.errors.presence');
  }

  if (Object.keys(errors).length > 0) {
    req.session[claimId].changeDependentChildren = {values, errors};
    return res.redirect('back');
  }

  values.dependentChildren = 'true';

  res.locals.values = values;
  next();
}

function redirectToConfirm(req, res) {
  const {claimId} = req.params;
  const {values} = res.locals;

  req.session[claimId].changeDependentChildren = {values};
  req.session[claimId].changeDependentChildrenBackStack = backLinker.storeBackLink(`/claim/${claimId}/change-pregnant`, req.session[claimId].changeDependentChildrenBackStack);

  if (values.pregnantAtDateOfDeath === 'false') {
    res.redirect(`/claim/${claimId}/change-child-benefit`);
  } else {
    res.redirect(`/claim/${claimId}/confirm-dependent-children`);
  }
}

module.exports = {renderPage, validateForm, redirectToConfirm};
