'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage, reviseClaimData, rateNotChanged} = require('./functions');

const router = new express.Router();

router.get('/:claimId/confirm-dependent-children',
  renderPage
);
router.post('/:claimId/confirm-dependent-children',
  wrapAsync(reviseClaimData)
);

router.post('/:claimId/rate-not-changed',
  rateNotChanged
);

module.exports = router;
