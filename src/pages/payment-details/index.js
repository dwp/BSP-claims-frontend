'use strict';

const express = require('express');
const warpAsync = require('../../utils/wrap-async');
const {renderPage, validateForm, reviseClaimData} = require('./functions');

const router = new express.Router();

router.get('/:claimId/payment-details', renderPage);
router.post('/:claimId/payment-details', validateForm, warpAsync(reviseClaimData));

module.exports = router;
