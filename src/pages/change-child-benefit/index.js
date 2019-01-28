'use strict';

const express = require('express');
const {renderPage, validateForm, redirectToConfirm} = require('./functions');

const router = new express.Router();

router.get('/:claimId/change-child-benefit', renderPage);
router.post('/:claimId/change-child-benefit', validateForm, redirectToConfirm);

module.exports = router;
