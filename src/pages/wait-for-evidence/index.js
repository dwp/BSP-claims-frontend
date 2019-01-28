'use strict';

const express = require('express');
const warpAsync = require('../../utils/wrap-async');
const {renderPage, validateForm, redirect} = require('./functions');

const router = new express.Router();

router.get('/:claimId/verify-relationship/wait-for-evidence', renderPage);
router.post('/:claimId/verify-relationship/wait-for-evidence', validateForm, warpAsync(redirect));

module.exports = router;
