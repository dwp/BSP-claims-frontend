'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage, validateForm, reviseClaimData} = require('./functions');

const router = new express.Router();

router.get('/:claimId/verify-death', renderPage);
router.post('/:claimId/verify-death', validateForm, wrapAsync(reviseClaimData));

module.exports = router;
