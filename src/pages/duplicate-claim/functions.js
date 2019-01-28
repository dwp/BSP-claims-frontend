'use strict';

const get = require('lodash.get');
const whiteListObject = require('../../utils/white-list-object');

const template = require('./template.marko');

function renderPage(req, res) {
  if (!req.session.startNewClaim && !req.session.duplicateClaim) {
    res.redirect('/start-new-claim');
  }

  const claim = req.session.duplicateClaim;
  const scheduleId = get(claim, 'schedule.scheduleId', undefined);

  if (req.session.continueClaim) {
    const {errors, values} = {...req.session.continueClaim};
    req.session.continueClaim = undefined;
    return res.marko(template, {claim, scheduleId, errors, values});
  }

  res.marko(template, {claim, scheduleId, values: {}, errors: {}});
}

function validateForm(req, res, next) {
  const values = whiteListObject(req.body, [
    'continueClaim'
  ]);
  const errors = {};

  if (values.continueClaim !== 'true' && values.continueClaim !== 'false') {
    errors.presence = req.t('duplicate-claim:unfinishedClaim.errors.presence');
  }

  if (Object.keys(errors).length > 0) {
    req.session.continueClaim = {values, errors};
    return res.redirect('back');
  }

  res.locals.values = values;
  next();
}

function redirect(req, res) {
  const {values} = res.locals;
  const {claimId} = req.session.duplicateClaim;
  req.session.duplicateClaim = undefined;
  req.session.startNewClaim = undefined;

  if (values.continueClaim === 'true') {
    res.redirect(`/claim/${claimId}/tasks-to-complete`);
  } else {
    res.redirect('/start-new-claim');
  }
}

module.exports = {renderPage, validateForm, redirect};
