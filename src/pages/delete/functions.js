'use strict';

const {deleteClaim} = require('../../lib/bsp');

const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;
  res.marko(template, {claimId});
}

async function deleteClaimAndRedirect(req, res) {
  const {claimId, nino} = req.claim;

  await deleteClaim(req, claimId, nino);

  res.redirect('/start-new-claim');
}

module.exports = {renderPage, deleteClaimAndRedirect};
