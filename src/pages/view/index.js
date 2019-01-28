'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');

const {redirectToTasks, renderPage} = require('./functions');

const router = new express.Router();

router.get('/:claimId/view', wrapAsync(redirectToTasks), renderPage);

module.exports = router;
