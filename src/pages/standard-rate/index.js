'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage, reviseClaimData} = require('./functions');

const router = new express.Router();

router.get('/:claimId/standard-rate', renderPage);
router.post('/:claimId/standard-rate', wrapAsync(reviseClaimData));

module.exports = router;
