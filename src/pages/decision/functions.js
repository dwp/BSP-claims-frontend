'use strict';

const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;
  const {claim} = req;

  if (!claim.decision) {
    return res.redirect(`/claim/${claimId}/tasks-to-complete`);
  }

  res.marko(template, {claimId, claim});
}

module.exports = {renderPage};
