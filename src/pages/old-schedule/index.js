'use strict';

const express = require('express');
const wrapAsync = require('../../utils/wrap-async');
const {renderPage} = require('./functions');

const router = new express.Router();

router.get('/:scheduleId/', wrapAsync(renderPage));

module.exports = router;
