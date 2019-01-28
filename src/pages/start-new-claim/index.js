'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage, validateForm, checkSPA, setupClaim} = require('./functions');

const router = new express.Router();

router.get('/', wrapAsync(renderPage));
router.post('/', validateForm, checkSPA, wrapAsync(setupClaim));

module.exports = router;
