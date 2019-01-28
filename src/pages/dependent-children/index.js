'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage, validateForm, reviseClaimData} = require('./functions');

const router = new express.Router();

router.get('/:claimId/dependent-children', renderPage);
router.post('/:claimId/dependent-children', validateForm, wrapAsync(reviseClaimData));

module.exports = router;
