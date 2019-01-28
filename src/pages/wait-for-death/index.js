'use strict';

const express = require('express');
const warpAsync = require('../../utils/wrap-async');
const {renderPage, validateForm, redirectAndReviseClaim} = require('./functions');

const router = new express.Router();

router.get('/:claimId/verify-death/wait-for-evidence', renderPage);
router.post('/:claimId/verify-death/wait-for-evidence', validateForm, warpAsync(redirectAndReviseClaim));

module.exports = router;
