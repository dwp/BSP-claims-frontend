'use strict';
const {getClaim} = require('../lib/bsp');
const pino = require('../utils/pino');
const wrapAsync = require('../utils/wrap-async');

const urlList = {
  unfinished: [
    '/claim-details',
    '/confirm-claim-details',
    '/decision',
    '/dependent-children',
    '/disallow-claim',
    '/payment-details',
    '/standard-rate',
    '/tasks-to-complete',
    '/verify-child-benefit',
    '/verify-death',
    '/verify-national-insurance',
    '/verify-relationship',
    '/wait-for-death',
    '/wait-for-evidence',
    '/delete'
  ],
  finished: [
    '/view',
    '/decision',
    '/payment-schedule',
    '/change-dependent-children',
    '/change-pregnant',
    '/change-child-benefit',
    '/change-payment-details',
    '/confirm-dependent-children',
    '/confirm-payment-details',
    '/stop',
    '/rate-not-changed'
  ]
};

async function gateKeeper(req, res, next) {
  const {claimId} = req.params;
  req.session[claimId] = req.session[claimId] || {};

  if (claimId) {
    try {
      req.claim = await getClaim(claimId);

      const claimState = req.claim.decision === null ? 'unfinished' : 'finished';
      const allowedAccess = urlList[claimState].some(allowedUrl => req.originalUrl.match(allowedUrl));

      if (allowedAccess) {
        return next();
      }

      pino.warn('User tried to access a restricted URL for a claim');

      if (claimState === 'finished') {
        res.redirect('/start-new-claim');
      } else {
        res.redirect(`/claim/${claimId}/tasks-to-complete`);
      }
    } catch (error) {
      throw error;
    }
  }

  next();
}

module.exports = wrapAsync(gateKeeper);
