'use strict';

const express = require('express');
const {renderPage, validateForm, redirectToConfirm} = require('./functions');

const router = new express.Router();

router.get('/:claimId/change-payment-details', renderPage);
router.post('/:claimId/change-payment-details', validateForm, redirectToConfirm);

module.exports = router;
