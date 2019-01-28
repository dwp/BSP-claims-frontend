'use strict';

const express = require('express');
const warpAsync = require('../../utils/wrap-async');
const {renderPage, validateForm, stopClaim} = require('./functions');

const router = new express.Router();

router.get('/:claimId/stop', renderPage);
router.post('/:claimId/stop', validateForm, warpAsync(stopClaim));

module.exports = router;
