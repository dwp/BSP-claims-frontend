'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage, validateForm, redirectToConfirm} = require('./functions');

const router = new express.Router();

router.get('/:claimId/change-pregnant', renderPage);
router.post('/:claimId/change-pregnant', validateForm, wrapAsync(redirectToConfirm));

module.exports = router;
