'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');

const {renderPage, validateForm, redirect} = require('./functions');

const router = new express.Router();

router.get('/duplicate-claim', renderPage);
router.post('/duplicate-claim', validateForm, wrapAsync(redirect));

module.exports = router;
