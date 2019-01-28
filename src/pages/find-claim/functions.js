'use strict';

const isNino = require('../../utils/is-national-insurance-number');
const sanitiseNino = require('../../utils/strip-spaces-force-uppercase');
const {findClaim} = require('../../lib/bsp');
const audit = require('../../utils/audit');
const {AUDIT_SEARCH_CLAIM, AUDIT_CODE_INVALID_INPUT} = require('../../lib/audit-constants');
const template = require('./template.marko');

function get(req, res) {
  if (req.query.nino === undefined) {
    return res.marko(template, {});
  }

  const nino = Array.isArray(req.query.nino) ? req.query.nino[0] : req.query.nino;
  const sanitisedNino = sanitiseNino(nino);

  if (!isNino(sanitisedNino)) {
    const msgKey = sanitisedNino === '' ? 'presence' : 'format';
    const errors = {nino: req.t(`find-claim:form.find.errors.${msgKey}`)};
    const auditMessage = audit.buildAuditObject(req.user, {}, {nino, numberOfClaimRecords: '', numberOfScheduleRecords: ''}, AUDIT_SEARCH_CLAIM, req.headers.interactionId);
    auditMessage.outcomeCode = AUDIT_CODE_INVALID_INPUT;
    audit.sendMessage(auditMessage);

    return res.marko(template, {nino, errors});
  }

  const searchResults = findClaim(req, sanitisedNino);
  res.marko(template, {nino, searchResults});
}

module.exports = {get};
