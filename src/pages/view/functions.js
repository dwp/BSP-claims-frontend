'use strict';

const {getClaimAndAudit} = require('../../lib/bsp');
const flattenVerifications = require('../../utils/flatten-verifications');
const backLinker = require('../../utils/back-link');
const resetSession = require('../../utils/reset-session');
const template = require('./template.marko');

async function redirectToTasks(req, res, next) {
  let claim = {};
  const {claimId} = req.params;
  if (req.session[claimId].visited) {
    claim = req.claim;
  } else {
    claim = await getClaimAndAudit(req, claimId);
    req.session[claimId].visited = true;
  }

  if (!claim.decision) {
    return res.redirect('tasks-to-complete');
  }

  res.locals.claim = claim;

  next();
}

function renderPage(req, res) {
  const claim = flattenVerifications(res.locals.claim);

  resetSession(req);

  req.session[claim.claimId].changeOrigin = 'view';
  req.session[claim.claimId].changeDependentChildrenBackStack = backLinker.storeBackLink('view', req.session[claim.claimId].changeDependentChildrenBackStack);
  res.marko(template, {claim});
}

module.exports = {redirectToTasks, renderPage};
