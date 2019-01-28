'use strict';

const test = require('ava');
const sinon = require('sinon');
const AWS = require('aws-sdk-mock');
const {user, uuid, changePaymentDetails,
  verifyDeath, verifyChild, niConts,
  capDepChild, createClaim, decideClaim,
  verifyRel, upRateCHIB, upRatePregnancy,
  upRatePregNotDep, upRateDepStaySTD, disallowDeath, disallowSPA,
  disallowNIConts, disallowNotMarried,
  disallowMarriageInvalid, searchClaim, stopPay, deleteClaim
} = require('../constants/audit-constants');

const tempQUEUE = process.env.AUDIT_SQS_QUEUE;

process.env.AUDIT_SQS_QUEUE = 'Something';
process.env.AUDIT_SQS_FLAG = 'true';

AWS.mock('SQS', 'sendMessage', (params, callback) => {
  callback(null, 'success');
});

const audit = require('../../src/utils/audit');
const pino = require('../../src/utils/pino');

test.before(() => {
  sinon.replace(pino, 'info', sinon.fake());
  sinon.replace(pino, 'error', sinon.fake());
  process.env.NODE_ENV = 'Not Test';
});

test.after(() => {
  sinon.restore();
  process.env.AUDIT_SQS_QUEUE = tempQUEUE;
  delete process.env.NODE_ENV;
});

const date = '10-10-10';

test('should export an object', t => {
  t.is(typeof audit, 'object');
  t.is(typeof audit.buildAuditObject, 'function');
  t.is(typeof audit.sendMessage, 'function');
});

test('should build an object out of serveral elements', t => {
  const outputObject = audit.buildAuditObject(user, changePaymentDetails.claim, changePaymentDetails.revisionData, changePaymentDetails.messageType, uuid, date);
  t.is(typeof outputObject, 'object');
});

test('should build and return a createClaim object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, createClaim.claim, createClaim.revisionData, createClaim.messageType, uuid, date);
  createClaim.expectedOutput.actionCd = 'createClaim';
  createClaim.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, createClaim.expectedOutput);
});

test('should build and return a changePaymentDetails object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, changePaymentDetails.claim, changePaymentDetails.revisionData, changePaymentDetails.messageType, uuid, date);
  changePaymentDetails.expectedOutput.actionCd = 'changePay';
  changePaymentDetails.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, changePaymentDetails.expectedOutput);
});

test('should build and return a searchClaim object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, searchClaim.claim, searchClaim.revisionData, searchClaim.messageType, uuid, date);
  searchClaim.expectedOutput.actionCd = 'searchClaim';
  searchClaim.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, searchClaim.expectedOutput);
});

test('should return a verify dependent children or pregnant object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, capDepChild.claim, capDepChild.revisionData, capDepChild.messageType, uuid, date);
  capDepChild.expectedOutput.actionCd = 'capDepChild';
  capDepChild.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, capDepChild.expectedOutput);
});

test('should return a verify dead object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, verifyDeath.claim, verifyDeath.revisionData, verifyDeath.messageType, uuid, date);
  verifyDeath.expectedOutput.actionCd = 'verifyDeath';
  verifyDeath.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, verifyDeath.expectedOutput);
});

test('should return a verify child object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, verifyChild.claim, verifyChild.revisionData, verifyChild.messageType, uuid, date);
  verifyChild.expectedOutput.actionCd = 'verifyChild';
  verifyChild.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, verifyChild.expectedOutput);
});

test('should return a verify relationship object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, verifyRel.claim, verifyRel.revisionData, verifyRel.messageType, uuid, date);
  verifyRel.expectedOutput.actionCd = 'verifyRel';
  verifyRel.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, verifyRel.expectedOutput);
});

test('should return a verify national insurance number object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, niConts.claim, niConts.revisionData, niConts.messageType, uuid, date);
  niConts.expectedOutput.actionCd = 'niConts';
  niConts.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, niConts.expectedOutput);
});

test('should return an uprate claim add CHIB number audit object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, upRateCHIB.claim, upRateCHIB.revisionData, upRateCHIB.messageType, uuid, date);
  upRateCHIB.expectedOutput.actionCd = 'changeRate';
  upRateCHIB.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, upRateCHIB.expectedOutput);
});

test('should return an uprate claim add pregnancy audit object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, upRatePregnancy.claim, upRatePregnancy.revisionData, upRatePregnancy.messageType, uuid, date);
  upRatePregnancy.expectedOutput.actionCd = 'changeRate';
  upRatePregnancy.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, upRatePregnancy.expectedOutput);
});

test('should return an uprate claim add pregnancy not complete Dependants audit object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, upRatePregNotDep.claim, upRatePregNotDep.revisionData, upRatePregNotDep.messageType, uuid, date);
  upRatePregNotDep.expectedOutput.actionCd = 'changeRate';
  upRatePregNotDep.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, upRatePregNotDep.expectedOutput);
});

test('should return audit object with the correct attributes when claim remains standard as Dependants is checked but no CHIB is added', t => {
  const outputObject = audit.buildAuditObject(user, upRateDepStaySTD.claim, upRateDepStaySTD.revisionData, upRateDepStaySTD.messageType, uuid, date);
  upRateDepStaySTD.expectedOutput.actionCd = 'changeRate';
  upRateDepStaySTD.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, upRateDepStaySTD.expectedOutput);
});

test('should return a disallow death object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, disallowDeath.claim, disallowDeath.revisionData, disallowDeath.messageType, uuid, date);
  disallowDeath.expectedOutput.actionCd = 'disClaim';
  disallowDeath.expectedOutput.outcomeCode = '00000000';
  disallowDeath.expectedOutput.eventNumber = 'E0461014';
  t.deepEqual(outputObject, disallowDeath.expectedOutput);
});

test('should return a disallow spa object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, disallowSPA.claim, disallowSPA.revisionData, disallowSPA.messageType, uuid, date);
  disallowSPA.expectedOutput.actionCd = 'disClaim';
  disallowSPA.expectedOutput.outcomeCode = '00000000';
  disallowSPA.expectedOutput.eventNumber = 'E0461014';
  t.deepEqual(outputObject, disallowSPA.expectedOutput);
});

test('should return a disallow NIConts object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, disallowNIConts.claim, disallowNIConts.revisionData, disallowNIConts.messageType, uuid, date);
  disallowNIConts.expectedOutput.actionCd = 'disClaim';
  disallowNIConts.expectedOutput.outcomeCode = '00000000';
  disallowNIConts.expectedOutput.eventNumber = 'E0461014';
  t.deepEqual(outputObject, disallowNIConts.expectedOutput);
});

test('should return a disallow not married object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, disallowNotMarried.claim, disallowNotMarried.revisionData, disallowNotMarried.messageType, uuid, date);
  disallowNotMarried.expectedOutput.actionCd = 'disClaim';
  disallowNotMarried.expectedOutput.outcomeCode = '00000000';
  disallowNotMarried.expectedOutput.eventNumber = 'E0461014';
  t.deepEqual(outputObject, disallowNotMarried.expectedOutput);
});

test('should return a disallow marriage not valid object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, disallowMarriageInvalid.claim, disallowMarriageInvalid.revisionData, disallowMarriageInvalid.messageType, uuid, date);
  disallowMarriageInvalid.expectedOutput.actionCd = 'disClaim';
  disallowMarriageInvalid.expectedOutput.outcomeCode = '00000000';
  disallowMarriageInvalid.expectedOutput.eventNumber = 'E0461014';
  t.deepEqual(outputObject, disallowMarriageInvalid.expectedOutput);
});

test('should return a confirm claim details object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, decideClaim.claim, decideClaim.revisionData, decideClaim.messageType, uuid, date);
  decideClaim.expectedOutput.actionCd = 'decideClaim';
  decideClaim.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, decideClaim.expectedOutput);
});

test('should return a stop payments object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, stopPay.claim, stopPay.revisionData, stopPay.messageType, uuid, date);
  stopPay.expectedOutput.actionCd = 'stopPay';
  stopPay.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, stopPay.expectedOutput);
});

test('should return a delete claim object with the correct attributes', t => {
  const outputObject = audit.buildAuditObject(user, deleteClaim.claim, deleteClaim.revisionData, deleteClaim.messageType, uuid, date);
  deleteClaim.expectedOutput.actionCd = 'deleteClaim';
  deleteClaim.expectedOutput.outcomeCode = '00000000';
  t.deepEqual(outputObject, deleteClaim.expectedOutput);
});

test('should send a message and log the return data', t => {
  changePaymentDetails.expectedOutput.actionCd = 'changePay';
  changePaymentDetails.expectedOutput.outcomeCode = '00000000';
  audit.sendMessage(changePaymentDetails.expectedOutput);
  t.true(pino.info.calledOnce);
  AWS.restore('SQS', 'sendMessage');
});

test('if the audit message fails it should send an error to the log', t => {
  AWS.mock('SQS', 'sendMessage', (params, callback) => {
    callback({error: true}, 'failed');
  });
  changePaymentDetails.expectedOutput.actionCd = 'changePay';
  changePaymentDetails.expectedOutput.outcomeCode = '00000000';
  audit.sendMessage(changePaymentDetails.expectedOutput);
  t.true(pino.error.calledOnce);
  AWS.restore('SQS', 'sendMessage');
});
