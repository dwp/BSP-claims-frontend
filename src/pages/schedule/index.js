'use strict';

const express = require('express');
const {renderPage} = require('./functions');

const router = new express.Router();

router.get('/:claimId/payment-schedule', renderPage);

module.exports = router;
