'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage, disallowClaim} = require('./functions');

const router = new express.Router();

router.get('/disallow-claim-state-pension-age', renderPage);
router.post('/disallow-claim-state-pension-age', wrapAsync(disallowClaim));

module.exports = router;
