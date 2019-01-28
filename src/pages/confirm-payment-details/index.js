'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage, reviseClaimData} = require('./functions');

const router = new express.Router();

router.get('/:claimId/confirm-payment-details',
  renderPage
);
router.post('/:claimId/confirm-payment-details',
  wrapAsync(reviseClaimData)
);

module.exports = router;
