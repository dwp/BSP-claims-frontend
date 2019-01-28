'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage, deleteClaimAndRedirect} = require('./functions');

const router = new express.Router();

router.get('/:claimId/delete', renderPage);
router.post('/:claimId/delete', wrapAsync(deleteClaimAndRedirect));

module.exports = router;
