'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage, disallowClaim} = require('./functions');

const router = new express.Router();

router.get('/:claimId/verify-national-insurance/disallow-claim', renderPage);
router.post('/:claimId/verify-national-insurance/disallow-claim', wrapAsync(disallowClaim));

module.exports = router;
