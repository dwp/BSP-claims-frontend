'use strict';

const get = require('lodash.get');
const {reviseAndAuditClaim} = require('../../lib/bsp');
const sanitiseSortCode = require('../../utils/sanitise-sort-code');
const {CHANGE_HISTORY_CHANGE_PAYMENT_DETAILS} = require('../../lib/constants');
const {AUDIT_CHANGE_PAYMENT_DETAILS} = require('../../lib/audit-constants');
const template = require('./template.marko');

function renderPage(req, res) {
  const {claimId} = req.params;
  const changePayment = get(req.session, `[${claimId}].changePayment`, undefined);

  if (!changePayment) {
    return res.redirect(`/claim/${claimId}/change-payment-details`);
  }

  res.marko(template, {claimId, changePayment: changePayment.values});
}

async function reviseClaimData(req, res) {
  const {claimId} = req.params;
  const changePayment = get(req.session, `[${claimId}].changePayment`, undefined);

  if (!changePayment) {
    return res.redirect(`/claim/${claimId}/change-payment-details`);
  }

  const redirectPath = req.session.changePaymentDetailsOrigin || 'payment-schedule';
  const {claim} = req;

  const claimRevision = {
    ...claim,
    paymentAccount: {
      accountType: changePayment.values.accountType,
      nameOnAccount: changePayment.values.nameOnAccount,
      accountNumber: changePayment.values.accountNumber,
      sortCode: sanitiseSortCode(changePayment.values.sortCode),
      rollNumber: changePayment.values.rollNumber
    },
    changeInfoList: [{
      agentIdentifier: req.user.cis.dwp_staffid,
      agentName: req.user.username,
      changeDescription: CHANGE_HISTORY_CHANGE_PAYMENT_DETAILS
    }]
  };

  await reviseAndAuditClaim(req, claimRevision, claim, AUDIT_CHANGE_PAYMENT_DETAILS);

  res.redirect(`/claim/${claimId}/${redirectPath}`);
}

module.exports = {renderPage, reviseClaimData};
