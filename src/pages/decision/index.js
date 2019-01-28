'use strict';

const express = require('express');
const {renderPage} = require('./functions');

const router = new express.Router();

router.get('/:claimId/decision', renderPage);

module.exports = router;
