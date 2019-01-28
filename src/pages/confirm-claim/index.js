'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {confirmClaimIsDecidable, renderPage, decide} = require('./functions');

const router = new express.Router();

router.get('/:claimId/confirm-claim-details',
  wrapAsync(confirmClaimIsDecidable),
  renderPage
);
router.post('/:claimId/confirm-claim-details',
  wrapAsync(confirmClaimIsDecidable),
  wrapAsync(decide)
);

module.exports = router;
