'use strict';

const backLinker = require('../../utils/back-link');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claim} = req;

  req.session[req.params.claimId] = {};

  req.session[req.params.claimId].changeOrigin = 'payment-schedule';
  req.session[req.params.claimId].changeDependentChildrenBackStack = backLinker.storeBackLink('payment-schedule', req.session[req.params.claimId].changeDependentChildrenBackStack);

  res.marko(template, {claim});
}

module.exports = {renderPage};
