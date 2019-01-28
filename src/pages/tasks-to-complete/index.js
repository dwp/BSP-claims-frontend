'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {redirectToView, renderPage} = require('./functions');

const router = new express.Router();

router.get('/:claimId/tasks-to-complete', wrapAsync(redirectToView), renderPage);

module.exports = router;
